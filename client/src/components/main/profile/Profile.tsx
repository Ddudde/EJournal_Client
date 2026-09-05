import { ContextStores } from "../../../utils/context";
import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import {Helmet} from "react-helmet-async";
import ErrFound from "../../other/error/ErrFound";
import yes from "../../../media/yes.png";
import no from "../../../media/no.png";
import ed from "../../../media/edit.png";
import profd from "../../../media/profd.png";
import profl from "../../../media/profl.png";
import ls1 from "../../../media/ls-icon1.png";
import ls2 from "../../../media/ls-icon2.png";
import ls3 from "../../../media/ls-icon3.png";
import type EventsStore from "../../../store/other/EventsStore";
import Main from "../Main";
import profileCSS from './profile.module.css';
import type StatusStore from "../../../store/StatusStore";
import type ThemeStore from "../../../store/main/ThemeStore";
import type ProfileStore from "../../../store/main/ProfileStore";
import withRouterHOC from "../../../utils/withHOC";
import type { NavigateFunction } from "react-router-dom";
import type ProfileController from "../../../controllers/main/ProfileController";

interface Props {
    params?: any,
    navigate?: any
};

@observer
class Profile extends Component {
    static contextType = ContextStores;
	context: any;
    private eventsStore: EventsStore;
    private profileController: ProfileController;
    private profilesInfo: ProfileStore;
    private cState: StatusStore;
    private themeState: ThemeStore;
    private navigate: NavigateFunction;
    private log: string;
    private errText = "К сожалению, информация не найдена...";
    private moore = `/*
    Можете что-то рассказать о себе
    Дополнительные контакты:
        Телефон: 8 800 555 35 35
        ВК: https://vk.com/id
        Телеграмм: https://t.me/id
        e-mail1: fsdfdsfd@ya.ru
        e-mail2: fsdfdsfd2@ya.ru
    */`;
    private icons = {
        1: ls1,
        2: ls2,
        3: ls3
    }

    private inpchr(event): void {
        const el: HTMLInputElement = event.target;
        if (el.validity.patternMismatch || el.validity.typeMismatch || el.value.length == 0) {
            el.setAttribute("data-mod", '1');
        } else {
            el.setAttribute("data-mod", '0');
        }
        const state: string = +(!el.validity.typeMismatch && !el.validity.patternMismatch && el.value.length != 0) + "";
        el.parentElement.querySelector(".yes").setAttribute("data-enable", state);
    }

    private onEdit(e): void {
        const par: HTMLElement = e.target.parentElement;
        par.setAttribute('data-mod', '1');
    }

    private async onFin(e): Promise<void> {
        const par: HTMLElement = e.target.parentElement;
        const inp: HTMLInputElement = par.querySelector("." + profileCSS.inp);
        if(inp.tagName == "TEXTAREA") {
            const successResponce: boolean = await this.profileController.chInfo(inp.value);
            if(successResponce){
                par.setAttribute('data-mod', '0');
            }
            return;
        }
        if (inp.validity.typeMismatch || inp.validity.patternMismatch || inp.value.length == 0) {
            inp.setAttribute("data-mod", '1');
            return;
        }
        inp.setAttribute("data-mod", '0');
        if (inp.type != "email") {
            this.chLogin(inp, par);
            return;
        }
        const successResponce: boolean = await this.profileController.chEmail(inp.value);
        if(successResponce){
            par.setAttribute('data-mod', '0');
        }
    }

    private async chLogin(inp: HTMLInputElement, par: HTMLElement) {
        const successResponce: boolean = await this.profileController.chLogin(inp.value);
        if (successResponce) {
            par.setAttribute('data-mod', '0');
            this.navigate(Main.prefSite + "/profiles");
        } else {
            this.eventsStore.changeEvent("Внимание!", "Логин занят, попробуйте изменить", 10);
        }
    }

    private onClose(e): void {
        const par: HTMLElement = e.target.parentElement;
        par.setAttribute('data-mod', '0');
    }

    private goToProf(log: string): void {
        if(log) this.navigate(Main.prefSite + "/profiles/" + log);
    }

    private renderFieldMoreInfo(roleId: string): JSX.Element {
        const role = this.profilesInfo.info.roles[roleId];
        return <div className={profileCSS.nav_iZag} key={roleId}>
            <div className={profileCSS.nav_i} id={profileCSS.nav_i}>
                Роль: {this.cState.rolesDescrs[roleId]}
            </div>
            {role.yo && <div className={profileCSS.nav_i} id={profileCSS.nav_i}>
                Учебная организация: {role.yo}
            </div>}
            <div className={profileCSS.nav_i} id={profileCSS.nav_i} data-mod='0'>
                <div className={profileCSS.preinf}>
                    Почта:
                </div>
                <div className={profileCSS.field}>
                    {role.email}
                </div>
                {(!this.log || this.log == this.cState.login) && <>
                    <input className={profileCSS.inp} onInput={this.inpchr} placeholder="ex@gmail.com" defaultValue={role.email} type="email" />
                    <img className={profileCSS.imginp + " yes"} src={yes} onClick={this.onFin} title="Подтвердить изменения" alt="" />
                    <img className={profileCSS.imginp} src={no} onClick={this.onClose} title="Отменить изменения и выйти из режима редактирования" alt="" />
                    <img className={profileCSS.imgfield} src={ed} onClick={this.onEdit} title="Редактировать" alt="" />
                </>}
            </div>
            {role.group && <div className={profileCSS.nav_i} id={profileCSS.nav_i}>
                Класс: {role.group}
            </div>}
            {role.parents && <>
                <div className={profileCSS.nav_i} id={profileCSS.nav_i}>
                    Родители:
                </div>
                <div className={profileCSS.nav_iZag}>
                    {Object.getOwnPropertyNames(role.parents).map((parentId: string) => 
                        <div key={parentId}>
                            <div className={profileCSS.nav_i + " " + profileCSS.preinf} id={profileCSS.nav_i}>
                                {role.parents[parentId].name}
                            </div>
                            <img className={profileCSS.proImg} src={this.themeState.theme_ch ? profd : profl} onClick={e => this.goToProf(role.parents[parentId].login)} title="Перейти в профиль" alt="" />
                        </div>
                    )}
                </div>
            </>}
            {role.kids && <>
                <div className={profileCSS.nav_i} id={profileCSS.nav_i}>
                    Дети:
                </div>
                <div className={profileCSS.nav_iZag}>
                    {Object.getOwnPropertyNames(role.kids).map((kidId: string) =>
                        <div key={kidId}>
                            <div className={profileCSS.nav_i + " " + profileCSS.preinf} id={profileCSS.nav_i}>
                                {role.kids[kidId].name}
                            </div>
                            <img className={profileCSS.proImg} src={this.themeState.theme_ch ? profd : profl} onClick={e => this.goToProf(role.kids[kidId].login)} title="Перейти в профиль" alt="" />
                        </div>
                    )}
                </div>
            </>}
            {role.lessons && <>
                <div className={profileCSS.nav_i} id={profileCSS.nav_i}>
                    Дисциплины:
                </div>
                <div className={profileCSS.nav_iZag}>
                    {role.lessons.map(param1 => 
                        <div className={profileCSS.nav_i} id={profileCSS.nav_i} key={param1}>
                            {param1}
                        </div>
                    )}
                </div>
            </>}
        </div>;
    }

    public constructor(props: Props) {
        super(props);
        this.navigate = props.navigate;
        this.log = props.params.log;
    }

	public UNSAFE_componentWillMount(): void {
		const {eventsStore} = this.context.stores;
        this.eventsStore = eventsStore;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Profile");
        Main.setActivedForPanel(".panPro");
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount Profile");
        this.eventsStore.clearEvents();
    }

    public UNSAFE_componentWillUpdate(): void {
        console.log("I was triggered during componentWillUpdate Profile");
        if(this.log && this.profilesInfo.info.login && this.log != this.profilesInfo.info.login) {
            this.profileController.getInfo();
        }
    }

    public render(): ReactElement {
        return <div className={profileCSS.AppHeader}>
            <Helmet>
                <title>Профиль</title>
            </Helmet>
            {!Object.getOwnPropertyNames(this.profilesInfo.info).length ?
                    <ErrFound text={this.errText}/>
                :
                    <div className={profileCSS.blockPro}>
                        <div className={profileCSS.pro}>
                            <img alt="ico" src={this.icons[this.profilesInfo.info.ico]}/>
                            <div className={profileCSS.nav_i} id={profileCSS.nav_i} data-mod='0'>
                                <div className={profileCSS.preinf}>
                                    Логин:
                                </div>
                                <div className={profileCSS.field}>
                                    {this.profilesInfo.info.login}
                                </div>
                                {(!this.log || this.log == this.cState.login) && <>
                                    <input className={profileCSS.inp} id="loginp" placeholder="nickname" onInput={this.inpchr} defaultValue={this.profilesInfo.info.login} type="text" pattern="^[a-zA-Z0-9\-]+$"/>
                                    <img className={profileCSS.imginp+" yes"} src={yes} onClick={this.onFin} title="Подтвердить изменения" alt=""/>
                                    <img className={profileCSS.imginp} src={no} onClick={this.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                                    <img className={profileCSS.imgfield} src={ed} onClick={this.onEdit} title="Редактировать" alt=""/>
                                </>}
                            </div>
                            <div className={profileCSS.nav_i} id={profileCSS.nav_i}>
                                ФИО: {this.profilesInfo.info.fio}
                            </div>
                            <div className={profileCSS.nav_i} id={profileCSS.nav_i} data-mod='0'>
                                <div className={profileCSS.preinf}>
                                    Дополнительная информация:
                                </div>
                                <pre className={profileCSS.field}>
                                    {this.profilesInfo.info.more}
                                </pre>
                                {(!this.log || this.log == this.cState.login) && <>
                                    <textarea className={profileCSS.inp+" "+profileCSS.inparea} placeholder="Информация о вас" onInput={this.inpchr} defaultValue={this.profilesInfo.info.more ? this.profilesInfo.info.more : this.moore}/>
                                    <img className={profileCSS.imginp+" yes"} src={yes} onClick={this.onFin} title="Подтвердить изменения" alt=""/>
                                    <img className={profileCSS.imginp} src={no} onClick={this.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
                                    <img className={profileCSS.imgfield} src={ed} onClick={this.onEdit} title="Редактировать" alt=""/>
                                </>}
                            </div>
                            {this.profilesInfo.info.roles && Object.getOwnPropertyNames(this.profilesInfo.info.roles).map((roleId: string) =>
                                this.renderFieldMoreInfo(roleId)
                            )}
                        </div>
                    </div>
            }
        </div>;
    }
}

export default withRouterHOC(Profile);