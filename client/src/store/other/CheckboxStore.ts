import {makeAutoObservable} from 'mobx';

//toDo: Изменить компоненты из-за info

export default class CheckboxStore {
    public checkBoxes: any = {
        "0": false
    }
    
    public constructor() {
        makeAutoObservable(this);
    }

    public changeCheckBox (id: number | string, value: boolean): void {
        this.checkBoxes[id] = value;
    }
}