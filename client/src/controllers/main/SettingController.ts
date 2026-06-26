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
    private dialogStore: DialogStore;
    private checkboxStore: CheckboxStore;
    private getSettingsComponent: any | Function;

    public constructor(mainApi: MainApi, settingApi: SettingApi, statusStore: StatusStore, eventsStore: EventsStore, dialogStore: DialogStore, checkboxStore: CheckboxStore) {
        this.mainApi = mainApi;
        this.settingApi = settingApi;
        this.statusStore = statusStore;
        this.eventsStore = eventsStore;
        this.dialogStore = dialogStore;
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

    public async checkCodeEmail(elem: any): Promise<void> {
        const data: any = await this.settingApi.checkCodeEmail(elem.codEm.value, elem.emal.value);
        if(data.status == 200){
            this.dialogStore.resetDialog();
            this.eventsStore.changeEvent("Внимание!", "Почта подтверждена успешно!", 10);
            elem.emBlock.dataset.mod = '0';
            this.statusStore.changeState("email", true);
        } else {
            this.eventsStore.changeEvent("Внимание!", "Код подтверждения к почте, неверный", 10);
        }
    }

    public async checkPasCodeEmail(elem: any, els: any): Promise<void> {
        const data: any = await this.settingApi.checkPasCodeEmail(elem.codEm.value, els.npasinp);
        if(data.status == 200){
            this.dialogStore.resetDialog();
            this.eventsStore.changeEvent("Внимание!", "Код верный, пароль изменён успешно!", 10);
            elem.zamBlockFir.dataset.mod = '0';
        } else {
            this.eventsStore.changeEvent("Внимание!", "Код подтверждения, неверный", 10);
        }
    }

    public async startEmail(elem: any, emailCode: any): Promise<void> {
        const data: any = await this.settingApi.startEmail(elem.emal.value);
        if(data.status == 200){
            this.dialogStore.cloneDialog(emailCode);
        }
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

    public async changePassword(emailSt: boolean, els: any, emailCodePas: any): Promise<boolean> {
        let isOK: boolean = false;
        const data: any = await this.settingApi.changePassword(emailSt, els.emInp, els.secinp, els.npasinp);
        if(data.status == 200){
            if(emailSt) {
                this.dialogStore.cloneDialog(emailCodePas);
            } else {
                isOK = true;
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
        return isOK;
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