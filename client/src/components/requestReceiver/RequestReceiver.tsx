import type { ReactElement} from "react";
import {Component} from "react";
import Main from "../main/Main";
import {Helmet} from "react-helmet-async";
import requestCSS from './request.module.css';
import {observer} from "mobx-react";
import yes from "../../media/yes.png";
import no from "../../media/no.png";
import ed from "../../media/edit.png";
import { ContextStores } from "../../utils/context";
import ErrFound from "../other/error/ErrFound";
import type RequestStore from "../../store/RequestStore";
import type EventsStore from "../../store/other/EventsStore";
import type RequestController from "../../controllers/RequestController";

interface Props {
};

@observer
export default class RequestReceiver extends Component {
    static contextType = ContextStores;
    context: any;
    private requestInfo: RequestStore;
    private eventsStore: EventsStore;
    private requestController: RequestController;
    private inps = {inpntt : "Текст", inpnzt : "Заголовок", inpndt: new Date().toLocaleString("ru", {day:"2-digit", month: "2-digit", year:"numeric"})};
    private errText: string = "Заявок нет...";

    private getEdField(edFi: ReactElement, titleEd: string, id: string, inf: string, inp: string, placeholder?: string, pattern?: string): ReactElement {
        return (<>
            <div className={requestCSS.fi}>
                {edFi}
                <img className={requestCSS.imgfield} src={ed} onClick={this.onEdit} title="Редактировать" alt=""/>
            </div>
            <div className={requestCSS.ed}>
                <div className={requestCSS.preinf}>
                    {titleEd}
                </div>
                {edFi.type == "pre" ?
                    <textarea className={requestCSS.inp+" "+requestCSS.inparea} id={inp} placeholder={placeholder} defaultValue={inf} data-id={id} onChange={this.chStatB}/>
                    :
                    <input className={requestCSS.inp} id={inp} placeholder={placeholder} pattern={pattern} defaultValue={inf} data-id={id} onChange={this.chStatB}/>
                }
                {this.ele(false, inp)}
                <img className={requestCSS.imginp+" yes "} src={yes} onClick={this.onFin} title="Подтвердить" alt=""/>
                <img className={requestCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={this.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
            </div>
        </>)
    }

    private getAdd(id: string): ReactElement {
        const zag: string = this.requestInfo.info[id].title;
        const zagFi: ReactElement = <h2 className={requestCSS.zag}>
            {zag}
        </h2>;
        const dat: string = this.requestInfo.info[id].date;
        const datFi: ReactElement = <span className={requestCSS.date}>
            {dat}
        </span>;
        const tex: string = this.requestInfo.info[id].text;
        const texFi: ReactElement = <pre className={requestCSS.field}>
            {tex}
        </pre>;
        const edFi: ReactElement = (
            <div className={requestCSS.ns}>
                <div className={requestCSS.za} data-st="0">
                    {this.getEdField(zagFi, "Заголовок:", id, zag, "inpnzt_" + (id?id:""))}
                </div>
                <div className={requestCSS.da} data-st="0">
                    {this.getEdField(datFi, "Дата:", id, dat, "inpndt_" + (id?id:""), "ДД.ММ.ГГГГ", "^[0-9.]+$")}
                </div>
                <div className={requestCSS.te} data-st="0">
                    {this.getEdField(texFi, "Текст:", id, tex, "inpntt_" + (id?id:""))}
                </div>
                <div className={requestCSS.upr} data-id={id}>
                    <img className={requestCSS.imginp+" "} style={{marginRight: "1vw"}} src={no} onClick={this.onDel} title="Удалить заявку" alt=""/>
                </div>
            </div>
        );
        return edFi
    }

    private onEdit(e): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.classList.contains(requestCSS.line)){
            par.setAttribute('data-st', '1');
        }
        if(par.parentElement.classList.contains(requestCSS.te) || par.parentElement.classList.contains(requestCSS.da) || par.parentElement.classList.contains(requestCSS.za)){
            par = par.parentElement;
            par.setAttribute('data-st', '1');
        }
        if(par.parentElement.parentElement.classList.contains(requestCSS.im)){
            par = par.parentElement.parentElement;
            par.setAttribute('data-st', '1');
        }
    }

    private onFin(e): void {
        let par: HTMLElement = e.target.parentElement;
        const bul: boolean = par.parentElement.classList.contains(requestCSS.te);
        const inp: HTMLTextAreaElement | HTMLInputElement = par.querySelector(bul ? "textarea" : "input");
        if (!this.inps[inp.id]) {
            inp.setAttribute("data-mod", '1');
            return;
        }
        inp.setAttribute("data-mod", '0');
        if(bul) {
            par = par.parentElement;
            this.requestController.changeText(inp.getAttribute("data-id"), inp.value);
        }
        if(par.parentElement.classList.contains(requestCSS.da)){
            par = par.parentElement;
            this.requestController.changeDate(inp.getAttribute("data-id"), inp.value);
        }
        if(par.parentElement.classList.contains(requestCSS.za)){
            par = par.parentElement;
            this.requestController.changeTitle(inp.getAttribute("data-id"), inp.value);
        }
        par.setAttribute('data-st', '0');
    }

    private onDel(e): void {
        const par: HTMLElement = e.target.parentElement;
        if(par.classList.contains(requestCSS.upr) && par.hasAttribute("data-id")){
            this.requestController.deleteRequest(par.getAttribute("data-id"));
        }
    }

    private onClose(e): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.parentElement.classList.contains(requestCSS.te) || par.parentElement.classList.contains(requestCSS.da) || par.parentElement.classList.contains(requestCSS.za)){
            par = par.parentElement;
            par.setAttribute('data-st', '0');
        }
        if(par.classList.contains(requestCSS.upr)){
            par = par.parentElement.parentElement;
            par.setAttribute('data-st', '0');
        }
    }

    public async getInfo(): Promise<void> {
        await this.requestController.getInfo();
        for(const el of document.querySelectorAll("." + requestCSS.ed + " > *[id^='inpn']")){
            this.chStatB({target: el});
        }
    }

    private chStatB(e): void {
        const el: HTMLInputElement = e.target;
        this.inps[el.id] = !el.validity.patternMismatch && el.value.length != 0;
        el.setAttribute("data-mod", this.inps[el.id] ? '0' : '1');
        const state: string = +this.inps[el.id] + "";
        el.parentElement.querySelector(".yes")
            .setAttribute("data-enable", state);
    }

    private ele (value: boolean, nameProperty: string): ReactElement {
        if(!this.inps[nameProperty]) this.inps[nameProperty] = value;
        return null;
    }
    
    public UNSAFE_componentWillMount(): void {
        const {eventsStore, requestStore} = this.context.stores;
        const {requestController} = this.context.controllers;
        this.eventsStore = eventsStore;
        this.requestInfo = requestStore;
        this.requestController = requestController;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount RequestReceiver");
        Main.setActivedForPanel(11);
        this.requestController.didMount(this.getInfo.bind(this));
    }

    public componentWillUnmount(): void {
        this.eventsStore.clearEvents();
        this.requestController.willUnmount();
        console.log("I was triggered during componentWillUnmount RequestReceiver");
    }

    public render(): ReactElement {
        return <div className={requestCSS.header}>
            <Helmet>
                <title>Заявки</title>
            </Helmet>
            {Object.getOwnPropertyNames(this.requestInfo.info).length == 0 ?
                    <ErrFound text={this.errText}/>
                :
                    <div className={requestCSS.block}>
                        <section className={requestCSS.center_colum}>
                            {Object.getOwnPropertyNames(this.requestInfo.info).reverse().map((id: string) =>
                                <div className={requestCSS.line} data-st="1" key={id}>
                                    {this.getAdd(id)}
                                </div>
                            )}
                        </section>
                    </div>
            }
        </div>;
    }
}