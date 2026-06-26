import {makeAutoObservable} from 'mobx';

export default class StatusStore {
    // public auth: boolean = true;
    public auth: boolean = false;
	public invErr: boolean = false;
	public reaYes: boolean = false;
	public ico: number = 2;
	public login: string = "nm12";
	public role: number = 4;
	public uuid: string = "sdfds";
	public roles: boolean = true;
	public secFr: boolean = true;
	public email: boolean = true;
	public roleDesc: string = "администратор портала";
	public rolesDescrs = ["обучающийся", "родитель", "педагог", "завуч", "администратор портала"];
	public kid: string = "id1";
	public kids = {
		"id1": "Петров А.А.",
		"id2": "Петрова А.Б."
	}
    
    public constructor() {
        makeAutoObservable(this);
    }

	public changeState (nameField: string, value: any): void {
		this[nameField] = value;
		if(nameField == "role") {
			this.roleDesc = this.rolesDescrs[value];
		}
	}

	public cloneState (value: any): void {
		if(!value) return;

		let nameProperty: string;
		for(nameProperty of Object.getOwnPropertyNames(value)){
			this[nameProperty] = value[nameProperty];
			if(nameProperty == "role") {
				this.roleDesc = this.rolesDescrs[value[nameProperty]];
			}
		}
	}

	public stateReset (): void {
		const uuid: string = this.uuid;
		let nameProperty: string;
		for(nameProperty of Object.getOwnPropertyNames(this)){
			this[nameProperty] = undefined;
		}
		this.auth = false;
		this.uuid = uuid;
		this.rolesDescrs = ["обучающийся", "родитель", "педагог", "завуч", "администратор портала"];
	}
}