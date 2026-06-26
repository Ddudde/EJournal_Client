import type MainApi from "../../api/main/MainApi";
import type PeopleApi from "../../api/people/PeopleApi";
import type GroupStore from "../../store/GroupStore";

export default class PeopleController {
    private mainApi: MainApi;
    private groupStore: GroupStore;
    private peopleApi: PeopleApi;
    private isMounted: boolean = false;

    public constructor(mainApi: MainApi, groupStore: GroupStore, peopleApi: PeopleApi){
        this.mainApi = mainApi;
        this.groupStore = groupStore;
        this.peopleApi = peopleApi;
    }
    
    public didMount(): void {
        if(this.isMounted) return;

        this.isMounted = true;
        this.mainApi.addEventListenerSSE('addGroupC', this.addGroupC.bind(this));
        this.mainApi.addEventListenerSSE('chGroupC', this.chGroupC.bind(this));
        this.mainApi.addEventListenerSSE('remGroupC', this.remGroupC.bind(this));
    }

    public willUnmount(): void {
        if(!this.isMounted) return;

        this.isMounted = false;
        this.mainApi.removeEventListenerSSE('addGroupC', this.addGroupC.bind(this));
        this.mainApi.removeEventListenerSSE('chGroupC', this.chGroupC.bind(this));
        this.mainApi.removeEventListenerSSE('remGroupC', this.remGroupC.bind(this));
    }

    public async deleteGroup (id: string): Promise<void> {
        this.peopleApi.deleteGroup(id);
    }

    public async changeGroup (id: string, value: string, par: HTMLElement): Promise<void> {
        const data: any = await this.peopleApi.changeGroup(id, value);
        if(data.status == 200){
            par.setAttribute('data-st', '0');
        }
    }

    public async addGroup (value: string, par: HTMLElement): Promise<void> {
        const data: any = await this.peopleApi.addGroup(value);
        if(data.status == 200){
            par.setAttribute('data-st', '0');
        }
    }

    private remGroupC(e): void {
        const msg = JSON.parse(e.data);
        this.groupStore.deleteGroupsGroups(msg.id);
    }

    private chGroupC(e): void {
        const msg = JSON.parse(e.data);
        this.groupStore.changeGroupsGroups(msg.id, msg.name);
    }

    private addGroupC(e): void {
        const msg = JSON.parse(e.data);
        this.groupStore.changeGroupsGroups(msg.id, msg.name);
    }
}