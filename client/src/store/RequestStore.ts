import {makeAutoObservable} from 'mobx';

//toDo: Изменить компоненты из-за info

export default class RequestStore {
    public info: any = {
        // 0: {
        //     title: 'Мы перешли на этот сервис',
        //     date: '11.11.2022',
        //     text: 'Всем своим дружным коллективом мы остановились на данном варианте.'
        // }
    };

    public constructor() {
        makeAutoObservable(this);
    }

    public cloneRequest (value: any): void {
        this.info = value;
    }

    public changeRequest (id: number | string, value: any): void {
        this.info[id] = value;
    }

    public changeRequestProperty (id: number | string, nameProperty: string, value: any): void {
        this.info[id][nameProperty] = value;
    }

    public deleteRequest (id: number | string): void {
        delete this.info[id];
    }
}