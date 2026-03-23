import { cDnevnik } from "../utils/apiPath";
import MainApi from "./main/MainApi";

export default class DnevnikApi {

    public async getDnevnik(): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cDnevnik+"getDnevnik");
        return data;
    }

    public async getInfo(): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cDnevnik+"getInfo");
        return data;
    }
}