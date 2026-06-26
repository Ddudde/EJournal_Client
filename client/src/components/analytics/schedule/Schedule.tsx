import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../../utils/context";
import {Helmet} from "react-helmet-async";
import analyticsCSS from '../analyticsMain.module.css';
import scheduleCSS from './schedule.module.css';
import Pane from "../../other/pane/Pane";
import yes from "../../../media/yes.png";
import no from "../../../media/no.png";
import mapd from "../../../media/Map_symbolD.png";
import mapl from "../../../media/Map_symbolL.png";
import ed from "../../../media/edit.png";
import Main from "../../main/Main";
import type StatusStore from "../../../store/StatusStore";
import type ScheduleStore from "../../../store/analytics/ScheduleStore";
import type GroupStore from "../../../store/GroupStore";
import type ThemeStore from "../../../store/ThemeStore";
import type EventsStore from "../../../store/other/EventsStore";
import AnalyticsMain from "../AnalyticsMain";
import type ScheduleController from "../../../controllers/analytics/ScheduleController";

interface Props {
};

//toDo: Связь с Teachers

@observer
export default class Schedule extends Component {
    static contextType = ContextStores;
    context: any;
    private cState: StatusStore;
    private schedulesInfo: ScheduleStore;
    private groupsInfo: GroupStore;
    private teachersInfo = {};
    private themeState: ThemeStore;
    private eventsStore: EventsStore;
    private scheduleController: ScheduleController;
    private selKid: string;
    private DoW: string[] = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
    private inps: any = {sinpnpt : "Математика", sinpnkt: "300"};
    private selGr: number = 0;

    private onDel(e, info: any): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        if(par.classList.contains(analyticsCSS.edbl)){
            const inp: HTMLInputElement = par.querySelector("input");
            if(!inp){
                this.schedulesInfo.deleteSchedule(info.id, info.id1);
            }
        }
    }

    private onFin(e, isScheduleParam: boolean, info: any): void {
        let par: HTMLElement = e.target.parentElement;
        const inp: HTMLInputElement = par.querySelector("input");
        if(par.classList.contains(analyticsCSS.edbl) && isScheduleParam === false){
            const inpm: string[] = ["sinpnpt_", "sinpnkt_"];
            if(this.inps.sinpnpt_ && this.inps.sinpnkt_ && this.inps.nyid) {
                this.scheduleController.addLesson(info.id, {
                    name: this.inps.sinpnpt_,
                    cabinet: this.inps.sinpnkt_,
                    prepod: {
                        name: this.inps.nw.prepod,
                        id: this.inps.nyid
                    }
                });
            } else {
                for(let i: number = 0; i < inpm.length; i++) {
                    const inpf: HTMLElement = document.querySelector("." + analyticsCSS.edbl + " *[id='" + inpm[i] + "']")
                    inpf.dataset.mod = '1';
                }
            }
            return;
        }
        if(!inp){
            if(isScheduleParam) {
                this.schedulesInfo.changeScheduleParam(info.id, info.id1, info.par, {
                    name: this.inps.nw.prepod,
                    id: this.inps.nyid
                });
            }
            par = par.parentElement;
            par.dataset.st = '0';
            return;
        }
        if (!this.inps[inp.id]) {
            inp.dataset.mod = '1';
            return;
        }
        inp.dataset.mod = '0';
        if(par.parentElement.classList.contains(analyticsCSS.edbl)) {
            par = par.parentElement;
            if(isScheduleParam && inp.dataset.id){
                this.schedulesInfo.changeScheduleParam(info.id, info.id1, info.par, inp.value);
            }
        }
        par.dataset.st = '0';
    }

    private getEdLessons(dayIndex: number, teachers: ReactElement, minLessons: number): ReactElement {
        let idLessons: string[] | any;
        const schedules: any = this.schedulesInfo.info[dayIndex];
        if(this.schedulesInfo.info[dayIndex]) {
            idLessons = Object.getOwnPropertyNames(this.schedulesInfo.info[dayIndex].lessons);
        }
        const countLessons: number = parseInt(idLessons[idLessons.length-1]);
        const mas: string[] = Array(countLessons > (minLessons-1) ? countLessons : minLessons).fill('');
        for(const numLess of idLessons) {
            mas[numLess] = numLess;
        }
        idLessons = mas;
        return idLessons.map((idLesson: string, i1, x, lesson = schedules ? schedules.lessons[idLesson] : undefined) => <>
            {idLesson == '' &&<>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    <br />
                </div>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    <br />
                </div>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    <br />
                </div>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    <br />
                </div>
            </>}
            {idLesson != '' && <>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    {parseInt(idLesson)+1}
                </div>
                <div className={analyticsCSS.edbl+" "+analyticsCSS.nav_iZag3} data-st="0">
                    <div className={analyticsCSS.fi}>
                        <div className={analyticsCSS.nav_i+" "+analyticsCSS.nav_iZag2} id={analyticsCSS.nav_i}>
                            {lesson.name}
                        </div>
                        <img className={analyticsCSS.imgfield} src={ed} onClick={AnalyticsMain.onEdit} title="Редактировать" alt=""/>
                    </div>
                    <div className={analyticsCSS.ed}>
                        <div className={analyticsCSS.preinf}>
                            Предмет:
                        </div>
                        <input className={analyticsCSS.inp} id={"sinpnpt_" + dayIndex + "_" + idLesson} placeholder={"Математика"} defaultValue={lesson.name} onChange={e=>AnalyticsMain.chStatB(e, this.inps)} type="text"/>
                        {AnalyticsMain.ele(false, "sinpnpt_" + dayIndex + "_" + idLesson, this.inps)}
                        <img className={analyticsCSS.imginp+" yes "} src={yes} onClick={e=>this.onFin(e, true, {par: "name", id: dayIndex, id1: idLesson})} title="Подтвердить" alt=""/>
                        <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={AnalyticsMain.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                    </div>
                </div>
                <div className={analyticsCSS.edbl+" "+analyticsCSS.nav_iZag3} data-st="0">
                    <div className={analyticsCSS.fi}>
                        <div className={analyticsCSS.nav_i+" "+analyticsCSS.nav_iZag2} id={analyticsCSS.nav_i}>
                            {lesson.cabinet}
                        </div>
                        <img className={analyticsCSS.imgfield} src={ed} onClick={AnalyticsMain.onEdit} title="Редактировать" alt=""/>
                    </div>
                    <div className={analyticsCSS.ed}>
                        <div className={analyticsCSS.preinf}>
                            Кабинет:
                        </div>
                        <input className={analyticsCSS.inp} id={"sinpnkt_" + dayIndex + "_" + idLesson} placeholder={"300"} defaultValue={lesson.cabinet} onChange={e=>AnalyticsMain.chStatB(e, this.inps)} type="text"/>
                        {AnalyticsMain.ele(false, "sinpnkt_" + dayIndex + "_" + idLesson, this.inps)}
                        <img className={analyticsCSS.imginp+" yes "} src={yes} onClick={e=>this.onFin(e, true, {par: "cabinet", id: dayIndex, id1: idLesson})} title="Подтвердить" alt=""/>
                        <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={AnalyticsMain.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                    </div>
                </div>
                <div className={analyticsCSS.edbl+" "+analyticsCSS.nav_iZag3} data-st="0">
                    <div className={analyticsCSS.fi}>
                        <div className={analyticsCSS.nav_i+" "+analyticsCSS.nav_iZag2} id={analyticsCSS.nav_i}>
                            {lesson.prepod.name}
                        </div>
                        <img className={analyticsCSS.imgfield} src={ed} onClick={AnalyticsMain.onEdit} title="Редактировать" alt=""/>
                        <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={e=>this.onDel(e, {id: dayIndex, id1: idLesson})} title="Удалить" alt=""/>
                    </div>
                    <div className={analyticsCSS.ed}>
                        <div className={analyticsCSS.preinf}>
                            Педагог:
                        </div>
                        {teachers}
                        <img className={analyticsCSS.imginp} data-enable={this.inps.nw && this.inps.nw.prepod ? "1" : "0"} src={yes} onClick={e=>this.onFin(e, true, {par: "prepod", id: dayIndex, id1: idLesson})} title="Подтвердить" alt=""/>
                        <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={AnalyticsMain.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                    </div>
                </div>
            </>}</>
        )
    }

    private getLessons(dayIndex: number, minLessons: number): ReactElement {
        let idLessons: string[];
        const schedules: any = this.schedulesInfo.info[dayIndex];
        if(this.schedulesInfo.info[dayIndex]) {
            idLessons = Object.getOwnPropertyNames(this.schedulesInfo.info[dayIndex].lessons);
        }
        if(!idLessons) return;
        
        const countLessons: number = parseInt(idLessons[(idLessons.length)-1]);
        const mas = Array(countLessons > (minLessons-1) ? countLessons : minLessons).fill('');
        for(const numLess of idLessons) {
            mas[numLess] = numLess;
        }
        idLessons = mas;
        return <>{idLessons.map((idLesson: string, i1, x, lesson = schedules ? schedules.lessons[idLesson] : undefined) => <>
            {idLesson == '' &&<>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    <br />
                </div>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    <br />
                </div>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    <br />
                </div>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    <br />
                </div>
            </>}
            {idLesson != '' && <>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    {parseInt(idLesson)+1}
                </div>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    {lesson.name}
                </div>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    {lesson.cabinet}
                </div>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    {this.cState.role == 2 ? lesson.group : lesson.prepod.name}
                </div>
            </>}</>
        )}</>;
    }

    private getSched(isHTeacher: boolean): ReactElement {
        const dayIndexes: number[] = [0, 1, 2, 3, 4, 5, 6];
        const preps: ReactElement = this.getPrep();
        return <>{isHTeacher ?
            dayIndexes.map((dayIndex: number) =>
                <div className={analyticsCSS.l1+" "+scheduleCSS.day}>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                        №
                    </div>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i} style={{gridColumn: "2"}}>
                        {this.DoW[dayIndex]}
                    </div>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i} style={{gridColumn: "3"}}>
                        Кабинет
                    </div>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i} style={{gridColumn: "4"}}>
                        Преподаватель
                    </div>
                    {this.getEdLessons(dayIndex, preps, 4)}
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                        X
                    </div>
                    <div className={analyticsCSS.add} data-st="0" style={{gridColumn: "2/5"}}>
                        <div className={analyticsCSS.nav_i+" "+analyticsCSS.link} id={analyticsCSS.nav_i} onClick={AnalyticsMain.onEdit}>
                            Добавить урок
                        </div>
                        <div className={analyticsCSS.edbl+" "+analyticsCSS.nav_iZag3} data-st="0">
                            <div className={analyticsCSS.preinf}>
                                Предмет:
                            </div>
                            <input className={analyticsCSS.inp} id={"sinpnpt_"} placeholder={"Математика"} defaultValue={this.inps.sinpnpt} onChange={e=>AnalyticsMain.chStatB(e, this.inps, this.forceUpdate())} type="text"/>
                            {AnalyticsMain.ele(false, "sinpnpt_", this.inps)}
                            <div className={analyticsCSS.preinf}>
                                , Кабинет:
                            </div>
                            <input className={analyticsCSS.inp} id={"sinpnkt_"} placeholder={"300"} defaultValue={this.inps.sinpnkt} onChange={e=>AnalyticsMain.chStatB(e, this.inps, this.forceUpdate())} type="text"/>
                            {AnalyticsMain.ele(false, "sinpnkt_", this.inps)}
                            <div className={analyticsCSS.preinf}>
                                , Педагог:
                            </div>
                            {preps}
                            <img className={analyticsCSS.imginp} data-enable={this.inps.sinpnpt_ && this.inps.sinpnkt_ && this.inps && this.inps.nw && this.inps.nw.prepod ? "1" : "0"} src={yes} onClick={e=>this.onFin(e, false, {id: dayIndex})} title="Подтвердить" alt=""/>
                            <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={AnalyticsMain.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                        </div>
                    </div>
                </div>
            )
        :
            dayIndexes.map((dayIndex: number) =>
                <div className={analyticsCSS.l1+" "+scheduleCSS.day}>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                        №
                    </div>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i} style={{gridColumn: "2"}}>
                        {this.DoW[dayIndex]}
                    </div>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i} style={{gridColumn: "3"}}>
                        Кабинет
                    </div>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i} style={{gridColumn: "4"}}>
                        {this.cState.role == 2 ? "Группа" : "Преподаватель"}
                    </div>
                    {this.getLessons(dayIndex, 5)}
                </div>
            )
        }</>
    }

    private selecPrep(e, id: string, obj: any): void {
        this.inps.nyid = id;
        if(!this.inps.nw) this.inps.nw = {};
        this.inps.nw.prepod = obj.name;
        this.forceUpdate();
    }

    private getPrep(): ReactElement {
        const idLessons: string[] = Object.getOwnPropertyNames(this.teachersInfo);
        return <div className={scheduleCSS.blockList}>
            <div className={analyticsCSS.nav_i+' '+scheduleCSS.selEl} id={analyticsCSS.nav_i}>
                <div className={scheduleCSS.elInf}>Педагог:</div>
                <div className={scheduleCSS.elText}>{this.inps && this.inps.nw && this.inps.nw.prepod ? this.inps.nw.prepod : "Не выбран"}</div>
                <img className={scheduleCSS.mapImg} data-enablem={idLessons.length < 2 ? "0" : "1"} src={this.themeState.theme_ch ? mapd : mapl} alt=""/>
            </div>
            <div className={scheduleCSS.list}>
                {idLessons.map((idLesson: string, i, x, info = this.teachersInfo[idLesson], idTeachers = (info && info.tea ? Object.getOwnPropertyNames(info.tea) : [])) =>
                    <>
                        {idTeachers.length > 0 &&
                            <div className={analyticsCSS.nav_i+' '+scheduleCSS.listZag} id={analyticsCSS.nav_i}>
                                <div className={scheduleCSS.elInf}>{idLesson == "nt" ? "Нераспределённые" : info.name}:</div>
                            </div>
                        }
                        {idTeachers.map((idTeacher : string, i, x, teacherInfo = info.tea[idTeacher]) =>
                            <div className={analyticsCSS.nav_i+' '+scheduleCSS.listEl} key={idTeacher} id={analyticsCSS.nav_i} onClick={e => (this.selecPrep(e, idTeacher, teacherInfo))}>
                                <div className={scheduleCSS.elInf}>Педагог:</div>
                                <div className={scheduleCSS.elText}>{teacherInfo.name}</div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    }

    public async getInfo(): Promise<void> {
        const data: any = await this.scheduleController.getInfo();
        if(data.isOK) {
            if(data.isSelGr != undefined) {
                this.selGr = data.isSelGr;
            }
            this.getSchedule();
        }
    }

    private async getSchedule(): Promise<void> {
        const isOK: boolean = await this.scheduleController.getSchedule();
        if(isOK) {
            this.selGr = this.groupsInfo.els.group;
            if(this.cState.role == 1 && this.cState.kid) this.selKid = this.cState.kid;
        }
    }

    public UNSAFE_componentWillMount(): void {
        const {statusStore, scheduleStore, groupStore, themeStore, eventsStore} = this.context.stores;
        const {scheduleController} = this.context.controllers;
        this.cState = statusStore;
        this.schedulesInfo = scheduleStore;
        this.groupsInfo = groupStore;
        this.themeState = themeStore;
        this.eventsStore = eventsStore;
        this.scheduleController = scheduleController;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Schedule");
        Main.setActivedForPanel(this.cState.role == 2 ? 8 : 2);
        this.scheduleController.didMount(this.getInfo.bind(this));
        for(const el of document.querySelectorAll(" *[id^='sinpn']")){
            AnalyticsMain.chStatB({target: el}, this.inps);
        }
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount Schedule");
        this.eventsStore.clearEvents();
        this.scheduleController.willUnmount();
    }

    public UNSAFE_componentWillUpdate(): void {
        console.log("I was triggered during componentWillUpdate Schedule");
        if(this.cState.role == 1 && this.cState.kid && this.selKid != this.cState.kid) {
            this.selKid = this.cState.kid;
            this.getSchedule();
        }
        if(this.groupsInfo.els.group && this.selGr != this.groupsInfo.els.group){
            this.getSchedule();
        }
    }

    public render(): ReactElement {
        return <div className={analyticsCSS.header}>
            <Helmet>
                <title>Расписание</title>
            </Helmet>
            {(this.cState.auth && this.cState.role == 3) &&
                <div className={scheduleCSS.pane}>
                    <Pane cla={true}/>
                </div>
            }
            <div className={analyticsCSS.block} style={{marginTop: (this.cState.auth && this.cState.role == 3) ? "7vh" : undefined}}>
                {this.getSched(this.cState.role == 3)}
            </div>
        </div>;
    }
}