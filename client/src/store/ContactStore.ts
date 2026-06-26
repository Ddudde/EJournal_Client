import {makeAutoObservable} from 'mobx';

// let contYO, mapTextYO, contPOR, mapTextPOR;

// contYO =
// `8 (800) 555 35 36
// 5 (353) 555 00 88`;

// mapTextYO =
// `Ближайшие станции метро:
// Александровский сад, 610 м (Филёвская линия, выход 5)
// Библиотека им. Ленина, 680 м (Сокольническая линия, выход 3)
// Арбатская, 750 м (Арбатско-Покровская линия, выход 8)`;

// contPOR =
// `8 (800) 555 35 37
// 5 (353) 555 00 88`;

// mapTextPOR =
// `Ближайшие станции метро:
// Александровский сад, 610 м (Филёвская линия, выход 5)
// Библиотека им. Ленина, 680 м (Сокольническая линия, выход 3)
// Арбатская, 750 м (Арбатско-Покровская линия, выход 8)`;

export default class ContactStore {
    public Yo: any = {
        // contact: contYO,
        // mapPr: {
        //     text: mapTextYO,
        //     imgUrl: "/static/media/map.jpg"
        // }
    };
    public Por: any = {
        // contact: contPOR,
        // mapPr: {
        //     text: mapTextPOR,
        //     imgUrl: "/static/media/map.jpg"
        // }
    };
    
    public constructor() {
        makeAutoObservable(this);
    }

    public cloneContact (type: string, value: any): void {
        this[type] = value;
    }

    public changeContact (type: string, nameProperty: string, value: any, nameProperty1?: string): void {
        if(!nameProperty1) {
            this[type][nameProperty] = value;
            return;
        }
        if(!this[type][nameProperty])
        {
            this[type][nameProperty] = {};
        }
        this[type][nameProperty][nameProperty1] = value;
    }
}