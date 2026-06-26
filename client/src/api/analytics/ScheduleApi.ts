import { cSchedule } from "../../utils/apiPath";
import MainApi from "../main/MainApi";

export default class ScheduleApi {
    public async addLesson(dayIndex: number, obj: any, group: number): Promise<any> {
        MainApi.sendToServer({
            group: group,
            day: dayIndex,
            obj: obj
        }, 'POST', cSchedule+"addLesson");
    }

    public async getInfo(url: string): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cSchedule + url);
        return data;
    }

    public async getSchedule(group: number): Promise<any> {
        const data: Promise<any> = MainApi.sendToServer(0, 'GET', cSchedule+"getSchedule/"+group);
        return data;
    }
}