import type MainApi from "../../api/main/MainApi";
import type SettingApi from "../../api/main/SettingApi";
import type CheckboxStore from "../../store/other/CheckboxStore";
import type DialogStore from "../../store/other/DialogStore";
import type EventsStore from "../../store/other/EventsStore";
import type StatusStore from "../../store/StatusStore";

export default class SettingController {
    private mainApi: MainApi;
    private settingApi: SettingApi;
    private statusStore: StatusStore;
    private eventsStore: EventsStore;
    private checkboxStore: CheckboxStore;
    private getSettingsComponent: any | Function;

    public constructor(mainApi: MainApi, settingApi: SettingApi, statusStore: StatusStore, eventsStore: EventsStore, checkboxStore: CheckboxStore) {
        this.mainApi = mainApi;
        this.settingApi = settingApi;
        this.statusStore = statusStore;
        this.eventsStore = eventsStore;
        this.checkboxStore = checkboxStore;
    }
    
    public didMount(getSettingsComponent: any | Function): void {
        this.getSettingsComponent = getSettingsComponent;
        if(this.mainApi.getReadyStateSSE() == EventSource.OPEN) this.onConnect();
        this.mainApi.addEventListenerSSE('connect', this.onConnect.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.onConnect.bind(this));
    }

    private onConnect(e?): void {
        this.settingApi.onConnect();
        this.getSettingsComponent();
    }

    public async checkCodeEmail(emailCode: string, email: string): Promise<boolean> {
        let successResponce: boolean = false;
        const data: any = await this.settingApi.checkCodeEmail(emailCode, email);
        if(data.status == 200){
            successResponce = true;
            this.eventsStore.changeEvent("Внимание!", "Почта подтверждена успешно!", 10);
            this.statusStore.changeState("email", true);
        } else {
            this.eventsStore.changeEvent("Внимание!", "Код подтверждения к почте, неверный", 10);
        }
        return successResponce;
    }

    public async checkPasCodeEmail(emailCode: string, els: any): Promise<boolean> {
        let successResponce: boolean = false;
        const data: any = await this.settingApi.checkPasCodeEmail(emailCode, els.npasinp);
        if(data.status == 200){
            successResponce = true;
            this.eventsStore.changeEvent("Внимание!", "Код верный, пароль изменён успешно!", 10);
        } else {
            this.eventsStore.changeEvent("Внимание!", "Код подтверждения, неверный", 10);
        }
        return successResponce;
    }

    public async startEmail(elem: any): Promise<boolean> {
        const data: any = await this.settingApi.startEmail(elem.emal.value);
        let successResponce: boolean = false;
        if(data.status == 200){
            successResponce = true;
        }
        return successResponce;
    }

    public async getSettings(): Promise<boolean> {
        const data: any = await this.settingApi.getSettings();
        if(data.status == 200){
            for(const id in data.body) {
                this.checkboxStore.changeCheckBox(id, !data.body[id]);
                if(id == "checkbox_hints") {
                    this.eventsStore.changeEventsVisible(data.body[id]);
                }
            }
            return true;
        }
        return false;
    }

    public async changePassword(emailSt: boolean, els: any): Promise<boolean> {
        let successResponce: boolean = false;
        const data: any = await this.settingApi.changePassword(emailSt, els.emInp, els.secinp, els.npasinp);
        if(data.status == 200){
            if(emailSt) {
                successResponce = undefined;
            } else {
                successResponce = true;
            }
            if(els.warnErrSecFr != undefined) {
                this.eventsStore.deleteEvents(els.warnErrSecFr);
                els.warnErrSecFr = undefined;
            }
            if(els.warnErrEm != undefined) {
                this.eventsStore.deleteEvents(els.warnErrEm);
                els.warnErrEm = undefined;
            }
        } else if(data.body.error == "email" && els.warnErrEm == undefined){
            els.warnErrEm = this.eventsStore.changeEvent("Внимание!", "Введённая почта неверна, попробуйте воспользоваться секретной фразой");
        } else if(data.body.error == "secFr" && els.warnErrSecFr == undefined){
            els.warnErrSecFr = this.eventsStore.changeEvent("Внимание!", "Секретная фраза неверна, попробуйте воспользоваться электронной почтой");
        }
        return successResponce;
    }

    public async changeNotification(id: string): Promise<void> {
        if(id == "checkbox_hints") {
            this.eventsStore.changeEventsVisible(!this.checkboxStore.checkBoxes[id]);
        }
        this.settingApi.changeNotification(id, !this.checkboxStore.checkBoxes[id]);
    }

    public async changeIco(icoElement: any): Promise<void> {
        const data: any = await this.settingApi.changeIco(icoElement.value);
        if(data.status == 200){
            icoElement.checked = true;
            this.statusStore.changeState("ico", icoElement.value);
        }
    }

    public async changeSecretFrase(els: any, inp: HTMLInputElement): Promise<boolean> {
        const data: any = await this.settingApi.changeSecretFrase(inp.value);
        if(data.status == 200){
            inp.value = "";
            this.statusStore.changeState("secFr", true);
            if(els.warnUnsetSecFr != undefined) {
                this.eventsStore.deleteEvents(els.warnUnsetSecFr);
                els.warnUnsetSecFr = undefined;
            }
            return true;
        }
        return false;
    }
}