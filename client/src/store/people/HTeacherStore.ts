import {makeAutoObservable} from 'mobx';

//toDo: Изменить компоненты из-за info

export default class HTeacherStore {
    public info = {
        // "id1" : {
        //     name: "Школа",
        //     pep: {
        //         "id8" : {
        //             name: "Петров А.А."
        //         }
        //     }
        // },
        // "id2" : {
        //     name: "Гимназия"
        // },
        // "id3" : {
        //     name: "Лицей"
        // }
        // "id1" : {
        //     name: "Петров А.А."
        // },
        // "id2" : {
        //     name: "Петров А.С."
        // },
        // "id3" : {
        //     name: "Петров А.Г."
        // }
    };
    
    public constructor() {
        makeAutoObservable(this);
    }

	public cloneHTeacher (value: any): void {
		this.info = value;
	}

    public changeHTeacherParam (id: number | string, nameProperty: string, value: any, nameProperty2: string = "name"): void {
        if(this.info[id].pep) {
            this.info[id].pep = {};
        }
        if(this.info[id].pep[nameProperty]) {
            this.info[id].pep[nameProperty] = {};
        }
        this.info[id].pep[nameProperty][nameProperty2] = value;
    }

    public cloneHTeachersForSchool (id: number | string, nameProperty: string, value: any): void {
        if(this.info[id].pep) {
            this.info[id].pep = {};
        }
        this.info[id].pep[nameProperty] = value;
    }

	public deleteHTeachersForSchool (id: number | string, nameProperty: string): void {
		delete this.info[id].pep[nameProperty];
	}

    public changeHTeacher (id: number | string, value: any, nameProperty: string = "name"): void {
        if(this.info[id]) {
            this.info[id] = {};
        }
        this.info[id][nameProperty] = value;
    }

    public cloneHTeacherParam (id: number | string, value: any): void {
        this.info[id] = value;
    }

    public deleteHTeacher (id: number | string): void {
        delete this.info[id];
    }
}