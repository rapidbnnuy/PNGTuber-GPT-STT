import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonRange,
    IonSelect,
    IonSelectOption,
    IonButton,

} from '@ionic/react';
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

    // Helper for visual meter logic (mostly for the meter bar, which we can keep as custom HTML/CSS inside IonItem)
    const dbToPercent = (db: number) => {
        return Math.max(0, Math.min(100, ((db + 60) / 60) * 100));
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Audio Settings</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonList inset={true}>
                    <IonListHeader>
                        <IonLabel>Input Device</IonLabel>
                    </IonListHeader>

                    {isPermissionsGranted && audioInputDevices.length > 0 ? (
                        <IonItem>
                            <IonSelect
                                label="Microphone"
                                value={selectedDeviceId}
                                onIonChange={e => setSelectedDeviceId(e.detail.value)}
                            >
                                {audioInputDevices.map(d => (
                                    <IonSelectOption key={d.deviceId} value={d.deviceId}>
                                        {d.label || `Microphone ${d.deviceId.slice(0, 5)}...`}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                    ) : (
                        <IonItem>
                            <IonLabel className="ion-text-wrap">Permission Required</IonLabel>
                            <IonButton slot="end" onClick={requestPermissions}>Grant Access</IonButton>
                        </IonItem>
                    )}
                </IonList>

                <IonList inset={true}>
                    <IonListHeader>
                        <IonLabel>Sensitivity & VAD</IonLabel>
                    </IonListHeader>

                    <IonItem lines="none" className="mb-2">
                        <div className="w-full py-2">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium" style={{ color: 'var(--ion-text-color)' }}>Voice Gate Threshold</span>
                                    <span className="text-xs" style={{ color: 'var(--ion-text-color)', opacity: 0.6 }}>Microphone sensitivity. Lower is more sensitive.</span>
                                </div>
                                <span className="text-xs px-2 py-1 rounded font-mono" style={{ backgroundColor: 'var(--ion-color-step-150, rgba(0,0,0,0.1))', color: 'var(--ion-text-color)' }}>{thresholdDb.toFixed(0)} dB</span>
                            </div>
                            <input
                                type="range" min="-60" max="0" step="1"
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer mb-3"
                                style={{ backgroundColor: 'var(--ion-color-step-150, rgba(0,0,0,0.1))' }}
                                value={thresholdDb}
                                onChange={e => setThreshold(Math.pow(10, parseFloat(e.target.value) / 20))}
                            />
                            {/* Visual Meter */}
                            <div className="w-full h-3 rounded-full overflow-hidden flex items-center relative border" style={{ backgroundColor: 'var(--ion-color-step-100, rgba(0,0,0,0.2))', borderColor: 'var(--ion-color-step-150, rgba(0,0,0,0.1))' }}>
                                <div
                                    className={`h-full transition-all duration-75 ease-out ${currentDb > thresholdDb ? 'bg-green-500' : 'bg-green-600/30'}`}
                                    style={{ width: `${dbToPercent(currentDb)}%` }}
                                />
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10"
                                    style={{ left: `${dbToPercent(thresholdDb)}%` }}
                                />
                            </div>
                        </div>
                    </IonItem>

                    <IonItem lines="none" className="mb-2">
                        <div className="w-full py-2">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium" style={{ color: 'var(--ion-text-color)' }}>VAD Silence Timeout</span>
                                    <span className="text-xs" style={{ color: 'var(--ion-text-color)', opacity: 0.6 }}>Wait time after speech stops before processing.</span>
                                </div>
                                <span className="text-xs px-2 py-1 rounded font-mono" style={{ backgroundColor: 'var(--ion-color-step-150, rgba(0,0,0,0.1))', color: 'var(--ion-text-color)' }}>{silenceDuration} ms</span>
                            </div>
                            <IonRange
                                min={500} max={5000} step={100}
                                value={silenceDuration}
                                onIonInput={e => setSilenceDuration(e.detail.value as number)}
                            />
                        </div>
                    </IonItem>

                    <IonItem lines="none">
                        <div className="w-full py-2">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium" style={{ color: 'var(--ion-text-color)' }}>Min Speech Duration</span>
                                    <span className="text-xs" style={{ color: 'var(--ion-text-color)', opacity: 0.6 }}>Ignore sounds shorter than this (clicks, pops).</span>
                                </div>
                                <span className="text-xs px-2 py-1 rounded font-mono" style={{ backgroundColor: 'var(--ion-color-step-150, rgba(0,0,0,0.1))', color: 'var(--ion-text-color)' }}>{minSpeechDuration} ms</span>
                            </div>
                            <IonRange
                                min={0} max={500} step={10}
                                value={minSpeechDuration}
                                onIonInput={e => setMinSpeechDuration(e.detail.value as number)}
                            />
                        </div>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
}
