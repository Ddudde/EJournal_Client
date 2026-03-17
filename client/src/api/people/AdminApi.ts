import { cAdmins, cAuth } from "../../utils/apiPath";
import MainApi from "../MainApi";

export default class AdminApi {
    public async getInfo(): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cAdmins+"getAdmins");
        return data;
    }

    public async deleteInvite (id: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id
        }, 'DELETE', cAdmins+"remPep");
        return data;
    }

    public async changeInvite (id: string, value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id,
            name: value
        }, 'PATCH', cAdmins+"chPep");
        return data;
    }

    public async addInvite (value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            name: value
        }, 'POST', cAdmins+"addPep");
        return data;
    }

    public async setCodePep (id: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id
        }, 'PATCH', cAuth+"setCodePep");
        return data;
    }
}