import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useTranscriber, Transcriber } from "../hooks/useTranscriber";
import { useVADRecorder, VADState } from "../hooks/useVADRecorder";
import { CHARACTERS } from "../utils/CharacterData";
import { getThemeVariables } from "../utils/ThemeData";

// Helper: Convert linear 0-1 to dB (-60 to 0)
const toDecibels = (linear: number) => {
    if (linear <= 0.001) return -60;
    const db = 20 * Math.log10(linear);
    return Math.max(-60, db);
};

interface AppContextType {
    // Audio State
    transcriber: Transcriber;
    vadState: VADState;
    volume: number;
    currentDb: number;
    toggleRecording: () => void;

    // Settings State
    audioInputDevices: MediaDeviceInfo[];
    selectedDeviceId: string | undefined;
    setSelectedDeviceId: (id: string) => void;
    isPermissionsGranted: boolean;
    requestPermissions: () => Promise<void>;

    threshold: number;
    thresholdDb: number;
    setThreshold: (val: number) => void;

    silenceDuration: number;
    setSilenceDuration: (val: number) => void;

    minSpeechDuration: number;
    setMinSpeechDuration: (val: number) => void;

    // App Config
    triggerPhrase: string;
    setTriggerPhrase: (val: string) => void;
    twitchUsername: string;
    setTwitchUsername: (val: string) => void;
    broadcastUserId: string;
    setBroadcastUserId: (val: string) => void;
    transcriptionBackend: 'webgpu' | 'cpu';
    setTranscriptionBackend: (val: 'webgpu' | 'cpu') => void;
    selectedCharacterId: string;
    setSelectedCharacterId: (val: string) => void;
    streamerBotUrl: string;
    setStreamerBotUrl: (val: string) => void;
    isStreamerBotConnected: boolean;

    // Theme State
    themeMode: 'light' | 'dark';
    setThemeMode: (val: 'light' | 'dark') => void;
    themeColor: string;
    setThemeColor: (val: string) => void;
    showGradient: boolean;
    setShowGradient: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    // --- State Initialization ---
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

    // VAD Settings
    const [threshold, setThreshold] = useState(0.02);
    const [silenceDuration, setSilenceDuration] = useState(1500);
    const [minSpeechDuration, setMinSpeechDuration] = useState(100);

    // App Data
    const [triggerPhrase, setTriggerPhrase] = useState<string>(() => localStorage.getItem("triggerPhrase") || "");
    const [twitchUsername, setTwitchUsername] = useState<string>(() => localStorage.getItem("twitchUsername") || "");
    const [broadcastUserId, setBroadcastUserId] = useState<string>(() => localStorage.getItem("broadcastUserId") || "");
    const [transcriptionBackend, setTranscriptionBackend] = useState<'webgpu' | 'cpu'>(() => (localStorage.getItem("transcriptionBackend") as any) || 'webgpu');
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>(CHARACTERS[0].id);
    const [streamerBotUrl, setStreamerBotUrl] = useState<string>(() => localStorage.getItem("streamerBotUrl") || "http://127.0.0.1:7474");
    const [isStreamerBotConnected, setIsStreamerBotConnected] = useState(false);

    // Theme State
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => (localStorage.getItem("themeMode") as any) || 'dark');
    const [themeColor, setThemeColor] = useState<string>(() => localStorage.getItem("themeColor") || 'blue');
    const [showGradient, setShowGradient] = useState<boolean>(() => localStorage.getItem("showGradient") === 'true');

    // Persistence
    useEffect(() => { localStorage.setItem("triggerPhrase", triggerPhrase); }, [triggerPhrase]);
    useEffect(() => { localStorage.setItem("twitchUsername", twitchUsername); }, [twitchUsername]);
    useEffect(() => { localStorage.setItem("broadcastUserId", broadcastUserId); }, [broadcastUserId]);
    useEffect(() => { localStorage.setItem("transcriptionBackend", transcriptionBackend); }, [transcriptionBackend]);
    useEffect(() => { localStorage.setItem("streamerBotUrl", streamerBotUrl); }, [streamerBotUrl]);

    // Theme Persistence & Application
    useEffect(() => {
        localStorage.setItem("themeMode", themeMode);
        localStorage.setItem("themeColor", themeColor);
        localStorage.setItem("showGradient", String(showGradient));

        const variables = getThemeVariables(themeMode, themeColor, showGradient);
        Object.entries(variables).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });

        // Force dark/light class on body for Ionic utilities
        document.body.classList.toggle('dark', themeMode === 'dark');
    }, [themeMode, themeColor, showGradient]);

    // Check Streamer.bot Connection
    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await fetch(`${streamerBotUrl}/GetActions`);
                const data = await response.json();
                // Basic validation: Check if response has actions or actions array
                if (data && (data.actions || Array.isArray(data))) {
                    // Optionally verification: Check if expected actions exist in the response
                    // For now, if we get a valid JSON response from GetActions, we assume connected.
                    setIsStreamerBotConnected(true);
                } else {
                    setIsStreamerBotConnected(false);
                }
            } catch (e) {
                console.warn("Streamer.bot connection failed:", e);
                setIsStreamerBotConnected(false);
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 10000); // Check every 10s
        return () => clearInterval(interval);
    }, [streamerBotUrl]);

    const [isPermissionsGranted, setIsPermissionsGranted] = useState(false);
    const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);

    // --- Hooks ---
    const transcriber = useTranscriber();
    const lastProcessedIndexRef = useRef<number>(-1);

    // Dynamic Device Switching
    useEffect(() => {
        if (transcriptionBackend === 'cpu') {
            transcriber.setDevice('wasm');
            transcriber.setModel('onnx-community/whisper-tiny');
        } else {
            transcriber.setDevice('webgpu');
            transcriber.setModel('onnx-community/whisper-small.en');
        }
    }, [transcriptionBackend]);

    // CPH Integration
    useEffect(() => {
        const history = transcriber.output?.history || [];
        if (history.length > 0 && history.length > lastProcessedIndexRef.current + 1) {
            for (let i = lastProcessedIndexRef.current + 1; i < history.length; i++) {
                const msg = history[i];
                if (msg.status !== 'pending') continue; // Skip already processed

                const text = msg.text;

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
                    const character = CHARACTERS.find(c => c.id === selectedCharacterId);
                    if (character) {
                        console.log(`[CPH] Triggered! Sending POST for ${character.name}...`);
                        fetch(`${streamerBotUrl}/DoAction`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: { id: character.id, name: character.name },
                                args: {
                                    userName: twitchUsername,
                                    broadcastUserId: broadcastUserId,
                                    broadcaster: twitchUsername,
                                    broadcasterId: broadcastUserId,
                                    currentGame: "Just Chatting",
                                    currentTitle: "Streamer.Bot Interaction",
                                    rawInput: text
                                }
                            })
                        })
                            .then(() => {
                                msg.status = 'completed';
                            })
                            .catch(err => {
                                console.error("CPH Post Error:", err);
                                msg.status = 'error';
                            });
                    } else {
                        msg.status = 'error'; // Triggered but no character? Should rely on default?
                    }
                } else {
                    msg.status = 'ignored';
                }
            }
            lastProcessedIndexRef.current = history.length - 1;
        } else if (history.length === 0) {
            lastProcessedIndexRef.current = -1;
        }
    }, [transcriber.output?.history, triggerPhrase, twitchUsername, broadcastUserId, selectedCharacterId, streamerBotUrl]);

    // VAD Hook
    const vad = useVADRecorder({
        onSpeechEnd: (buffer) => {
            transcriber.start(buffer);
        },
        threshold,
        silenceDuration,
        minSpeechDuration,
        deviceId: selectedDeviceId
    });

    const currentDb = toDecibels(vad.volume);
    const thresholdDb = toDecibels(threshold);

    // Initial Device Listing
    useEffect(() => {
        const getDevices = async () => {
            try {
                // Ensure permissions first if possible? enumerateDevices works without but labels are hidden
                // We'll rely on global permission state or initial prompt elsewhere? 
                // Actually the original logic tried to find inputs.
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

    const toggleRecording = () => {
        vad.vadState === 'idle' ? vad.start(selectedDeviceId) : vad.stop();
    };

    return (
        <AppContext.Provider value={{
            transcriber,
            vadState: vad.vadState,
            volume: vad.volume,
            currentDb,
            toggleRecording,

            audioInputDevices,
            selectedDeviceId,
            setSelectedDeviceId,
            isPermissionsGranted,
            requestPermissions,

            threshold,
            thresholdDb,
            setThreshold,
            silenceDuration,
            setSilenceDuration,
            minSpeechDuration,
            setMinSpeechDuration,

            triggerPhrase,
            setTriggerPhrase,
            twitchUsername,
            setTwitchUsername,
            broadcastUserId,
            setBroadcastUserId,
            transcriptionBackend,
            setTranscriptionBackend,
            selectedCharacterId,
            setSelectedCharacterId,
            streamerBotUrl,
            setStreamerBotUrl,
            isStreamerBotConnected,

            themeMode, setThemeMode,
            themeColor, setThemeColor,
            showGradient, setShowGradient
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
