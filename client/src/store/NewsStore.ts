import {makeAutoObservable} from 'mobx';

export default class NewsStore {
    public Yo: any = {
        // 0: {
        //     title: 'Мы перешли на этот сервис',
        //     date: '11.11.2022',
        //     img_url: '',
        //     text: 'Всем своим дружным коллективом мы остановились на данном варианте.'
        // }
    };
    public Por: any = {
        // 0: {
        //     title: 'День рождения портала!',
        //     date: '25.04.2022',
        //     img_url: '',
        //     text: 'Начались первые работы'
        // },
        // 1: {
        //     title: 'А проект вышел большим...',
        //     date: '02.12.2022',
        //     img_url: '/static/media/tuman.jpg',
        //     text: 'Да-да, всё ещё не конец...'
        // }
    };

    public constructor() {
        makeAutoObservable(this);
    }

    public cloneNews (type: string, value: any): void {
        this[type] = value;
    }

    public changeNews (type: string, id: any, value: any): void {
        this[type][id] = value;
    }

    public changeNewsParam (type: string, id: any, nameProperty: string, value: any): void {
        this[type][id][nameProperty] = value;
    }

    public deleteNews (type: string, id: any): void {
        delete this[type][id];
    }
}