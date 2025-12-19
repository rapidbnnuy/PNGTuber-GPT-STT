import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonLabel,
    IonItem,
    IonToggle,
    IonIcon
} from '@ionic/react';
import { moonOutline, sunnyOutline, colorPaletteOutline } from 'ionicons/icons';
import { useAppContext } from '../context/AppContext';
import { THEME_PRESETS } from '../utils/ThemeData';

export function ThemeSettingsPage() {
    const {
        themeMode, setThemeMode,
        themeColor, setThemeColor,
        showGradient, setShowGradient
    } = useAppContext();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Theme Settings</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

                {/* --- Mode Selection --- */}
                <div className="mb-8 px-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pl-1" style={{ color: 'var(--ion-text-color)', opacity: 0.6 }}>Appearance</h3>
                    <div className="p-1 rounded-xl flex" style={{ backgroundColor: 'var(--ion-card-background)', border: '1px solid var(--ion-color-step-150, rgba(0,0,0,0.1))' }}>
                        <button
                            onClick={() => setThemeMode('light')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all`}
                            style={{
                                backgroundColor: themeMode === 'light' ? 'var(--ion-color-light)' : 'transparent',
                                color: themeMode === 'light' ? 'var(--ion-color-light-contrast)' : 'var(--ion-text-color)',
                                opacity: themeMode === 'light' ? 1 : 0.6
                            }}
                        >
                            <IonIcon icon={sunnyOutline} />
                            Light
                        </button>
                        <button
                            onClick={() => setThemeMode('dark')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all`}
                            style={{
                                backgroundColor: themeMode === 'dark' ? 'var(--ion-color-dark)' : 'transparent',
                                color: themeMode === 'dark' ? 'var(--ion-color-dark-contrast)' : 'var(--ion-text-color)',
                                opacity: themeMode === 'dark' ? 1 : 0.6
                            }}
                        >
                            <IonIcon icon={moonOutline} />
                            Dark
                        </button>
                    </div>
                </div>

                {/* --- Color Presets --- */}
                <div className="mb-8 px-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pl-1" style={{ color: 'var(--ion-text-color)', opacity: 0.6 }}>Accent Color</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {THEME_PRESETS.map(preset => (
                            <div
                                key={preset.id}
                                onClick={() => setThemeColor(preset.id)}
                                className={`cursor-pointer relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-200`}
                                style={{
                                    backgroundColor: themeColor === preset.id ? 'var(--ion-card-background)' : 'rgba(var(--ion-color-step-950, 0,0,0), 0.05)',
                                    borderColor: themeColor === preset.id ? preset.primary : 'transparent',
                                    boxShadow: themeColor === preset.id ? `0 4px 12px -2px ${preset.primary}40` : 'none'
                                }}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 rounded-full shadow-inner" style={{ background: preset.primary }}></div>
                                    <span className="text-xs font-medium" style={{ color: 'var(--ion-text-color)' }}>
                                        {preset.name}
                                    </span>
                                </div>
                                {themeColor === preset.id && (
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: preset.primary }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Effects --- */}
                <div className="mb-6 px-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pl-1" style={{ color: 'var(--ion-text-color)', opacity: 0.6 }}>Effects</h3>
                    <div className="rounded-xl overflow-hidden border" style={{ backgroundColor: 'var(--ion-card-background)', borderColor: 'var(--ion-color-step-150, rgba(0,0,0,0.1))' }}>
                        <IonItem lines="none" style={{ '--background': 'transparent' }}>
                            <IonIcon slot="start" icon={colorPaletteOutline} style={{ color: 'var(--ion-text-color)', opacity: 0.6 }} />
                            <IonLabel>
                                <h2 className="font-medium" style={{ color: 'var(--ion-text-color)' }}>Vibrant Gradients</h2>
                                <p className="text-xs mt-1" style={{ color: 'var(--ion-text-color)', opacity: 0.6 }}>Add colorful background gradients based on your theme.</p>
                            </IonLabel>
                            <IonToggle
                                checked={showGradient}
                                onIonChange={e => setShowGradient(e.detail.checked)}
                            />
                        </IonItem>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
}
