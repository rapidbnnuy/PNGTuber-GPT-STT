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
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1">Appearance</h3>
                    <div className="bg-slate-800/50 p-1 rounded-xl flex">
                        <button
                            onClick={() => setThemeMode('light')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${themeMode === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            <IonIcon icon={sunnyOutline} />
                            Light
                        </button>
                        <button
                            onClick={() => setThemeMode('dark')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${themeMode === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            <IonIcon icon={moonOutline} />
                            Dark
                        </button>
                    </div>
                </div>

                {/* --- Color Presets --- */}
                <div className="mb-8 px-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1">Accent Color</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {THEME_PRESETS.map(preset => (
                            <div
                                key={preset.id}
                                onClick={() => setThemeColor(preset.id)}
                                className={`
                                    cursor-pointer relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-200
                                    ${themeColor === preset.id ? 'border-primary bg-slate-800/80 shadow-lg' : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/60'}
                                `}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 rounded-full shadow-inner" style={{ background: preset.primary }}></div>
                                    <span className={`text-xs font-medium ${themeColor === preset.id ? 'text-white' : 'text-slate-400'}`}>
                                        {preset.name}
                                    </span>
                                </div>
                                {themeColor === preset.id && (
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Effects --- */}
                <div className="mb-6 px-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1">Effects</h3>
                    <div className="bg-slate-900/40 rounded-xl overflow-hidden border border-slate-800">
                        <IonItem lines="none" className="bg-transparent">
                            <IonIcon slot="start" icon={colorPaletteOutline} className="text-slate-400" />
                            <IonLabel>
                                <h2 className="text-white font-medium">Vibrant Gradients</h2>
                                <p className="text-slate-400 text-xs">Add colorful background gradients based on your theme.</p>
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
