import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../utils/context";
import analyticsCSS from './analyticsMain.module.css';
import {Outlet} from "react-router-dom";
import Pane from "../other/pane/Pane";
import Main from "../main/Main";
import type StatusStore from "../../store/StatusStore";
import type PanelStore from "../../store/other/PanelStore";

interface Props {
    comp?: any;
};

@observer
export default class AnalyticsMain extends Component<Props> {
    static contextType = ContextStores;
    context: any;
    private cState: StatusStore;
    private ke: number;
    private panelInfo: PanelStore;
    private gr: any = {
        group: 0
    }
    public static chStatB: (e, inps: any, upd?: any | Function) => void;
    public static ele: (value: boolean, nameProperty: string, inps: any)=>ReactElement;
    public static onClose: (e, type?)=>void;
    public static onEdit: (e)=>void;
    public static setActNew: (name: string | number)=>void;

    public onDel(e, type): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        if(par.classList.contains(analyticsCSS.edbl)){
            const inp: HTMLInputElement = par.querySelector("input");
            if (inp.hasAttribute("data-id")) {
                const id: string[] = inp.getAttribute("data-id").split("_");
                if(type == CHANGE_PERIODS_DEL) {
                    dispatch(changeAnalytics(type, "prs", id[0]));
                }
            }
        }
    }

    public onEdit(e): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.classList.contains(analyticsCSS.add)){
            par.setAttribute('data-st', '1');
        }
        if(par.parentElement.classList.contains(analyticsCSS.edbl)){
            par = par.parentElement;
            par.setAttribute('data-st', '1');
        }
    }

    public onFin(e, inps: any, forceUpdate: any | Function, type): void {
        let par: HTMLElement = e.target.parentElement;
        const inp:HTMLInputElement = par.querySelector("input");
        if(par.classList.contains(analyticsCSS.edbl)){
            if(type == CHANGE_PERIODS_L1){
                const inpm: string[] = ["inpnnt_", "inpnit_", "inpnit1_"];
                if(inps.inpnnt_ && inps.inpnit_ && inps.inpnit1_)
                {
                    addPer(inps.inpnnt_, inps.inpnit_, inps.inpnit1_);
                } else {
                    for(let i = 0; i < inpm.length; i++) {
                        const inpf: HTMLElement = document.querySelector("." + analyticsCSS.edbl + " *[id='" + inpm[i] + "']");
                        inpf.setAttribute("data-mod", '1');
                    }
                }
                return;
            }
        }
        if (!inps[inp.id]) {
            inp.setAttribute("data-mod", '1');
        }
        inp.setAttribute("data-mod", '0');
        if(par.parentElement.classList.contains(analyticsCSS.edbl)) {
            par = par.parentElement;
            if(type){
                if(inp.hasAttribute("data-id")){
                    const id: string[] = inp.getAttribute("data-id").split("_");
                    if(type == CHANGE_PERIODS) {
                        dispatch(changeAnalytics(type, "prs", id[0], id[1], inp.value));
                    }
                }
            } else {
                inps.inpnpt = inp.value;
                forceUpdate();
            }
        }
        par.setAttribute('data-st', '0');
    }

    public onClose(e, type): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.parentElement.classList.contains(analyticsCSS.edbl)){
            if(par.classList.contains(analyticsCSS.fi) || type) {
                par = par.parentElement.parentElement;
            } else {
                par = par.parentElement;
            }
            par.setAttribute('data-st', '0');
        } else if(par.classList.contains(analyticsCSS.edbl)) {
            par = par.parentElement;
            par.setAttribute('data-st', '0');
        }
    }

    public chStatB(e, inps: any, upd?: any | Function): void {
        const el: HTMLInputElement = e.target;
        inps[el.id] = !el.validity.patternMismatch ? el.value : false;
        if (inps[el.id]) {
            el.setAttribute("data-mod", '0');
        } else {
            el.setAttribute("data-mod", '1');
        }
        if(upd) upd();
        const ye: HTMLElement = el.parentElement.querySelector(".yes");
        if(ye) {
            const state: string = +inps[el.id] + "";
            ye.setAttribute("data-enable", state);
        }
    }

    public ele (value: boolean, nameProperty: string, inps: any): ReactElement {
        if(!inps[nameProperty]) inps[nameProperty] = value;
        return null;
    }

    public setActNew(name: string | number): void {
        this.gr.group = name;
    }

    private updatePanel(): void {
        this.gr.groups = {
            0: {
                nam: "Расписание звонков",
                linke: "zvonki"
            },
            1: {
                nam: (this.cState.auth && this.cState.role < 2) ? "Расписание периодов" : "Периоды обучения",
                linke: "periods"
            },
            2: {
                nam: (this.cState.auth && this.cState.role < 2) ? "Расписание" : "Дисциплины",
                linke: "schedule"
            },
            3: this.cState.auth && this.cState.role < 2 ? {
                nam: "Журнал",
                linke: "journal"
            } : undefined,
            4: this.cState.auth && this.cState.role < 2 ? {
                nam: "Итоговые оценки",
                linke: "marks"
            } : undefined
        };
    }

    public constructor(props: Props) {
        super(props);
        AnalyticsMain.chStatB = this.chStatB.bind(this);
        AnalyticsMain.ele = this.ele.bind(this);
        AnalyticsMain.onClose = this.onClose.bind(this);
        AnalyticsMain.onEdit = this.onEdit.bind(this);
        AnalyticsMain.setActNew = this.setActNew.bind(this);
    }

    public UNSAFE_componentWillMount(): void {
        const {statusStore, panelStore} = this.context.stores;
        this.cState = statusStore;
        this.panelInfo = panelStore;
        this.updatePanel();
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount AnalyticsMain");
        Main.setActivedForPanel(this.cState.role == 3 ? 10 : 14);
    }

    public UNSAFE_componentWillUpdate(): void {
        console.log("I was triggered during componentWillUpdate AnalyticsMain");
        this.updatePanel();
    }

    public render(): ReactElement {
        return <div className={analyticsCSS.AppHeader}>
            <div style={{width:"inherit", height: "7vh", position: "fixed", zIndex:"1"}} ref={()=>(this.ke = !this.ke ? this.panelInfo.els.length : this.ke)}>
                <Pane gro={this.gr}/>
            </div>
            <Outlet />
            {this.props.comp && this.props.comp}
        </div>;
    }
}