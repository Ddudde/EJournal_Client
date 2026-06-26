import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../../utils/context";
import settingsCSS from './settings.module.css';
import button from "../../button.module.css";
import ran from "../../../media/random.png";
import ls1 from "../../../media/ls-icon1.png";
import ls2 from "../../../media/ls-icon2.png";
import ls3 from "../../../media/ls-icon3.png";
import CheckBox from "../../other/checkBox/CheckBox";
import {Helmet} from "react-helmet-async";
import Main from "../Main";
import type StatusStore from "../../../store/StatusStore";
import type CheckboxStore from "../../../store/other/CheckboxStore";
import type EventsStore from "../../../store/other/EventsStore";
import type DialogStore from "../../../store/other/DialogStore";
import type SettingController from "../../../controllers/main/SettingController";

interface Props {
};

@observer
export default class Settings extends Component {
    static contextType = ContextStores;
    context: any;
    private cState: StatusStore;
    private checkBoxInfo: CheckboxStore;
    private eventsStore: EventsStore;
    private dialogStore: DialogStore;
    private settingController: SettingController;
    private emailSt: boolean = true;
    private elem: any = {npasinp : undefined, powpasinp : undefined, zambut : undefined, secBut : undefined, emBut : undefined, emInp : undefined, secinp : undefined, emal : undefined, codEm : undefined, emBlock : undefined, zamBlock : undefined, zamBlockFir : undefined};
    private els: any = {emInp: undefined, secinp: undefined, npasinp: undefined, powpasinp: undefined, warnUnsetSecFr: undefined, warnErrSecFr: undefined, warnErrEm: undefined};
    private emailCode = {
        obj: this.getEmail("Подтвердите E-Mail"),
        buts: {
            0 : {
                text: "ГОТОВО!",
                fun: () => this.settingController.checkCodeEmail(this.elem),
                enab: false
            },
            1 : {
                text: "ОТМЕНА",
                fun: () => this.dialogStore.resetDialog(),
                enab: true
            }
        }
    };
    private emailCodePas = {
        obj: this.getEmail("Изменение пароля"),
        buts: {
            0 : {
                text: "ГОТОВО!",
                fun: () => this.settingController.checkPasCodeEmail(this.elem, this.els),
                enab: false
            },
            1 : {
                text: "ОТМЕНА",
                fun: () => this.dialogStore.resetDialog(),
                enab: true
            }
        }
    };

    private inpchr(event): void {
        const el: HTMLInputElement = event.target;
        if (el.validity.patternMismatch || el.value.length == 0) {
            el.setAttribute("data-mod", '1');
        } else {
            el.setAttribute("data-mod", '0');
        }
    }

    private onEditPass(e): void {
        const par: HTMLElement = e.target.parentElement;
        par.setAttribute('data-mod', '1');
    }

    private onChSt(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        this.emailSt = !this.emailSt;
        this.chStatB({target:this.emailSt ? this.elem.emInp:this.elem.secinp});
        if(!this.emailSt && !this.cState.secFr){
            if (this.els.warnUnsetSecFr == undefined) {
                this.els.warnUnsetSecFr = this.eventsStore.changeEvent("Внимание!", "Секретная фраза не установлена");;
            }
        } else if(this.els.warnUnsetSecFr != undefined) {
            this.eventsStore.deleteEvents(this.els.warnUnsetSecFr);
            this.els.warnUnsetSecFr = undefined;
        }
        if(this.els.warnErrSecFr != undefined) {
            this.eventsStore.deleteEvents(this.els.warnErrSecFr);
            this.els.warnErrSecFr = undefined;
        }
        if(this.els.warnErrEm != undefined) {
            this.eventsStore.deleteEvents(this.els.warnErrEm);
            this.els.warnErrEm = undefined;
        }
        const state: string = +this.emailSt + "";
        par.setAttribute('data-mod', state);
    }

    private onCloseBlock(e): void {
        const par: HTMLElement = e.target.classList.contains("clA") ? e.target.parentElement.parentElement : e.target.parentElement.parentElement.parentElement;
        par.setAttribute('data-mod', '0');
    }

    private getEmail(title: string): ReactElement {
        return <div className={settingsCSS.code}>
            <div className={settingsCSS.zag}>
                {title}
            </div>
            <div className={settingsCSS.raz}>
                В течение нескольких минут вам
                придёт письмо с кодом, который
                необходимо ввести в форму ниже.
            </div>
            <div className={settingsCSS.raz}>
                Код подтверждения:
                <span style={{color: "#F00"}}> *</span>
            </div>
            <input className={settingsCSS.inp} type="text" placeholder="Код подтверждения" onChange={this.chGotovo} id="codeR"
                ref={el => this.elem.codEm = el} required pattern="^[a-zA-Z0-9_]+$"/>
        </div>
    }

    private chGotovo(e): void {
        const el: HTMLInputElement = e.target;
        this.els[el.id] = el.value;
        this.dialogStore.changeDialogBut(0, this.els[el.id]);
    }

    private async changeSecretFrase(e): Promise<void> {
        const par: HTMLElement = e.target.parentElement.parentElement;
        const inp: HTMLInputElement = par.querySelector("input");
        const isOK: boolean = await this.settingController.changeSecretFrase(this.els, inp);
        if(isOK){
            this.onCloseBlock(e);
            this.chStatB({target:this.emailSt ? this.elem.emInp:this.elem.secinp});
        }
    }

    private chStatB(e): void {
        const el: HTMLInputElement = e.target;
        this.els[el.id] = (!el.validity.patternMismatch && el.value.length != 0) ? el.value : undefined;
        const state: boolean = this.emailSt ? this.els.emInp != undefined : (this.els.secinp != undefined && this.cState.secFr);
        const bool: boolean = (state && this.els.npasinp != undefined && this.els.powpasinp != undefined && (this.els.npasinp == this.els.powpasinp));
        this.elem.zambut.setAttribute("data-enable", +bool);
        if(this.els.npasinp == this.els.powpasinp) {
            if(this.els.warnPow != undefined) {
                this.eventsStore.deleteEvents(this.els.warnPow);
                this.els.warnPow = undefined;
            }
        } else if (this.els.warnPow == undefined) {
            this.els.warnPow = this.eventsStore.changeEvent("Внимание!", "Повторите новый пароль верно");
        }
    }

    private onCloseChPar(e): void {
        if(this.els.warnPow != undefined) {
            this.eventsStore.deleteEvents(this.els.warnPow);
            this.els.warnPow = undefined;
        }
        this.onCloseBlock(e);
    }

    private async onFinChangePassword(e): Promise<void> {
        const isOK: boolean = await this.settingController.changePassword(this.emailSt, this.els, this.emailCodePas);
        if(isOK) {
            this.onCloseBlock(e);
        }
    }

    private chStatSb(e): void {
        const el: HTMLInputElement = e.target;
        this.elem.secBut.setAttribute("data-enable", +(el ? el.value.length != 0 : false));
    }

    private chStatEm(e): void {
        const el: HTMLInputElement = e.target;
        this.elem.emBut.setAttribute("data-enable", +(el ? el.value.length != 0 : false));
    }

    private gen_pas(e): void {
        let password: string = "";
        const symbols: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i: number = 0; i < 15; i++){
            password += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        for(const el of [this.elem.npasinp, this.elem.powpasinp]){
            el.value = password;
            this.inpchr({target:el});
            this.chStatB({target:el});
        }
        navigator.clipboard.writeText(password);
        this.eventsStore.changeEvent("Внимание!", `Сгенерирован пароль: ${password}. Он скопирован в буфер обмена`, 10);
    }

    public async getSettings(): Promise<void> {
        const isOK: boolean = await this.settingController.getSettings();
        if(isOK && this.elem.zamBlock) {
            this.elem.zamBlock.dataset.mod = +(this.cState.secFr || false);
        }
    }

    public UNSAFE_componentWillMount(): void {
        const {statusStore, checkboxStore, eventsStore, dialogStore} = this.context.stores;
        const {settingController} = this.context.controllers;
        this.cState = statusStore;
        this.checkBoxInfo = checkboxStore;
        this.eventsStore = eventsStore;
        this.dialogStore = dialogStore;
        this.settingController = settingController;
    }

    public componentDidMount(): void {
        Main.setActivedForPanel(".panSet");
        this.settingController.didMount(this.getSettings.bind(this));
        console.log("I was triggered during componentDidMount Settings.jsx");
        const ico: any = document.querySelector("#ch" + this.cState.ico);
        ico.checked = true;
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount Settings");
        this.eventsStore.clearEvents();
        this.settingController.willUnmount();
    }

    public render(): ReactElement {
        const changeIco = (e: any)=>this.settingController.changeIco(e.target.firstChild);
        return <div className={settingsCSS.AppHeader}>
            <Helmet>
                <title>Настройки</title>
            </Helmet>
            <div className={settingsCSS.blockPro}>
                <div className={settingsCSS.pro}>
                    <div className={settingsCSS.nav_i} id={settingsCSS.nav_i} onClick={e=>this.settingController.changeNotification("checkbox_hints")}>
                        <CheckBox state={+true} text={"Включить подсказки"} checkbox_id={"checkbox_hints"}/>
                    </div>
                    <div className={settingsCSS.nav_iZag}>
                        <div className={settingsCSS.nav_i} id={settingsCSS.nav_i} onClick={e=>this.settingController.changeNotification("checkbox_notify")}>
                            <CheckBox text={"Включить уведомления"} checkbox_id={"checkbox_notify"}/>
                        </div>
                        <div className={settingsCSS.nav_iZag} data-act={+(this.checkBoxInfo.checkBoxes.checkbox_notify || false)}>
                            {(this.cState.role < 3) && <div className={settingsCSS.nav_i} id={settingsCSS.nav_i} onClick={e=>this.settingController.changeNotification("checkbox_notify_sched")}>
                                <CheckBox text={"Уведомления о изменении в расписании"} checkbox_id={"checkbox_notify_sched"}/>
                            </div>}
                            {(this.cState.role < 2) && <div className={settingsCSS.nav_i} id={settingsCSS.nav_i} onClick={e=>this.settingController.changeNotification("checkbox_notify_marks")}>
                                <CheckBox text={"Уведомления о новых оценках"} checkbox_id={"checkbox_notify_marks"}/>
                            </div>}
                            {(this.cState.role < 3) && <div className={settingsCSS.nav_i} id={settingsCSS.nav_i} onClick={e=>this.settingController.changeNotification("checkbox_notify_yo")}>
                                <CheckBox text={"Присылать новые объявления учебного центра"} checkbox_id={"checkbox_notify_yo"}/>
                            </div>}
                            {(this.cState.role < 4) && <div className={settingsCSS.nav_i} id={settingsCSS.nav_i} onClick={e=>this.settingController.changeNotification("checkbox_notify_por")}>
                                <CheckBox text={"Присылать новые объявления портала"} checkbox_id={"checkbox_notify_por"}/>
                            </div>}
                            {(this.cState.role == 4) && <div className={settingsCSS.nav_i} id={settingsCSS.nav_i} onClick={e=>this.settingController.changeNotification("checkbox_notify_new_sch")}>
                                <CheckBox text={"Присылать уведомления о новых заявках школ"} checkbox_id={"checkbox_notify_new_sch"}/>
                            </div>}
                        </div>
                    </div>
                    <div className={settingsCSS.nav_iZag} data-mod="1" data-act={+(this.cState.secFr || this.cState.email)} ref={el=>this.elem.zamBlockFir = el}>
                        <div className={settingsCSS.nav_i+" "+settingsCSS.link} id={settingsCSS.nav_i} data-act='1' onClick={this.onEditPass}>
                            Сменить пароль
                        </div>
                        <div className={settingsCSS.block} data-mod='0' ref={el=>this.elem.zamBlock = el}>
                            <div className={settingsCSS.pasBlock+" "+settingsCSS.emailBlock}>
                                <input className={settingsCSS.inp} onChange={this.chStatB} onInput={this.inpchr} ref={el=>this.elem.emInp = el} id="emInp" placeholder="E-Mail" type="email"/>
                                <div className={button.button+" "+settingsCSS.marg} data-mod="2" onClick={this.onChSt}>
                                    Заменить на секретную фразу
                                </div>
                            </div>
                            <div className={settingsCSS.pasBlock+" "+settingsCSS.frp}>
                                <input className={settingsCSS.inp} onChange={this.chStatB} onInput={this.inpchr} ref={el=>this.elem.secinp = el} id="secinp" placeholder="Секретная фраза" type="password" pattern="^[a-zA-Z0-9]+$"/>
                                <div className={button.button+" "+settingsCSS.marg} data-mod="2" onClick={this.onChSt}>
                                    Заменить на e-mail
                                </div>
                            </div>
                            <div className={settingsCSS.pasBlock}>
                                <input className={settingsCSS.inp} ref={el=>this.elem.npasinp = el} onChange={this.chStatB} onInput={this.inpchr} id="npasinp" placeholder="Новый пароль" type="password" autoComplete="new-password" pattern="^[a-zA-Z0-9]+$"/>
                                <div className={button.button+" "+settingsCSS.marg} data-mod="2" onClick={this.gen_pas}>
                                    <img src={ran} className={settingsCSS.randimg} alt=""/>
                                    Случайный пароль
                                </div>
                            </div>
                            <input className={settingsCSS.inp+" "+settingsCSS.inpPass} ref={el=>this.elem.powpasinp = el} id="powpasinp" onChange={this.chStatB} onInput={this.inpchr} placeholder="Повторите пароль" type="password" autoComplete="new-password" pattern="^[a-zA-Z0-9]+$"/>
                            <div className={settingsCSS.blockKnops}>
                                <div className={button.button} ref={el=>this.elem.zambut = el} data-mod="2" data-enable="0" onClick={this.onFinChangePassword}>
                                    Замена!
                                </div>
                                <div className={button.button} data-mod="2" onClick={this.onCloseChPar}>
                                    Отменить
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={settingsCSS.nav_iZag} data-mod="0">
                        <div className={settingsCSS.nav_i+" "+settingsCSS.link} id={settingsCSS.nav_i} onClick={this.onEditPass}>
                            Сменить аватар
                        </div>
                        <div className={settingsCSS.block}>
                            <div className={settingsCSS.logo}>
                                <p style={{marginBlock: "0.5vw"}}>Выберите аватар для профиля:</p>
                                <div className={settingsCSS.blockAva} onClick={changeIco}>
                                    <input id="ch1" name="ico" type="radio" value="1"/>
                                    <img className={settingsCSS.logoi} src={ls1} alt=""/>
                                </div>
                                <div className={settingsCSS.blockAva} onClick={changeIco}>
                                    <input id="ch2" name="ico" type="radio" value="2"/>
                                    <img className={settingsCSS.logoi} src={ls2} alt=""/>
                                </div>
                                <div className={settingsCSS.blockAva} onClick={changeIco}>
                                    <input id="ch3" name="ico" type="radio" value="3"/>
                                    <img className={settingsCSS.logoi} src={ls3} alt=""/>
                                </div>
                            </div>
                            <div className={button.button+' clA '+settingsCSS.marg} data-mod="2" style={{width:"fit-content"}} onClick={this.onCloseBlock}>
                                Закрыть меню выбора
                            </div>
                        </div>
                    </div>
                    <div className={settingsCSS.nav_iZag} data-mod="0" ref={el => this.elem.emBlock = el}>
                        <div className={settingsCSS.nav_i+" "+settingsCSS.link} id={settingsCSS.nav_i} onClick={this.onEditPass}>
                            {this.cState.email? "Изменить" : "Добавить"} электронную почту
                        </div>
                        <div className={settingsCSS.block}>
                            <input className={settingsCSS.inp+" "+settingsCSS.inpPass} ref={el => this.elem.emal = el} onChange={this.chStatEm} onInput={this.inpchr} placeholder="Электронная почта" type="email"/>
                            <div className={settingsCSS.blockKnops}>
                                <div className={button.button} data-mod="2" ref={el=>this.elem.emBut = el} data-enable="0" onClick={e=>this.settingController.startEmail(this.elem, this.emailCode)}>
                                    Подтвердить
                                </div>
                                <div className={button.button} data-mod="2" onClick={this.onCloseBlock}>
                                    Отменить
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={settingsCSS.nav_iZag} data-mod="0">
                        <div className={settingsCSS.nav_i+" "+settingsCSS.link} id={settingsCSS.nav_i} onClick={this.onEditPass}>
                            {this.cState.secFr? "Изменить" : "Добавить"} секретную фразу
                        </div>
                        <div className={settingsCSS.block}>
                            <input className={settingsCSS.inp+" "+settingsCSS.inpPass} onChange={this.chStatSb} onInput={this.inpchr} placeholder="Секретная фраза" type="password" pattern="^[a-zA-Z0-9]+$"/>
                            <div className={settingsCSS.blockKnops}>
                                <div className={button.button} data-mod="2" ref={el=>this.elem.secBut = el} data-enable="0" onClick={this.changeSecretFrase}>
                                    Подтвердить
                                </div>
                                <div className={button.button} data-mod="2" onClick={this.onCloseBlock}>
                                    Отменить
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}