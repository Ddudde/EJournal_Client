import { cAuth, cProfiles, cSSE } from "../utils/apiPath";

export default class MainApi {
    public static servLink: string = "http://localhost:8080";
    private eventSource: EventSource;

    public constructor() {
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

    public static async sendToServer(bod: any, typeC: string, url: string, auth?: string): Promise<any> {
        const sed: any = {
            method: typeC,
            headers: {'Content-Type': 'application/json'}
        };
        if(auth) {
            sed.headers["Authorization"] = "Basic " + window.btoa(auth);
        }
        if(localStorage.getItem("sec")) {
            sed.headers["x-access-token"] = localStorage.getItem("sec");
            console.log("yyes send", localStorage.getItem("sec"));
        }
        if(bod && typeC != 'GET') sed.body = JSON.stringify(bod);
        if(!url) url = "";
        try {
            const res: Response = await fetch(MainApi.servLink + "/" + url, sed);
            // if(res.status == 401 && localStorage.getItem("sec")) {
            //     localStorage.removeItem("sec");
            // }
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

    public async initConnection(login: string, notifToken: string, permis: boolean): Promise<void> {
        const data: Promise<any> = MainApi.sendToServer({
            login: login,
            notifToken: notifToken,
            permis: permis
        }, 'PATCH', cAuth+"infCon");
        return data;
    }

    public initSSE(): EventSource {
        this.eventSource = new EventSource(MainApi.servLink + '/' + cSSE + 'start/' + localStorage.getItem("sec"));
        this.eventSource.onopen = e => console.log('open');
        return this.eventSource;
    }

    public closeStream(): void {
        if(!this.eventSource) return;

        if(this.eventSource.readyState != EventSource.CLOSED) {
            MainApi.sendToServer(0, 'PATCH', cAuth+"remCon");
            this.eventSource.close();
        }
    }

    public getReadyStateSSE(): number {
        if (this.eventSource === undefined) return undefined;

        return this.eventSource.readyState;
    }

    public addEventListenerSSE(type: string, func: any): void {
        this.eventSource.addEventListener(type, func, false);
    }

    public removeEventListenerSSE(type: string, func: any): void {
        this.eventSource.removeEventListener(type, func);
    }
}