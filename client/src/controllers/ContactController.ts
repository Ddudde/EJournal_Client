import type ContactApi from "../api/ContactApi";
import type MainApi from "../api/main/MainApi";
import type ContactStore from "../store/ContactStore";

export default class ContactController {
    private mainApi: MainApi;
    private contactApi: ContactApi;
    private contactStore: ContactStore;
    private type: string = "Por";

    public constructor(mainApi: MainApi, contactApi: ContactApi, contactStore: ContactStore) {
        this.mainApi = mainApi;
        this.contactApi = contactApi;
        this.contactStore = contactStore;
    }

    public didMount(type: string): void {
        this.type = type;
        if(this.mainApi.getReadyStateSSE() === EventSource.OPEN) {
            this.getInfo();
        }
        this.mainApi.addEventListenerSSE('connect', this.onConnect.bind(this));
        this.mainApi.addEventListenerSSE('chContactC', this.changeContactSSE.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.onConnect.bind(this));
        this.mainApi.removeEventListenerSSE('chContactC', this.changeContactSSE.bind(this));
    }

    private onConnect(): void {
        this.getInfo();
    }

    private changeContactSSE(e): void {
        const msg = JSON.parse(e.data);
        this.contactStore.changeContact(this.type, msg.p, msg.val, msg.p1);
    }

    public async changeContact (value: string, p: string, p1?: string): Promise<void> {
        await this.contactApi.changeContact(value, p, p1);
    }

    public async getInfo(): Promise<void> {
        const data: any = await this.contactApi.getInfo(this.type);
        if(data.status == 200){
            this.contactStore.cloneContact(this.type, data.body);
        }
    }
}