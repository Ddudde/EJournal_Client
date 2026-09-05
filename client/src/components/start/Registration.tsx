import type { ReactElement} from "react";
import {observer} from "mobx-react";
import {Component} from "react";
import start from './start.module.css';
import button from "../button.module.css";
import ls1 from '../../media/ls-icon1.png';
import ls2 from '../../media/ls-icon2.png';
import ls3 from '../../media/ls-icon3.png';
import ran from '../../media/random.png';
import warn from '../../media/warning.png';
import License from "./License";
import CheckBox from "../other/checkBox/CheckBox";
import type { NavigateFunction } from "react-router-dom";
import withRouterHOC from "../../utils/withHOC";
import { ContextStores } from "../../utils/context";
import type StartController from "../../controllers/StartController";
import type CheckboxStore from "../../store/other/CheckboxStore";
import type DialogStore from "../../store/other/DialogStore";
import type EventsStore from "../../store/other/EventsStore";
import Start from "./Start";

interface Props{
    navigate?: any,
    params?: any,
    mod?: any
}

@observer
class Registration extends Component<Props> {
    static contextType = ContextStores;
    context;
    private code: string;
    private mod: string;
    private selEmailR: boolean = true;
    private navigate: NavigateFunction;
    private checkBoxInfo: CheckboxStore;
    private eventsInfo: EventsStore;
    private dialogInfo: DialogStore;
    private startController: StartController;
    private elem: any = {regbut: undefined, blockRecR: undefined, emalR:undefined, logoR:undefined};
    private els: any = {logr: 0, pasr: 0, ppasr: 0, emalR: 0, secFrR: 0};
    private warns: any = {pow: undefined};
    private textNoInv: string = "Приглашение неверно или недействительно.";
    private licField = {
        buts: {
            0 : {
                text: "Прочитал",
                fun: this.closeDialog.bind(this),
                enab: true
            }
        }
    }
    private emailCode = {
        buts: {
            0 : {
                text: "ГОТОВО!",
                fun: this.checkCodeEmail.bind(this),
                enab: false
            },
            1 : {
                text: "ОТМЕНА",
                fun: this.closeDialog.bind(this),
                enab: true
            }
        }
    }
    public static chStatRb: (e?) => void;

    private async checkCodeEmail(): Promise<void> {
        const successResponce: boolean = await this.startController.checkCodeEmail(this.code, this.elem);
        if(successResponce) {
            this.closeDialog();
            this.initRegistration();
        }
    }

    private closeDialog(): void {
        this.context.dialog.updateComponent(undefined);
        this.dialogInfo.resetDialog();
    }

    private showLicense(): void {
        this.context.dialog.updateComponent(<div className={start.lic_text}>
            <License/>
        </div>);
        this.dialogInfo.cloneDialog(this.licField);
    }

    private async preRego(): Promise<void> {
        if(this.selEmailR) {
            const successResponce: boolean = await this.startController.startEmail(this.code, this.elem.emalR.value);
            if(successResponce) {
                this.context.dialog.updateComponent(Start.getEmail("Подтвердите E-Mail"));
                this.dialogInfo.cloneDialog(this.emailCode);
            }
        } else {
            this.initRegistration();
        }
    }

    private changeSelEmailR(): void {
        this.selEmailR = !this.selEmailR;
        this.elem.blockRecR.dataset.selemail = +this.selEmailR;
        this.chStatRb();
    }

    private chStatAv(e): void {
        e.target.firstChild.checked = true;
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

    private async initRegistration(): Promise<void> {
        const ch: HTMLInputElement = this.elem.logoR.querySelector("input[checked]");
        if(!this.els.pasr || !this.els.logr) return;

        const data: boolean = await this.startController.initRegistration(this.mod, this.selEmailR, ch.value, this.els, this.code, this.textNoInv);
        if(data) {
            Start.onvxod({target: this.elem.logoR.firstElementChild});
            this.navigate("/");
        }
    }
    
    public constructor(props: Props) {
        super(props);
        this.navigate = props.navigate;
        this.code = props.params;
        this.mod = props.mod;
        HOC.chStatRb = this.chStatRb.bind(this);
        this.showLicense = this.showLicense.bind(this);
    }

    public UNSAFE_componentWillMount(): void {
        const {checkboxStore, dialogStore, eventsStore} = this.context.stores;
        const {startController} = this.context.controllers;
        this.checkBoxInfo = checkboxStore;
        this.dialogInfo = dialogStore;
        this.eventsInfo = eventsStore;
        this.startController = startController;
        this.els.regb = (this.checkBoxInfo.checkBoxes.checkbox_lic && this.els.logr && this.els.pasr && this.els.ppasr && (this.els.pasr == this.els.ppasr)) || false;
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount Registration");
        this.warns = {};
    }

    public render(): ReactElement {
        return <form className={start.reg} id="reg">
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
                id="pasr" autoComplete="new-password" required pattern="[\S]{8,}"/>
            <div className={start.raz}>
                Повторите пароль:
                <span style={{color: "#F00"}}> *</span>
            </div>
            <div className={start.dinp}>
                <input className={start.inps} type="password" placeholder="Повторите пароль"
                    onChange={this.chStatRb.bind(this)} id="ppasr" autoComplete="new-password" required
                    pattern="[\S]{8,}"/>
                <span className={button.button + ' ' + start.marg} data-mod='2' onClick={Start.gen_pas}>
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
                            required pattern="[\S]{8,}"/>
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
                        <span className={start.url} onClick={this.showLicense}>
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
        </form>;
    }
}

const HOC = withRouterHOC(Registration);

function setStaticForHOCInJS() {
    return HOC;
}

export default setStaticForHOCInJS();