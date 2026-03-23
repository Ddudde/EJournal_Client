import {makeAutoObservable} from 'mobx';

export default class ScheduleStore {
    public info: any = {
        // 0 : {
        //     lessons: {
        //         0: {
        //             name: "Англ. яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         3 : {
        //             name: "Окруж. мир",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         4: {
        //             name: "Англ. яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         }
        //     }
        // },
        // 1 : {
        //     lessons: {
        //         0 : {
        //             name: "Русский яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         1 : {
        //             name: "Математика",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         2 : {
        //             name: "Англ. яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         3 : {
        //             name: "Русский яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         4 : {
        //             name: "Математика",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         5 : {
        //             name: "Окруж. мир",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         6 : {
        //             name: "Математика",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         }
        //     }
        // },
        // 2 : {
        //     lessons: {
        //         0 : {
        //             name: "Англ. яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         1 : {
        //             name: "Англ. яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         2 : {
        //             name: "Русский яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         3 : {
        //             name: "Математика",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         4 : {
        //             name: "Окруж. мир",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         }
        //     }
        // },
        // 3 : {
        //     lessons: {
        //         0 : {
        //             name: "Математика",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         1 : {
        //             name: "Окруж. мир",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         }
        //     }
        // },
        // 4 : {
        //     lessons: {
        //         0 : {
        //             name: "Англ. яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         },
        //         1 : {
        //             name: "Русский яз.",
        //             cabinet: "300",
        //             prepod: {
        //                 name: "Петренко А.А.",
        //                 id: "id1"
        //             },
        //             group: "10A"
        //         }
        //     }
        // },
        // 5 : {lessons: {}},
        // 6 : {lessons: {}}
    };
    
    public constructor() {
        makeAutoObservable(this);
    }

    public changeScheduleParam (id: number | string, nameProperty: string, nameProperty2: string, value: any): void {
        if(this.info[id]) {
            this.info[id] = {};
        }
        if(this.info[id].lessons) {
            this.info[id].lessons = {};
        }
        if(this.info[id].lessons[nameProperty]) {
            this.info[id].lessons[nameProperty] = {};
        }
        this.info[id].lessons[nameProperty][nameProperty2] = value;
    }

    public cloneSchedule (value: any): void {
        if(!value) value = {};
        this.info = value;
    }

    public changeSchedule (id: number | string, nameProperty: string, dayId: string, value: any): void {
        if(this.info[id]) {
            this.info[id] = {};
        }
        if(this.info[id].lessons) {
            this.info[id].lessons = {};
        }
        this.info[id].lessons[nameProperty] = value;
        if(dayId) {
            this.info[id].dayId = dayId;
        }
    }

    public deleteSchedule (id: number | string, nameProperty: string): void {
        delete this.info[id].lessons[nameProperty];
    }
}