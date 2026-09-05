import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../utils/context";
import {Helmet} from "react-helmet-async";
import peopleCSS from './peopleMain.module.css';
import profl from "../../media/profl.png";
import profd from "../../media/profd.png";
import ed from "../../media/edit.png";
import no from "../../media/no.png";
import refreshCd from "../../media/refreshCd.png";
import refreshCl from "../../media/refreshCl.png";
import copyd from "../../media/copyd.png";
import copyl from "../../media/copyl.png";
import yes from "../../media/yes.png";
import ErrFound from "../other/error/ErrFound";
import PeopleMain from "./PeopleMain";
import type AdminsStore from "../../store/people/AdminsStore";
import type ThemeStore from "../../store/main/ThemeStore";
import type StatusStore from "../../store/StatusStore";
import type EventsStore from "../../store/other/EventsStore";
import type AdminController from "../../controllers/people/AdminController";

interface Props {
};

@observer
export default class Admins extends Component {
    static contextType = ContextStores;
    context: any;
    private adminsInfo: AdminsStore;
    private themeState: ThemeStore;
    private cState: StatusStore;
    private eventsInfo: EventsStore;
    private adminController: AdminController;
    private errText: string = "К сожалению, информация не найдена...";
    private inps: any = {inpnpt : "Фамилия И.О."};

    private copyLink(e, url: string, FIO: string): void {
        const title: string = "Внимание!";
        const text: string = "Ссылка-приглашение для " + FIO + " успешно скопирована в буфер обмена.";
        navigator.clipboard.writeText(url);
        this.eventsInfo.changeEvent(title, text, 10);
    }

    private refreshLink(e): void {
        const title: string = "Внимание!";
        const text: string = "Ссылка успешно обновлена"
        const inp: HTMLInputElement = e.target.parentElement.querySelector("input");
        if (inp.hasAttribute("data-id")) {
            const id: string[] = inp.getAttribute("data-id").split("*");
            this.adminController.setCodePep(id[0], title, text);
        }
    }

    private onDel(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        if(par.classList.contains(peopleCSS.pepl)){
            const inp: HTMLInputElement = par.querySelector("input:not([readOnly])");
            if (inp.hasAttribute("data-id")) {
                const id: string[] = inp.getAttribute("data-id").split("*");
                this.adminController.deleteInvite(id[1]);
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

    private onFin(e, type: boolean | any): void {
        let par: HTMLElement = e.target.parentElement;
        if (par.classList.contains(peopleCSS.fi)){
            par = par.parentElement.parentElement;
            this.adminController.addInvite(this.inps.inpnpt, par);
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
        if(type){
            if(inp.hasAttribute("data-id")){
                const id: string[] = inp.getAttribute("data-id").split("*");
                this.adminController.changeInvite(id[1], inp.value, par);
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

    public async getInfo(): Promise<void> {
        await this.adminController.getInfo();
        for(const el of document.querySelectorAll("." + peopleCSS.ed + " > *[id^='inpn']")){
            this.chStatB({target: el});
        }
    }

    private getBlock(id?: string, b?: boolean): ReactElement {
        let codeURL: string;
        const info: any = this.adminsInfo.info[id];
        if(info && info.link) {
            codeURL = PeopleMain.sit + (info.login ? "/reauth/" : "/invite/") + info.link;
        }
        const edFi: ReactElement = <div className={peopleCSS.pepl} key={id} data-st="0">
            {id ?
                <div className={peopleCSS.fi}>
                    <div className={peopleCSS.nav_i+" "+peopleCSS.nav_iZag2} id={peopleCSS.nav_i}>
                        {info.name}
                    </div>
                    {info.login && <img className={peopleCSS.profIm} src={this.themeState.theme_ch ? profd : profl} onClick={e=>PeopleMain.goToProf(info.login)} title="Перейти в профиль" alt=""/>}
                    <img className={peopleCSS.imgfield} src={ed} onClick={this.onEdit} title="Редактировать" alt=""/>
                    <img className={peopleCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={e=>this.onDel(e)} title="Удалить" alt=""/>
                    <input className={peopleCSS.inp+" "+peopleCSS.copyInp} data-id={id ? info.login+"*"+id : undefined} id={"inpcpt_" + id} placeholder="Ссылка не создана" defaultValue={codeURL} type="text" readOnly/>
                    <img className={peopleCSS.imginp+" "+peopleCSS.refrC} src={this.themeState.theme_ch ? refreshCd : refreshCl} onClick={this.refreshLink} title="Создать ссылку-приглашение" alt=""/>
                    <img className={peopleCSS.imginp} src={this.themeState.theme_ch ? copyd : copyl} title="Копировать" data-enable={info.link ? "1" : "0"} onClick={(e)=>this.copyLink(e, codeURL, info.name)} alt=""/>
                </div>
                :
                <div className={peopleCSS.fi}>
                    <div className={peopleCSS.nav_i + " " + peopleCSS.nav_iZag2} id={peopleCSS.nav_i}>
                        {this.inps.inpnpt}
                    </div>
                    <img className={peopleCSS.profIm} src={this.themeState.theme_ch ? profd : profl} title="Так будет выглядеть иконка перехода в профиль" alt=""/>
                    <img className={peopleCSS.imgfield} src={ed} onClick={this.onEdit} title="Редактировать" alt=""/>
                    <img className={peopleCSS.imginp+" yes "} src={yes} onClick={e=>this.onFin(e, true)} title="Подтвердить" alt=""/>
                    <img className={peopleCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={this.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                </div>
            }
            <div className={peopleCSS.ed}>
                <div className={peopleCSS.preinf}>
                    ФИО:
                </div>
                <input className={peopleCSS.inp} data-id={id ? info.login+"*"+id : undefined} id={"inpnpt_" + (id?id:"")} placeholder={"Фамилия И.О."} defaultValue={id ? info.name : this.inps.inpnpt} onChange={this.chStatB} type="text"/>
                {PeopleMain.ele(false, "inpnpt_" + (id?id:""), this.inps)}
                <img className={peopleCSS.imginp+" yes "} src={yes} onClick={e=>this.onFin(e, id)} title="Подтвердить" alt=""/>
                <img className={peopleCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={this.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
            </div>
        </div>;
        return b ? edFi :
            <div className={peopleCSS.add+" "+peopleCSS.nav_iZag} data-st="0">
                <div className={peopleCSS.nav_i+" "+peopleCSS.link} id={peopleCSS.nav_i} onClick={this.onEdit}>
                    Добавить администратора
                </div>
                {edFi}
            </div>
    }

	public UNSAFE_componentWillMount(): void {
		const {statusStore, eventsStore, adminsStore, themeStore} = this.context.stores;
		const {adminController} = this.context.controllers;
        this.cState = statusStore;
        this.eventsInfo = eventsStore;
        this.adminsInfo = adminsStore;
        this.themeState = themeStore;
        this.adminController = adminController;
        PeopleMain.setActNew(4);
        this.adminController.didMount(this.getInfo.bind(this));
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Admins");
    }

    public componentWillUnmount(): void {
        this.eventsInfo.clearEvents();
        this.adminController.willUnmount();
        console.log("I was triggered during componentWillUnmount Admins.jsx");
    }

    public render(): ReactElement {
        return <div className={peopleCSS.header}>
            <Helmet>
                <title>Администраторы портала</title>
            </Helmet>
            {Object.getOwnPropertyNames(this.adminsInfo.info).length == 0 && !(this.cState.auth && this.cState.role == 4) ?
                    <ErrFound text={this.errText}/>
                :
                    <div className={peopleCSS.blockPep}>
                        <div className={peopleCSS.pep}>
                            <div className={peopleCSS.nav_iZag}>
                                <div className={peopleCSS.nav_i} id={peopleCSS.nav_i}>
                                    Администраторы портала
                                </div>
                                {this.cState.auth && this.cState.role == 4 ? <>
                                        {this.getBlock()}
                                        {Object.getOwnPropertyNames(this.adminsInfo.info).map((id: string) =>
                                            this.getBlock(id, true)
                                        )}
                                    </> :
                                    Object.getOwnPropertyNames(this.adminsInfo.info).map((id: string) =>
                                        <div key={id}>
                                            <div className={peopleCSS.nav_i+" "+peopleCSS.nav_iZag2} id={peopleCSS.nav_i}>
                                                {this.adminsInfo.info[id].name}
                                            </div>
                                            {this.adminsInfo.info[id].login && <img className={peopleCSS.profIm} src={this.themeState.theme_ch ? profd : profl} onClick={e=>PeopleMain.goToProf(this.adminsInfo.info[id].login)} title="Перейти в профиль" alt=""/>}
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