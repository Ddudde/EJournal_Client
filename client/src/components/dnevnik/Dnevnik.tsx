import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../utils/context";
import ErrFound from "../other/error/ErrFound";
import {Helmet} from "react-helmet-async";
import dnevCSS from './dnevnik.module.css';
import Main from "../main/Main";
import knopka from "../../media/dnevnik/knopka.png";
import type DnevnikStore from "../../store/DnevnikStore";
import type StatusStore from "../../store/StatusStore";
import type ScheduleStore from "../../store/analytics/ScheduleStore";
import type EventsStore from "../../store/other/EventsStore";
import type DnevnikController from "../../controllers/DnevnikController";

interface Props {
};

@observer
export default class Dnevnik extends Component {
    static contextType = ContextStores;
    context: any;
    private mouseEvent: WheelEvent;
    private dnevnikStore: DnevnikStore;
    private selectedKid: string;
    private timid: number;
    private cState: StatusStore;
    private schedulesInfo: ScheduleStore;
    private eventsStore: EventsStore;
    private dnevnikController: DnevnikController;
    private DoW: string[] = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
    private elem = {CW: undefined, CW1: undefined};
    private scrolling: boolean = false;
    private errText: string = "К сожалению, информация не найдена... Можете попробовать попросить завуча заполнить информацию.";
    private days: string[] = Array(7).fill('');

    private tim(): void {
        if (!this.scrolling) return;

        this.scrolling = false;
        if(this.mouseEvent.deltaY < 0 && window.pageYOffset == 0) {
            const i: number = this.dnevnikStore.reqWeek[0] - 1;
            this.dnevnikStore.reqWeek.splice(0, 0, i);
            this.forceUpdate();
        }
        if(this.mouseEvent.deltaY > 0 && window.pageYOffset >= (document.body.scrollHeight-document.body.clientHeight)) {
            const i: number = this.dnevnikStore.reqWeek[this.dnevnikStore.reqWeek.length-1] + 1;
            this.dnevnikStore.reqWeek.push(i);
            this.forceUpdate();
        }
        this.knop();
    }

    private knop(): void {
        if(!this.elem.CW1 || !this.elem.CW) return;

        const ratioHeight: number = Math.round(window.innerHeight / 100) * 7 - window.innerHeight;
        const x: number = this.elem.CW1.getBoundingClientRect().top + ratioHeight;
        const x1: number = this.elem.CW.getBoundingClientRect().top + ratioHeight;
        const CWElement: HTMLElement = document.querySelector("#CWSEL");
        CWElement.style.display = x > 0 && x1 < 0 ? "none" : "flex";
    }

    private getDate(rawDate: string): Date | any {
        const rawDateMas: string[] = rawDate.split('.');
        return new Date("20" + [rawDateMas[2], rawDateMas[1], rawDateMas[0]].join("-"));
    }

    private getDiff(rawDate: string, rawDate1: string): boolean {
        const difference: number = this.getDate(rawDate) - this.getDate(rawDate1);
        return difference > 0;
    }

    private getRawDay(differenceOfDay: number): string {
        const date = new Date();
        const day: number = (date.getDay() || 7) - 1;
        if(day != undefined) date.setDate(date.getDate() - day + differenceOfDay);
        return date.toLocaleString("ru", {day:"2-digit", month: "2-digit", year:"2-digit"});
    }

    private getLessons(rawDayDate: string, dayIndex: number, minLessons: number): ReactElement {
        if(!this.dnevnikStore.min || !this.dnevnikStore.max) return;

        const schedules = this.schedulesInfo.info[dayIndex] || {lessons:{}};
        let idLessons: string[] = Object.getOwnPropertyNames(schedules.lessons);
        const isWeekends: boolean = this.getDiff(this.dnevnikStore.min, rawDayDate) || this.getDiff(rawDayDate, this.dnevnikStore.max);
        const countLessons: number = isWeekends ? 0 : parseInt(idLessons[idLessons.length-1]);
        const mas = Array(countLessons > (minLessons-1) ? countLessons : minLessons).fill('');
        if(!isWeekends) {
            for (const numLess of idLessons) {
                mas[numLess] = numLess;
            }
        }
        idLessons = mas;
        return <>{idLessons.map((idLesson: string, lesNum, x, lesson = schedules.lessons[idLesson] || {}, lesDM = (this.dnevnikStore.jur[lesson.name] || {})[rawDayDate] || {}, lesD = lesDM[lesDM.i++] || {}) => <>
            <div className={dnevCSS.nav_i} id={dnevCSS.nav_i}>
                {lesson.name || <br/>}
            </div>
            <div className={dnevCSS.nav_i+" "+dnevCSS.dayHomework} id={dnevCSS.nav_i}>
                {lesD.homework || <br/>}
            </div>
            <div className={dnevCSS.nav_i} id={dnevCSS.nav_i}>
                {lesD.mark || <br/>}
                {lesD.weight > 1 && <div className={dnevCSS.nav_i+" "+dnevCSS.nav_iWeight} id={dnevCSS.nav_i}>
                    {lesD.weight}
                </div>}
                {lesD.type && <div className={dnevCSS.nav_i+" "+dnevCSS.nav_iType} id={dnevCSS.nav_i}>
                    {lesD.type}
                </div>}
            </div>
        </>)}</>
    }

    private async getDnevnik(): Promise<void> {
        const isOK: boolean = await this.dnevnikController.getDnevnik();
        if(isOK) {
            if(this.cState.role == 1 && this.cState.kid) this.selectedKid = this.cState.kid;
        }
    }

    private goTo(): void {
        if(this.elem.CW) this.elem.CW.scrollIntoView(true);
        const sinc: number = window.scrollY - Math.round(window.innerHeight / 100) * 7;
        window.scrollTo(0, sinc);
        this.knop();
    }

    public UNSAFE_componentWillMount(): void {
        const {scheduleStore, statusStore, eventsStore, dnevnikStore} = this.context.stores;
        const {dnevnikController} = this.context.controllers;
        this.schedulesInfo = scheduleStore;
        this.cState = statusStore;
        this.eventsStore = eventsStore;
        this.dnevnikStore = dnevnikStore;
        this.dnevnikController = dnevnikController;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Dnevnik");
        this.dnevnikController.didMount(this.getDnevnik.bind(this));
        window.onwheel = e => {
            if(!this.scrolling) {
                this.scrolling = true;
                this.mouseEvent = e;
                this.timid = setTimeout(this.tim,1000);
            }
        };
        this.knop();
        Main.setActivedForPanel(13);
        this.eventsStore.changeEventsRL(false);
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount Dnevnik");
        this.eventsStore.clearEvents();
        this.eventsStore.changeEventsRL(true);
        this.dnevnikController.willUnmount();
        window.onwheel = undefined;
        clearTimeout(this.timid);
    }

    public UNSAFE_componentWillUpdate(): void {
        console.log("I was triggered during componentWillUpdate Dnevnik");
        if(this.cState.role == 1 && this.cState.kid && this.selectedKid != this.cState.kid) {
            this.selectedKid = this.cState.kid;
            this.getDnevnik();
        }
    }

    public render(): ReactElement {
        return <div className={dnevCSS.AppHeader}>
            <Helmet>
                <title>Дневник</title>
            </Helmet>
            {!Object.getOwnPropertyNames(this.dnevnikStore.jur) ?
                    <ErrFound text={this.errText}/>
                :
                    <div className={dnevCSS.blockDay}>
                        {this.dnevnikStore.reqWeek.map((weekIndex: number) => <>
                            {<div className={dnevCSS.blockL+" "+dnevCSS.blockLU}>
                                <div className={dnevCSS.blockLine} ref={el=>(weekIndex ? el : this.elem.CW=el)}/>
                                <div className={dnevCSS.blockLText}>
                                    {weekIndex ? "Неделя " + (weekIndex > 0 ? "+" : "") + weekIndex : "Текущая неделя"}
                                </div>
                            </div>}
                            {this.days.map((emptyP, dayIndex: number, x, dayDate = this.getRawDay(dayIndex + 7*weekIndex)) => <>
                                <div className={dnevCSS.day}>
                                    <div className={dnevCSS.nav_i} id={dnevCSS.nav_i}>
                                        {this.DoW[dayIndex]} / {dayDate}
                                    </div>
                                    <div className={dnevCSS.nav_i} id={dnevCSS.nav_i}>
                                        Домашнее задание
                                    </div>
                                    <div className={dnevCSS.nav_i} id={dnevCSS.nav_i}>
                                        Оценка
                                    </div>
                                    {this.getLessons(dayDate, dayIndex, 5)}
                                </div>
                            </>)}
                            {<div className={dnevCSS.blockL+" "+dnevCSS.blockLD}>
                                <div className={dnevCSS.blockLText+" "+dnevCSS.blockLTextD}>
                                    {weekIndex ? "Неделя " + (weekIndex > 0 ? "+" : "") + weekIndex : "Текущая неделя"}
                                </div>
                                <div className={dnevCSS.blockLine} ref={el=>(weekIndex ? el : this.elem.CW1=el)}/>
                            </div>}
                        </>)}
                        <div className={dnevCSS.GotCW} id={"CWSEL"}>
                            <div>
                                <img src={knopka} alt="" onClick={this.goTo.bind(this)}/>
                                <div className={dnevCSS.GotCWText}>
                                    Перейти к текущей неделе
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>;
    }
}