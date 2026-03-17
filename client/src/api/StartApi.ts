import { cAuth, cSettings } from "../utils/apiPath";
import MainApi from "./MainApi";

export default class StartApi {
    public async initRecovery(selEmailZ: boolean, els: any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            login: els.logz,
            emailSt: selEmailZ,
            email: selEmailZ ? els.emalZ : undefined,
            secFr: selEmailZ ? undefined : els.secFrZ,
            nPar : els.pasnz
        }, 'PATCH', cSettings+"chPass");
        return data;
    }

    public onConnect(): void{
        MainApi.sendToServer({
            type: "AUTH"
        }, 'PATCH', cAuth+"infCon");
    }

    public async checkInviteCode(code: any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            code: code
        }, 'POST', cAuth+"checkInvCode");
        return data;
    }

    public async initVxod(notifToken: string, permis: boolean, auth: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            notifToken: notifToken,
            permis: permis
        }, 'POST', cAuth+"auth", auth);
        return data;
    }

    public async initRegistration(mod: string, selEmailR: boolean, value: string, els: any, code: any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            login: els.logr,
            par: els.pasr,
            ico: value,
            mod: mod,
            secFr: selEmailR ? undefined : els.secFrR,
            code: code
        }, 'POST', cAuth+"reg");
        return data;
    }

    public async startEmail(code: any, value: any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            invCod: code,
            email: value
        }, 'PATCH', cSettings+"startEmail");
        return data;
    }

    public async checkCodeEmail(code: any, elem: any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            invCod: code,
            emailCode: elem.codEm.value,
            email: elem.emalR.value
        }, 'PATCH', cSettings+"checkCodeEmail");
        return data;
    }

    public async checkPasCodeEmail(els: any, elem: any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            login: els.logz,
            emailCode: elem.codEm.value,
            nPar : els.pasnz
        }, 'PATCH', cSettings+"checkPasCodeEmail");
        return data;
    }
}