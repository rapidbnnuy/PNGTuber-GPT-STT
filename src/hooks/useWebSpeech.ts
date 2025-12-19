import { useState, useEffect, useRef } from "react";

export function useWebSpeech(options: {
    onResult?: (text: string) => void,
    continuous?: boolean,
    lang?: string
} = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [history, setHistory] = useState<string[]>([]);

    // Check support
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!isSupported) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = options.continuous ?? true;
        recognition.interimResults = true;
        recognition.lang = options.lang || 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            console.log("Web Speech Loop Ended. restarting (if continuous)...");
            setIsListening(false);
            // Auto restart if it was supposed to be continuous but stopped (e.g. silence)
            // Note: We might want a manual "stop" flag to prevent infinite loops if desired
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                    // Add to history
                    const cleanText = event.results[i][0].transcript.trim();
                    if (cleanText) {
                        setHistory(prev => [...prev, cleanText]);
                        if (options.onResult) options.onResult(cleanText);
                    }
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // For UI display, we just show current interim or last final
            setTranscript(interimTranscript || finalTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error("Web Speech API Error:", event.error, event.message);
            // If "not-allowed" or "service-not-allowed", we should probably stop trying
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const start = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.warn("Speech recognition already started");
            }
        }
    };

    const stop = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    return {
        isSupported,
        isListening,
        transcript,
        history,
        start,
        stop
    };
}
