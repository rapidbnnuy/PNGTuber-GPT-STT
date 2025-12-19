import { useRef, useEffect } from "react";

import { TranscriberData } from "../hooks/useTranscriber";

interface Props {
    transcribedData: TranscriberData | undefined;
}

export default function Transcript({ transcribedData }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic: Always scroll to bottom when data updates (Log Tail)
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [transcribedData?.history]);


    // Helper to format timestamp
    const formatTime = (ts: number) => {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };



    return (
        <div
            className='w-full flex flex-col my-2 h-full'
        >
            {!transcribedData?.history || transcribedData.history.length === 0 ? (
                <div className="text-gray-500 text-center mt-10 italic">
                    Waiting for speech...
                </div>
            ) : (
                transcribedData.history.map((msg, i) => {
                    // Fallback to "pending" if somehow undefined, though type says otherwise
                    const status = msg.status || 'pending';

                    // Determine styles based on status
                    let containerStyle = 'border-slate-700/50 bg-slate-800/80';
                    let badgeColor = 'text-slate-400 bg-slate-900/50';
                    let badgeText = 'IGNORED';
                    let outlineStyle = '';

                    if (status === 'completed') {
                        containerStyle = 'border-green-500 bg-slate-800/80 shadow-[0_0_15px_rgba(34,197,94,0.15)]';
                        badgeColor = 'text-green-400 bg-green-900/30 border border-green-500/30';
                        badgeText = 'COMPLETED';
                        outlineStyle = 'ring-1 ring-green-500/50';
                    } else if (status === 'error') {
                        containerStyle = 'border-red-500 bg-slate-800/80 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
                        badgeColor = 'text-red-400 bg-red-900/30 border border-red-500/30';
                        badgeText = 'ERROR';
                        outlineStyle = 'ring-1 ring-red-500/50';
                    } else if (status === 'ignored') {
                        badgeText = 'IGNORED';
                    }
                    // If pending, maybe yellow? Or just default
                    if (status === 'pending') {
                        badgeText = '...';
                    }


                    return (
                        <div key={i} className="mb-6 px-2">
                            <div className={`relative p-4 rounded-xl rounded-tl-none border ${containerStyle} ${outlineStyle} transition-all duration-300`}>
                                {/* Top Badge */}
                                <div className={`absolute -top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full tracking-wider ${badgeColor}`}>
                                    {badgeText}
                                </div>

                                {/* Text Content */}
                                <div className="text-white text-lg leading-relaxed font-medium">
                                    {msg.text}
                                </div>

                                {/* Metadata Footer */}
                                <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                                        Message #{i + 1}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            {transcribedData?.tps && (
                <div className="fixed bottom-4 left-4 text-green-500 text-xs bg-black/50 p-1 rounded z-50 pointer-events-none">
                    {transcribedData.tps.toFixed(2)} tok/s
                </div>
            )}

            {/* Scroll Anchor */}
            <div ref={bottomRef} className="h-0 w-0" />
        </div>
    );
}
