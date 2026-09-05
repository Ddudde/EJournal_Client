import type MainApi from "../../api/main/MainApi";
import type ProfileApi from "../../api/main/ProfileApi";
import type ProfileStore from "../../store/main/ProfileStore";
import type StatusStore from "../../store/StatusStore";

export default class ProfileController {
    private mainApi: MainApi;
    private profileApi: ProfileApi;
    private profilesInfo: ProfileStore;
    private cState: StatusStore;
    private log: string;

    public constructor(mainApi: MainApi, profileApi: ProfileApi, profilesInfo: ProfileStore, cState: StatusStore) {
        this.mainApi = mainApi;
        this.profileApi = profileApi;
        this.profilesInfo = profilesInfo;
        this.cState = cState;
    }

    public async chInfo(value: string): Promise<boolean> {
        const data: any = await this.profileApi.chInfo(value);
        let successResponce: boolean = false;
        if(data.status == 200){
            successResponce = true;
        }
        return successResponce;
    }

    public async chEmail(value: string): Promise<boolean> {
        const data: any = await this.profileApi.chEmail(value);
        let successResponce: boolean = false;
        if(data.status == 200){
            successResponce = true;
        }
        return successResponce;
    }

    public async chLogin(value: string): Promise<boolean> {
        const data: any = await this.profileApi.chLogin(value);
        let successResponce: boolean = false;
        if(data.status == 200){
            successResponce = true;
        }
        return successResponce;
    }

    public async getInfo(): Promise<void> {
        const data: any = await this.profileApi.getInfo(this.log);
        if(data.status == 200){
            this.profilesInfo.cloneProfile(data.body);
        }
    }
    
    public didMount(log: string): void {
        this.log = log;
        if(this.mainApi.getReadyStateSSE() == EventSource.OPEN) this.getInfo();
        this.mainApi.addEventListenerSSE('connect', this.getInfo.bind(this));
        this.mainApi.addEventListenerSSE('chEmail', this.chEmailSSE.bind(this));
        this.mainApi.addEventListenerSSE('chLogin', this.chLoginSSE.bind(this));
        this.mainApi.addEventListenerSSE('chInfo', this.chInfoSSE.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.getInfo.bind(this));
        this.mainApi.removeEventListenerSSE('chEmail', this.chEmailSSE.bind(this));
        this.mainApi.removeEventListenerSSE('chLogin', this.chLoginSSE.bind(this));
        this.mainApi.removeEventListenerSSE('chInfo', this.chInfoSSE.bind(this));
    }

    private chInfoSSE(e): void {
        const msg = JSON.parse(e.data);
        this.profilesInfo.changeProfile("more", msg.body.more);
    }

    private chLoginSSE(e): void {
        const msg = JSON.parse(e.data);
        if (this.cState.login == msg.body.oLogin) {
            this.cState.changeState("login", msg.body.nLogin);
        }
        this.profilesInfo.changeProfile("login", msg.body.nLogin);
    }

    private chEmailSSE(e): void {
        const msg = JSON.parse(e.data);
        this.profilesInfo.changeRoles(msg.body.role, "email", msg.body.email);
    }
}