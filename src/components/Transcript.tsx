import { useRef, useEffect } from "react";

import { TranscriberData } from "../hooks/useTranscriber";

interface Props {
    transcribedData: TranscriberData | undefined;
    triggerPhrase?: string;
}

export default function Transcript({ transcribedData, triggerPhrase }: Props) {
    const divRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        if (divRef.current) {
            const diff = Math.abs(
                divRef.current.offsetHeight +
                divRef.current.scrollTop -
                divRef.current.scrollHeight,
            );

            if (diff <= 100) {
                divRef.current.scrollTop = divRef.current.scrollHeight;
            }
        }
    });

    // Helper to check for trigger phrase
    const hasTrigger = (text: string): boolean => {
        if (!triggerPhrase || !triggerPhrase.trim()) return false;

        try {
            // Escape special regex chars from the trigger phrase
            const escaped = triggerPhrase.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Allow flexibility: spaces in trigger match any sequence of whitespace or punctuation
            // e.g. "hey rapid" matches "Hey, Rapid" or "Hey Rapid!" or "hey... rapid"
            const pattern = escaped.replace(/\s+/g, '[\\s\\p{P}]*');
            const regex = new RegExp(pattern, 'iu'); // i = case insensitive, u = unicode (for \p{P})
            return regex.test(text);
        } catch (e) {
            console.warn("Invalid regex pattern", e);
            return false;
        }
    };

    return (
        <div
            ref={divRef}
            className='w-full flex flex-col my-2 h-full'
        >
            {!transcribedData?.history || transcribedData.history.length === 0 ? (
                <div className="text-gray-500 text-center mt-10 italic">
                    Waiting for speech...
                </div>
            ) : (
                transcribedData.history.map((line, i) => {
                    const isTriggered = hasTrigger(line);
                    return (
                        <div key={i} className="mb-4">
                            <div className="text-xs text-zinc-500 mb-1">Message #{i + 1}</div>
                            <div
                                className={`
                                    p-3 rounded-2xl rounded-tl-none inline-block max-w-full text-white text-lg shadow-md border 
                                    transition-colors duration-300
                                    ${isTriggered
                                        ? 'bg-green-900/40 border-green-500 shadow-green-900/20'
                                        : 'bg-zinc-800 border-zinc-700/50'}
                                `}
                            >
                                {line}
                            </div>
                        </div>
                    );
                })
            )}

            {transcribedData?.tps && (
                <div className="fixed bottom-4 right-4 text-green-500 text-xs bg-black/50 p-1 rounded">
                    {transcribedData.tps.toFixed(2)} tok/s
                </div>
            )}
        </div>
    );
}
