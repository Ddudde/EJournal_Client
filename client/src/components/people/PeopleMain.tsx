import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../utils/context";
import type {NavigateFunction} from "react-router-dom";
import { Outlet} from "react-router-dom";
import Main from "../main/Main";
import peopleCSS from './peopleMain.module.css';
import Pane from "../other/pane/Pane";
import withRouterHOC from "../../utils/withRouterHOC";
import type StatusStore from "../../store/StatusStore";
import type EventsStore from "../../store/other/EventsStore";
import type PeopleController from "../../controllers/people/PeopleController";

interface Props {
    navigate?: any;
};

//todo: Связь с Parents, Teachers
@observer
class PeopleMain extends Component<Props> {
    static contextType = ContextStores;
    context: any;
    private cState: StatusStore;
    private evsIni: boolean;
    private navigate: NavigateFunction;
    private eventsInfo: EventsStore;
    private peopleController: PeopleController;
    private gr: any = {
        group: 0
    };
    public static sit: string = window.location.origin;
    public static ele;
    public static goToProf;
    public static setActNew;

    public copyLink(e, url: string, FIO: string): void {
        const title: string = "Внимание!";
        const text: string = "Ссылка-приглашение для " + FIO + " успешно скопирована в буфер обмена.";
        navigator.clipboard.writeText(url);
        this.eventsInfo.changeEvent(title, text, 10);
    }

    private gen_cod(): string{
        let password: string = "", i: number = 0;
        const symbols: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (i = 0; i < 15; i++){
            password += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        return password;
    }

    public refreshLink(e, type): void {
        const title: string = "Внимание!";
        const text: string = "Ссылка успешно обновлена"
        const inp: HTMLInputElement = e.target.parentElement.querySelector("input");
        if (inp.hasAttribute("data-id")) {
            const id: string[] = inp.getAttribute("data-id").split("_");
            if(type == CHANGE_PARENTS){
                codPar(id[1], title, text);
            } else {
                codTea(id[1], title, text);
            }
        } else if (inp.hasAttribute("data-id1")) {
            const id: string = inp.getAttribute("data-id1");
            dispatch(changePeople(type, 2, id, undefined, PeopleMain.sit + "/invite/" + this.gen_cod(), "link"));
            this.eventsInfo.changeEvent(title, text, 10);
        }
    }

    public onDel(e, type, info): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        if(par.classList.contains(peopleCSS.nav_iZag) && e.target.hasAttribute("data-id1")){
            const id: string = e.target.getAttribute("data-id1");
            if(type == CHANGE_PARENTS_DEL_L0) {
                dispatch(changePeople(type, id));
            }
            return;
        }
        if(!par.classList.contains(peopleCSS.pepl)) return;

        const inp: HTMLInputElement = par.querySelector("input:not([readOnly])");
        if (inp.hasAttribute("data-id")) {
            const id: string[] = inp.getAttribute("data-id").split("_");
            if(type == CHANGE_PARENTS_DEL) {
                if(Object.getOwnPropertyNames(info[id[0]].par).length < 2){
                    dispatch(changePeople(CHANGE_PARENTS_DEL_L0, id[0]));
                } else {
                    dispatch(changePeople(type, id[0], "par", id[1]));
                }
            } else {
                dispatch(changePeople(type, id[0], id[1]));
            }
        } else if(inp.hasAttribute("data-id1")){
            const id: string = inp.getAttribute("data-id1");
            if(type == CHANGE_PARENTS_DEL) {
                dispatch(changePeople(type, "nw", "par", id));
            } else {
                dispatch(changePeople(type, 2, id));
            }
        }
    }

    public onEdit(e): void {
        let par: HTMLElement = e.target.parentElement;
        if(par.classList.contains(peopleCSS.add)){
            par.setAttribute('data-st', '1');
        }
        if(par.parentElement.classList.contains(peopleCSS.pepl)){
            par = par.parentElement;
            par.setAttribute('data-st', '1');
        }
    }

    public onFin(e, inps: any, forceUpdate: any, type, info): void {
        let par: HTMLElement = e.target.parentElement;
        if (par.classList.contains(parentsCSS.upr)) {
            par = par.parentElement;
            addKid({...info.nw}, inps.nyid, par);
            par.setAttribute('data-st', '0');
            return;
        }
        if (par.classList.contains(peopleCSS.fi)){
            par = par.parentElement;
            if(type == CHANGE_PARENTS) {
                const inp: HTMLInputElement = par.querySelector("input");
                par = par.parentElement;
                if(inp.hasAttribute("data-id1")) {
                    const id: string = inp.getAttribute("data-id1");
                    const grop: string[] = info[id] && info[id].par ? Object.getOwnPropertyNames(info[id].par) : [];
                    const id1: string = grop.length == 0 ? "id0" : "id" + (parseInt(grop[grop.length-1].replace("id", "")) + 1);
                    dispatch(changePeople(type, id, "par", id1, inps.inpnpt));
                } else {
                    const grop: string[] = info.nw && info.nw.par ? Object.getOwnPropertyNames(info.nw.par) : [];
                    const id: string = grop.length == 0 ? "id0" : "id" + (parseInt(grop[grop.length-1].replace("id", "")) + 1);
                    dispatch(changePeople(type, "nw", "par", id, inps.inpnpt));
                }
                par.setAttribute('data-st', '0');
            } else if(type == CHANGE_TEACHERS) {
                par = par.parentElement;
                addTea(inps.inpnpt, par);
            } else {
                par = par.parentElement;
                dispatch(changePeople(type, 2, "id8", undefined, inps.inpnpt));
                par.setAttribute('data-st', '0');
            }
            return;
        }
        const inp: HTMLInputElement = par.querySelector("input");
        if (!inps[inp.id]) {
            inp.setAttribute("data-mod", '1');
            return;
        }
        inp.setAttribute("data-mod", '0');
        if(par.parentElement.classList.contains(peopleCSS.pepl)) {
            par = par.parentElement;
            if(type){
                if(inp.hasAttribute("data-id")){
                    const id: string[] = inp.getAttribute("data-id").split("_");
                    if(type == CHANGE_PARENTS) {
                        dispatch(changePeople(type, id[0], "par", id[1], inp.value));
                    } else {
                        dispatch(changePeople(type, id[0], id[1], undefined, inp.value));
                    }
                } else if(inp.hasAttribute("data-id1")){
                    const id: string = inp.getAttribute("data-id1");
                    if(type == CHANGE_PARENTS) {
                        dispatch(changePeople(type, "nw", "par", id, inp.value));
                    } else {
                        dispatch(changePeople(type, 2, id, undefined, inp.value));
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
        if(par.parentElement.classList.contains(peopleCSS.pepl)){
            if(par.classList.contains(peopleCSS.fi) || type) {
                par = par.parentElement.parentElement;
            } else {
                par = par.parentElement;
            }
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

    public ele (x: boolean, par: string, inps: any): ReactElement {
        if(!inps[par]) inps[par] = x;
        return null;
    }

    public goToProf(login: string): void {
        if(login) this.navigate(Main.prefSite + "/profiles/" + login);
    }

    public setActNew(name: number | any): void {
        this.gr.group = name;
    }

    public setEvGr(): void {
        if(!this.evsIni) {
            this.evsIni = true;
            this.peopleController.didMount();
        }
    }

    private updatePanel(): void {
        this.gr.groups = {
            0: this.cState.auth && (this.cState.role < 2 || this.cState.role == 3) ? {
                nam: "Педагоги",
                linke: "teachers"
            } : undefined,
            1: this.cState.auth ? {
                nam: "Завучи",
                linke: "hteachers"
            } : undefined,
            2: this.cState.auth && (this.cState.role == 0 || this.cState.role == 3) ? {
                nam: this.cState.role == 3 ? "Обучающиеся" : "Одноклассники",
                linke: "class"
            } : undefined,
            3: this.cState.auth && (this.cState.role == 0 || this.cState.role == 3) ? {
                nam: "Родители",
                linke: "parents"
            } : undefined,
            4: {
                nam: "Администраторы портала",
                linke: "admins"
            }
        };
    }

    public constructor(props: Props) {
        super(props);
        this.navigate = props.navigate;
        this.setStaticForHOC();
    }

    private setStaticForHOC(): void {
        HOC.sit = PeopleMain.sit;
        HOC.setActNew = this.setActNew.bind(this);
        HOC.goToProf = this.goToProf.bind(this);
        HOC.ele = this.ele.bind(this);
    }

	public UNSAFE_componentWillMount(): void {
		const {statusStore, eventsStore} = this.context.stores;
		const {peopleController} = this.context.controllers;
        this.cState = statusStore;
        this.eventsInfo = eventsStore;
        this.peopleController = peopleController;
        this.updatePanel();
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount PeopleMain");
        Main.setActivedForPanel(3);
    }

    public componentWillUnmount(): void {
        this.peopleController.willUnmount();
        this.evsIni = false;
        console.log("I was triggered during componentWillUnmount PeopleMain.jsx");
    }

    public UNSAFE_componentWillUpdate(): void {
        this.updatePanel();
        console.log('componentWillUpdate PeopleMain.jsx');
    }

    public render(): ReactElement {
        return <div className={peopleCSS.AppHeader}>
            <div style={{width:"inherit", height: "7vh", position: "fixed", zIndex:"1"}}>
                <Pane gro={this.gr}/>
            </div>
            <Outlet />
        </div>;
    }
}

const HOC = withRouterHOC(PeopleMain);

function setStaticForHOC() {
    return HOC;
}

export default setStaticForHOC();