import JournalApi from "../../api/analytics/JournalApi";
import MainApi from "../../api/main/MainApi";
import JournalStore from "../../store/analytics/JournalStore";
import StatusStore from "../../store/StatusStore";

export default class JournalController {
    private mainApi: MainApi;
    private journalApi: JournalApi;
    private journalsInfo: JournalStore;
    private cState: StatusStore;
    public selKid: string;

    public constructor(mainApi: MainApi, journalApi: JournalApi, journalsInfo: JournalStore, cState: StatusStore) {
        this.mainApi = mainApi;
        this.journalApi = journalApi;
        this.journalsInfo = journalsInfo;
        this.cState = cState;
    }

    public async getInfo(): Promise<void> {
        const data: any = await this.journalApi.getInfo();
        if(data.status != 200) return;

        let weight, sum, mark, wei;
        for(const predm in data.body.bodyJ) {
            const lesson = data.body.bodyJ[predm];
            weight = 0;
            sum = 0;
            for(const day in lesson.days) {
                mark = parseInt(lesson.days[day].mark);
                if(!mark || isNaN(mark)) continue;
                wei = parseInt(lesson.days[day].weight);
                if(!wei) wei = 1;
                sum += mark*wei;
                weight += wei;
            }
            if (sum && weight) {
                if(!lesson.avg) lesson.avg = {};
                lesson.avg.mark = (sum/weight).toFixed(2);
            }
        }
        if(this.cState.role == 1 && this.cState.kid) this.selKid = this.cState.kid;
        this.journalsInfo.cloneJournal(data.body.bodyJ);
    }
    
    public didMount(): void {
        if(this.mainApi.getReadyStateSSE() == EventSource.OPEN) this.getInfo();
        this.mainApi.addEventListenerSSE('connect', this.getInfo.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.getInfo.bind(this));
    }
}