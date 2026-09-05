import type MainApi from "../api/main/MainApi";
import StartApi from "../api/StartApi";
import type DialogStore from "../store/other/DialogStore";
import type EventsStore from "../store/other/EventsStore";
import type StatusStore from "../store/StatusStore";

export default class StartController {
    private warns: any = {};
    private startApi: StartApi;
    private mainApi: MainApi;
    private dialogStore: DialogStore;
    private eventsStore: EventsStore;
    private statusStore: StatusStore;

    public constructor(startApi: StartApi, dialogStore: DialogStore, eventsStore: EventsStore, mainApi: MainApi, statusStore: StatusStore){
        this.startApi = startApi;
        this.mainApi = mainApi;
        this.dialogStore = dialogStore;
        this.eventsStore = eventsStore;
        this.statusStore = statusStore;
    }

    public didMount(): void {
        this.mainApi.addEventListenerSSE('connect', this.onConnect.bind(this));
    }

    public willUnmount(): void {
        this.warns = {};
        this.mainApi.removeEventListenerSSE('connect', this.onConnect.bind(this));
    }

    public async initRecovery(selEmailZ: boolean, els: any): Promise<boolean> {
        const data: any = await this.startApi.initRecovery(selEmailZ, els);
        if(data.status == 200){
            let callback: boolean = false;
            if(selEmailZ) {
                callback = undefined;
            } else {
                callback = true;
            }
            if(this.warns.chPass != undefined) {
                this.eventsStore.deleteEvents(this.warns.chPass);
                this.warns.chPass = undefined;
            }
            return callback;
        } else if(this.warns.chPass == undefined){
            const text = "Неверен логин или " + (selEmailZ ? "электронная почта" : "секретная фраза");
            this.warns.chPass = this.eventsStore.changeEvent("Внимание!", text);
        }
        return false;
    }

    public onConnect(): void{
        this.startApi.onConnect();
    }

    public async checkInviteCode(code: any, mod: string): Promise<void> {
        const data: any = await this.startApi.checkInviteCode(code);
        if(data.status != 200){
            this.statusStore.changeState("invErr", true);
            return;
        }
        if(mod == "inv") {
            if (this.statusStore.auth) {
                this.statusStore.changeState("reaYes", true);
            } else {
                this.eventsStore.changeEvent("Внимание!", "Поздравляем, приглашение активно! Вам разрешено зарегистроваться.", 10);
            }
        } else {
            this.eventsStore.changeEvent("Внимание!", "Аккаунт существует. Открыта возможность перерегистрации.", 10);
        }
    }

    public async initVxod(notifToken: string, permis: boolean, auth: string): Promise<void> {
        const data: any = await StartApi.initVxod(notifToken, permis, auth);
        if(data.status == 200) {
            console.log(data);
            this.statusStore.cloneState(data.body.bodyAuth);
            localStorage.setItem("accessToken", data.body.token);
        } else {
            this.eventsStore.changeEvent("Внимание!", "Неверный логин или пароль", 10);
        }
    }

    public static async initTestVxod(auth: string): Promise<void> {
        const data: any = await StartApi.initVxod(undefined, undefined, auth);
        if(data.status == 200) {
            console.log(data);
            localStorage.setItem("accessToken", data.body.token);
        }
    }

    public async initRegistration(mod: string, selEmailR: boolean, value: string, els: any, code: any, textNoInv: string): Promise<boolean> {
        const data: any = await this.startApi.initRegistration(mod, selEmailR, value, els, code);
        if(data.status == 201){
            if(this.warns.logR != undefined) {
                this.eventsStore.deleteEvents(this.warns.logR);
                this.warns.logR = undefined;
            }
            return true;
        } else if(data.body.error == "noInv"){
            this.eventsStore.changeEvent("Внимание!", textNoInv, 10);
        } else if(this.warns.logR == undefined && mod == undefined){
            this.warns.logR = this.eventsStore.changeEvent("Внимание!", "Логин занят, попробуйте изменить");
        }
        return false;
    }

    public async startEmail(code: any, value: any): Promise<boolean> {
        const data: any = await this.startApi.startEmail(code, value);
        let successResponce: boolean = false;
        if(data.status == 200){
            successResponce = true;
        }
        return successResponce;
    }

    public async checkCodeEmail(code: any, elem: any): Promise<boolean> {
        const data: any = await this.startApi.checkCodeEmail(code, elem);
        if(data.status == 200){
            this.eventsStore.changeEvent("Внимание!", "Почта подтверждена успешно!", 10);
            return true;
        } else {
            this.eventsStore.changeEvent("Внимание!", "Код подтверждения к почте, неверный", 10);
        }
        return false;
    }

    public async checkPasCodeEmail(els: any, elem: any): Promise<boolean> {
        const data: any = await this.startApi.checkPasCodeEmail(els, elem);
        let successResponce: boolean = false;
        if(data.status == 200){
            this.eventsStore.changeEvent("Внимание!", "Код верный, пароль изменён успешно!", 10);
            elem.vxodBlock.dataset.mod = '0';
            successResponce = true;
        } else {
            this.eventsStore.changeEvent("Внимание!", "Код подтверждения, неверный", 10);
        }
        return successResponce;
    }
}