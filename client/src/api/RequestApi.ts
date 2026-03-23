import { cRequests } from "../utils/apiPath";
import MainApi from "./main/MainApi";

export default class RequestApi {
    public async getInfo(): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cRequests+"getRequests");
        return data;
    }

    public async deleteRequest(id: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id
        }, 'DELETE', cRequests+"delReq");
        return data;
    }

    public async changeTitle(id: string, title: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id,
            title: title
        }, 'PATCH', cRequests+"chTitle");
        return data;
    }

    public async changeDate(id: string, date: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id,
            date: date
        }, 'PATCH', cRequests+"chDate");
        return data;
    }

    public async changeText(id: string, text: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id,
            text: text
        }, 'PATCH', cRequests+"chText");
        return data;
    }
}