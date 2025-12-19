import { useAppContext } from '../context/AppContext';
import { CHARACTERS } from '../utils/CharacterData';

export function GeneralSettingsPage() {
    const {
        triggerPhrase,
        setTriggerPhrase,
        twitchUsername,
        setTwitchUsername,
        broadcastUserId,
        setBroadcastUserId,
        transcriptionBackend,
        setTranscriptionBackend,
        selectedCharacterId,
        setSelectedCharacterId
    } = useAppContext();

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-slate-700 pb-2">General Settings</h2>

            <div className="space-y-8 bg-slate-800 p-6 rounded-xl border border-slate-700">

                {/* Transcription Backend Section */}
                <section>
                    <h4 className="text-md font-semibold text-purple-400 mb-4 uppercase tracking-wider text-xs">AI Engine</h4>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                        <label className="block text-sm font-medium text-slate-300 mb-3">Model Selection</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setTranscriptionBackend('webgpu')}
                                className={`p-4 rounded-lg border text-left transition-all ${transcriptionBackend === 'webgpu'
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                <div className="font-bold mb-1 text-lg">Local AI (WebGPU)</div>
                                <div className="text-xs opacity-80 leading-relaxed">High Accuracy. Runs on GPU. Best for decent graphics cards (~2GB VRAM).</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTranscriptionBackend('cpu')}
                                className={`p-4 rounded-lg border text-left transition-all ${transcriptionBackend === 'cpu'
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                <div className="font-bold mb-1 text-lg">CPU Mode (Lightweight)</div>
                                <div className="text-xs opacity-80 leading-relaxed">Zero GPU Usage. Uses 'tiny' model via WASM. Ideal for gaming on the same PC.</div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Application Config */}
                <section className="space-y-6">
                    <h4 className="text-md font-semibold text-blue-400 mb-4 uppercase tracking-wider text-xs">Integration</h4>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Trigger Phrase (Regex Supported)</label>
                        <input
                            type="text"
                            placeholder="e.g. Hey Rapid"
                            value={triggerPhrase}
                            onChange={(e) => setTriggerPhrase(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
                        />
                        <p className="text-xs text-slate-500 mt-2">Only text matching this phrase will be sent to Streamer.Bot.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Twitch User</label>
                            <input
                                type="text"
                                placeholder="Username"
                                value={twitchUsername}
                                onChange={(e) => setTwitchUsername(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Character Profile</label>
                            <select
                                value={selectedCharacterId}
                                onChange={(e) => setSelectedCharacterId(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {CHARACTERS.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Broadcaster ID (Internal)</label>
                        <input
                            type="text"
                            placeholder="e.g. 44445592"
                            value={broadcastUserId}
                            onChange={(e) => setBroadcastUserId(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
