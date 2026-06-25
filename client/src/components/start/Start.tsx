import {observer} from "mobx-react";
import type { ReactElement} from "react";
import {Component} from "react";
import {Helmet} from "react-helmet-async";
import warn from '../../media/warning.png';
import ran from '../../media/random.png';
import pedagog from '../../media/start/pedagog.jpg';
import roditelyam from '../../media/start/roditelyam.jpg';
import zavuch from '../../media/start/zavuch.jpg';
import detyam from '../../media/start/detyam.jpeg';
import left from '../../media/start/left.png';
import sta from '../../media/start/start.gif';
import start from './start.module.css';
import button from "../button.module.css";
import {Link} from "react-router-dom"
import ErrFound from "../other/error/ErrFound";
import Main from "../main/Main";
import { ContextStores } from "../../utils/context";
import type IndicatorStore from "../../store/other/IndicatorStore";
import type StatusStore from "../../store/StatusStore";
import type EventsStore from "../../store/other/EventsStore";
import type DialogStore from "../../store/other/DialogStore";
import type StartController from "../../controllers/StartController";
import Registration from "./Registration";
import { withParamsHOC } from "../../utils/withHOC";
import Authentication from "./Authentication";

interface Props{
    params?: any,
    mod?: any
}

@observer
class Start extends Component<Props> {
    static contextType = ContextStores;
    context;
    private timer: number;
    private code: string;
    private mod: string;
    private indicInfo: IndicatorStore;
    private cState: StatusStore;
    private eventsInfo: EventsStore;
    private dialogInfo: DialogStore;
    private startController: StartController;
    private elem: any = {g_id: undefined, codEm:undefined};
    private textNoInv: string = "Приглашение неверно или недействительно.";
    private textYesInvNR: any = "К действующему аккаунту была добавлена новая роль.";
    private els: any = {};
    private warns: any = {pat: undefined, empt: undefined};
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
    public static getEmail: (title: string) => ReactElement;
    public static gen_pas: (e) => void;
    public static onvxod: (e) => void;

    private gen_pas(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        const symbols: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        let password: string = "";
        for (let i = 0; i < 17; i++){
            password += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        let el: any;
        for(el of par.querySelectorAll("." + start.inps+"[type='password']")){
            el.value = password;
            this.inpchr({target:el});
            if(par.classList.contains(start.reg)) {
                Registration.chStatRb({target:el})
            } else { 
                Authentication.chStatZb({target:el});
            }
        }
        navigator.clipboard.writeText(password);
        this.eventsInfo.changeEvent("Внимание!", `Сгенерирован пароль: ${password}. Он скопирован в буфер обмена`, 10);
    }

    private inpchr(e: InputEvent | any): void {
        const el: HTMLInputElement = e.target as HTMLInputElement;
        if(!e.inputType) return;
        if(!el.validity.patternMismatch && el.value.length != 0) {
            el.setAttribute("data-mod", '0');
            if(this.warns.pat != undefined) {
                this.eventsInfo.deleteEvents(this.warns.pat);
                this.warns.pat = undefined;
            } else if(this.warns.empt != undefined) {
                this.eventsInfo.deleteEvents(this.warns.empt);
                this.warns.empt = undefined;
            }
            return;
        }

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
            let message = "Допустимы только латиница, цифры или дефис/нижнее подчёркивание";
            if(el.type == "password"){
                message = "Пароль не меньше 8 символов, без пробелов";
            }
            this.warns.pat = this.eventsInfo.changeEvent("Внимание!", message);
            if(this.warns.empt != undefined) {
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
        this.code = props.params.code;
        this.mod = props.mod;
        HOC.getEmail = this.getEmail.bind(this);
        HOC.gen_pas = this.gen_pas.bind(this);
        HOC.onvxod = this.onvxod.bind(this);
    }

    public UNSAFE_componentWillMount(): void {
		const {statusStore, indicatorStore, dialogStore, eventsStore} = this.context.stores;
		const {startController} = this.context.controllers;
        this.cState = statusStore;
        this.indicInfo = indicatorStore;
        this.dialogInfo = dialogStore;
        this.eventsInfo = eventsStore;
        this.startController = startController;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Start");
        if(this.code){
            this.startController.checkInviteCode(this.code, this.mod);
        }
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
                        <Authentication/>
                        <Registration params={this.code} mod={this.mod}/>
                    </div>
                </div>
            }
        </div>;
    }
}

const HOC = withParamsHOC(Start);

function setStaticForHOCInJS() {
    return HOC;
}

export default setStaticForHOCInJS();