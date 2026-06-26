import ReactDOM from 'react-dom/client';
import {HelmetProvider} from "react-helmet-async";
import './index.css';
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import { initContextsValues, ContextStores } from './utils/context';
import { initPWA } from './utils/initPWA';

const contexts = initContextsValues();
initPWA(contexts.controllers.notificationController);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <HelmetProvider>
            <ContextStores.Provider value={contexts}>
                <App/>
            </ContextStores.Provider>
        </HelmetProvider>
    </BrowserRouter>
);