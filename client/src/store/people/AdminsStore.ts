import {makeAutoObservable} from 'mobx';

//toDo: Изменить компоненты из-за info

export default class AdminsStore {
    public info: any = {
        // "id1" : {
        //     name: "Новиков А.А."
        // },
        // "id2" : {
        //     name: "Новиков А.С."
        // },
        // "id3" : {
        //     name: "Новиков А.Г."
        // }
    };

    public constructor() {
        makeAutoObservable(this);
    }

    public cloneAdmins (value: any): void {
        this.info = value;
    }

    public changeAdminsParam (id: any, nameProperty: any, value: any): void {
        if(!this.info[id]){
            this.info[id] = {};
        }
        this.info[id][nameProperty] = value;
    }

    public changeAdmins (id: any, value: any): void {
        this.info[id] = value;
    }

    public deleteAdmins (id: any): void {
        delete this.info[id];
    }
}