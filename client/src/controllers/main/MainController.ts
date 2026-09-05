import type MainApi from "../../api/main/MainApi";
import type EventsStore from "../../store/other/EventsStore";
import type StatusStore from "../../store/StatusStore";
import { NotifEvent } from "../NotificationController";
import StartController from "../StartController";

export default class MainController {
    private mainApi: MainApi;
    private statusStore: StatusStore;
    private warnErrNet: number | undefined;
    private eventsStore: EventsStore;
    public static awaitInitSSE: Promise<void>;
    private awaitInitAuth: Promise<void>;

    public constructor(mainApi: MainApi, statusStore: StatusStore, eventsStore: EventsStore) {
        this.mainApi = mainApi;
        this.statusStore = statusStore;
        this.eventsStore = eventsStore;
        if(!localStorage.getItem("accessToken")) {
            // this.awaitInitAuth = StartController.initTestVxod("nm12:1111");
        }
    }

    public async selectKid(kid: string): Promise<void> {
        const data: any = await this.mainApi.selectKid(kid);
        if(data.status == 200) {
            console.log(data);
            this.statusStore.changeState("kid", data.body.kid);
        }
    }

    public async changeRoles(): Promise<void> {
        const data: any = await this.mainApi.changeRoles();
        if(data.status == 200 && data.body.role != undefined){
            this.statusStore.cloneState(data.body);
        }
    }

    public async exitFromAccount(notifToken: string): Promise<boolean> {
        let successResponce: boolean = false;
        const data: any = await this.mainApi.exitFromAccount(notifToken);
        if(data.status == 200) {
            successResponce = true;
            console.log(data);
            this.statusStore.stateReset();
        }
        return successResponce;
    }

    private async initConnection(notifToken: string, permis: boolean, eventSource:EventSource): Promise<void> {
        const data: any = await this.mainApi.initConnection(notifToken, permis);
        if(data.status == 200) {
            this.statusStore.cloneState(data.body);
            window.dispatchEvent(new Event(NotifEvent.REQUEST_PERMISSON));
            eventSource.dispatchEvent(new Event("connect"));
        }
    }

    private async initSSE(): Promise<void> {
        await this.connectToSSE();
        console.log("yaaaaaaaa");
        const eventSource:EventSource = this.mainApi.initSSE();
        eventSource.onerror = this.errorSSE.bind(this);
        eventSource.addEventListener('chck', e => {
            const msg = JSON.parse(e.data);
            console.log(msg);
            if (msg) {
                localStorage.setItem("token", msg);
                this.statusStore.changeState("uuid", msg);
            }
            if(this.warnErrNet != undefined){
                this.eventsStore.deleteEvents(this.warnErrNet);
                this.warnErrNet = undefined;
            }
            this.initConnection(localStorage.getItem("notifToken"), Notification.permission == "granted", eventSource);
        }, false);
    }

    private errorSSE (e: any) {
        if (e.readyState == EventSource.CLOSED) {
            console.log('close');
            this.closeStream();
        } else {
            console.log('try to reconnect....');
            this.connectToSSE();
        }
        if(this.warnErrNet == undefined) {
            this.warnErrNet = this.eventsStore.changeEvent("Внимание!", "Отсутствует подключение к серверу", undefined, true);
        }
    }

    public closeStream(): void {
        this.mainApi.closeStream();
    }

    public async openStream(): Promise<void> {
        const readyStateSSE: number = this.mainApi.getReadyStateSSE();
        if (readyStateSSE != undefined && readyStateSSE != EventSource.CLOSED) {
            console.log("stream already opened");
            return;
        }
        if(this.awaitInitAuth) await this.awaitInitAuth;
        MainController.awaitInitSSE = this.initSSE();
    }

    public async connectToSSE(): Promise<void> {
        const data: any = await this.mainApi.connectToSSE();
        if(data.status == 200 && data.body) {
            localStorage.setItem("uuid", data.body);
        }
    }
}