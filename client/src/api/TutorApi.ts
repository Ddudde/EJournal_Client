import { cRequests } from "../utils/apiPath";
import MainApi from "./MainApi";

export default class TutorApi {

    public async addRequest(inps: any): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer({
            fio: inps.inpnnt_,
            email: inps.inpnet_,
            date: new Date().toLocaleString("ru", {day:"2-digit", month: "2-digit", year:"numeric"})
        }, 'POST', cRequests+"addReq");
        return data;
    }
}