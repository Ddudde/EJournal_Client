import {makeAutoObservable} from 'mobx';

export default class DialogStore {
    public obj = undefined;
    public buts: any = {
        0 : {
            text: "Прочитал"
        }
    };

	public constructor() {
		makeAutoObservable(this);
	}

	public cloneDialog (dialogValue: any): void {
		if(!dialogValue) return;

		let nameProperty: string;
		for(nameProperty of Object.getOwnPropertyNames(dialogValue)){
			this[nameProperty] = dialogValue[nameProperty];
		}
	}

	public resetDialog (): void {
		let nameProperty: string;
		for(nameProperty of Object.getOwnPropertyNames(this)){
			this[nameProperty] = undefined;
		}
	}

	public changeDialogBut (id: number, value: any): void {
		if(!this.buts) this.buts = {};
        if(!this.buts[id]) {
            this.buts[id] = {};
        }
        this.buts[id].enab = value;
	}
}