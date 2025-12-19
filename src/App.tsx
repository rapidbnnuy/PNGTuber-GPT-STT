import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import { AppProvider } from './context/AppContext';
import { HomePage } from './pages/HomePage';
import { AudioSettingsPage } from './pages/AudioSettingsPage';
import { GeneralSettingsPage } from './pages/GeneralSettingsPage';
import { ThemeSettingsPage } from './pages/ThemeSettingsPage';

/* Theme variables */
import './components/Menu.css';

setupIonicReact();

const App: React.FC = () => {
    return (
        <IonApp>
            <AppProvider>
                <IonReactHashRouter>
                    {/* Menu is now a direct child, appearing as an overlay/drawer */}
                    <Menu />

                    {/* Main Content Router */}
                    <IonRouterOutlet id="main">
                        <Route path="/" exact={true}>
                            <HomePage />
                        </Route>
                        <Route path="/settings/audio" exact={true}>
                            <AudioSettingsPage />
                        </Route>
                        <Route path="/settings/general" exact={true}>
                            <GeneralSettingsPage />
                        </Route>
                        <Route path="/settings/theme" exact={true}>
                            <ThemeSettingsPage />
                        </Route>
                        {/* Fallback to home */}
                        <Route render={() => <Redirect to="/" />} />
                    </IonRouterOutlet>
                </IonReactHashRouter>
            </AppProvider>
        </IonApp>
    );
};

export default App;
