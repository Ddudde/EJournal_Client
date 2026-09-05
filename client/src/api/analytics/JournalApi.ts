import { cJournal } from "../../utils/apiPath";
import MainApi from "../main/MainApi";

export default class JournalApi {

    public async getInfo(): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cJournal + "getInfo");
        return data;
    }
}