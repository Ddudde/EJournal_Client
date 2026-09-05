import { cTest } from "../utils/apiPath";
import MainApi from "./main/MainApi";

export default class TestPanelApi {

    public async chNotif(id: string, value: boolean): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id,
            val: value
        }, 'PUT', cTest+"chTests");
        return data;
    }

    public async getInfo(): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cTest+"getInfo");
        return data;
    }
}