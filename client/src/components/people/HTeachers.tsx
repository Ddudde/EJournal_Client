import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../utils/context";
import ErrFound from "../other/error/ErrFound";
import PeopleMain from "./PeopleMain";
import { Helmet } from "react-helmet-async";
import peopleCSS from './peopleMain.module.css';
import profl from "../../media/profl.png";
import profd from "../../media/profd.png";
import ed from "../../media/edit.png";
import yes from "../../media/yes.png";
import no from "../../media/no.png";
import refreshCd from "../../media/refreshCd.png";
import refreshCl from "../../media/refreshCl.png";
import copyd from "../../media/copyd.png";
import copyl from "../../media/copyl.png";
import type StatusStore from "../../store/StatusStore";
import type HTeacherStore from "../../store/people/HTeacherStore";
import type ThemeStore from "../../store/main/ThemeStore";
import type EventsStore from "../../store/other/EventsStore";
import type HTeacherController from "../../controllers/people/HTeacherController";

interface Props {
};

@observer
export default class HTeachers extends Component {
    static contextType = ContextStores;
    context: any;
    private cState: StatusStore;
    private selKid: string;
    private hteachersInfo: HTeacherStore;
    private themeState: ThemeStore;
    private eventsStore: EventsStore;
    private hteacherController: HTeacherController;
    private errText: string = "К сожалению, информация не найдена... Можете попробовать попросить завуча заполнить информацию.";
    private inps = {inpnpt : "Поле для ввода"};

    private copyLink(e, codeLinkURL: string, FIO: string): void {
        const title: string = "Внимание!";
        const text: string = "Ссылка-приглашение для " + FIO + " успешно скопирована в буфер обмена.";
        navigator.clipboard.writeText(codeLinkURL);
        this.eventsStore.changeEvent(title, text, 10);
    }

    private refreshLink(e): void {
        let id: string;
        const inp: HTMLInputElement = e.target.parentElement.parentElement.querySelector("input:not([readOnly])");
        if (inp.hasAttribute("data-id")) {
            id = inp.getAttribute("data-id").split("_")[1];
        } else if (inp.hasAttribute("data-id1")) {
            id = inp.getAttribute("data-id1").split("_")[0];
        }
        if(id) {
            this.hteacherController.setCodePep(id);
        }
    }

    private onDel(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        if(!par.classList.contains(peopleCSS.pepl)) return;

        const inp: HTMLInputElement = par.querySelector("input:not([readOnly])");
        if (inp.hasAttribute("data-id")) {
            const id: string[] = inp.getAttribute("data-id").split("_");
            this.hteacherController.deletePeople(id[1]);
        } else if(inp.hasAttribute("data-id1")){
            const id: string[] = inp.getAttribute("data-id1").split("_");
            if(this.cState.role == 4) {
                this.hteacherController.deleteSchool(id[0]);
            } else if(this.cState.role == 3) {
                this.hteacherController.deletePeople(id[0]);
            }
        }
    }

    private onEdit(e): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.classList.contains(peopleCSS.add)){
            par.setAttribute('data-st', '1');
        }
        if(par.parentElement.classList.contains(peopleCSS.pepl)){
            par = par.parentElement;
            par.setAttribute('data-st', '1');
        }
    }

    private onFin(e, type): void {
        let par: HTMLElement = e.target.parentElement;
        if (par.classList.contains(peopleCSS.fi)){
            par = par.parentElement;
            if(type){
                par = par.parentElement;
                if(e.target.hasAttribute("data-id1")){
                    const id: string = e.target.getAttribute("data-id1");
                    this.hteacherController.addPeople(par, id, this.inps.inpnpt);
                }
            } else {
                par = par.parentElement;
                if(this.cState.role == 4) {
                    this.hteacherController.addSchool(par, this.inps.inpnpt);
                } else if(this.cState.role == 3) {
                    this.hteacherController.addPeople(par, undefined, this.inps.inpnpt);
                }
            }
            return;
        }
        const inp: HTMLInputElement = par.querySelector("input");
        if (!this.inps[inp.id]) {
            inp.setAttribute("data-mod", '1');
            return;
        }
        inp.setAttribute("data-mod", '0');
        if(!par.parentElement.classList.contains(peopleCSS.pepl)) return;

        par = par.parentElement;
        if(type != undefined){
            if(inp.hasAttribute("data-id")){
                const id: string[] = inp.getAttribute("data-id").split("_");
                this.hteacherController.changePeople(par, id[1], inp.value);
            } else if(inp.hasAttribute("data-id1")){
                const id: string[] = inp.getAttribute("data-id1").split("_");
                if(this.cState.role == 4) {
                    this.hteacherController.changeSchool(par, id[0], inp.value);
                } else if(this.cState.role == 3) {
                    this.hteacherController.changePeople(par, id[0], inp.value);
                }
            }
        } else {
            this.inps.inpnpt = inp.value;
            this.forceUpdate();
            par.setAttribute('data-st', '0');
        }
    }

    private onClose(e): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.parentElement.classList.contains(peopleCSS.pepl)){
            if(par.classList.contains(peopleCSS.fi)) {
                par = par.parentElement.parentElement;
            } else {
                par = par.parentElement;
            }
            par.setAttribute('data-st', '0');
        }
    }

    private chStatB(e): void {
        const el: HTMLInputElement = e.target;
        this.inps[el.id] = !el.validity.patternMismatch && el.value.length != 0;
        if (this.inps[el.id]) {
            el.setAttribute("data-mod", '0');
        } else {
            el.setAttribute("data-mod", '1');
        }
        const state: string = +this.inps[el.id] + "";
        el.parentElement.querySelector(".yes")
            .setAttribute("data-enable", state);
    }

    private async getInfo(): Promise<void> {
        const isOK: boolean = await this.hteacherController.getInfo();
        if(isOK){
            if(this.cState.role == 1 && this.cState.kid) this.selKid = this.cState.kid;
        }
        for(const el of document.querySelectorAll("." + peopleCSS.ed + " > *[id^='inpn']")){
            this.chStatB({target: el});
        }
    }

    private getBlock(title: string, type: string, id?: string, isPeopleBlock?: boolean, idHTeacherForSchool?: string): ReactElement {
        let codeLinkURL: string, info;
        const isHT4L2: boolean = type === "ht4L2";
        if(id) {
            info = this.hteachersInfo.info[id];
        }
        if(info && info.link) {
            codeLinkURL = PeopleMain.sit + (info.login ? "/reauth/" : "/invite/") + info.link;
        }
        const edFi: ReactElement = <div className={peopleCSS.pepl} style={{marginLeft: type == "ht4L2" ? "2vw" : undefined}} key={idHTeacherForSchool ? idHTeacherForSchool : id} data-st="0">
            {isPeopleBlock ?
                <div className={peopleCSS.fi}>
                    <div className={peopleCSS.nav_i+" "+peopleCSS.nav_iZag2} id={peopleCSS.nav_i}>
                        {info.name}
                    </div>
                    {(type != "ht4" && info.login) && <img className={peopleCSS.profIm} src={this.themeState.theme_ch ? profd : profl} onClick={e=>PeopleMain.goToProf(info.login)} title="Перейти в профиль" alt=""/>}
                    <img className={peopleCSS.imgfield} src={ed} onClick={this.onEdit} title="Редактировать" alt=""/>
                    <img className={peopleCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={this.onDel} title="Удалить" alt=""/>
                    {type != "ht4" && <>
                        <input className={peopleCSS.inp+" "+peopleCSS.copyInp} id={"inpcpt_" + id} placeholder="Ссылка не создана" defaultValue={codeLinkURL} type="text" readOnly/>
                        <img className={peopleCSS.imginp+" "+peopleCSS.refrC} src={this.themeState.theme_ch ? refreshCd : refreshCl} onClick={this.refreshLink} title="Создать ссылку-приглашение" alt=""/>
                        <img className={peopleCSS.imginp} src={this.themeState.theme_ch ? copyd : copyl} title="Копировать" data-enable={info.link ? "1" : "0"} onClick={e=>this.copyLink(e, codeLinkURL, info.name)} alt=""/>
                    </>}
                </div>
                :
                <div className={peopleCSS.fi}>
                    <div className={peopleCSS.nav_i + " " + peopleCSS.nav_iZag2} id={peopleCSS.nav_i}>
                        {this.inps.inpnpt}
                    </div>
                    {type != "ht4" && <img className={peopleCSS.profIm} src={this.themeState.theme_ch ? profd : profl} title="Так будет выглядеть иконка перехода в профиль" alt=""/>}
                    <img className={peopleCSS.imgfield} src={ed} onClick={this.onEdit} title="Редактировать" alt=""/>
                    <img className={peopleCSS.imginp+" yes "} data-id1={type == "ht4L2" ? id : undefined} src={yes} onClick={e=>this.onFin(e, isHT4L2)} title="Подтвердить" alt=""/>
                    <img className={peopleCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={this.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                </div>
            }
            <div className={peopleCSS.ed}>
                <div className={peopleCSS.preinf}>
                    ФИО:
                </div>
                <input className={peopleCSS.inp} data-id={idHTeacherForSchool ? info.login+"_"+idHTeacherForSchool : undefined} data-id1={info ? id+"_"+info.login : id+"_"} id={"inpnpt_" + (id?id:"")} placeholder={"Фамилия И.О."} defaultValue={isPeopleBlock ? info.name : this.inps.inpnpt} onChange={this.chStatB} type="text"/>
                {PeopleMain.ele(false, "inpnpt_" + (id?id:""), this.inps)}
                <img className={peopleCSS.imginp+" yes "} src={yes} onClick={e=>this.onFin(e, isPeopleBlock ? isHT4L2 : undefined)} title="Подтвердить" alt=""/>
                <img className={peopleCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={this.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
            </div>
        </div>;
        return isPeopleBlock ? edFi :
            <div className={peopleCSS.add+" "+peopleCSS.nav_iZag} style={{marginLeft: type == "ht4L2" ? "2vw" : undefined}} data-st="0">
                <div className={peopleCSS.nav_i+" "+peopleCSS.link} id={peopleCSS.nav_i} onClick={this.onEdit}>
                    {title}
                </div>
                {edFi}
            </div>
    }

    public UNSAFE_componentWillMount(): void {
        const {statusStore, hteacherStore, themeStore, eventsStore} = this.context.stores;
        const {hteacherController} = this.context.controllers;
        this.cState = statusStore;
        this.hteachersInfo = hteacherStore;
        this.themeState = themeStore;
        this.eventsStore = eventsStore;
        this.hteacherController = hteacherController;
        PeopleMain.setActNew(1);
        this.hteacherController.didMount(this.getInfo.bind(this));
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount HTeachers");
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount HTeachers");
        this.eventsStore.clearEvents();
        this.hteacherController.willUnmount();
    }

    public UNSAFE_componentWillUpdate(): void {
        console.log("I was triggered during componentWillUpdate HTeachers");
        if(this.cState.role == 1 && this.cState.kid && this.selKid != this.cState.kid) {
            this.selKid = this.cState.kid;
            this.getInfo();
        }
    }

    public render(): ReactElement {
        return <div className={peopleCSS.header}>
            <Helmet>
                <title>{this.cState.role == 4 ? "Администрации учебных организаций" : "Администрация учебной организации"}</title>
            </Helmet>
            {Object.getOwnPropertyNames(this.hteachersInfo.info).length == 0 && !(this.cState.auth && this.cState.role > 2) ?
                <ErrFound text={this.errText}/>
                :
                <div className={peopleCSS.blockPep}>
                    <div className={peopleCSS.pep}>
                        <div className={peopleCSS.nav_iZag}>
                            <div className={peopleCSS.nav_i} id={peopleCSS.nav_i}>
                                {this.cState.role == 4 ? "Администрации учебных организаций" : "Администрация учебной организации"}
                            </div>
                            {this.cState.auth && this.cState.role > 2 ? this.cState.role == 3 ? <>
                                        {this.getBlock("Добавить завуча", "ht")}
                                        {Object.getOwnPropertyNames(this.hteachersInfo.info).map((idHTeacher: string) =>
                                            this.getBlock(undefined, "ht", idHTeacher, true)
                                        )}
                                    </> : <>
                                        {this.getBlock("Добавить учебную организацию", "ht4")}
                                        {Object.getOwnPropertyNames(this.hteachersInfo.info).map((idSchool: string) =><>
                                            {this.getBlock(undefined, "ht4", idSchool, true)}
                                            {this.getBlock("Добавить завуча", "ht4L2", idSchool)}
                                            {this.hteachersInfo.info[idSchool].pep && Object.getOwnPropertyNames(this.hteachersInfo.info[idSchool].pep).map((idHTeacher: string) =>
                                                this.getBlock(undefined, "ht4L2", idSchool, true, idHTeacher)
                                            )}
                                        </>)}
                                </> :
                                Object.getOwnPropertyNames(this.hteachersInfo.info).map((idHTeacher: string) =>
                                    <div key={idHTeacher}>
                                        <div className={peopleCSS.nav_i+" "+peopleCSS.nav_iZag2} id={peopleCSS.nav_i}>
                                            {this.hteachersInfo.info[idHTeacher].name}
                                        </div>
                                        {this.hteachersInfo.info[idHTeacher].login && <img className={peopleCSS.profIm} src={this.themeState.theme_ch ? profd : profl} onClick={e=>PeopleMain.goToProf(this.hteachersInfo.info[idHTeacher].login)} title="Перейти в профиль" alt=""/>}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            }
        </div>;
    }
}