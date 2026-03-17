import {makeAutoObservable} from 'mobx';

export default class GroupStore {
    public els = {
        groups: {
            // 0: "11A",
            // 1: "11Б",
            // 2: "11В",
            // 3: "11Г",
            // 4: "10А",
            // 5: "10Б",
            // 6: "10В",
            // 7: "10Г",
            // 8: "9А",
            // 9: "9Б",
            // 10: "9В",
            // 11: "9Г",
            // 12: "8А",
            // 13: "8Б",
            // 14: "8В",
            // 15: "8Г",
            // 16: "7А",
            // 17: "7Б",
            // 18: "7В",
            // 19: "7Г",
            // 20: "6А",
            // 21: "6Б",
            // 22: "6В",
            // 23: "6Г",
            // 24: "5А",
            // 25: "5Б",
            // 26: "5В",
            // 27: "5Г",
            // 28: "4А",
            // 29: "4Б",
            // 30: "4В",
            // 31: "4Г",
            // 32: "3А",
            // 33: "3Б",
            // 34: "3В",
            // 35: "3Г",
            // 36: "2А",
            // 37: "2Б",
            // 38: "2В",
            // 39: "2Г",
            // 40: "1А",
            // 41: "1Б",
            // 42: "1В",
            // 43: "1Г"
        },
        group: 0
    }
    
    public constructor() {
        makeAutoObservable(this);
    }

    public changeGroups (value: any): void {
        this.els = value;
    }

    public changeGroupsGlobal (value: any): void {
        this.els.groups = value;
    }

    public changeGroupsGroup (value: any): void {
        this.els.group = value;
    }

    public changeGroupsGroups (id: number, value: any): void {
        this.els.groups[id] = value;
    }

    public deleteGroupsGroups (id: number): void {
        delete this.els.groups[id];
    }
}