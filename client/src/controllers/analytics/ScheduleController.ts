import type ScheduleApi from "../../api/analytics/ScheduleApi";
import type MainApi from "../../api/main/MainApi";
import type ScheduleStore from "../../store/analytics/ScheduleStore";
import type GroupStore from "../../store/GroupStore";
import type StatusStore from "../../store/StatusStore";
import type PeopleController from "../people/PeopleController";

export default class ScheduleController {
    private mainApi: MainApi;
    private scheduleApi: ScheduleApi;
    private scheduleStore: ScheduleStore;
    private groupStore: GroupStore;
    private statusStore: StatusStore;
    private peopleController: PeopleController;
    private getInfoInComponent: Function | any;

    public constructor(mainApi: MainApi, scheduleApi: ScheduleApi, scheduleStore: ScheduleStore, groupStore: GroupStore, statusStore: StatusStore, peopleController: PeopleController) {
        this.mainApi = mainApi;
        this.scheduleApi = scheduleApi;
        this.scheduleStore = scheduleStore;
        this.groupStore = groupStore;
        this.statusStore = statusStore;
        this.peopleController = peopleController;
    }
    
    public didMount(getInfoComponent: Function | any): void {
        this.getInfoInComponent = getInfoComponent;
        if(this.mainApi.getReadyStateSSE() != EventSource.OPEN) this.getInfoInComponent();
        this.mainApi.addEventListenerSSE('connect', this.getInfoInComponent);
        this.mainApi.addEventListenerSSE('addLessonC', this.addLessonSSE);
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.getInfoInComponent);
        this.mainApi.removeEventListenerSSE('addLessonC', this.addLessonSSE);
    }

    public async addLesson(dayIndex: number, obj: any): Promise<void> {
        this.scheduleApi.addLesson(dayIndex, obj, this.groupStore.els.group);
    }

    public async getInfo(): Promise<any> {
        let url: string = "getInfo";
        if(this.statusStore.role == 3 || this.statusStore.role == 2) url = "getInfoToHT";
        const data: any = await this.scheduleApi.getInfo(url);
        if(data.status == 200) {
            let isSelGr: any;
            if(this.statusStore.role == 3 || this.statusStore.role == 2) {
                this.peopleController.didMount();
                this.groupStore.cloneGroups(data.body.bodyG);
                if (!data.body.bodyG[this.groupStore.els.group]) {
                    isSelGr = data.body.firstG;
                    this.groupStore.changeGroupsGroup(parseInt(data.body.firstG));
                }
                dispatch(changePeople(CHANGE_TEACHERS_GL, 0, 0, 0, data.body.bodyT));
            }
            return {isOK: true, isSelGr: isSelGr};
        }
        return {};
    }

    public async getSchedule(): Promise<boolean> {
        if(this.mainApi.getReadyStateSSE() != EventSource.OPEN) return false;
        const data: any = await this.scheduleApi.getSchedule(this.groupStore.els.group);
        if(data.status == 200) {
            this.scheduleStore.cloneSchedule(data.body.body);
            return true;
        }
    }

    private addLessonSSE(e): void {
        const msg = JSON.parse(e.data);
        this.scheduleStore.changeSchedule(msg.day, msg.les, undefined, msg.body);
        dispatch(changePeople(CHANGE_TEACHERS_GL, 0, 0, 0, msg.bodyT));
    }
}