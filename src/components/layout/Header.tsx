interface HeaderProps {
    onOpenSettings: () => void;
    vadState: "idle" | "listening" | "recording" | "processing";
    onToggleRecording: () => void;
    isPermissionsGranted: boolean;
}

export function Header({ onOpenSettings, vadState, onToggleRecording, isPermissionsGranted }: HeaderProps) {
    const isRecording = vadState !== 'idle';

    const getStatusText = () => {
        if (vadState === "recording") return "Recording Speech...";
        if (vadState === "processing") return "Processing Silence...";
        if (vadState === "listening") return "Listening...";
        return "Idle";
    }

    const getButtonColor = () => {
        if (vadState === 'idle') return 'bg-green-600 hover:bg-green-500 text-white';
        return 'bg-red-600 hover:bg-red-500 text-white animate-pulse';
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 flex items-center px-4 z-50 justify-between shadow-md">
            {/* Left: Title & Menu */}
            <div className="flex items-center gap-4">
                <button className="text-slate-400 hover:text-white transition-colors" onClick={onOpenSettings}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-white leading-tight">PNGTuberGPT-STT</h1>
                    <span className="text-xs text-slate-400">WebGPU Edition</span>
                </div>
            </div>

            {/* Right: Controls & Settings */}
            <div className="flex items-center gap-4">
                {isPermissionsGranted && (
                    <button
                        onClick={onToggleRecording}
                        className={`px-6 py-2 rounded-full font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${getButtonColor()}`}
                    >
                        {isRecording ? (
                            <>
                                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                                <span>{getStatusText()}</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                <span>Start Recording</span>
                            </>
                        )}
                    </button>
                )}

                <button
                    onClick={onOpenSettings}
                    className="p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-md transition-all"
                    title="Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
