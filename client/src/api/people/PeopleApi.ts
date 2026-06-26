import { cHteachers } from "../../utils/apiPath";
import MainApi from "../main/MainApi";

export default class PeopleApi {
    public async deleteGroup (id: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            grId: id
        }, 'DELETE', cHteachers+"remGroup");
        return data;
    }

    public async changeGroup (id: string, value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            grId: id,
            name: value
        }, 'PATCH', cHteachers+"chGroup");
        return data;
    }

    public async addGroup (value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            name: value
        }, 'POST', cHteachers+"addGroup");
        return data;
    }
}