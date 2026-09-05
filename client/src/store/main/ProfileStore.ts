import {makeAutoObservable} from 'mobx';

export default class ProfileStore {
    public info: any = {
        // login: "test",
        // ico: 2,
        // fio: "Иванов Иван Иванович",
        // more: "",
        // roles: {
        //     0: {
        //         yo: "Школа №1541",
        //         email: "ya@ya.ru",
        //         parents: {
        //             "id1": "Петров А.А.",
        //             "id2": "Петрова А.Б."
        //         },
        //         group: "10A"
        //     },
        //     1: {
        //         yo: "Школа №1541",
        //         kids: {
        //             "id1": "Петров А.А.",
        //             "id2": "Петрова А.Б."
        //         },
        //         email: "ya@ya.ru"
        //     },
        //     2: {
        //         yo: "Школа №1541",
        //         lessons: ["Англ. Яз.", "Математика"],
        //         email: "ya@ya.ru"
        //     },
        //     3: {
        //         yo: "Школа №1541",
        //         email: "ya@ya.ru"
        //     },
        //     4: {
        //         email: "ya@ya.ru",
        //     }
        // }
    };

    public constructor() {
        makeAutoObservable(this);
    }

    public cloneProfile(value: any): void {
        this.info = value;
    }

    public changeProfile(nameProperty: string, value: any): void {
        this.info[nameProperty] = value;
    }

    public changeRoles(roleId: string, nameProperty: string, value: any): void {
        this.info.roles[roleId][nameProperty] = value;
    }
}