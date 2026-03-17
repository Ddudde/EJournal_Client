/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {makeAutoObservable} from 'mobx';

export default class IndicatorStore {
    public actived: number = 0
    
    public constructor() {
        makeAutoObservable(this);
    }

    public changeIndicator(value: number, resetTimerCallBack: Function): void {
        if(resetTimerCallBack) resetTimerCallBack();
        this.actived = value;
    }

    public nextIndicator(resetTimerCallBack?: Function): void {
        if(resetTimerCallBack) resetTimerCallBack();
        let stat: number = this.actived + 1;
        if(stat > 3) stat = 0;
        this.actived = stat;
    }

    public prevIndicator(resetTimerCallBack: Function): void {
        if(resetTimerCallBack) resetTimerCallBack();
        let stat: number = this.actived - 1;
        if(stat < 0) stat = 3;
        this.actived = stat;
    }
}