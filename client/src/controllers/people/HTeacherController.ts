import type MainApi from "../../api/main/MainApi";
import type HTeacherApi from "../../api/people/HTeacherApi";
import type EventsStore from "../../store/other/EventsStore";
import type HTeacherStore from "../../store/people/HTeacherStore";
import type StatusStore from "../../store/StatusStore";

export default class HTeacherController {
    private mainApi: MainApi;
    private hteacherApi: HTeacherApi;
    private hteacherStore: HTeacherStore;
    private statusStore: StatusStore;
    private eventsStore: EventsStore;
    private getInfoInComponent: Function | any;

    public constructor(mainApi: MainApi, hteacherApi: HTeacherApi, hteacherStore: HTeacherStore, statusStore: StatusStore, eventsStore: EventsStore) {
        this.mainApi = mainApi;
        this.hteacherApi = hteacherApi;
        this.hteacherStore = hteacherStore;
        this.statusStore = statusStore;
        this.eventsStore = eventsStore;
    }
    
    public didMount(getInfoInComponent: Function | any): void {
        this.getInfoInComponent = getInfoInComponent;
        if(this.mainApi.getReadyStateSSE() == EventSource.OPEN) getInfoInComponent();
        this.mainApi.addEventListenerSSE('connect', getInfoInComponent);
        this.mainApi.addEventListenerSSE('addInfoL1C', this.addInfoL1C.bind(this));
        this.mainApi.addEventListenerSSE('chInfoL1C', this.chInfoL1C.bind(this));
        this.mainApi.addEventListenerSSE('remInfoL1C', this.remInfoL1C.bind(this));
        this.mainApi.addEventListenerSSE('addInfoL2C', this.addInfoL2C.bind(this));
        this.mainApi.addEventListenerSSE('remInfoL2C', this.remInfoL2C.bind(this));
        this.mainApi.addEventListenerSSE('chInfoL2C', this.chInfoL2C.bind(this));
        this.mainApi.addEventListenerSSE('codPepL1C', this.codPepL1C.bind(this));
        this.mainApi.addEventListenerSSE('codPepL2C', this.codPepL2C.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.getInfoInComponent);
        this.mainApi.removeEventListenerSSE('addInfoL1C', this.addInfoL1C.bind(this));
        this.mainApi.removeEventListenerSSE('chInfoL1C', this.chInfoL1C.bind(this));
        this.mainApi.removeEventListenerSSE('remInfoL1C', this.remInfoL1C.bind(this));
        this.mainApi.removeEventListenerSSE('addInfoL2C', this.addInfoL2C.bind(this));
        this.mainApi.removeEventListenerSSE('remInfoL2C', this.remInfoL2C.bind(this));
        this.mainApi.removeEventListenerSSE('chInfoL2C', this.chInfoL2C.bind(this));
        this.mainApi.removeEventListenerSSE('codPepL1C', this.codPepL1C.bind(this));
        this.mainApi.removeEventListenerSSE('codPepL2C', this.codPepL2C.bind(this));
    }

    public async addSchool (par: HTMLElement, value: string): Promise<void> {
        const data: any = await this.hteacherApi.addSchool(value);
        if(data.status == 201){
            par.setAttribute('data-st', '0');
        }
    }

    public async deleteSchool (id: string): Promise<void> {
        this.hteacherApi.deleteSchool(id);
    }

    public async changeSchool (par: HTMLElement, id: string, value: string): Promise<void> {
        const data: any = await this.hteacherApi.changeSchool(id, value);
        if(data.status == 200){
            par.setAttribute('data-st', '0');
        }
    }

    public async deletePeople (id: string): Promise<void> {
        this.hteacherApi.deletePeople(id);
    }

    public async changePeople (par: HTMLElement, id: string, value: string): Promise<void> {
        const data: any = await this.hteacherApi.changePeople(id, value);
        if(data.status == 200){
            par.setAttribute('data-st', '0');
        }
    }

    public async addPeople (par: HTMLElement, id: string, value: string): Promise<void> {
        const data: any = await this.hteacherApi.addPeople(id, value);
        if(data.status == 201){
            par.setAttribute('data-st', '0');
        }
    }

    public async setCodePep (id: string): Promise<void> {
        const title: string = "Внимание!";
        const text: string = "Ссылка успешно обновлена";
        const data: any = await this.hteacherApi.setCodePep(id);
        if (data.status == 200) {
            this.eventsStore.changeEvent(title, text, 10);
        }
    }

    public async getInfo(): Promise<boolean> {
        const URL: string = this.statusStore.role == 4 ? "getInfoFA" : "getInfo";
        const data: any = await this.hteacherApi.getInfo(URL);
        if(data.status == 200){
            this.hteacherStore.cloneHTeacher(data.body);
            return true;
        }
    }

    private codPepL2C(e): void {
        console.log(e.data);
        const msg = JSON.parse(e.data);
        this.hteacherStore.changeHTeacherParam(msg.id1, msg.id, msg.code, "link");
    }

    private codPepL1C(e): void {
        console.log(e.data);
        const msg = JSON.parse(e.data);
        this.hteacherStore.changeHTeacher(msg.id, msg.name, "link");
    }

    private remInfoL1C(e): void {
        const msg = JSON.parse(e.data);
        this.hteacherStore.deleteHTeacher(msg.id);
    }

    private chInfoL1C(e): void {
        const msg = JSON.parse(e.data);
        console.log(msg);
        this.hteacherStore.changeHTeacher(msg.id, msg.name);
    }

    private addInfoL1C(e): void {
        const msg = JSON.parse(e.data);
        this.hteacherStore.cloneHTeacherParam(msg.id, msg.body);
    }

    private remInfoL2C(e): void {
        const msg = JSON.parse(e.data);
        this.hteacherStore.deleteHTeachersForSchool(msg.id1, msg.id);
    }

    private chInfoL2C(e): void {
        const msg = JSON.parse(e.data);
        this.hteacherStore.changeHTeacherParam(msg.id1, msg.id, msg.name);
    }

    private addInfoL2C(e): void {
        const msg = JSON.parse(e.data);
        this.hteacherStore.cloneHTeachersForSchool(msg.id1, msg.id, msg.body);
    }
}