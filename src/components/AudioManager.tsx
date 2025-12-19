import { useEffect, useState, useRef } from "react";
import { useTranscriber } from "../hooks/useTranscriber";
import { useWebSpeech } from "../hooks/useWebSpeech";
import Transcript from "./Transcript";
import { useVADRecorder } from "../hooks/useVADRecorder";
import { CHARACTERS, CPH_ENDPOINT } from "../utils/CharacterData";

import { Header } from "./layout/Header";
import { SettingsModal } from "./modals/SettingsModal";

export function AudioManager() {
    return <AudioManagerInternal />;
}

// Helper: Convert linear 0-1 to dB (-60 to 0)
const toDecibels = (linear: number) => {
    if (linear <= 0.001) return -60;
    const db = 20 * Math.log10(linear);
    return Math.max(-60, db);
};

// Internal component that owns both hooks to link them
function AudioManagerInternal() {
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

    // VAD Settings
    // Threshold now stored as linear but displayed as dB
    const [threshold, setThreshold] = useState(0.02);
    const [silenceDuration, setSilenceDuration] = useState(1500);
    const [minSpeechDuration, setMinSpeechDuration] = useState(100);

    const [triggerPhrase, setTriggerPhrase] = useState<string>(() => localStorage.getItem("triggerPhrase") || "");
    const [twitchUsername, setTwitchUsername] = useState<string>(() => localStorage.getItem("twitchUsername") || "");
    const [broadcastUserId, setBroadcastUserId] = useState<string>(() => localStorage.getItem("broadcastUserId") || "");
    const [transcriptionBackend, setTranscriptionBackend] = useState<'webgpu' | 'web_speech'>(() => (localStorage.getItem("transcriptionBackend") as any) || 'webgpu');
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>(CHARACTERS[0].id);

    // Persistence
    useEffect(() => { localStorage.setItem("triggerPhrase", triggerPhrase); }, [triggerPhrase]);
    useEffect(() => { localStorage.setItem("twitchUsername", twitchUsername); }, [twitchUsername]);
    useEffect(() => { localStorage.setItem("broadcastUserId", broadcastUserId); }, [broadcastUserId]);
    useEffect(() => { localStorage.setItem("transcriptionBackend", transcriptionBackend); }, [transcriptionBackend]);

    const [isPermissionsGranted, setIsPermissionsGranted] = useState(false);
    const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);

    const transcriber = useTranscriber();
    const webSpeech = useWebSpeech({ continuous: true, lang: 'en-US' });
    const lastProcessedIndexRef = useRef<number>(-1);

    // Unify History
    const activeHistory = transcriptionBackend === 'webgpu'
        ? (transcriber.output?.history || [])
        : webSpeech.history;

    // CPH Integration Effect
    useEffect(() => {
        const history = activeHistory;
        // Only process new entries
        if (history.length > 0 && history.length > lastProcessedIndexRef.current + 1) {

            // Loop through new messages
            for (let i = lastProcessedIndexRef.current + 1; i < history.length; i++) {
                const text = history[i];

                // Regex Check
                let isTriggered = false;
                if (triggerPhrase && triggerPhrase.trim()) {
                    try {
                        const escaped = triggerPhrase.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const pattern = escaped.replace(/\s+/g, '[\\s\\p{P}]*');
                        const regex = new RegExp(pattern, 'iu');
                        isTriggered = regex.test(text);
                    } catch (e) {
                        console.warn(e);
                    }
                }

                if (isTriggered) {
                    // Send to CPH
                    const character = CHARACTERS.find(c => c.id === selectedCharacterId);
                    if (character) {
                        console.log(`[CPH] Triggered! Sending POST for ${character.name}...`);
                        fetch(CPH_ENDPOINT, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: {
                                    id: character.id,
                                    name: character.name
                                },
                                args: {
                                    userName: twitchUsername,
                                    broadcastUserId: broadcastUserId,
                                    broadcaster: twitchUsername, // Mirror userName
                                    broadcasterId: broadcastUserId, // Some actions might use this one
                                    currentGame: "Just Chatting",
                                    currentTitle: "Streamer.Bot Interaction",
                                    rawInput: text
                                }
                            })
                        }).catch(err => console.error("CPH Post Error:", err));
                    }
                }
            }
            // Update cursor
            lastProcessedIndexRef.current = history.length - 1;
        } else if (history.length === 0) {
            lastProcessedIndexRef.current = -1; // Reset
        }
    }, [activeHistory, triggerPhrase, twitchUsername, broadcastUserId, selectedCharacterId]);

    const vad = useVADRecorder({
        onSpeechEnd: (buffer) => {
            // Processing triggers automatically when speech ends
            if (transcriptionBackend === 'webgpu') {
                transcriber.start(buffer);
            } else {
                // For Web Speech, we don't need audio buffer, 
                // but we should ensure it's "listening" if not continuous. 
                // Since we use continuous=true, it's always running when active.
                console.log("VAD Speech End (Web Speech Mode) - No Action Needed");
            }
        },
        threshold,
        silenceDuration,
        minSpeechDuration,
        deviceId: selectedDeviceId
    });

    // Metering
    const currentDb = toDecibels(vad.volume);
    const thresholdDb = toDecibels(threshold);

    // Handle initial device listing
    useEffect(() => {
        const getDevices = async () => {
            try {
                const devs = await navigator.mediaDevices.enumerateDevices();
                const inputs = devs.filter(d => d.kind === 'audioinput');
                setAudioInputDevices(inputs);

                if (inputs.length > 0 && inputs[0].label) {
                    setIsPermissionsGranted(true);
                    if (!selectedDeviceId) setSelectedDeviceId(inputs[0].deviceId);
                }
            } catch (e) {
                console.error("Error listing devices", e);
            }
        };

        getDevices();
        navigator.mediaDevices.addEventListener('devicechange', getDevices);
        return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    }, [selectedDeviceId]);

    const requestPermissions = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsPermissionsGranted(true);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Permission denied");
        }
    };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white">
            {/* 1. Header (Fixed Top) */}
            <Header
                onOpenSettings={() => setIsSettingsOpen(true)}
                vadState={transcriptionBackend === 'webgpu' ? vad.vadState : (webSpeech.isListening ? 'recording' : 'idle')}
                onToggleRecording={() => {
                    if (transcriptionBackend === 'webgpu') {
                        vad.vadState === 'idle' ? vad.start(selectedDeviceId) : vad.stop();
                    } else {
                        webSpeech.isListening ? webSpeech.stop() : webSpeech.start();
                    }
                }}
                isPermissionsGranted={isPermissionsGranted}
            />

            {/* 2. Main Content (Scrollable by default) */}
            <main className="w-full min-h-screen pt-20 pb-4 px-4 flex flex-col justify-between">
                {/* Progress Bar (Fixed just below header) */}
                {transcriber.progressItems.length > 0 && (
                    <div className="fixed top-16 left-0 w-full z-40 bg-slate-800 h-1">
                        {transcriber.progressItems.map((item) => (
                            <div key={item.file} className="bg-blue-600 h-1 transition-all duration-200" style={{ width: `${item.progress}%` }}></div>
                        ))}
                    </div>
                )}

                {/* Content Container (Grows to push footer down) */}
                <div className="w-full relative flex-1">
                    {/* Overlay text if empty */}
                    {/* Overlay text if empty */}
                    {!activeHistory.length && ( // Check length instead of object nullity
                        <div className="flex items-center justify-center text-slate-500 py-20 pointer-events-none">
                            <div className="text-center">
                                <p className="text-lg font-semibold">Ready to Transcribe</p>
                                <p className="text-sm opacity-60">Click 'Start Recording' in the top bar</p>
                            </div>
                        </div>
                    )}

                    <Transcript
                        transcribedData={transcriptionBackend === 'webgpu'
                            ? transcriber.output
                            : { history: webSpeech.history, isBusy: webSpeech.isListening, text: webSpeech.transcript }}
                        triggerPhrase={triggerPhrase}
                    />
                </div>

                {/* Footer */}
                <div className="text-center text-zinc-600 text-xs mt-8">
                    Powered by {transcriptionBackend === 'webgpu' ? '🤗 Transformers.js (WebGPU)' : 'Web Speech API'}
                </div>
            </main>

            {/* 3. Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                closeModal={() => setIsSettingsOpen(false)}

                // Audio Config
                audioInputDevices={audioInputDevices}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
                isPermissionsGranted={isPermissionsGranted}
                requestPermissions={requestPermissions}

                threshold={threshold}
                thresholdDb={thresholdDb}
                setThreshold={setThreshold}

                silenceDuration={silenceDuration}
                setSilenceDuration={setSilenceDuration}

                minSpeechDuration={minSpeechDuration}
                setMinSpeechDuration={setMinSpeechDuration}

                currentDb={currentDb}

                // App Config
                triggerPhrase={triggerPhrase}
                setTriggerPhrase={setTriggerPhrase}
                twitchUsername={twitchUsername}
                setTwitchUsername={setTwitchUsername}
                broadcastUserId={broadcastUserId}
                setBroadcastUserId={setBroadcastUserId}
                transcriptionBackend={transcriptionBackend}
                setTranscriptionBackend={setTranscriptionBackend}
                selectedCharacterId={selectedCharacterId}
                setSelectedCharacterId={setSelectedCharacterId}
            />
        </div>
    );
}
