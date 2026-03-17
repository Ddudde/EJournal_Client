import {makeAutoObservable} from 'mobx';

export default class CheckboxStore {
    public checkBoxes: any = {
        "0": false
    }
    
    public constructor() {
        makeAutoObservable(this);
    }

    public changeCheckBox (id: number, value: boolean): void {
        this.checkBoxes[id] = value;
    }
}