import type MainApi from "../api/MainApi";
import type NewsApi from "../api/NewsApi";
import type NewsStore from "../store/NewsStore";

export default class NewsController {
    private mainApi: MainApi;
    private newsStore: NewsStore;
    private newsApi: NewsApi;
    private type: string = "Por";

    public constructor(mainApi: MainApi, newsStore: NewsStore, newsApi: NewsApi) {
        this.mainApi = mainApi;
        this.newsStore = newsStore;
        this.newsApi = newsApi;
    }
    
    public didMount(type: string): void {
        this.type = type;
        if(this.mainApi.getReadyStateSSE() == EventSource.OPEN) this.getInfo();
        this.mainApi.addEventListenerSSE('connect', this.getInfo.bind(this));
        this.mainApi.addEventListenerSSE('addNewsC', this.addNewsSSE.bind(this));
        this.mainApi.addEventListenerSSE('delNewsC', this.delNewsSSE.bind(this));
        this.mainApi.addEventListenerSSE('chNewsC', this.chNewsSSE.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.getInfo.bind(this));
        this.mainApi.removeEventListenerSSE('addNewsC', this.addNewsSSE.bind(this));
        this.mainApi.removeEventListenerSSE('delNewsC', this.delNewsSSE.bind(this));
        this.mainApi.removeEventListenerSSE('chNewsC', this.chNewsSSE.bind(this));
    }

    public async deleteNews (id: string): Promise<void> {
        this.newsApi.deleteNews(id);
    }

    public async changeNews (id: string, value: string, nameProperty: string): Promise<void> {
        this.newsApi.changeNews(id, value, nameProperty);
    }

    public async addNews (inps: any): Promise<void> {
        this.newsApi.addNews(inps, this.type);
    }

    public async getInfo(): Promise<void> {
        const data: any = await this.newsApi.getInfo(this.type);
        if(data.status == 200){
            this.newsStore.cloneNews(this.type, data.body);
        }
    }

    private delNewsSSE(e): void {
        const msg = JSON.parse(e.data);
        this.newsStore.deleteNews(this.type, msg.id);
    }

    private chNewsSSE(e): void {
        const msg = JSON.parse(e.data);
        this.newsStore.changeNewsParam(this.type, msg.id, msg.type, msg.val);
    }

    private addNewsSSE(e): void {
        const msg = JSON.parse(e.data);
        this.newsStore.changeNews(this.type, msg.id, msg.body);
    }
}