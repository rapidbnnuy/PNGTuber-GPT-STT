import { useState, useRef, useEffect, useCallback } from "react";
import Constants from "../utils/Constants";

export interface StreamingRecorderProps {
    onAudioUpdate: (buffer: AudioBuffer) => void;
    isTranscribing: boolean;
    deviceId?: string;
}

export function useStreamingRecorder(props: StreamingRecorderProps) {
    const [recording, setRecording] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const inputRef = useRef<MediaStreamAudioSourceNode | null>(null);

    // Buffer for accumulating audio context
    const audioDataRef = useRef<Float32Array>(new Float32Array(0));

    const startRecording = async (deviceId?: string) => {
        try {
            // Stop any existing stream first
            if (activeStreamRef.current) {
                stopRecording();
            }

            const constraints = {
                audio: deviceId ? { deviceId: { exact: deviceId } } : true,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            activeStreamRef.current = stream;

            const audioContext = new AudioContext({
                sampleRate: Constants.SAMPLING_RATE,
            });
            await audioContext.resume();
            audioContextRef.current = audioContext;

            const input = audioContext.createMediaStreamSource(stream);
            inputRef.current = input;

            // Use ScriptProcessor for raw data access
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            input.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                // Reduced MAX_SAMPLES to 30s to prevent infinite memory growth lag if clearAudioBuffer isn't called,
                // but relying on clearAudioBuffer for main optimization.
                const MAX_SAMPLES = Constants.SAMPLING_RATE * 30;

                let newBuffer;
                if (audioDataRef.current.length + inputData.length > MAX_SAMPLES) {
                    // Shift buffer when full
                    const cut = (audioDataRef.current.length + inputData.length) - MAX_SAMPLES;
                    newBuffer = new Float32Array(MAX_SAMPLES);
                    newBuffer.set(audioDataRef.current.subarray(cut));
                    newBuffer.set(inputData, MAX_SAMPLES - inputData.length);
                } else {
                    newBuffer = new Float32Array(audioDataRef.current.length + inputData.length);
                    newBuffer.set(audioDataRef.current);
                    newBuffer.set(inputData, audioDataRef.current.length);
                }
                audioDataRef.current = newBuffer;
            };

            setRecording(true);
        } catch (err) {
            console.error("Failed to start recording", err);
            alert("Could not access microphone. Please verify permissions.");
        }
    };

    const stopRecording = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (activeStreamRef.current) {
            activeStreamRef.current = null;
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (inputRef.current) {
            inputRef.current.disconnect();
            inputRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setRecording(false);
        audioDataRef.current = new Float32Array(0);
    };

    // Explicitly allow clearing the buffer from outside
    const clearAudioBuffer = useCallback(() => {
        audioDataRef.current = new Float32Array(0);
    }, []);

    // Ref to track active stream for toggle logic
    const activeStreamRef = useRef<MediaStream | null>(null);

    // Polling for updates
    useEffect(() => {
        let interval: any;
        if (recording) {
            interval = setInterval(() => {
                // Check props.isTranscribing to avoid queueing, but with WebGPU it might be faster.
                // Still safer to respect the flag.
                if (audioDataRef.current.length > 0 && !props.isTranscribing) {
                    if (audioContextRef.current && audioContextRef.current.state === "running") {
                        const buffer = audioContextRef.current.createBuffer(1, audioDataRef.current.length, Constants.SAMPLING_RATE);
                        buffer.copyToChannel(audioDataRef.current as any, 0);
                        props.onAudioUpdate(buffer);
                    }
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [recording, props.isTranscribing]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) stopRecording();
        };
    }, []);

    return {
        recording,
        startRecording,
        stopRecording,
        clearAudioBuffer
    };
}
