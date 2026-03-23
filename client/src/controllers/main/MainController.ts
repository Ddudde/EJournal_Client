import type MainApi from "../../api/main/MainApi";
import type DialogStore from "../../store/other/DialogStore";
import type EventsStore from "../../store/other/EventsStore";
import type StatusStore from "../../store/StatusStore";
import { NotifEvent } from "../NotificationController";

export default class MainController {
    private mainApi: MainApi;
    private statusStore: StatusStore;
    private dialogStore: DialogStore;
    private warnErrNet: number | undefined;
    private eventsStore: EventsStore;

    public constructor(mainApi: MainApi, statusStore: StatusStore, dialogStore: DialogStore, eventsStore: EventsStore) {
        this.mainApi = mainApi;
        this.statusStore = statusStore;
        this.dialogStore = dialogStore;
        this.eventsStore = eventsStore;
    }

    public async selectKid(kid: string): Promise<void> {
        const data: any = await this.mainApi.selectKid(kid);
        if(data.status == 200) {
            console.log(data);
            this.statusStore.changeState("kid", data.body.kid);
        }
    }

    public async changeRoles(): Promise<void> {
        console.log("testdffd");
        const data: any = await this.mainApi.changeRoles();
        if(data.status == 200 && data.body.role != undefined){
            this.statusStore.cloneState(data.body);
        }
    }

    public async exitFromAccount(notifToken: string): Promise<void> {
        const data: any = await this.mainApi.exitFromAccount(notifToken);
        if(data.status == 200) {
            console.log(data);
            this.statusStore.stateReset();
            this.dialogStore.resetDialog();
        }
    }

    private async initConnection(login: string, notifToken: string, permis: boolean, eventSource:EventSource): Promise<void> {
        const data: any = await this.mainApi.initConnection(login, notifToken, permis);
        if(data.status == 200) {
            this.statusStore.cloneState(data.body);
            window.dispatchEvent(new Event(NotifEvent.REQUEST_PERMISSON));
            eventSource.dispatchEvent(new Event("connect"));
        }
    }

    private initSSE(): void {
        const eventSource:EventSource = this.mainApi.initSSE();
        eventSource.onerror = this.errorSSE.bind(this);
        eventSource.addEventListener('chck', e => {
            const msg = JSON.parse(e.data);
            console.log(msg);
            if (msg) {
                localStorage.setItem("sec", msg);
                this.statusStore.changeState("uuid", msg);
            }
            if(this.warnErrNet != undefined){
                this.eventsStore.deleteEvents(this.warnErrNet);
                this.warnErrNet = undefined;
            }
            this.initConnection(this.statusStore.login, localStorage.getItem("notifToken"), Notification.permission == "granted", eventSource);
        }, false);
    }

    private errorSSE (e: any) {
        if (e.readyState == EventSource.CLOSED) {
            console.log('close');
            this.closeStream();
        } else {
            console.log('try to reconnect....');
        }
        if(this.warnErrNet == undefined) {
            this.warnErrNet = this.eventsStore.changeEvent("Внимание!", "Отсутствует подключение к серверу", undefined, true);
        }
    }

    public closeStream(): void {
        this.mainApi.closeStream();
    }

    public openStream(): void {
        const readyStateSSE: number = this.mainApi.getReadyStateSSE();
        if (readyStateSSE != undefined && readyStateSSE != EventSource.CLOSED) {
            console.log("stream already opened");
            return;
        }
        this.initSSE();
    }
}