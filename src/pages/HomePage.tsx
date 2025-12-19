import { useAppContext } from "../context/AppContext";
import Transcript from "../components/Transcript";

export function HomePage() {
    const {
        transcriber,
        triggerPhrase,
        transcriptionBackend
    } = useAppContext();

    return (
        <div className="w-full max-w-5xl mx-auto px-4 pb-8 flex flex-col min-h-[calc(100vh-6rem)]">

            {/* Progress Bar (Global or Local?) - Putting it here for now as it's 'active work' */}
            {transcriber.progressItems.length > 0 && (
                <div className="fixed top-16 left-0 w-full z-40 bg-slate-800 h-1">
                    {transcriber.progressItems.map((item) => (
                        <div key={item.file} className="bg-blue-600 h-1 transition-all duration-200" style={{ width: `${item.progress}%` }}></div>
                    ))}
                </div>
            )}

            {/* Content Container (Grows to push footer down) */}
            <div className="w-full relative flex-1 flex flex-col">
                {/* Overlay text if empty */}
                {!transcriber.output && (
                    <div className="flex flex-1 items-center justify-center text-slate-500 py-20 pointer-events-none">
                        <div className="text-center">
                            <p className="text-lg font-semibold">Ready to Transcribe</p>
                            <p className="text-sm opacity-60">Click 'Start Recording' in the top bar</p>
                        </div>
                    </div>
                )}

                <Transcript
                    transcribedData={transcriber.output}
                    triggerPhrase={triggerPhrase}
                />
            </div>

            {/* Footer */}
            <div className="text-center text-zinc-600 text-xs mt-8 pb-4">
                Powered by 🤗 Transformers.js ({transcriptionBackend === 'webgpu' ? 'WebGPU' : 'CPU/WASM'})
            </div>
        </div>
    );
}
