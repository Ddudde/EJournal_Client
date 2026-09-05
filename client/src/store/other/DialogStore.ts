import {makeAutoObservable} from 'mobx';

export default class DialogStore {
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

		this.buts = dialogValue.buts;
	}

	public resetDialog (): void {
		this.buts = undefined;
	}

	public changeDialogBut (id: number, value: any): void {
		if(!this.buts) this.buts = {};
        if(!this.buts[id]) {
            this.buts[id] = {};
        }
        this.buts[id].enab = value;
	}
}