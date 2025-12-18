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
                <button className="text-slate-400 hover:text-white transition-colors">
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
                    className="p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-full transition-all"
                    title="Settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
