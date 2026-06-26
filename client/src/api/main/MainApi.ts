import MainController from "../../controllers/main/MainController";
import type EventsStore from "../../store/other/EventsStore";
import type StatusStore from "../../store/StatusStore";
import { cAuth, cProfiles, cSSE } from "../../utils/apiPath";

export default class MainApi {
    public static servLink: string = "http://localhost:8080";
    private eventSource: EventSource;
    private static statusStore: StatusStore;
    private static eventsStore: EventsStore;

    public constructor(statusStore: StatusStore, eventsStore: EventsStore) {
        MainApi.statusStore = statusStore;
        MainApi.eventsStore = eventsStore;
    }

    public async exitFromAccount(notifToken: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            notifToken: notifToken
        }, 'PATCH', cProfiles+"exit");
        return data;
    }

    public async changeRoles(): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'PATCH', cProfiles+"chRole");
        return data;
    }

    public selectKid(kid: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            idL: kid
        }, 'PATCH', cProfiles+"chKid");
        return data;
    }

    public static async sendToServer(bod: any, typeC: string, url: string, auth?: string, closeConnect?: boolean): Promise<any> {
        const sed: any = {
            method: typeC,
            credentials: "include",
            headers: {'Content-Type': 'application/json'}
        };
        if(auth) {
            sed.headers["Authorization"] = "Basic " + window.btoa(auth);
        }
        if(localStorage.getItem("token")) {
            sed.headers["x-token"] = localStorage.getItem("token");
            console.log("yyes send", localStorage.getItem("token"));
        }
        if(localStorage.getItem("accessToken")) {
            sed.headers["x-access-token"] = localStorage.getItem("accessToken");
            console.log("yyes send", localStorage.getItem("accessToken"));
        }
        if(bod && typeC != 'GET') sed.body = JSON.stringify(bod);
        if(!url) url = "";
        try {
            const res: Response = await fetch(MainApi.servLink + "/" + url, sed);
            if(!MainApi.statusStore.auth) {
                localStorage.removeItem("accessToken");
            }
            if(res.status == 417 && MainApi.statusStore.auth && !closeConnect) {
                const data: any = await MainApi.sendToServer(0, 'GET', cAuth+"refreshToken");
                console.log("teees ", data.status);
                if(data.status == 200) {
                    localStorage.setItem('accessToken', data.body.token);
                } else {
                    localStorage.removeItem("accessToken");
                    MainApi.eventsStore.changeEvent("Внимание!", "Ваш токен неверен или просрочен, необходима повторная авторизация", 10);
                    MainApi.statusStore.auth = false;
                }
            }
            if (!res.ok) {
                throw new Error(`This is an HTTP error: The status is ${res.status}`);
            }
            return res.json().then(data => ({
                status: res.status, body: data
            })).catch(data => ({
                status: res.status
            }));
        } catch(data: any) {
            return data;
        }
    }

    public async initConnection(notifToken: string, permis: boolean): Promise<void> {
        const data: Promise<any> = MainApi.sendToServer({
            notifToken: notifToken,
            permis: permis
        }, 'PATCH', cAuth+"infCon");
        return data;
    }

    public initSSE(): EventSource {
        this.eventSource = new EventSource(MainApi.servLink + '/' + cSSE + 'start?uuid=' + localStorage.getItem("uuid"));
        this.eventSource.onopen = e => console.log('open');
        return this.eventSource;
    }

    public closeStream(): void {
        if(!this.eventSource) return;

        if(this.eventSource.readyState != EventSource.CLOSED) {
            this.eventSource.close();
            this.eventSource = null;
            MainApi.sendToServer(0, 'PATCH', cAuth+"remCon", undefined, true);
        }
    }

    public getReadyStateSSE(): number {
        if (this.eventSource === undefined) return undefined;

        return this.eventSource.readyState;
    }

    public async addEventListenerSSE(type: string, func: any): Promise<void> {
        if(!this.eventSource) await MainController.awaitInitSSE;
        this.eventSource.addEventListener(type, func, false);
    }

    public async removeEventListenerSSE(type: string, func: any): Promise<void> {
        if(!this.eventSource) await MainController.awaitInitSSE;
        this.eventSource.removeEventListener(type, func);
    }

    public connectToSSE(): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cSSE+"connectToken");
        return data;
    }
}