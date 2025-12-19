import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonIcon
} from '@ionic/react';
import { hardwareChipOutline, speedometerOutline } from 'ionicons/icons';
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
        setSelectedCharacterId,
        streamerBotUrl,
        setStreamerBotUrl
    } = useAppContext();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>General Settings</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

                {/* AI Engine Selection - Card Style */}
                <div className="mb-6 px-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-2 pl-1">AI Engine</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* WebGPU Option */}
                        <div
                            onClick={() => setTranscriptionBackend('webgpu')}
                            className={`cursor-pointer rounded-xl border-2 transition-all duration-200 relative overflow-hidden group ${transcriptionBackend === 'webgpu'
                                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                                : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${transcriptionBackend === 'webgpu' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                        <IonIcon icon={hardwareChipOutline} />
                                    </div>
                                    <div className="font-bold text-lg text-white">Local AI (WebGPU)</div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    High accuracy transcription using your GPU. Best performance for most users.
                                    <span className="block mt-1 text-xs opacity-70">Requires ~2GB VRAM.</span>
                                </p>
                            </div>
                            {transcriptionBackend === 'webgpu' && (
                                <div className="absolute top-0 right-0 p-1.5 bg-blue-500 rounded-bl-lg">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </div>

                        {/* CPU Option */}
                        <div
                            onClick={() => setTranscriptionBackend('cpu')}
                            className={`cursor-pointer rounded-xl border-2 transition-all duration-200 relative overflow-hidden group ${transcriptionBackend === 'cpu'
                                ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                                : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${transcriptionBackend === 'cpu' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                        <IonIcon icon={speedometerOutline} />
                                    </div>
                                    <div className="font-bold text-lg text-white">CPU Mode</div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Lightweight 'tiny' model running via WASM. Zero GPU impact.
                                    <span className="block mt-1 text-xs opacity-70">Ideal for heavy gaming loads.</span>
                                </p>
                            </div>
                            {transcriptionBackend === 'cpu' && (
                                <div className="absolute top-0 right-0 p-1.5 bg-purple-500 rounded-bl-lg">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <IonList inset={true}>
                    <IonListHeader>
                        <IonLabel>Integration</IonLabel>
                    </IonListHeader>

                    <IonItem>
                        <IonInput
                            label="Trigger Phrase"
                            labelPlacement="stacked"
                            placeholder="e.g. Hey Rapid"
                            value={triggerPhrase}
                            onIonInput={e => setTriggerPhrase(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Twitch Username"
                            labelPlacement="stacked"
                            placeholder="Username"
                            value={twitchUsername}
                            onIonInput={e => setTwitchUsername(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonSelect
                            label="Character Profile"
                            value={selectedCharacterId}
                            onIonChange={e => setSelectedCharacterId(e.detail.value)}
                            interfaceOptions={{ cssClass: 'custom-select-interface' }}
                        >
                            {CHARACTERS.map(c => (
                                <IonSelectOption key={c.id} value={c.id}>{c.name}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Streamer.bot URL"
                            labelPlacement="stacked"
                            placeholder="http://127.0.0.1:7474"
                            value={streamerBotUrl}
                            onIonInput={e => setStreamerBotUrl(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Broadcaster ID"
                            labelPlacement="stacked"
                            placeholder="Numeric ID"
                            value={broadcastUserId}
                            onIonInput={e => setBroadcastUserId(e.detail.value!)}
                        />
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
}
