import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import ErrFound from "../../other/error/ErrFound";
import analyticsCSS from '../analyticsMain.module.css';
import zvonkiCSS from './zvonki.module.css';
import {Helmet} from "react-helmet-async";
import yes from "../../../media/yes.png";
import no from "../../../media/no.png";
import ed from "../../../media/edit.png";
import AnalyticsMain from "../AnalyticsMain";
import { ContextStores } from "../../../utils/context";
import type ZvonkiStore from "../../../store/analytics/ZvonkiStore";
import type StatusStore from "../../../store/StatusStore";

interface Props {
};

@observer
export default class Zvonki extends Component {
    static contextType = ContextStores;
    context: any;
    private zvonkiInfo: ZvonkiStore;
    private cState: StatusStore;
    private errText: string = "К сожалению, информация не найдена... Можете попробовать попросить завуча заполнить информацию.";
    private inps = {inpnpt : "8.00-8.45", inpnst: "1 смена"};

    private onDel(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        if(par.classList.contains(analyticsCSS.edbl)){
            const inp: HTMLInputElement = par.querySelector("input");
            if (inp.hasAttribute("data-id")) {
                const id: string[] = inp.getAttribute("data-id").split("_");
                this.zvonkiInfo.deleteZvonkiParam(id[0], "lessons", id[1]);
            } else if(inp.hasAttribute("data-id1")){
                const id: string = inp.getAttribute("data-id1");
                this.zvonkiInfo.deleteSmena(id);
            }
        }
    }

    private onFin(e, inps: any, isSmena?: boolean): void {
        let par:HTMLElement = e.target.parentElement;
        const inp:HTMLInputElement = par.querySelector("input");
        if (!inps[inp.id]) {
            inp.setAttribute("data-mod", '1');
        }
        inp.setAttribute("data-mod", '0');
        if(par.parentElement.classList.contains(analyticsCSS.edbl)) {
            par = par.parentElement;
            if(isSmena != undefined) {
                if(inp.hasAttribute("data-id")){
                    const id: string[] = inp.getAttribute("data-id").split("_");
                    this.zvonkiInfo.changeZvonkiParam(id[0], "lessons", id[1], inp.value);
                } else if(inp.hasAttribute("data-id1")){
                    const id: string = inp.getAttribute("data-id1");
                    this.zvonkiInfo.changeZvonki(id, "name", inp.value);
                }
            } else {
                inps.inpnpt = inp.value;
                this.forceUpdate();
            }
        } else if(par.classList.contains(analyticsCSS.edbl)) {
            if(inp.hasAttribute("data-id1")) {
                const id: string = inp.getAttribute("data-id1");
                const grop: string[] = this.zvonkiInfo.info[id] && this.zvonkiInfo.info[id].lessons ? Object.getOwnPropertyNames(this.zvonkiInfo.info[id].lessons) : [];
                const id1: number = grop.length == 0 ? 0 : (parseInt(grop[grop.length-1]) + 1);
                this.zvonkiInfo.changeZvonkiParam(id, "lessons", id1+"", inp.value);
            } else if(isSmena){
                const grop: string[] = Object.getOwnPropertyNames(this.zvonkiInfo.info);
                const id: number = grop.length == 0 ? 0 : (parseInt(grop[grop.length-1]) + 1);
                this.zvonkiInfo.changeSmena(id, {
                    name: inp.value
                });
            }
        }
        par.setAttribute('data-st', '0');
    }

    private getZvonki(isHTeacher: boolean): ReactElement {
        return isHTeacher ? <>
            {Object.getOwnPropertyNames(this.zvonkiInfo.info).map((idSmena: string) =>
                <div className={zvonkiCSS.smenaGrid} key={idSmena}>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                        №
                    </div>
                    <div className={analyticsCSS.edbl+" "+analyticsCSS.nav_iZag3} style={{gridColumn: "2"}} data-st="0">
                        <div className={analyticsCSS.fi}>
                            <div className={analyticsCSS.nav_i+" "+analyticsCSS.nav_iZag2} id={analyticsCSS.nav_i}>
                                {this.zvonkiInfo.info[idSmena].name}
                            </div>
                            <img className={analyticsCSS.imgfield} src={ed} onClick={AnalyticsMain.onEdit} title="Редактировать" alt=""/>
                            <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={(e)=>this.onDel(e)} title="Удалить" alt=""/>
                        </div>
                        <div className={analyticsCSS.ed}>
                            <div className={analyticsCSS.preinf}>
                                Смена:
                            </div>
                            <input className={analyticsCSS.inp} data-id1={idSmena} id={"inpnst_" + idSmena} placeholder={"1 смена"} defaultValue={this.zvonkiInfo.info[idSmena].name} onChange={(e)=>AnalyticsMain.chStatB(e, this.inps)} type="text"/>
                            {AnalyticsMain.ele(false, "inpnst_" + idSmena, this.inps)}
                            <img className={analyticsCSS.imginp+" yes "} src={yes} onClick={(e)=>this.onFin(e, this.inps)} title="Подтвердить" alt=""/>
                            <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={AnalyticsMain.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                        </div>
                    </div>
                    {this.zvonkiInfo.info[idSmena].lessons && Object.getOwnPropertyNames(this.zvonkiInfo.info[idSmena].lessons).map((idLesson: string, indexLesson: number) =>
                        <>
                            <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                                {indexLesson + 1}
                            </div>
                            <div className={analyticsCSS.edbl+" "+analyticsCSS.nav_iZag3} key={idLesson} data-st="0">
                                <div className={analyticsCSS.fi}>
                                    <div className={analyticsCSS.nav_i+" "+analyticsCSS.nav_iZag2} id={analyticsCSS.nav_i}>
                                        {this.zvonkiInfo.info[idSmena].lessons[idLesson]}
                                    </div>
                                    <img className={analyticsCSS.imgfield} src={ed} onClick={AnalyticsMain.onEdit} title="Редактировать" alt=""/>
                                    <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={(e)=>this.onDel(e)} title="Удалить" alt=""/>
                                </div>
                                <div className={analyticsCSS.ed}>
                                    <div className={analyticsCSS.preinf}>
                                        Интервал:
                                    </div>
                                    <input className={analyticsCSS.inp} data-id={idSmena + "_" + idLesson} id={"inpnpt_" + idSmena + "_" + idLesson} placeholder={"8.00-8.45"} defaultValue={this.zvonkiInfo.info[idSmena].lessons[idLesson]} onChange={(e)=>AnalyticsMain.chStatB(e, this.inps)} type="text"/>
                                    {AnalyticsMain.ele(false, "inpnpt_" + idSmena + "_" + idLesson, this.inps)}
                                    <img className={analyticsCSS.imginp+" yes "} src={yes} onClick={(e)=>this.onFin(e, this.inps)} title="Подтвердить" alt=""/>
                                    <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={AnalyticsMain.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                                </div>
                            </div>
                        </>
                    )}
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                        X
                    </div>
                    <div className={analyticsCSS.add} data-st="0">
                        <div className={analyticsCSS.nav_i+" "+analyticsCSS.link} id={analyticsCSS.nav_i} onClick={AnalyticsMain.onEdit}>
                            Добавить интервал
                        </div>
                        <div className={analyticsCSS.edbl+" "+analyticsCSS.nav_iZag3} data-st="0">
                            <div className={analyticsCSS.preinf}>
                                Интервал:
                            </div>
                            <input className={analyticsCSS.inp} data-id1={idSmena} id={"inpnpt_"} placeholder={"8.00-8.45"} defaultValue={this.inps.inpnpt} onChange={(e)=>AnalyticsMain.chStatB(e, this.inps)} type="text"/>
                            {AnalyticsMain.ele(false, "inpnpt_", this.inps)}
                            <img className={analyticsCSS.imginp+" yes "} src={yes} onClick={(e)=>this.onFin(e, this.inps)} title="Подтвердить" alt=""/>
                            <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={AnalyticsMain.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                        </div>
                    </div>
                </div>
            )}
            <div className={zvonkiCSS.smenaGrid}>
                <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                    X
                </div>
                <div className={analyticsCSS.add} data-st="0" style={{gridColumn: "2"}}>
                    <div className={analyticsCSS.nav_i+" "+analyticsCSS.link} id={analyticsCSS.nav_i} onClick={AnalyticsMain.onEdit}>
                        Добавить смену
                    </div>
                    <div className={analyticsCSS.edbl+" "+analyticsCSS.nav_iZag3} data-st="0">
                        <div className={analyticsCSS.preinf}>
                            Смена:
                        </div>
                        <input className={analyticsCSS.inp} id={"inpnst_"} placeholder={"X Смена"} defaultValue={this.inps.inpnst} onChange={(e)=>AnalyticsMain.chStatB(e, this.inps)} type="text"/>
                        {AnalyticsMain.ele(false, "inpnst_", this.inps)}
                        <img className={analyticsCSS.imginp+" yes "} src={yes} onClick={(e)=>this.onFin(e, this.inps, true)} title="Подтвердить" alt=""/>
                        <img className={analyticsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={AnalyticsMain.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                    </div>
                </div>
            </div>
        </> :
            <>{Object.getOwnPropertyNames(this.zvonkiInfo.info).map((idSmena: string) =>
                <div className={zvonkiCSS.smenaGrid} key={idSmena}>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                        №
                    </div>
                    <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i} style={{gridColumn: "2"}}>
                        {this.zvonkiInfo.info[idSmena].name}
                    </div>
                    {Object.getOwnPropertyNames(this.zvonkiInfo.info[idSmena].lessons).map((idLesson: string, indexLesson: number) =>
                        <>
                            <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                                {indexLesson + 1}
                            </div>
                            <div className={analyticsCSS.nav_i} id={analyticsCSS.nav_i}>
                                {this.zvonkiInfo.info[idSmena].lessons[idLesson]}
                            </div>
                        </>
                    )}
                </div>
            )}</>
    }

    public UNSAFE_componentWillMount(): void {
        const {zvonkiStore, statusStore} = this.context.stores;
        this.zvonkiInfo = zvonkiStore;
        this.cState = statusStore;
        AnalyticsMain.setActNew(0);
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Zvonki");
        for(const el of document.querySelectorAll("." + analyticsCSS.edbl + " *[id^='inpn']")){
            AnalyticsMain.chStatB({target: el}, this.inps);
        }
    }

    public render(): ReactElement {
        return <div className={analyticsCSS.header}>
            <Helmet>
                <title>Расписание звонков</title>
            </Helmet>
            {!Object.getOwnPropertyNames(this.zvonkiInfo.info).length && this.cState.role != 3 ?
                    <ErrFound text={this.errText}/>
                :
                    <div className={analyticsCSS.block}>
                        <div className={analyticsCSS.l1}>
                            {this.getZvonki(this.cState.role == 3)}
                        </div>
                    </div>
            }
        </div>;
    }
}