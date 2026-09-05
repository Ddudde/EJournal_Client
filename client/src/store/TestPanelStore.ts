import {makeAutoObservable} from 'mobx';

export default class TestPanelStore {
    public info: any = {
        // admins: {
    //     0: {
    //         fio: "Петров В.В.",
    //         login: "nm12",
    //         pass: "1111"
    //     },
    //     1: {
    //         fio: "Петров В.Ва.",
    //         login: "nm1",
    //         pass: "1111"
    //     }
    // },
    // schools: {
    //     0: {
    //         name: "Гимназия №5",
    //         hteachers: {
    //             0: {
    //                 fio: "Петров В.В.",
    //                 login: "nm13",
    //                 pass: "1111"
    //             },
    //             1: {
    //                 fio: "Петров В.Ва.",
    //                 login: "nm14",
    //                 pass: "1111"
    //             }
    //         },
    //         teachers: {
    //             0: {
    //                 fio: "Петров В.В.",
    //                 login: "nm19",
    //                 pass: "1111"
    //             },
    //             1: {
    //                 fio: "Петров В.Ва.",
    //                 login: "nm20",
    //                 pass: "1111"
    //             }
    //         },
    //         groups: {
    //             0: {
    //                 name: "11А",
    //                 kids: {
    //                     0: {
    //                         fio: "Петров В.В.",
    //                         login: "nm16",
    //                         pass: "1111"
    //                     },
    //                     1: {
    //                         fio: "Петров В.Ва.",
    //                         login: "nm15",
    //                         pass: "1111"
    //                     }
    //                 },
    //                 parents: {
    //                     0: {
    //                         fio: "Петров В.В.",
    //                         login: "nm17",
    //                         pass: "1111"
    //                     },
    //                     1: {
    //                         fio: "Петров В.Ва.",
    //                         login: "nm18",
    //                         pass: "1111"
    //                     }
    //                 }
    //             },
    //             1: {
    //                 name: "11Б",
    //                 kids: {
    //                     0: {
    //                         fio: "Петров В.В.",
    //                         login: "nm161",
    //                         pass: "1111"
    //                     },
    //                     1: {
    //                         fio: "Петров В.Ва.",
    //                         login: "nm151",
    //                         pass: "1111"
    //                     }
    //                 },
    //                 parents: {
    //                     0: {
    //                         fio: "Петров В.В.",
    //                         login: "nm171",
    //                         pass: "1111"
    //                     },
    //                     1: {
    //                         fio: "Петров В.Ва.",
    //                         login: "nm181",
    //                         pass: "1111"
    //                     }
    //                 }
    //             },
    //             2: {
    //                 name: "11В",
    //                 kids: {
    //                     0: {
    //                         fio: "Петров В.В.",
    //                         login: "nm162",
    //                         pass: "1111"
    //                     },
    //                     1: {
    //                         fio: "Петров В.Ва.",
    //                         login: "nm152",
    //                         pass: "1111"
    //                     }
    //                 },
    //                 parents: {
    //                     0: {
    //                         fio: "Петров В.В.",
    //                         login: "nm172",
    //                         pass: "1111"
    //                     },
    //                     1: {
    //                         fio: "Петров В.Ва.",
    //                         login: "nm182",
    //                         pass: "1111"
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    };

    public constructor() {
		makeAutoObservable(this);
	}

    public cloneTest (value: any): void {
        this.info = value;
    }
}