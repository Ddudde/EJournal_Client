import { cAuth, cHteachers } from "../../utils/apiPath";
import MainApi from "../main/MainApi";

export default class HTeacherApi {
    public async addSchool (value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            name: value
        }, 'POST', cHteachers+"addSch");
        return data;
    }

    public async deleteSchool (id: string): Promise<any> {
        MainApi.sendToServer({
            schId: id
        }, 'DELETE', cHteachers+"remSch");
    }

    public async changeSchool (id: string, value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            chSch: id,
            name: value
        }, 'PATCH', cHteachers+"chSch");
        return data;
    }

    public async deletePeople (id: string): Promise<any> {
        MainApi.sendToServer({
            id: id
        }, 'DELETE', cHteachers+"remPep")
    }

    public async changePeople (id: string, value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id,
            name: value
        }, 'PATCH', cHteachers+"chPep");
        return data;
    }

    public async addPeople (id: string, value: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            yo: id,
            name: value
        }, 'POST', cHteachers+"addPep");
        return data;
    }

    public async setCodePep (id: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            id: id
        }, 'PATCH', cAuth+"setCodePep");
        return data;
    }

    public async getInfo(URL: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cHteachers+URL);
        return data;
    }
}