import { cAuth, cSettings } from "../../utils/apiPath";
import MainApi from "./MainApi";

export default class SettingApi {
    public onConnect(): void {
        MainApi.sendToServer({
            type: "SETTINGS"
        }, 'PATCH',  cAuth+"infCon");
    }

    public async checkCodeEmail(emailCode: string, email: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            emailCode: emailCode,
            email: email
        }, 'PATCH', cSettings+"checkCodeEmail");
        return data;
    }

    public async checkPasCodeEmail(emailCode: string, nPar: any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            emailCode: emailCode,
            nPar : nPar
        }, 'PATCH', cSettings+"checkPasCodeEmail");
        return data;
    }

    public async startEmail(email: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            email: email
        }, 'PATCH', cSettings+"startEmail");
        return data;
    }

    public async getSettings(): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cSettings+"getSettings");
        return data;
    }

    public async changePassword(emailSt: boolean, email: string, secFr: string, nPar: string | any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            emailSt: emailSt,
            email: emailSt ? email : undefined,
            secFr: emailSt ? undefined : secFr,
            nPar : nPar
        }, 'PATCH', cSettings+"chPass");
        return data;
    }

    public async changeNotification(id: string, value: boolean): Promise<any> {
        MainApi.sendToServer({
            id: id,
            val: value
        }, 'PATCH', cSettings+"chSettings");
    }

    public async changeIco(value: any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: 'chIco',
            valInt: value
        }, 'PATCH', cSettings+"chSettings");
        return data;
    }

    public async changeSecretFrase(value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: 'chSecFR',
            valString: value
        }, 'PATCH', cSettings+"chSettings");
        return data;
    }
}