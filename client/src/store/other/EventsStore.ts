import {makeAutoObservable} from 'mobx';

export default class EventsStore {
    public steps: number = 0
    public right: boolean = true
    public visible: boolean = true
    public evs = {
        // 0: {
        //     title: 'Внимание1!',
        //     dtime: '12:00',
        //     text: 'Допустимы только латиница и цифры'
        // },
        // 1: {
        //     title: 'Внимание2!',
        //     dtime: '12:00',
        //     text: 'Допустимы только латиница и цифры'
        // },
        // 2: {
        //     title: 'Внимание3!',
        //     dtime: '12:00',
        //     text: 'Допустимы только латиница и цифры'
        // }
    }
    public time = {
        // 0: {
        //     long: 10,
        //     init: false
        // },
        // 1: {
        //     long: 5,
        //     init: false
        // }
    }
    public cons = {}
    
    public constructor() {
        makeAutoObservable(this);
    }

    public changeEvents (value: any): void {
        this.evs = value;
    }

    public clearEvents (): void {
        const mas = {};
        let nameProperty: string;
        for(nameProperty of Object.getOwnPropertyNames(this.cons)){
            mas[nameProperty] = this.evs[nameProperty];
        }
        this.evs = mas;
        this.time = {};
    }

    public changeEvent (title: string, text: string, time?: number, cons?: boolean): number {
        const value = {
            time: {
                long: time,
                init: false
            },
            title: title,
            dtime: title ? new Date().toLocaleString("ru", {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }) : undefined,
            text: text,
            cons: cons
        };
        const evsFields = Object.getOwnPropertyNames(this.evs);
        const id: number = evsFields.length == 0 ? 0 : parseInt(evsFields[evsFields.length-1]) + 1;
        
        this.evs[id] = value;
        if(value.time.long) this.time[id] = value.time;
        if(value.cons) {
            this.cons[id] = true;
            delete value.cons;
        }
        return id;
    }

    public deleteEvents (id: any, value?: boolean): void {
        if(value && !this.time[id]){
            return;
        }
        delete this.evs[id];
        if(this.time[id]) delete this.time[id];
        if(this.cons[id]) delete this.cons[id];
    }

    public changeEventTimer (id: any, value: boolean): void {
        this.time[id].init = value;
    }

    public deleteEventTimer (id: any): void {
        delete this.time[id];
    }

    public changeEventsStep (value: number): void {
        this.steps += value;
    }

    public changeEventsRL (value: boolean): void {
        this.right = value;
    }

    public changeEventsVisible (value: boolean): void {
        this.visible = value;
    }
}