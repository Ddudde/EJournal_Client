import MainApi from "../api/main/MainApi";
import type TutorApi from "../api/TutorApi";
import type EventsStore from "../store/other/EventsStore";
import { cAuth } from "../utils/apiPath";

export default class TutorController {
    private mainApi: MainApi;
    private tutorApi: TutorApi;
    private eventsInfo: EventsStore;

    public constructor(mainApi: MainApi, tutorApi: TutorApi, eventsInfo: EventsStore) {
        this.mainApi = mainApi;
        this.tutorApi = tutorApi;
        this.eventsInfo = eventsInfo;
    }

    public async addRequest(inps: any): Promise<void> {
        const data: any = await this.tutorApi.addRequest(inps);
        if(data.status == 200){
            const title: string = "Внимание!";
            const text: string = "Данные отправлены. В течении дня мы с вами свяжемся. До связи:3";
            this.eventsInfo.changeEvent(title, text, 10);
        }
    }
    
    public didMount(): void {
        this.mainApi.addEventListenerSSE('connect', this.onConnect.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.onConnect.bind(this));
    }

    public onConnect(): void{
        MainApi.sendToServer({
            type: "TUTOR"
        }, 'PATCH', cAuth+"infCon");
    }
}