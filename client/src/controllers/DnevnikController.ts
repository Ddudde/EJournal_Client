import type DnevnikApi from "../api/DnevnikApi";
import type MainApi from "../api/main/MainApi";
import type ScheduleStore from "../store/analytics/ScheduleStore";
import type DnevnikStore from "../store/DnevnikStore";

export default class DnevnikController {
    private mainApi: MainApi;
    private dnevnikApi: DnevnikApi;
    private dnevnikStore: DnevnikStore;
    private scheduleStore: ScheduleStore;
    private getDnevnikInComponent: Function | any;

    public constructor(mainApi: MainApi, dnevnikApi: DnevnikApi, dnevnikStore: DnevnikStore, scheduleStore: ScheduleStore) {
        this.mainApi = mainApi;
        this.dnevnikApi = dnevnikApi;
        this.dnevnikStore = dnevnikStore;
        this.scheduleStore = scheduleStore;
    }
    
    public didMount(getDnevnikInComponent: Function | any): void {
        this.getDnevnikInComponent = getDnevnikInComponent;
        if(this.mainApi.getReadyStateSSE() == EventSource.OPEN) this.getInfo();
        this.mainApi.addEventListenerSSE('connect', this.getInfo.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.getInfo.bind(this));
    }

    public async getDnevnik(): Promise<boolean> {
        const data: any = await this.dnevnikApi.getDnevnik();
        if(data.status == 200) {
            this.scheduleStore.cloneSchedule(data.body.body);
            this.dnevnikStore.changeDnevnik("jur", data.body.bodyD || {});
            this.dnevnikStore.changeDnevnik("min", data.body.min);
            this.dnevnikStore.changeDnevnik("max", data.body.max);
            return true;
        }
    }

    private async getInfo(): Promise<void> {
        const data: any = await this.dnevnikApi.getInfo();
        if(data.status == 200) this.getDnevnikInComponent();
    }
}