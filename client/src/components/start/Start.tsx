import {observer} from "mobx-react";
import type { ReactElement} from "react";
import {Component} from "react";
import {Helmet} from "react-helmet-async";
import warn from '../../media/warning.png';
import ls1 from '../../media/ls-icon1.png';
import ls2 from '../../media/ls-icon2.png';
import ls3 from '../../media/ls-icon3.png';
import ran from '../../media/random.png';
import pedagog from '../../media/start/pedagog.jpg';
import roditelyam from '../../media/start/roditelyam.jpg';
import zavuch from '../../media/start/zavuch.jpg';
import detyam from '../../media/start/detyam.jpeg';
import left from '../../media/start/left.png';
import sta from '../../media/start/start.gif';
import start from './start.module.css';
import button from "../button.module.css";
import type { NavigateFunction} from "react-router-dom";
import {Link} from "react-router-dom"
import License from "./License";
import withRouterHOC from "../../utils/withRouterHOC";
import ErrFound from "../other/error/ErrFound";
import CheckBox from "../other/checkBox/CheckBox";
import Main from "../main/Main";
import { ContextStores } from "../../utils/context";
import type IndicatorStore from "../../store/other/IndicatorStore";
import type StatusStore from "../../store/StatusStore";
import type CheckboxStore from "../../store/other/CheckboxStore";
import type EventsStore from "../../store/other/EventsStore";
import type DialogStore from "../../store/other/DialogStore";
import type StartController from "../../controllers/StartController";

interface Props{
    navigate?: any,
    params?: any,
    mod?: any
}

@observer
class Start extends Component<Props> {
    static contextType = ContextStores;
    context;
    private timer: number;
    private navigate: NavigateFunction;
    private code;
    private mod: string;
    private indicInfo: IndicatorStore;
    private cState: StatusStore;
    private checkBoxInfo: CheckboxStore;
    private eventsInfo: EventsStore;
    private dialogInfo: DialogStore;
    private startController: StartController;
    private elem: any = {regbut: undefined, vxbut: undefined, g_id: undefined, logv: undefined, pasv: undefined, logz: undefined, blockRecR: undefined, emalR:undefined, codEm:undefined, logoR:undefined, blockRecZ:undefined, emalZ:undefined, vxodBlock:undefined};
    private textNoInv: string = "Приглашение неверно или недействительно.";
    private textYesInvNR: any = "К действующему аккаунту была добавлена новая роль.";
    private els: any = {logz: 0, pasnz: 0, paspz: 0, logv: 0, pasv: 0, logr: 0, pasr: 0, ppasr: 0, emalR: 0, secFrR: 0, secFrZ: 0, emalZ: 0};
    private warns: any = {pat: undefined, empt: undefined, pow: undefined};
    private selEmailR: boolean = true;
    private selEmailZ: boolean = true;
    private blocks = [
        {
            name: "Завучам",
            text: "Немного информации об портале для завучей",
            img: zavuch,
            link: "tutor/sch"
        },
        {
            name: "Педагогам",
            text: "Немного информации об портале для педагогов",
            img: pedagog,
            link: "tutor/tea"
        },
        {
            name: "Родителям",
            text: "Немного информации об портале для родителей",
            img: roditelyam,
            link: "tutor/par"
        },
        {
            name: "Детям",
            text: "Немного информации об портале для детей",
            img: detyam,
            link: "tutor/kid"
        }
    ]
    private licField = {
        obj: <div className={start.lic_text}>
            <License/>
        </div>,
        buts: {
            0 : {
                text: "Прочитал",
                fun: () => this.dialogInfo.resetDialog(),
                enab: true
            }
        }
    }
    private emailCode = {
        obj: this.getEmail("Подтвердите E-Mail"),
        buts: {
            0 : {
                text: "ГОТОВО!",
                fun: () => this.checkCodeEmail(),
                enab: false
            },
            1 : {
                text: "ОТМЕНА",
                fun: () => this.dialogInfo.resetDialog(),
                enab: true
            }
        }
    }
    private emailCodePas = {
        obj: this.getEmail("Восстановление пароля"),
        buts: {
            0 : {
                text: "ГОТОВО!",
                fun: () => this.startController.checkPasCodeEmail(this.els, this.elem),
                enab: false
            },
            1 : {
                text: "ОТМЕНА",
                fun: () => this.dialogInfo.resetDialog(),
                enab: true
            }
        }
    }

    private gen_pas(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        const symbols: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password: string = "";
        for (let i = 0; i < 15; i++){
            password += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        let el: any;
        for(el of par.querySelectorAll("." + start.inps+"[type='password']")){
            el.value = password;
            this.inpchr({target:el});
            if(par.classList.contains(start.reg)) {
                this.chStatRb({target:el})
            } else { 
                this.chStatZb({target:el});
            }
        }
        navigator.clipboard.writeText(password);
        this.eventsInfo.changeEvent("Внимание!", `Сгенерирован пароль: ${password}. Он скопирован в буфер обмена`, 10);
    }

    private async checkCodeEmail(): Promise<void> {
        const data: boolean = await this.startController.checkCodeEmail(this.code, this.elem);
        if(data) {
            this.initRegistration();
        }
    }

    private preRego(): void {
        if(this.selEmailR) {
            this.startController.startEmail(this.code, this.elem.emalR.value, this.emailCode);
        } else {
            this.initRegistration();
        }
    }

    private async initRegistration(): Promise<void> {
        const ch: HTMLInputElement = this.elem.logoR.querySelector("input[checked]");
        if(!this.els.pasr || !this.els.logr) return;

        const data: boolean = await this.startController.initRegistration(this.mod, this.selEmailR, ch.value, this.els, this.code, this.textNoInv);
        if(data) {
            this.onvxod({target: this.elem.logoR.firstElementChild});
            this.navigate("/");
        }
    }

    private async initVxod(): Promise<void> {
        const permission: boolean = Notification.permission == "granted";
        const auth: string = this.elem.logv.value + ":" + this.elem.pasv.value;
        this.startController.initVxod(localStorage.getItem("notifToken"), permission, auth);
    }

    private inpchr(e: InputEvent | any): void {
        const el: HTMLInputElement = e.target as HTMLInputElement;
        if(!e.inputType) return;

        if (el.validity.patternMismatch || el.value.length == 0) {
            el.setAttribute("data-mod", '1');
            if(el.value.length == 0){
                if(this.warns.empt == undefined) {
                    this.warns.empt = this.eventsInfo.changeEvent("Внимание!", "Необходимо заполнить поле");
                    if(this.warns.pat != undefined) {
                        this.eventsInfo.deleteEvents(this.warns.pat);
                        this.warns.pat = undefined;
                    }
                }
            } else if(this.warns.pat == undefined) {
                this.warns.pat = this.eventsInfo.changeEvent("Внимание!", "Допустимы только латиница, цифры или дефис/нижнее подчёркивание");
                if(this.warns.empt != undefined) {
                    this.eventsInfo.deleteEvents(this.warns.empt);
                    this.warns.empt = undefined;
                }
            }
        } else {
            el.setAttribute("data-mod", '0');
            if(this.warns.pat != undefined) {
                this.eventsInfo.deleteEvents(this.warns.pat);
                this.warns.pat = undefined;
            } else if(this.warns.empt != undefined) {
                this.eventsInfo.deleteEvents(this.warns.empt);
                this.warns.empt = undefined;
            }
        }
    }

    private checkCaps(event): void {
        const caps: boolean = event.getModifierState && event.getModifierState('CapsLock');
        for(const el of document.getElementsByClassName(start.warn)){
            const elWithType: HTMLElement = el as HTMLElement;
            elWithType.style.opacity = +caps + "";
        }
    }

    private onvxod(e): void {
        let par: HTMLElement = e.target.parentElement.parentElement;
        par.setAttribute('data-mod', "0");
        par = par.parentElement;
        par.setAttribute('data-mod', "0");
        this.eventsInfo.clearEvents();
        this.warns = {};
    }

    private onreg(e): void {
        let par: HTMLElement = e.target.parentElement.parentElement;
        par.setAttribute('data-mod', "1");
        par = par.parentElement;
        par.setAttribute('data-mod', "1");
        this.eventsInfo.clearEvents();
        this.warns = {};
    }

    private reset_timer(): void {
        clearInterval(this.timer);
        this.timer = setInterval(()=>{this.indicInfo.nextIndicator()}, 5000);
    }


    private changeSelEmailR(): void {
        this.selEmailR = !this.selEmailR;
        this.elem.blockRecR.dataset.selemail = +this.selEmailR;
        this.chStatRb();
    }

    private changeSelEmailZ(): void {
        this.selEmailZ = !this.selEmailZ;
        this.elem.blockRecZ.dataset.selemail = +this.selEmailZ;
        this.chStatZb();
    }

    private chStatRb(e?): void {
        if(e) {
            const el: HTMLInputElement = e.target;
            this.els[el.id] = (el.validity.patternMismatch || el.validity.typeMismatch) ? false : el.value;
        }
        this.els.regb = (this.checkBoxInfo.checkBoxes.checkbox_lic && this.els.logr && this.els.pasr && this.els.ppasr && (this.els.pasr == this.els.ppasr) && (this.selEmailR ? this.els.emalR : this.els.secFrR)) || false;
        this.elem.regbut.setAttribute("data-enable", +this.els.regb);
        if(this.els.pasr == this.els.ppasr) {
            if(this.warns.pow != undefined) {
                this.eventsInfo.deleteEvents(this.warns.pow);
                this.warns.pow = undefined;
            }
        } else if (this.warns.pow == undefined) {
            this.warns.pow = this.eventsInfo.changeEvent("Внимание!", "Повторите новый пароль верно");
        }
    }

    private chStatVb(e, x?): void {
        const el: HTMLInputElement = e.target;
        this.els[el.id] = x ? true : (el ? !el.validity.patternMismatch && el.value.length != 0 : false);
        this.elem.vxbut.setAttribute("data-enable", +((this.els.logv & this.els.pasv) || false));
    }

    private chStatAv(e): void {
        e.target.firstChild.checked = true;
    }

    private async initRecovery(e): Promise<void> {
        const data: boolean = await this.startController.initRecovery(this.selEmailZ, this.els, this.emailCodePas);
        if(data){
            e.target = e.target.parentElement;
            this.goToRecoveryOrVxod(e);
        }
    }

    private goToRecoveryOrVxod(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement.parentElement;
        const mod: boolean = par.getAttribute('data-mod') == '0';
        par.setAttribute("data-mod", +mod + "");
        if(mod && this.warns.pow != undefined) {
            this.eventsInfo.deleteEvents(this.warns.pow);
            this.warns.pow = undefined;
        }
    }

    private chStatZb(e?): void {
        if(e) {
            const el:HTMLInputElement = e.target;
            this.els[el.id] = (el.validity.patternMismatch || el.validity.typeMismatch) ? false : el.value;
        }
        const butEnable: number = +((this.els.logz && (this.selEmailZ ? this.els.emalZ : this.els.secFrZ) && this.els.pasnz && this.els.paspz && (this.els.pasnz == this.els.paspz)) || false);
        document.querySelector("#butL").setAttribute("data-enable", butEnable + "");
        if(this.els.pasnz == this.els.paspz) {
            if(this.warns.pow != undefined) {
                this.eventsInfo.deleteEvents(this.warns.pow);
                this.warns.pow = undefined;
            }
        } else if (this.warns.pow == undefined) {
            this.warns.pow = this.eventsInfo.changeEvent("Внимание!", "Повторите новый пароль верно");
        }
    }

    private unsetText(e: MouseEvent): void {
        const par: HTMLElement = e.target as HTMLElement;
        for(const el of par.getElementsByClassName(start.g_block_text)){
            el.innerHTML = el.getAttribute("data-text");
        }
    }

    private onsetText(e: MouseEvent): void {
        const par: HTMLElement = e.target as HTMLElement;
        for(const el of par.getElementsByClassName(start.g_block_text)){
            el.innerHTML = el.getAttribute("data-textm");
        }
    }

    private getEmail(title: string): ReactElement {
        return <div className={start.code}>
            <div className={start.zag}>
                {title}
            </div>
            <div className={start.raz}>
                В течение нескольких минут вам
                придёт письмо с кодом, который
                необходимо ввести в форму ниже.
            </div>
            <div className={start.raz}>
                Код подтверждения:
                <span style={{color: "#F00"}}> *</span>
            </div>
            <input className={start.inps} type="text" placeholder="Код подтверждения" onChange={this.chGotovo.bind(this)} id="codeR"
                ref={el => this.elem.codEm = el} required pattern="^[a-zA-Z0-9_]+$"/>
        </div>
    }

    private chGotovo(e): void {
        const el: HTMLInputElement = e.target;
        this.els[el.id] = el.value;
        this.dialogInfo.changeDialogBut(0, this.els[el.id]);
    }

    public constructor(props: Props) {
        super(props);
        this.navigate = props.navigate;
        this.code = props.params.code;
        this.mod = props.mod;
    }

    public UNSAFE_componentWillMount(): void {
		const {statusStore, indicatorStore, checkboxStore, dialogStore, eventsStore} = this.context.stores;
		const {startController} = this.context.controllers;
        this.cState = statusStore;
        this.indicInfo = indicatorStore;
        this.checkBoxInfo = checkboxStore;
        this.dialogInfo = dialogStore;
        this.eventsInfo = eventsStore;
        this.startController = startController;
        this.els.regb = (this.checkBoxInfo.checkBoxes.checkbox_lic && this.els.logr && this.els.pasr && this.els.ppasr && (this.els.pasr == this.els.ppasr)) || false;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Start");
        this.chStatVb({target: this.elem.logv});
        this.chStatZb({target: this.elem.logz});
        if(this.code){
            this.startController.checkInviteCode(this.code, this.mod);
        }
        console.log(this.code);
        this.elem.g_id.addEventListener('mouseenter', this.onsetText.bind(this));
        this.elem.g_id.addEventListener('mouseleave', this.unsetText.bind(this));
        this.indicInfo.changeIndicator(0, this.reset_timer.bind(this));
        Main.setActivedForPanel(0);
        window.addEventListener('click', this.checkCaps.bind(this));
        window.addEventListener('keydown', this.checkCaps.bind(this));
        let el: any;
        for(el of document.querySelectorAll("input[placeholder]")){
            el.addEventListener('input', this.inpchr.bind(this));
        }
        this.startController.didMount();
    }

    public UNSAFE_componentWillUpdate(): void {
        console.log('componentDidUpdate Start');
        this.reset_timer();
    }

    public componentWillUnmount(): void {
        clearInterval(this.timer);
        console.log("I was triggered during componentWillUnmount Start");
        this.eventsInfo.clearEvents();
        this.startController.willUnmount();
        this.warns = {};
    }

    public render(): ReactElement {
        return <div className={start.AppHeader}>
            <Helmet>
                <title>Главная</title>
            </Helmet>
            <div className={start.block}>
                {this.cState.invErr &&
                    <ErrFound text={this.textNoInv}/>
                }
                {this.cState.reaYes &&
                    <ErrFound text={this.textYesInvNR}/>
                }
                {(this.cState.invErr || this.cState.reaYes) ? undefined : <>
                    <div className={start.g}>
                        <div className={start.gH} ref={el=>this.elem.g_id=el}>
                            {this.blocks.map((param, i) =>
                                <Link className={start.g_block} to={param.link} key={i} data-act={this.indicInfo.actived == i ? "1" : "0"}>
                                    <img src={param.img} className={start.pic_g} alt=""/>
                                    <div className={start.g_block_text} data-text={param.name} data-textm={param.text}>
                                        {param.name}
                                    </div>
                                </Link>
                            )}
                            <div className={start.g_block_shad}/>
                            <img src={left} className={start.pic_l} alt="" onClick={() => {this.indicInfo.prevIndicator(this.reset_timer.bind(this))}}/>
                            <img src={left} className={start.pic_r} alt="" onClick={() => {this.indicInfo.nextIndicator(this.reset_timer.bind(this))}}/>
                            <div className={start.indic}>
                                <div className={start.indic_bl} id="ind_0" data-act={!this.indicInfo.actived ? "1" : "0"} onClick={() => {this.indicInfo.changeIndicator(0, this.reset_timer.bind(this))}}/>
                                <div className={start.indic_bl} id="ind_1" data-act={this.indicInfo.actived == 1 ? "1" : "0"} onClick={() => {this.indicInfo.changeIndicator(1, this.reset_timer.bind(this))}}/>
                                <div className={start.indic_bl} id="ind_2" data-act={this.indicInfo.actived == 2 ? "1" : "0"} onClick={() => {this.indicInfo.changeIndicator(2, this.reset_timer.bind(this))}}/>
                                <div className={start.indic_bl} id="ind_3" data-act={this.indicInfo.actived == 3 ? "1" : "0"} onClick={() => {this.indicInfo.changeIndicator(3, this.reset_timer.bind(this))}}/>
                            </div>
                        </div>
                    </div>
                    <div className={start.startimg}>
                        <div className={start.startimgText}>
                            Для авторизации проскролльте или нажмите на стрелки
                        </div>
                        <img src={sta} alt="" onClick={() => {window.scrollTo(0, window.innerHeight)}}/>
                    </div>
                </>}
            </div>
            {(this.cState.invErr || this.cState.reaYes) ? undefined :
                <div className={start.block}>
                    <div className={start.posit} data-mod="0">
                        <div className={start.help} data-enable={this.code ? '1' : '0'} data-mod="0">
                            <div className={start.r}>
                                Нет аккаунта? <span className={start.helpa} onClick={this.onreg.bind(this)}>Регистрация!</span>
                            </div>
                            <div className={start.v}>
                                Есть аккаунт? <span className={start.helpa} onClick={this.onvxod.bind(this)}>Вход!</span>
                            </div>
                        </div>
                        <form className={start.vxod} data-mod="0" ref={el=>this.elem.vxodBlock = el}>
                            <div className={start.vxo}>
                                <input className={start.inps} type="login" onChange={this.chStatVb.bind(this)}
                                    ref={el => this.elem.logv = el} placeholder="Логин" id="logv" autoComplete="username"
                                    required pattern="^[a-zA-Z0-9\-]+$"/>
                                <div className={start.dinp}>
                                    <input className={start.inps} type="password" onChange={this.chStatVb.bind(this)}
                                        ref={el => this.elem.pasv = el} placeholder="Пароль" id="pasv"
                                        autoComplete="current-password" required pattern="^[a-zA-Z0-9_]+$"/>
                                    <div className={start.nav_i + " " + start.zabpar} id={start.nav_i} onClick={this.goToRecoveryOrVxod.bind(this)}>
                                        Забыли пароль?
                                    </div>
                                </div>
                                <div className={start.dinp}>
                                    <div className={start.dinpo}>
                                        <div className={start.warn + ' ' + start.warnc} id="warnc">
                                            <img src={warn} className={start.warnimg} alt=""/>
                                            Включён Caps Lock!
                                        </div>
                                    </div>
                                    <div className={button.button + ' ' + start.marg} ref={el => this.elem.vxbut = el}
                                        onClick={this.initVxod.bind(this)}>
                                        ВОЙТИ!
                                    </div>
                                </div>
                            </div>
                            <div className={start.zab}>
                                <input className={start.inps} ref={el => this.elem.logz = el} type="text"
                                    onChange={this.chStatZb.bind(this)} placeholder="Логин" id="logz" autoComplete="username"
                                    required pattern="^[a-zA-Z0-9\-]+$"/>
                                <div className={start.blockRec} data-selemail={+this.selEmailZ} ref={el=>this.elem.blockRecZ=el}>
                                    <div className={start.email}>
                                        <div className={start.dinp}>
                                            <input className={start.inps} ref={el => this.elem.emalZ = el} type="email" placeholder="E-Mail" onChange={this.chStatZb.bind(this)} id="emalZ" required/>
                                            <span className={button.button + ' ' + start.marg} data-mod='2' onClick={this.changeSelEmailZ.bind(this)}>
                                                Заменить на секретную фразу
                                            </span>
                                        </div>
                                    </div>
                                    <div className={start.secFR}>
                                        <div className={start.dinp}>
                                            <input className={start.inps} type="text" placeholder="Секретная фраза" onChange={this.chStatZb.bind(this)} id="secFrZ"
                                                required pattern="^[a-zA-Z0-9_]+$"/>
                                            <span className={button.button + ' ' + start.marg} data-mod='2' onClick={this.changeSelEmailZ.bind(this)}>
                                                Заменить на e-mail
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={start.dinp}>
                                    <input className={start.inps} type="password" onChange={this.chStatZb.bind(this)}
                                        placeholder="Новый пароль" id="pasnz" autoComplete="new-password" required
                                        pattern="^[a-zA-Z0-9_]+$"/>
                                    <div className={button.button + ' ' + start.marg} data-mod='2' onClick={this.gen_pas.bind(this)}>
                                        <img src={ran} className={start.randimg} alt=""/>
                                        Случайный пароль
                                    </div>
                                </div>
                                <div className={start.dinp}>
                                    <input className={start.inps} type="password" onChange={this.chStatZb.bind(this)}
                                        placeholder="Подтвердите пароль" id="paspz" autoComplete="new-password"
                                        required pattern="^[a-zA-Z0-9_]+$"/>
                                    <span className={start.warn + ' ' + start.marg} id="warncz">
                                        <img src={warn} className={start.warnimg} alt=""/>
                                        Включён Caps Lock!
                                    </span>
                                </div>
                                <div className={start.dinp}>
                                    <div className={start.dinpo}>
                                        <div className={button.button + ' ' + start.butZab} id="butL" data-mod="1"
                                            onClick={this.initRecovery}>
                                            Подтвердить
                                        </div>
                                    </div>
                                    <div className={button.button + ' ' + start.butZab + ' ' + start.marg} id="butR"
                                        data-mod="1" onClick={this.goToRecoveryOrVxod.bind(this)}>
                                        Вспомнил пароль
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form className={start.reg} id="reg">
                            <div className={start.logo} ref={el => this.elem.logoR = el}>
                                <p style={{marginBlock: "0.5vw"}}>
                                    Выберите аватар для профиля:
                                    <span style={{color: "#F00"}}> *</span>
                                </p>
                                <div className={start.blockAva} onClick={this.chStatAv.bind(this)}>
                                    <input id="ch1" name="ico" type="radio" value="1" defaultChecked/>
                                    <img className={start.logoi} src={ls1} alt=""/>
                                </div>
                                <div className={start.blockAva} onClick={this.chStatAv.bind(this)}>
                                    <input id="ch2" name="ico" type="radio" value="2"/>
                                    <img className={start.logoi} src={ls2} alt=""/>
                                </div>
                                <div className={start.blockAva} onClick={this.chStatAv.bind(this)}>
                                    <input id="ch3" name="ico" type="radio" value="3"/>
                                    <img className={start.logoi} src={ls3} alt=""/>
                                </div>
                            </div>
                            <div className={start.raz}>
                                Логин:
                                <span style={{color: "#F00"}}> *</span>
                            </div>
                            <input className={start.inps} type="text" placeholder="Логин" onChange={this.chStatRb.bind(this)} id="logr"
                                autoComplete="username" required pattern="^[a-zA-Z0-9\-]+$"/>
                            <div className={start.raz}>
                                Пароль:
                                <span style={{color: "#F00"}}> *</span>
                            </div>
                            <input className={start.inps} type="password" placeholder="Пароль" onChange={this.chStatRb.bind(this)}
                                id="pasr" autoComplete="new-password" required pattern="^[a-zA-Z0-9_]+$"/>
                            <div className={start.raz}>
                                Повторите пароль:
                                <span style={{color: "#F00"}}> *</span>
                            </div>
                            <div className={start.dinp}>
                                <input className={start.inps} type="password" placeholder="Повторите пароль"
                                    onChange={this.chStatRb.bind(this)} id="ppasr" autoComplete="new-password" required
                                    pattern="^[a-zA-Z0-9_]+$"/>
                                <span className={button.button + ' ' + start.marg} data-mod='2' onClick={this.gen_pas.bind(this)}>
                                    <img src={ran} className={start.randimg} alt=""/>
                                    Случайный пароль
                                </span>
                            </div>
                            <div className={start.blockRec} data-selemail={+this.selEmailR} ref={el=>this.elem.blockRecR=el}>
                                <div className={start.email}>
                                    <div className={start.raz}>
                                        E-Mail:
                                        <span style={{color: "#F00"}}> *</span>
                                    </div>
                                    <div className={start.dinp}>
                                        <input className={start.inps} ref={el => this.elem.emalR = el} type="email" placeholder="E-Mail" onChange={this.chStatRb.bind(this)} id="emalR" required/>
                                        <span className={button.button + ' ' + start.marg} data-mod='2' onClick={this.changeSelEmailR.bind(this)}>
                                            Заменить на секретную фразу
                                        </span>
                                    </div>
                                </div>
                                <div className={start.secFR}>
                                    <div className={start.raz}>
                                        Секретная фраза:
                                        <span style={{color: "#F00"}}> *</span>
                                    </div>
                                    <div className={start.dinp}>
                                        <input className={start.inps} type="text" placeholder="Секретная фраза" onChange={this.chStatRb.bind(this)} id="secFrR"
                                            required pattern="^[a-zA-Z0-9_]+$"/>
                                        <span className={button.button + ' ' + start.marg} data-mod='2' onClick={this.changeSelEmailR.bind(this)}>
                                            Заменить на e-mail
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={start.dinp}>
                                <div className={start.dinpo}>
                                    <div className={start.lic}>
                                        <CheckBox text={"Принимаю условия "} checkbox_id={"checkbox_lic"}/>
                                        <span className={start.url}
                                            onClick={() => this.dialogInfo.cloneDialog(this.licField)}>
                                            соглашения
                                        </span>
                                        <span style={{color: "#F00"}}> *</span>
                                        <div>
                                            <span style={{color: "#F00"}}>*</span>
                                            — поля, обязательные для заполнения
                                        </div>
                                    </div>
                                    <div className={start.warn} id="warncr">
                                        <img src={warn} className={start.warnimg} alt=""/>
                                        Включён Caps Lock!
                                    </div>
                                </div>
                                <span data-enable={+this.els.regb} className={button.button + ' ' + start.marg}
                                    ref={el => this.elem.regbut = el} onClick={this.preRego.bind(this)}>
                                    ЗАРЕГИСТРИРОВАТЬСЯ!
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>;
    }
}

export default withRouterHOC(Start, true);