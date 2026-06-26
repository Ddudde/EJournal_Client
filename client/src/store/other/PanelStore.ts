import {makeAutoObservable} from 'mobx';

export default class PanelStore {
    public els = [];
    
    public constructor() {
        makeAutoObservable(this);
    }

	public changePane (id: number, value: any): void {
		this.els[id] = value;
	}

	public changePaneGroup (id: number, value: any): void {
		this.els[id].group = value;
	}

	public changePaneGroups (id: number, groupId: number | any, value: any): void {
		this.els[id].groups[groupId] = value;
		this.els[id].group = groupId;
	}

	public deletePaneGroups (id: number, groupId: number | any): void {
		delete this.els[id].groups[groupId];
	}
}