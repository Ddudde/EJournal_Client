import {makeAutoObservable} from 'mobx';

export default class ZvonkiStore {
    public info = {
        0 : {
            name: "1 смена",
            lessons: {
                0: "8.00-8.45",
                1: "8.50-9.35",
                2: "9.45-10.30",
                3: "10.40-11.25",
                4: "11.30-12.15",
                5: "12.20-13.05",
                6: "13.10-13.55"
            }
        },
        1 : {
            name: "2 смена",
            lessons: {
                0: "13.10-13.55",
                1: "14.00-14.45",
                2: "14.55-15.40",
                3: "15.50-16.35",
                4: "16.40-17.25",
                5: "17.30-18.15",
                6: "18.20-19.05"
            }
        }
    };
    
    public constructor() {
        makeAutoObservable(this);
    }

    public changeZvonkiParam (id: number | string, nameProperty: string, nameProperty2: string, value: any): void {
        if(!this.info[id]) {
            this.info[id] = {};
        }
        if(!this.info[id][nameProperty]) {
            this.info[id][nameProperty] = {};
        }
        this.info[id][nameProperty][nameProperty2] = value;
    }

    public changeSmena (id: number | string, value: any): void {
        this.info[id] = value;
    }

    public changeZvonki (id: number | string, nameProperty: string, value: any): void {
        if(!this.info[id]) {
            this.info[id] = {};
        }
        this.info[id][nameProperty] = value;
    }

    public deleteZvonkiParam (id: number | string, nameProperty: string, nameProperty2: string): void {
        delete this.info[id][nameProperty][nameProperty2];
    }

    public deleteSmena (id: number | string): void {
        delete this.info[id];
    }
}