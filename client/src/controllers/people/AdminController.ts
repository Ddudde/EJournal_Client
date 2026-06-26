import type MainApi from "../../api/main/MainApi";
import type AdminApi from "../../api/people/AdminApi";
import type EventsStore from "../../store/other/EventsStore";
import type AdminsStore from "../../store/people/AdminsStore";

export default class AdminController {
    private mainApi: MainApi;
    private eventsStore: EventsStore;
    private adminApi: AdminApi;
    private adminsStore: AdminsStore;
    private getInfoComponent: any;

    public constructor(mainApi: MainApi, eventsStore: EventsStore, adminApi: AdminApi, adminsStore: AdminsStore) {
        this.mainApi = mainApi;
        this.eventsStore = eventsStore;
        this.adminApi = adminApi;
        this.adminsStore = adminsStore;
    }
    
    public didMount(getInfoComponent: any): void {
        this.getInfoComponent = getInfoComponent;
        if(this.mainApi.getReadyStateSSE() === EventSource.OPEN) this.getInfoComponent();
        this.mainApi.addEventListenerSSE('connect', this.getInfoComponent);
        this.mainApi.addEventListenerSSE('addPepC', this.addPepSSE.bind(this));
        this.mainApi.addEventListenerSSE('chPepC', this.chPepSSE.bind(this));
        this.mainApi.addEventListenerSSE('remPepC', this.remPepSSE.bind(this));
        this.mainApi.addEventListenerSSE('codPepL2C', this.codPepSSE.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.getInfoComponent);
        this.mainApi.removeEventListenerSSE('addPepC', this.addPepSSE.bind(this));
        this.mainApi.removeEventListenerSSE('chPepC', this.chPepSSE.bind(this));
        this.mainApi.removeEventListenerSSE('remPepC', this.remPepSSE.bind(this));
        this.mainApi.removeEventListenerSSE('codPepL2C', this.codPepSSE.bind(this));
    }

    public async getInfo(): Promise<void> {
        const data: any = await this.adminApi.getInfo();
        if(data.status == 200){
            this.adminsStore.cloneAdmins(data.body);
        }
    }

    public async deleteInvite (id: string): Promise<void> {
        await this.adminApi.deleteInvite(id);
    }

    public async changeInvite (id: string, value: string, par: HTMLElement): Promise<void> {
        const data: any = await this.adminApi.changeInvite(id, value);
        if(data.status == 200){
            par.setAttribute('data-st', '0');
        }
    }

    public async addInvite (value: string, par: HTMLElement): Promise<void> {
        const data: any = await this.adminApi.addInvite(value);
        if(data.status == 201){
            par.setAttribute('data-st', '0');
        }
    }

    private codPepSSE(e): void {
        const msg: any = JSON.parse(e.data);
        this.adminsStore.changeAdminsParam(msg.id, "link", msg.code);
    }

    private remPepSSE(e): void {
        const msg: any = JSON.parse(e.data);
        this.adminsStore.deleteAdmins(msg.id);
    }

    private chPepSSE(e): void {
        const msg: any = JSON.parse(e.data);
        this.adminsStore.changeAdminsParam(msg.id, "name", msg.name);
    }

    private addPepSSE(e): void {
        const msg: any = JSON.parse(e.data);
        this.adminsStore.changeAdmins(msg.id, msg.body);
    }

    public async setCodePep (id: string, title: string, text: string): Promise<void> {
        const data: any = await this.adminApi.setCodePep(id);
        if(data.status == 200){
            this.eventsStore.changeEvent(title, text, 10);
        }
    }
}