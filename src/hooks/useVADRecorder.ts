import { useState, useRef, useEffect } from "react";
import Constants from "../utils/Constants";

export interface VADRecorderProps {
    onSpeechEnd: (buffer: AudioBuffer) => void;
    threshold?: number; // 0-1, default 0.05
    silenceDuration?: number; // ms, default 1500
    preRollDuration?: number; // ms, default 500
    minSpeechDuration?: number; // ms, default 100
    deviceId?: string;
}

export type VADState = "idle" | "listening" | "recording" | "processing";

export function useVADRecorder(props: VADRecorderProps) {
    const [vadState, setVadState] = useState<VADState>("idle");
    const [volume, setVolume] = useState(0);

    // Refs for dynamic prop access inside closures
    const thresholdRef = useRef(props.threshold ?? 0.05);
    const silenceLimitRef = useRef(props.silenceDuration ?? 1500);
    const preRollLimitRef = useRef(props.preRollDuration ?? 500);
    const minSpeechDurationRef = useRef(props.minSpeechDuration ?? 100);

    // Update refs when props change
    useEffect(() => { thresholdRef.current = props.threshold ?? 0.05; }, [props.threshold]);
    useEffect(() => { silenceLimitRef.current = props.silenceDuration ?? 1500; }, [props.silenceDuration]);
    useEffect(() => { preRollLimitRef.current = props.preRollDuration ?? 500; }, [props.preRollDuration]);
    useEffect(() => { minSpeechDurationRef.current = props.minSpeechDuration ?? 100; }, [props.minSpeechDuration]);

    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    // Audio accumulation
    const chunksRef = useRef<Float32Array[]>([]);
    const totalLengthRef = useRef(0);

    // Pre-roll Ring Buffer (Array of chunks)
    const PreRollBufferRef = useRef<{ buffer: Float32Array, timestamp: number }[]>([]);

    // Silence detection
    const silenceStartRef = useRef<number | null>(null);
    const speechStartTimeRef = useRef<number | null>(null); // For min duration check
    const isRecordingRef = useRef(false);
    const rafIdRef = useRef<number | null>(null);

    const start = async (deviceId?: string) => {
        try {
            if (audioContextRef.current) stop();

            // 1. Audio Setup
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: deviceId ? { deviceId: { exact: deviceId } } : true,
            });
            streamRef.current = stream;

            const ctx = new AudioContext({ sampleRate: Constants.SAMPLING_RATE });
            await ctx.resume();
            audioContextRef.current = ctx;

            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256; // Faster response
            analyser.smoothingTimeConstant = 0.4; // Smoother fallback
            analyserRef.current = analyser;

            const processor = ctx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            source.connect(analyser);
            source.connect(processor);
            processor.connect(ctx.destination);

            setVadState("listening");

            // 2. Visualization Loop (Decoupled from Audio Process)
            const updateMeter = () => {
                if (!analyserRef.current) return;
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);

                // RMS Calculation for better accuracy
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    const x = dataArray[i] / 128.0;
                    sum += x * x;
                }
                const rms = Math.sqrt(sum / dataArray.length);
                const vol = Math.min(1, rms); // RMS is usually < 1 but can peak

                setVolume(vol);
                rafIdRef.current = requestAnimationFrame(updateMeter);
            };
            rafIdRef.current = requestAnimationFrame(updateMeter);

            // 3. Audio Processing Loop
            processor.onaudioprocess = (e) => {
                const input = e.inputBuffer.getChannelData(0);
                const copy = new Float32Array(input);

                // Calculate quick RMS for VAD logic (independent of visualizer)
                let sum = 0;
                for (let i = 0; i < copy.length; i++) sum += copy[i] * copy[i];
                const rms = Math.sqrt(sum / copy.length);
                // Boost signal for detection if needed, but raw RMS is standard. 
                // Using 5x boost for threshold check matching linear visualization expectation
                const detectionVol = rms * 5;

                const now = Date.now();

                // Manage Pre-Roll Buffer
                PreRollBufferRef.current.push({ buffer: copy, timestamp: now });
                // Clean up old chunks > 500ms
                const cutoff = now - preRollLimitRef.current;
                while (PreRollBufferRef.current.length > 0 && PreRollBufferRef.current[0].timestamp < cutoff) {
                    PreRollBufferRef.current.shift();
                }

                // VAD Logic with Min Duration Gate

                // 1. Monitor Threshold Duration
                if (detectionVol > thresholdRef.current) {
                    if (speechStartTimeRef.current === null) {
                        speechStartTimeRef.current = now;
                    }
                } else {
                    speechStartTimeRef.current = null;
                }

                // 2. State Machine
                if (!isRecordingRef.current) {
                    // Not recording yet - check for trigger
                    if (speechStartTimeRef.current !== null) {
                        const durationAboveThreshold = now - speechStartTimeRef.current;
                        if (durationAboveThreshold >= minSpeechDurationRef.current) {
                            isRecordingRef.current = true;
                            setVadState("recording");
                            console.log("VAD: Triggered! Pre-roll size:", PreRollBufferRef.current.length);

                            // Dump Pre-Roll into Main Buffer
                            chunksRef.current = PreRollBufferRef.current.map(item => item.buffer);
                            totalLengthRef.current = chunksRef.current.reduce((acc, c) => acc + c.length, 0);

                            // Clear pre-roll
                            PreRollBufferRef.current = [];
                        }
                    }
                } else {
                    // RECORDING ACTIVE - Capture Audio
                    chunksRef.current.push(copy);
                    totalLengthRef.current += copy.length;

                    if (detectionVol > thresholdRef.current) {
                        // User is speaking
                        silenceStartRef.current = null;
                        setVadState("recording");
                    } else {
                        // Silence Check
                        if (silenceStartRef.current === null) {
                            silenceStartRef.current = Date.now();
                        } else {
                            const diff = Date.now() - silenceStartRef.current;
                            if (diff > silenceLimitRef.current) {
                                stopAndProcess();
                            }
                        }
                    }
                }
            };

        } catch (e) {
            console.error("VAD Start Error", e);
            alert("Mic Error");
        }
    };

    const stopAndProcess = () => {
        setVadState("processing");
        isRecordingRef.current = false;
        silenceStartRef.current = null;

        if (audioContextRef.current && chunksRef.current.length > 0) {
            const fullBuffer = audioContextRef.current.createBuffer(1, totalLengthRef.current, Constants.SAMPLING_RATE);
            const channel = fullBuffer.getChannelData(0);
            let offset = 0;
            for (const chunk of chunksRef.current) {
                channel.set(chunk, offset);
                offset += chunk.length;
            }
            props.onSpeechEnd(fullBuffer);
        }

        // Reset
        setVadState("listening");
        chunksRef.current = [];
        totalLengthRef.current = 0;
        PreRollBufferRef.current = [];
    };

    const stop = () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        if (audioContextRef.current) audioContextRef.current.close();

        streamRef.current = null;
        audioContextRef.current = null;
        setVadState("idle");
        isRecordingRef.current = false;
        setVolume(0);
    };

    useEffect(() => {
        return () => stop();
    }, []);

    return {
        start,
        stop,
        vadState,
        volume
    };
}
