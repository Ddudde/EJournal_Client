import { cContacts } from "../utils/apiPath";
import MainApi from "./main/MainApi";

export default class ContactApi {
    public async changeContact (value: string, p: string, p1?: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            p: p,
            p1: p1,
            val: value
        }, 'PUT', cContacts+"chContact");
        return data;
    }

    public async getInfo(type: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cContacts+"getContacts/"+type);
        return data;
    }
}