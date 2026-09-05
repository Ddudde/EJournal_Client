import { cProfiles } from "../../utils/apiPath";
import MainApi from "./MainApi";

export default class ProfileApi {

    public async chInfo(value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            info: value
        }, 'PATCH', cProfiles+"chInfo");
        return data;
    }

    public async chEmail(value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            email: value
        }, 'PATCH', cProfiles+"chEmail");
        return data;
    }

    public async chLogin(value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            nLogin: value
        }, 'PATCH', cProfiles+"chLogin");
        return data;
    }

    public async getInfo(log: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cProfiles+"getProfile/"+log);
        return data;
    }
}