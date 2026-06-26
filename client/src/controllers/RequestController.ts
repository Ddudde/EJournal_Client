import type MainApi from "../api/main/MainApi";
import type RequestApi from "../api/RequestApi";
import type RequestStore from "../store/RequestStore";

export default class RequestController {
    private mainApi: MainApi;
    private requestApi: RequestApi;
    private requestStore: RequestStore;
    private getInfoComponent: any;

    public constructor(mainApi: MainApi, requestApi: RequestApi, requestStore: RequestStore) {
        this.mainApi = mainApi;
        this.requestApi = requestApi;
        this.requestStore = requestStore;
    }

    public async getInfo(): Promise<void> {
        const data: any = await this.requestApi.getInfo();
        if(data.status == 200){
            this.requestStore.cloneRequest(data.body);
        }
    }

    public async deleteRequest(id: string): Promise<void> {
        this.requestApi.deleteRequest(id);
    }

    public async changeTitle(id: string, title: string): Promise<void> {
        this.requestApi.changeTitle(id, title);
    }

    public async changeDate(id: string, date: string): Promise<void> {
        this.requestApi.changeDate(id, date);
    }

    public async changeText(id: string, text: string): Promise<void> {
        this.requestApi.changeText(id, text);
    }
    
    public didMount(getInfoComponent: any): void {
        this.getInfoComponent = getInfoComponent;
        if(this.mainApi.getReadyStateSSE() == EventSource.OPEN) this.getInfo();
        this.mainApi.addEventListenerSSE('connect', getInfoComponent);
        this.mainApi.addEventListenerSSE('addReq', this.addReq.bind(this));
        this.mainApi.addEventListenerSSE('chText', this.chText.bind(this));
        this.mainApi.addEventListenerSSE('chDate', this.chDate.bind(this));
        this.mainApi.addEventListenerSSE('chTitle', this.chTitle.bind(this));
        this.mainApi.addEventListenerSSE('delReq', this.delReq.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.getInfoComponent);
        this.mainApi.removeEventListenerSSE('addReq', this.addReq.bind(this));
        this.mainApi.removeEventListenerSSE('chText', this.chText.bind(this));
        this.mainApi.removeEventListenerSSE('chDate', this.chDate.bind(this));
        this.mainApi.removeEventListenerSSE('chTitle', this.chTitle.bind(this));
        this.mainApi.removeEventListenerSSE('delReq', this.delReq.bind(this));
    }

    private addReq(e): void {
        const msg = JSON.parse(e.data);
        this.requestStore.changeRequest(msg.id, msg.body);
    }

    private chText(e): void {
        const msg = JSON.parse(e.data);
        this.requestStore.changeRequestProperty(msg.id, "text", msg.text);
    }

    private chDate(e): void {
        const msg = JSON.parse(e.data);
        this.requestStore.changeRequestProperty(msg.id, "date", msg.date);
    }

    private chTitle(e): void {
        const msg = JSON.parse(e.data);
        this.requestStore.changeRequestProperty(msg.id, "title", msg.title);
    }

    private delReq(e): void {
        const msg = JSON.parse(e.data);
        this.requestStore.deleteRequest(msg.id);
    }
}