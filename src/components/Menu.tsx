import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { micOutline, micSharp, settingsOutline, settingsSharp, optionsOutline, optionsSharp, colorPaletteOutline, colorPaletteSharp } from 'ionicons/icons';
import pkg from '../../package.json';
import './Menu.css';

interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
}

const mainPages: AppPage[] = [
    {
        title: 'Speech to Text',
        url: '/',
        iosIcon: micOutline,
        mdIcon: micSharp
    }
];

const settingsPages: AppPage[] = [
    {
        title: 'General Settings',
        url: '/settings/general',
        iosIcon: settingsOutline,
        mdIcon: settingsSharp
    },
    {
        title: 'Audio Settings',
        url: '/settings/audio',
        iosIcon: optionsOutline,
        mdIcon: optionsSharp
    },
    {
        title: 'Theme',
        url: '/settings/theme',
        iosIcon: colorPaletteOutline,
        mdIcon: colorPaletteSharp
    }
];

const Menu: React.FC = () => {
    const location = useLocation();

    return (
        <IonMenu contentId="main" type="overlay">
            <IonContent>
                <div className="flex flex-col h-full bg-transparent">
                    {/* Header & Main Nav */}
                    <div className="pt-2">
                        <IonList id="inbox-list" lines="none" style={{ background: 'transparent' }}>
                            <IonListHeader>PNGTuber-GPT-STT</IonListHeader>
                            <IonNote className="mb-6">v{pkg.version}</IonNote>

                            {mainPages.map((appPage, index) => (
                                <IonMenuToggle key={index} autoHide={false}>
                                    <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                                        <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                                        <IonLabel>{appPage.title}</IonLabel>
                                    </IonItem>
                                </IonMenuToggle>
                            ))}
                        </IonList>
                    </div>

                    {/* Spacer to push settings to bottom */}
                    <div className="flex-grow"></div>

                    {/* Settings Nav */}
                    <div className="pb-4">
                        <IonList lines="none" style={{ background: 'transparent' }}>
                            <IonListHeader className="uppercase text-xs font-bold tracking-wider text-slate-500 mb-2 pl-5">Settings</IonListHeader>
                            {settingsPages.map((appPage, index) => (
                                <IonMenuToggle key={`settings-${index}`} autoHide={false}>
                                    <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                                        <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                                        <IonLabel>{appPage.title}</IonLabel>
                                    </IonItem>
                                </IonMenuToggle>
                            ))}
                        </IonList>
                    </div>
                </div>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
