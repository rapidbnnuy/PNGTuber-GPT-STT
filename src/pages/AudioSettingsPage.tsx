import { useAppContext } from '../context/AppContext';

export function AudioSettingsPage() {
    const {
        audioInputDevices,
        selectedDeviceId,
        setSelectedDeviceId,
        isPermissionsGranted,
        requestPermissions,
        thresholdDb,
        setThreshold,
        currentDb,
        silenceDuration,
        setSilenceDuration,
        minSpeechDuration,
        setMinSpeechDuration
    } = useAppContext();

    // Helper for visual meter
    const dbToPercent = (db: number) => {
        return Math.max(0, Math.min(100, ((db + 60) / 60) * 100));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            <h2 className="text-2xl font-bold mb-6 text-green-400 border-b border-slate-700 pb-2">Audio Settings</h2>

            <div className="space-y-8 bg-slate-800 p-6 rounded-xl border border-slate-700">
                {/* Input Device */}
                <section>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Microphone Input</label>
                    {isPermissionsGranted && audioInputDevices.length > 0 ? (
                        <select
                            value={selectedDeviceId || ''}
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {audioInputDevices.map(d => (
                                <option key={d.deviceId} value={d.deviceId}>
                                    {d.label || `Microphone ${d.deviceId.slice(0, 5)}...`}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg">
                            <span className="text-slate-400 text-sm">Microphone access required</span>
                            <button
                                onClick={requestPermissions}
                                className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 text-sm font-bold"
                            >
                                Grant Permission
                            </button>
                        </div>
                    )}
                </section>

                {/* Sensitivity */}
                <section>
                    <div className="flex justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-300">Sensitivity Gate</label>
                        <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded">{thresholdDb.toFixed(0)} dB</span>
                    </div>
                    <input
                        type="range" min="-60" max="0" step="1"
                        value={thresholdDb}
                        onChange={e => {
                            const db = parseFloat(e.target.value);
                            setThreshold(Math.pow(10, db / 20));
                        }}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />

                    {/* Live Meter */}
                    <div className="mt-4 w-full h-4 bg-slate-900 rounded-full overflow-hidden flex items-center relative border border-slate-700/50">
                        <div
                            className={`h-full transition-all duration-75 ease-out ${currentDb > thresholdDb ? 'bg-green-500' : 'bg-green-900/40'}`}
                            style={{ width: `${dbToPercent(currentDb)}%` }}
                        />
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                            style={{ left: `${dbToPercent(thresholdDb)}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Audio below the red line is ignored (silence).</p>
                </section>

                {/* VAD Timing */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Silence Wait (ms)</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range" min="500" max="5000" step="100"
                                value={silenceDuration}
                                onChange={e => setSilenceDuration(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-slate-400 w-12 text-right font-mono">{silenceDuration}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">How long to wait after speech stops before processing.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Min Speech (ms)</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range" min="0" max="500" step="10"
                                value={minSpeechDuration}
                                onChange={e => setMinSpeechDuration(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-slate-400 w-12 text-right font-mono">{minSpeechDuration}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Short noises below this duration are ignored.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
