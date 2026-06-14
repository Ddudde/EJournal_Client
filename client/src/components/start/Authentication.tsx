import type { ReactElement} from "react";
import {observer} from "mobx-react";
import {Component} from "react";
import { ContextStores } from "../../utils/context";
import start from './start.module.css';
import button from "../button.module.css";
import warn from '../../media/warning.png';
import ran from '../../media/random.png';
import Start from "./Start";
import type EventsStore from "../../store/other/EventsStore";
import type DialogStore from "../../store/other/DialogStore";
import type StartController from "../../controllers/StartController";

interface Props {
}

@observer
export default class Authentication extends Component {
    static contextType = ContextStores;
    context;
    private eventsInfo: EventsStore;
    private dialogInfo: DialogStore;
    private startController: StartController;
    private selEmailZ: boolean = true;
    private elem: any = {vxbut: undefined, logv: undefined, pasv: undefined, logz: undefined, blockRecZ:undefined, emalZ:undefined, vxodBlock:undefined};
    private els: any = {logz: 0, pasnz: 0, paspz: 0, logv: 0, pasv: 0, secFrZ: 0, emalZ: 0};
    private warns: any = {pow: undefined};
    private emailCodePas = {
        obj: Start.getEmail("Восстановление пароля"),
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
    public static chStatZb: (e?) => void;

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

    private changeSelEmailZ(): void {
        this.selEmailZ = !this.selEmailZ;
        this.elem.blockRecZ.dataset.selemail = +this.selEmailZ;
        this.chStatZb();
    }

    private async initVxod(): Promise<void> {
        const permission: boolean = Notification.permission == "granted";
        const auth: string = this.elem.logv.value + ":" + this.elem.pasv.value;
        this.startController.initVxod(localStorage.getItem("notifToken"), permission, auth);
    }

    private chStatVb(e, x?): void {
        const el: HTMLInputElement = e.target;

        if(el) {
            this.els[el.id] = !el.validity.patternMismatch && el.value.length != 0;
            if(x) this.els[el.id] = true;
        }
        this.elem.vxbut.setAttribute("data-enable", +((this.els.logv & this.els.pasv) || false));
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

    public constructor(props: Props) {
        super(props);
        Authentication.chStatZb = this.chStatZb.bind(this);
    }

    public UNSAFE_componentWillMount(): void {
        const {dialogStore, eventsStore} = this.context.stores;
        const {startController} = this.context.controllers;
        this.dialogInfo = dialogStore;
        this.eventsInfo = eventsStore;
        this.startController = startController;
    }
    
    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Authentication");
        this.chStatVb({target: this.elem.logv});
        this.chStatZb({target: this.elem.logz});
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount Authentication");
        this.warns = {};
    }

    public render(): ReactElement {
        return <form className={start.vxod} data-mod="0" ref={el=>this.elem.vxodBlock = el}>
            <div className={start.vxo}>
                <input className={start.inps} type="login" onChange={this.chStatVb.bind(this)}
                    ref={el => this.elem.logv = el} placeholder="Логин" id="logv" autoComplete="username"
                    required pattern="^[a-zA-Z0-9/-]+$"/>
                <div className={start.dinp}>
                    <input className={start.inps} type="password" onChange={this.chStatVb.bind(this)}
                        ref={el => this.elem.pasv = el} placeholder="Пароль" id="pasv"
                        autoComplete="current-password" required pattern="[\S]"/>
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
                    required pattern="^[a-zA-Z0-9-]+$"/>
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
                                required pattern="[\S]{8,}"/>
                            <span className={button.button + ' ' + start.marg} data-mod='2' onClick={this.changeSelEmailZ.bind(this)}>
                                Заменить на e-mail
                            </span>
                        </div>
                    </div>
                </div>
                <div className={start.dinp}>
                    <input className={start.inps} type="password" onChange={this.chStatZb.bind(this)}
                        placeholder="Новый пароль" id="pasnz" autoComplete="new-password" required
                        pattern="[\S]{8,}"/>
                    <div className={button.button + ' ' + start.marg} data-mod='2' onClick={Start.gen_pas}>
                        <img src={ran} className={start.randimg} alt=""/>
                        Случайный пароль
                    </div>
                </div>
                <div className={start.dinp}>
                    <input className={start.inps} type="password" onChange={this.chStatZb.bind(this)}
                        placeholder="Подтвердите пароль" id="paspz" autoComplete="new-password"
                        required pattern="[\S]{8,}"/>
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
        </form>;
    }
}