import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { CHARACTERS } from "../../utils/CharacterData";

interface SettingsModalProps {
    isOpen: boolean;
    closeModal: () => void;

    // Audio State
    audioInputDevices: MediaDeviceInfo[];
    selectedDeviceId: string | undefined;
    setSelectedDeviceId: (id: string) => void;
    isPermissionsGranted: boolean;
    requestPermissions: () => void;

    threshold: number; // linear
    thresholdDb: number;
    setThreshold: (val: number) => void;

    silenceDuration: number; // ms
    setSilenceDuration: (val: number) => void;

    minSpeechDuration: number; // ms
    setMinSpeechDuration: (val: number) => void;

    currentDb: number;

    // App State
    triggerPhrase: string;
    setTriggerPhrase: (val: string) => void;
    twitchUsername: string;
    setTwitchUsername: (val: string) => void;
    selectedCharacterId: string;
    setSelectedCharacterId: (val: string) => void;
}

export function SettingsModal(props: SettingsModalProps) {

    // Helper for visual meter in modal
    const dbToPercent = (db: number) => {
        return Math.max(0, Math.min(100, ((db + 60) / 60) * 100));
    };

    return (
        <Transition appear show={props.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={props.closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all border border-slate-700">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-bold leading-6 text-white mb-6 border-b border-slate-700 pb-2"
                                >
                                    Configuration
                                </Dialog.Title>

                                <div className="space-y-8">
                                    {/* Audio Section */}
                                    <section>
                                        <h4 className="text-md font-semibold text-green-400 mb-4 uppercase tracking-wider text-xs">Audio Settings</h4>
                                        <div className="space-y-4">
                                            {/* Input Device */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Microphone Input</label>
                                                {props.isPermissionsGranted && props.audioInputDevices.length > 0 ? (
                                                    <select
                                                        value={props.selectedDeviceId || ''}
                                                        onChange={(e) => props.setSelectedDeviceId(e.target.value)}
                                                        className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-green-500"
                                                    >
                                                        {props.audioInputDevices.map(d => (
                                                            <option key={d.deviceId} value={d.deviceId}>
                                                                {d.label || `Microphone ${d.deviceId.slice(0, 5)}...`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <button
                                                        onClick={props.requestPermissions}
                                                        className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 text-sm"
                                                    >
                                                        Grant Permission
                                                    </button>
                                                )}
                                            </div>

                                            {/* Sensitivity */}
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <label className="block text-sm font-medium text-slate-300">Sensitivity Gate</label>
                                                    <span className="text-xs text-slate-400 font-mono">{props.thresholdDb.toFixed(0)} dB</span>
                                                </div>
                                                <input
                                                    type="range" min="-60" max="0" step="1"
                                                    value={props.thresholdDb}
                                                    onChange={e => {
                                                        const db = parseFloat(e.target.value);
                                                        props.setThreshold(Math.pow(10, db / 20));
                                                    }}
                                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                                />

                                                {/* Live Meter in Modal for tuning */}
                                                <div className="mt-2 w-full h-3 bg-slate-900 rounded-full overflow-hidden flex items-center relative border border-slate-700/50">
                                                    <div
                                                        className={`h-full transition-all duration-75 ease-out ${props.currentDb > props.thresholdDb ? 'bg-green-500' : 'bg-green-900/40'}`}
                                                        style={{ width: `${dbToPercent(props.currentDb)}%` }}
                                                    />
                                                    <div
                                                        className="absolute top-0 bottom-0 w-0.5 bg-red-400/80 z-10"
                                                        style={{ left: `${dbToPercent(props.thresholdDb)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* VAD Timing */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-1">Silence Wait (ms)</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="range" min="500" max="5000" step="100"
                                                            value={props.silenceDuration}
                                                            onChange={e => props.setSilenceDuration(parseInt(e.target.value))}
                                                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                                        />
                                                        <span className="text-xs text-slate-400 w-12 text-right">{props.silenceDuration}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-1">Min Speech (ms)</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="range" min="0" max="500" step="10"
                                                            value={props.minSpeechDuration}
                                                            onChange={e => props.setMinSpeechDuration(parseInt(e.target.value))}
                                                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                                        />
                                                        <span className="text-xs text-slate-400 w-12 text-right">{props.minSpeechDuration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* App Section */}
                                    <section>
                                        <h4 className="text-md font-semibold text-blue-400 mb-4 uppercase tracking-wider text-xs">Application Settings</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Trigger Phrase (Regex Supported)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Hey Rapid"
                                                    value={props.triggerPhrase}
                                                    onChange={(e) => props.setTriggerPhrase(e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">Twitch User</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Username"
                                                        value={props.twitchUsername}
                                                        onChange={(e) => props.setTwitchUsername(e.target.value)}
                                                        className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">Character</label>
                                                    <select
                                                        value={props.selectedCharacterId}
                                                        onChange={(e) => props.setSelectedCharacterId(e.target.value)}
                                                        className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {CHARACTERS.map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="button"
                                        className="rounded-md border border-transparent bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                                        onClick={props.closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
