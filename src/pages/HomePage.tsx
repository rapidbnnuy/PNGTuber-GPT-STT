import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonSpinner
} from '@ionic/react';
import { micOutline, stopCircleOutline } from 'ionicons/icons';
import { useAppContext } from "../context/AppContext";
import Transcript from "../components/Transcript";

export function HomePage() {
    const {
        transcriber,
        transcriptionBackend,
        vadState,
        toggleRecording,
        isPermissionsGranted,
        isStreamerBotConnected
    } = useAppContext();

    const isRecording = vadState !== 'idle';
    const isProcessing = vadState === 'processing';

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>PNGTuber-GPT-STT</IonTitle>
                    {/* Status Badge in Toolbar */}
                    <div slot="end" className="flex items-center gap-3 mr-2">
                        {/* Streamer.bot Status - Use theme variables via dynamic classes or simpler contrast */}
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border"
                            style={{
                                backgroundColor: 'var(--ion-card-background)',
                                borderColor: 'var(--ion-color-step-150, rgba(0,0,0,0.1))'
                            }}>
                            <div className={`w-2 h-2 rounded-full ${isStreamerBotConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-400'}`}></div>
                            <span className={`text-[10px] font-bold`} style={{ color: isStreamerBotConnected ? 'var(--ion-color-success)' : 'var(--ion-text-color)', opacity: isStreamerBotConnected ? 1 : 0.6 }}>SB</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-xs opacity-80">{transcriptionBackend === 'webgpu' ? 'WebGPU' : 'CPU'}</span>
                            {isRecording && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <div className="flex flex-col min-h-full">

                    {/* Progress Bar */}
                    {transcriber.progressItems.length > 0 && (
                        <div className="w-full h-1 bg-slate-800 mb-2">
                            {transcriber.progressItems.map((item) => (
                                <div key={item.file} className="bg-blue-500 h-1 transition-all duration-200" style={{ width: `${item.progress}%` }}></div>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 relative pb-20"> {/* Added padding bottom */}
                        {!transcriber.output && (
                            <div className="flex h-full items-center justify-center py-20 pointer-events-none" style={{ color: 'var(--ion-text-color)', opacity: 0.7 }}>
                                <div className="text-center">
                                    <IonIcon icon={micOutline} style={{ fontSize: '48px' }} />
                                    <p className="font-medium mt-2">Ready to Transcribe</p>
                                </div>
                            </div>
                        )}
                        <Transcript
                            transcribedData={transcriber.output}
                        />
                    </div>
                </div>

                {/* FAB for Recording */}
                {isPermissionsGranted && (
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton
                            color={isRecording ? "danger" : "success"}
                            onClick={toggleRecording}
                        >
                            {isProcessing ? (
                                <IonSpinner name="crescent" color="light" />
                            ) : (
                                <IonIcon icon={isRecording ? stopCircleOutline : micOutline} />
                            )}
                        </IonFabButton>
                    </IonFab>
                )}
            </IonContent>
        </IonPage>
    );
}
