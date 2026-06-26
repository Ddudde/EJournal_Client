import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../utils/context";
import Main from "../main/Main";
import contactCSS from './contactMain.module.css';
import {Outlet} from "react-router-dom";
import ed from "../../media/edit.png";
import yes from "../../media/yes.png";
import no from "../../media/no.png";
import Pane from "../other/pane/Pane";
import type ContactStore from "../../store/ContactStore";
import type StatusStore from "../../store/StatusStore";
import type ContactController from "../../controllers/ContactController";

@observer
export default class ContactMain extends Component {
    static contextType = ContextStores;
    context: any;
    private contactsInfo: ContactStore;
    private cState: StatusStore;
    private contactController: ContactController;
    private type: string = "Por";
    private gr = {
        group: 0,
        groups: {
            0: {
                nam: "Контакты портала",
                linke: "por"
            },
            1: {
                nam: "Контакты учебного центра",
                linke: "yo"
            }
        }
    }
    public static chStatB: (e: any, inps: any) => void;
    public static errorLoad: (e: any) => void;
    public static getEdCon: (inps: any, forceUpdate: any) => ReactElement;
    public static setActNew: (name: any | number) => void;
    public static setTyp: (typ: string) => void;

    private getEdField(edFi: ReactElement, titleEd: string, inf: string, inp: string, inps: any, forceUpdate: any, placeholder?: string, pattern?: string): ReactElement {
        return <>
            <div className={contactCSS.fi}>
                {edFi}
                {titleEd != "Ссылка:" && <img className={contactCSS.imgfield} src={ed} onClick={(e)=>this.onEdit(e, inps)} title="Редактировать" alt=""/>}
            </div>
            <div className={contactCSS.ed}>
                <div className={contactCSS.preinf}>
                    {titleEd}
                </div>
                {edFi.type == "pre" ?
                        <textarea className={contactCSS.inp+" "+contactCSS.inparea} id={inp} placeholder={placeholder} defaultValue={inf} onChange={(e)=>this.chStatB(e, inps)}/>
                    :
                        <input className={contactCSS.inp} id={inp} placeholder={placeholder} pattern={pattern} defaultValue={inf} onChange={(e)=>this.chStatB(e, inps)}/>
                }
                {this.ele(false, inp, inps)}
                <img className={contactCSS.imginp+" yes "} src={yes} onClick={(e)=>this.onFin(e, inps)} title="Подтвердить" alt=""/>
                <img className={contactCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={(e)=>this.onClose(e, inps, forceUpdate)} title="Отменить изменения и выйти из режима редактирования" alt=""/>
            </div>
        </>;
    }

    public getEdCon(inps: any, forceUpdate: any): ReactElement {
        const tel: string = this.contactsInfo[this.type].contact;
        const telFi: ReactElement = <pre className={contactCSS.field}>
            {tel}
        </pre>;
        const telM: string = this.contactsInfo[this.type].mapPr ? this.contactsInfo[this.type].mapPr.text : undefined;
        const telMFi: ReactElement = <pre className={contactCSS.field}>
            {telM}
        </pre>;
        const imgUrl: string = inps.edAddIm;
        const imFi: ReactElement = <div className={contactCSS.banner}>
            <div>
                <div>
                    Изображение
                </div>
                <img className={contactCSS.imgfield} src={ed} onClick={(e)=>this.onEdit(e, inps)} title="Редактировать" alt=""/>
            </div>
        </div>;
        return <section className={contactCSS.center_colum}>
            <div className={contactCSS.blockTel}>
                <h1 className={contactCSS.zag}>Телефоны для связи</h1>
                <div className={contactCSS.te} data-st="0">
                    {this.getEdField(telFi, "Текст:", tel, "inpntt_c", inps, forceUpdate)}
                </div>
            </div>
            <div className={contactCSS.map+" "+contactCSS.blockTel}>
                <h1 className={contactCSS.zag}>Карта проезда</h1>
                <div className={contactCSS.te+" mapt"} data-st="0">
                    {this.getEdField(telMFi, "Текст:", telM, "inpntt_m", inps, forceUpdate)}
                    {this.contactsInfo[this.type].mapPr && this.contactsInfo[this.type].mapPr.imgUrl ?
                            <span className={contactCSS.banner}>
                                <img alt="banner" src={this.contactsInfo[this.type].mapPr.imgUrl} onError={e=>this.contactController.changeContact("", "mapPr", "imgUrl")}/>
                                <div className={contactCSS.upr}>
                                    <img className={contactCSS.imgfield} src={ed} onClick={(e)=>this.onEdit(e, inps)} title="Редактировать" alt=""/>
                                    <img className={contactCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={this.onDel} title="Удалить изображение" alt=""/>
                                </div>
                            </span>
                        :
                            <div className={contactCSS.im} data-st={inps.edAddIm ? "1" : "0"}>
                                {this.getEdField(imFi, "Ссылка:", imgUrl, "inpnit_m", inps, forceUpdate, "/media/tuman.jpg")}
                            </div>
                    }
                </div>
            </div>
        </section>;
    }

    public errorLoad(e): void {
        e.target.style.display = 'none';
    }

    private onDel(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        if(par.classList.contains(contactCSS.banner)){
            this.contactController.changeContact("", "mapPr", "imgUrl");
        }
    }

    private onEdit(e, inps): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.parentElement.classList.contains(contactCSS.im) || par.parentElement.classList.contains(contactCSS.te)){
            par = par.parentElement;
            par.setAttribute('data-st', '1');
        }
        if(par.parentElement.parentElement.parentElement.classList.contains(contactCSS.im)){
            par = par.parentElement.parentElement.parentElement;
            par.setAttribute('data-st', '1');
        }
        if(par.classList.contains(contactCSS.upr)){
            inps.edAddIm = this.contactsInfo[this.type].mapPr.imgUrl;
            this.contactController.changeContact("", "mapPr", "imgUrl");
        }
    }

    private onFin(e, inps: any): void {
        let par: HTMLElement = e.target.parentElement;
        const bul: boolean = par.parentElement.classList.contains(contactCSS.te);
        const inp: HTMLInputElement | HTMLTextAreaElement = par.querySelector(bul ? "textarea" : "input");
        if (inps[inp.id]) {
            inp.setAttribute("data-mod", '0');
            if(par.parentElement.classList.contains(contactCSS.im)) {
                if (inps.edAddIm) inps.edAddIm = undefined;
                this.contactController.changeContact(inp.value, "mapPr", "imgUrl");
            }
            if(bul) {
                par = par.parentElement;
                if(par.classList.contains("mapt")){
                    this.contactController.changeContact(inp.value, "mapPr", "text");
                } else {
                    this.contactController.changeContact(inp.value, "contact");
                }
            }
            par.setAttribute('data-st', '0');
        } else {
            inp.setAttribute("data-mod", '1');
        }
    }

    private onClose(e, inps: any, forceUpdate: any): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.parentElement.classList.contains(contactCSS.im) || par.parentElement.classList.contains(contactCSS.te)){
            par = par.parentElement;
            if(inps.edAddIm) {
                inps.addIm = inps.edAddIm;
                inps.edAddIm = undefined;
                forceUpdate();
            } else {
                par.setAttribute('data-st', '0');
            }
        }
    }

    public chStatB(e, inps: any): void {
        const el: HTMLInputElement = e.target;
        inps[el.id] = !el.validity.patternMismatch && el.value.length != 0;
        if (inps[el.id]) {
            el.setAttribute("data-mod", '0');
        } else {
            el.setAttribute("data-mod", '1');
        }
        const state: string = +inps[el.id] + "";
        el.parentElement.querySelector(".yes").setAttribute("data-enable", state);
    }

    private ele (x: boolean, nameProperty: string, inps: any): ReactElement {
        if(!inps[nameProperty]) inps[nameProperty] = x;
        return null;
    }

    public setTyp(typ: string): void {
        this.type = typ;
        this.contactController.didMount(typ);
    }

    public setActNew(name: any | number): void {
        this.gr.group = name;
    }

    public constructor(props) {
        super(props);
        ContactMain.chStatB = this.chStatB.bind(this);
        ContactMain.errorLoad = this.errorLoad.bind(this);
        ContactMain.getEdCon = this.getEdCon.bind(this);
        ContactMain.setActNew = this.setActNew.bind(this);
        ContactMain.setTyp = this.setTyp.bind(this);
    }

	public UNSAFE_componentWillMount(): void {
		const {statusStore, contactsStore} = this.context.stores;
		const {contactController} = this.context.controllers;
        this.cState = statusStore;
        this.contactsInfo = contactsStore;
        this.contactController = contactController;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount ContactMain");
        Main.setActivedForPanel(2);
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount ContactMain");
        this.contactController.willUnmount();
    }

    public render(): ReactElement {
        return <div className={contactCSS.AppHeader}>
            {(this.cState.auth && this.cState.role != 4) &&
                <div className={contactCSS.pane}>
                    <Pane gro={this.gr}/>
                </div>
            }
            <Outlet />
        </div>;
    }
}