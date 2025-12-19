import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { AudioSettingsPage } from "./pages/AudioSettingsPage";
import { GeneralSettingsPage } from "./pages/GeneralSettingsPage";

function App() {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="settings/audio" element={<AudioSettingsPage />} />
                        <Route path="settings/general" element={<GeneralSettingsPage />} />
                    </Route>
                </Routes>
            </Router>
        </AppProvider>
    );
}

export default App;
