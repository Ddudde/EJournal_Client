import { cNews } from "../utils/apiPath";
import MainApi from "./main/MainApi";

export default class NewsApi {
    public async deleteNews (id: string): Promise<void> {
        MainApi.sendToServer({
            id: id
        }, 'DELETE', cNews+"delNews")
    }

    public async changeNews (id: string, value: string, nameProperty: string): Promise<void> {
        MainApi.sendToServer({
            type: nameProperty,
            val: value,
            id: id
        }, 'PUT', cNews+"chNews");
    }

    public async addNews (inps: any, type: string): Promise<void> {
        MainApi.sendToServer({
            title: inps.inpnzt,
            date: inps.inpndt,
            img_url: inps.addIm,
            text: inps.inpntt
        }, 'POST', cNews+"addNews"+type);
    }

    public async getInfo(type: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cNews+"getNews/"+type);
        return data;
    }
}