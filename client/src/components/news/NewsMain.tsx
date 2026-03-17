import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../utils/context";
import newsCSS from './newsMain.module.css';
import ed from "../../media/edit.png";
import yes from "../../media/yes.png";
import no from "../../media/no.png";
import {Outlet} from "react-router-dom";
import Pane from "../other/pane/Pane";
import Main from "../main/Main";
import type NewsStore from "../../store/NewsStore";
import type StatusStore from "../../store/StatusStore";
import type NewsController from "../../controllers/NewsController";

interface Props {
};

@observer
export default class NewsMain extends Component {
    static contextType = ContextStores;
    context: any;
    private newsInfo: NewsStore;
    private cState: StatusStore;
    private newsController: NewsController;
    private type: string = "Por";
    private gr = {
        group: 0,
        groups: {
            0: {
                nam: "Объявления портала",
                linke: "por"
            },
            1: {
                nam: "Объявления учебного центра",
                linke: "yo"
            }
        }
    };
    static chStatB: (e, inps: any) => void;
    static errorLoad: (e) => void;
    static getAdd: (inps: any, forceUpdate: any, id?: string) => ReactElement;
    static setActNew: (name: any) => void;
    static setTyp: (value: string) => void;

    private getEdField(edFi: ReactElement, titleEd: string, id: string, inf: string, inp: string, inps: any, forceUpdate: any, placeholder?: string, pattern?: string): ReactElement {
        return (<>
            <div className={newsCSS.fi}>
                {edFi}
                {titleEd != "Ссылка:" && <img className={newsCSS.imgfield} src={ed} onClick={(e)=>this.onEdit(e, inps, forceUpdate)} title="Редактировать" alt=""/>}
            </div>
            <div className={newsCSS.ed}>
                <div className={newsCSS.preinf}>
                    {titleEd}
                </div>
                {edFi.type == "pre" ?
                        <textarea className={newsCSS.inp+" "+newsCSS.inparea} id={inp} placeholder={placeholder} defaultValue={inf} data-id={id} onChange={(e)=>this.chStatB(e, inps)}/>
                    :
                        <input className={newsCSS.inp} id={inp} placeholder={placeholder} pattern={pattern} defaultValue={inf} data-id={id} onChange={(e)=>this.chStatB(e, inps)}/>
                }
                {this.ele(false, inp, inps)}
                <img className={newsCSS.imginp+" yes "} src={yes} onClick={(e)=>this.onFin(e, inps, forceUpdate, id)} title="Подтвердить" alt=""/>
                <img className={newsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={(e)=>this.onClose(e, inps, forceUpdate, id)} title="Отменить изменения и выйти из режима редактирования" alt=""/>
            </div>
        </>)
    }

    public getAdd(inps: any, forceUpdate: any, id?: string): ReactElement {
        const zag: string = id ? this.newsInfo[this.type][id].title : inps.inpnzt;
        const zagFi: ReactElement = <h2 className={newsCSS.zag}>
            {zag}
        </h2>;
        const dat: string = id ? this.newsInfo[this.type][id].date : inps.inpndt;
        const datFi: ReactElement = <span className={newsCSS.date}>
            {dat}
        </span>;
        const imgURL: string = id ? this.newsInfo[this.type][id].img_url : inps.addIm;
        const imiFi: ReactElement = <div className={newsCSS.banner}>
            <div>
                Изображение
            </div>
            <img className={newsCSS.imgfield} src={ed} onClick={(e)=>this.onEdit(e, inps, forceUpdate)} title="Редактировать" alt=""/>
        </div>;
        const tex: string = id ? this.newsInfo[this.type][id].text : inps.inpntt;
        const texFi: ReactElement = <pre className={newsCSS.field}>
            {tex}
        </pre>;
        const edFi: ReactElement = (
            <div className={newsCSS.ns}>
                <div className={newsCSS.za} data-st="0">
                    {this.getEdField(zagFi, "Заголовок:", id, zag, "inpnzt_" + (id?id:""), inps, forceUpdate)}
                </div>
                <div className={newsCSS.da} data-st="0">
                    {this.getEdField(datFi, "Дата:", id, dat, "inpndt_" + (id?id:""), inps, forceUpdate, "ДД.ММ.ГГГГ", "^[0-9.]+$")}
                </div>
                <div className={newsCSS.te} data-st="0">
                    {imgURL ?
                            <span className={newsCSS.banner}>
                                <img alt="banner" data-id={id} src={imgURL} onError={(e)=>this.errLoadAddIm(e, inps, forceUpdate)}/>
                                <div className={newsCSS.upr}>
                                    <img className={newsCSS.imgfield} src={ed} onClick={(e)=>this.onEdit(e, inps, forceUpdate)} title="Редактировать" alt=""/>
                                    <img className={newsCSS.imginp} style={{marginRight: "1vw"}} src={no} onClick={(e)=>this.onDel(e, inps, forceUpdate)} title="Удалить изображение" alt=""/>
                                </div>
                            </span>
                        :
                            <div className={newsCSS.im} data-st={(id ? this.newsInfo[this.type][id].edImg_url : inps.edAddIm) ? "1" : "0"}>
                                {this.getEdField(imiFi, "Ссылка:", id, (id ? this.newsInfo[this.type][id].edImg_url : inps.edAddIm), "inpnit_" + (id?id:""), inps, forceUpdate, "/media/tuman.jpg")}
                            </div>
                    }
                    {this.getEdField(texFi, "Текст:", id, tex, "inpntt_" + (id?id:""), inps, forceUpdate)}
                </div>
                <div className={newsCSS.upr} data-id={id}>
                    {!id && <img className={newsCSS.imginp+" yes "} src={yes} onClick={(e)=>this.onFin(e, inps, forceUpdate)} title="Подтвердить" alt=""/>}
                    <img className={newsCSS.imginp+" "} style={{marginRight: "1vw"}} src={no} onClick={(e)=>this.onClose(e, inps, forceUpdate)} title={id ? "Удалить новость" : "Отменить изменения и выйти из режима редактирования"} alt=""/>
                </div>
            </div>
        );
        return id ? (edFi) : (
            <div className={newsCSS.news_line} data-st="0">
                <div className={newsCSS.nav_i+" "+newsCSS.link} id={newsCSS.nav_i} onClick={(e)=>this.onEdit(e, inps, forceUpdate)}>
                    Добавить новость
                </div>
                {edFi}
            </div>
        )
    }

    public errorLoad(e): void {
        e.target.style.display = 'none';
    }

    private errLoadAddIm(e, inps: any, forceUpdate: any): void {
        if (e.target.hasAttribute("data-id")) {
            this.newsInfo.changeNewsParam(this.type, e.target.getAttribute("data-id"), "img_url", "");
        } else {
            inps.addIm = undefined;
            forceUpdate();
        }
    }

    private onDel(e, inps: any, forceUpdate: any): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        if(!par.classList.contains(newsCSS.banner)) return;

        const ima: HTMLElement = par.querySelector("img");
        if (ima.hasAttribute("data-id")) {
            this.newsController.changeNews(ima.getAttribute("data-id"), "", "img_url");
        } else {
            inps.addIm = undefined;
            forceUpdate();
        }
    }

    private onEdit(e, inps: any, forceUpdate: any): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.classList.contains(newsCSS.news_line)){
            par.setAttribute('data-st', '1');
        }
        if(par.parentElement.classList.contains(newsCSS.im) || par.parentElement.classList.contains(newsCSS.te) || par.parentElement.classList.contains(newsCSS.da) || par.parentElement.classList.contains(newsCSS.za)){
            par = par.parentElement;
            par.setAttribute('data-st', '1');
        }
        if(par.parentElement.parentElement.classList.contains(newsCSS.im)){
            par = par.parentElement.parentElement;
            par.setAttribute('data-st', '1');
        }
        if(!par.classList.contains(newsCSS.upr)) return;

        const ima: HTMLElement = par.parentElement.querySelector("img");
        if (ima.hasAttribute("data-id")) {
            const objNews: any = this.newsInfo[this.type][ima.getAttribute("data-id")];
            objNews.edImg_url = objNews.img_url;
            objNews.img_url = undefined;
            this.newsInfo.changeNews(this.type, ima.getAttribute("data-id"), objNews);
        } else {
            inps.edAddIm = inps.addIm;
            inps.addIm = undefined;
            forceUpdate();
        }
    }

    private onFin(e, inps: any, forceUpdate: any, id?: string): void {
        let par: HTMLElement = e.target.parentElement;
        const bul: boolean = par.parentElement.classList.contains(newsCSS.te);
        const inp: HTMLTextAreaElement | HTMLInputElement = par.querySelector(bul ? "textarea" : "input");
        if(par.classList.contains(newsCSS.upr)){
            this.newsController.addNews(inps);
            return;
        }
        if (!inps[inp.id]) {
            inp.setAttribute("data-mod", '1');
            return;
        }
        inp.setAttribute("data-mod", '0');
        if(par.parentElement.classList.contains(newsCSS.im)) {
            if (inps.edAddIm) inps.edAddIm = undefined;
            if (this.newsInfo[this.type][id].edImg_url) {
                this.newsInfo.changeNewsParam(this.type, id, "edAddIm", undefined);
            }
            if (inp.hasAttribute("data-id")) {
                this.newsController.changeNews(inp.getAttribute("data-id"), inp.value, "img_url");
            } else {
                inps.addIm = inp.value;
                forceUpdate();
            }
        }
        if(bul) {
            par = par.parentElement;
            if(inp.hasAttribute("data-id")){
                this.newsController.changeNews(inp.getAttribute("data-id"), inp.value, "text");
            }else {
                inps.inpntt = inp.value;
                forceUpdate();
            }
        }
        if(par.parentElement.classList.contains(newsCSS.da)){
            par = par.parentElement;
            if(inp.hasAttribute("data-id")){
                this.newsController.changeNews(inp.getAttribute("data-id"), inp.value, "date");
            }else {
                inps.inpndt = inp.value;
                forceUpdate();
            }
        }
        if(par.parentElement.classList.contains(newsCSS.za)){
            par = par.parentElement;
            if(inp.hasAttribute("data-id")){
                this.newsController.changeNews(inp.getAttribute("data-id"), inp.value, "title");
            }else{
                inps.inpnzt = inp.value;
                forceUpdate();
            }
        }
        par.setAttribute('data-st', '0');
    }

    private onClose(e, inps: any, forceUpdate: any, id?: string): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.classList.contains(newsCSS.upr)){
            if (par.hasAttribute("data-id")) {
                this.newsController.deleteNews(par.getAttribute("data-id"));
            }else {
                par = par.parentElement.parentElement;
                par.setAttribute('data-st', '0');
            }
        }
        par = par.parentElement;
        if(!par.classList.contains(newsCSS.im) && !par.classList.contains(newsCSS.te)
            && !par.classList.contains(newsCSS.da) && !par.classList.contains(newsCSS.za)){
            return;
        }
        if(id) {
            const objNews: any = this.newsInfo[this.type][id];
            objNews.img_url = objNews.edImg_url;
            objNews.edImg_url = undefined;
            this.newsInfo.changeNews(this.type, id, objNews);
        } else if(inps.edAddIm) {
            inps.addIm = inps.edAddIm;
            inps.edAddIm = undefined;
            forceUpdate();
        } else {
            par.setAttribute('data-st', '0');
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
        el.parentElement.querySelector(".yes")
            .setAttribute("data-enable", state);
    }

    private ele (value: boolean, nameProperty: string, inps: any): ReactElement {
        if(!inps[nameProperty]) inps[nameProperty] = value;
        return null;
    }

    public setTyp(value: string): void {
        this.type = value;
        this.newsController.didMount(this.type);
    }

    public setActNew(name: number | any): void {
        this.gr.group = name;
    }

    public constructor(props) {
        super(props);
        NewsMain.chStatB = this.chStatB.bind(this);
        NewsMain.errorLoad = this.errorLoad.bind(this);
        NewsMain.getAdd = this.getAdd.bind(this);
        NewsMain.setActNew = this.setActNew.bind(this);
        NewsMain.setTyp = this.setTyp.bind(this);
    }

	public UNSAFE_componentWillMount(): void {
		const {statusStore, newsStore} = this.context.stores;
		const {newsController} = this.context.controllers;
        this.cState = statusStore;
        this.newsInfo = newsStore;
        this.newsController = newsController;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount NewsMain");
        Main.setActivedForPanel(1);
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount NewsMain.jsx");
        this.newsController.willUnmount();
    }

    public render(): ReactElement {
        return <div className={newsCSS.AppHeader}>
            {(this.cState.auth && this.cState.role != 4) &&
                <div className={newsCSS.pane}>
                    <Pane gro={this.gr}/>
                </div>
            }
            <Outlet />
        </div>;
    }
}