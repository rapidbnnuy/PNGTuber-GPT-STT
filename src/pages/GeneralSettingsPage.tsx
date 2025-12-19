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
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 mt-2 pl-1 text-muted">AI Engine</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* WebGPU Option */}
                        <div
                            onClick={() => setTranscriptionBackend('webgpu')}
                            className={`cursor-pointer rounded-theme-lg border-2 transition-all duration-200 relative overflow-hidden group`}
                            style={{
                                backgroundColor: transcriptionBackend === 'webgpu' ? 'rgba(59, 130, 246, 0.1)' : 'var(--app-surface)',
                                borderColor: transcriptionBackend === 'webgpu' ? 'var(--ion-color-primary)' : 'var(--app-border)',
                                boxShadow: transcriptionBackend === 'webgpu' ? '0 4px 12px -2px rgba(59, 130, 246, 0.2)' : 'none'
                            }}
                        >
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-theme`} style={{ backgroundColor: transcriptionBackend === 'webgpu' ? 'var(--ion-color-primary)' : 'var(--ion-color-step-100, rgba(0,0,0,0.1))', color: transcriptionBackend === 'webgpu' ? '#fff' : 'var(--app-text)' }}>
                                        <IonIcon icon={hardwareChipOutline} />
                                    </div>
                                    <div className="font-bold text-lg text-text">Local AI (WebGPU)</div>
                                </div>
                                <p className="text-sm leading-relaxed text-muted">
                                    High accuracy transcription using your GPU. Best performance for most users.
                                    <span className="block mt-1 text-xs opacity-70">Requires ~2GB VRAM.</span>
                                </p>
                            </div>
                            {transcriptionBackend === 'webgpu' && (
                                <div className="absolute top-0 right-0 p-1.5 rounded-bl-theme-lg" style={{ backgroundColor: 'var(--ion-color-primary)' }}>
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </div>

                        {/* CPU Option */}
                        <div
                            onClick={() => setTranscriptionBackend('cpu')}
                            className={`cursor-pointer rounded-theme-lg border-2 transition-all duration-200 relative overflow-hidden group`}
                            style={{
                                backgroundColor: transcriptionBackend === 'cpu' ? 'rgba(168, 85, 247, 0.1)' : 'var(--app-surface)',
                                borderColor: transcriptionBackend === 'cpu' ? 'var(--ion-color-secondary)' : 'var(--app-border)',
                                boxShadow: transcriptionBackend === 'cpu' ? '0 4px 12px -2px rgba(168, 85, 247, 0.2)' : 'none'
                            }}
                        >
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-theme`} style={{ backgroundColor: transcriptionBackend === 'cpu' ? 'var(--ion-color-secondary)' : 'var(--ion-color-step-100, rgba(0,0,0,0.1))', color: transcriptionBackend === 'cpu' ? '#fff' : 'var(--app-text)' }}>
                                        <IonIcon icon={speedometerOutline} />
                                    </div>
                                    <div className="font-bold text-lg text-text">CPU Mode</div>
                                </div>
                                <p className="text-sm leading-relaxed text-muted">
                                    Lightweight 'tiny' model running via WASM. Zero GPU impact.
                                    <span className="block mt-1 text-xs opacity-70">Ideal for heavy gaming loads.</span>
                                </p>
                            </div>
                            {transcriptionBackend === 'cpu' && (
                                <div className="absolute top-0 right-0 p-1.5 rounded-bl-theme-lg" style={{ backgroundColor: 'var(--ion-color-secondary)' }}>
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
