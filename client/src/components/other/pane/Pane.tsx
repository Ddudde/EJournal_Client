import type { ReactElement} from "react";
import React, {Component} from "react";
import {observer} from "mobx-react";
import paneCSS from './pane.module.css';
import {Link} from "react-router-dom";
import yes from "../../../media/yes.png";
import no from "../../../media/no.png";
import ed from "../../../media/edit.png";
import { ContextStores } from "../../../utils/context";
import type StatusStore from "../../../store/StatusStore";
import type PanelStore from "../../../store/other/PanelStore";
import type GroupStore from "../../../store/GroupStore";
import type EventsStore from "../../../store/other/EventsStore";
import PanJs from "./PanJs";
import type PeopleController from "../../../controllers/people/PeopleController";

interface Props {
    cla?: any;
    gro?: any;
    main?: any;
};

@observer
export default class Pane extends Component<Props> {
    static contextType = ContextStores;
    context: any;
    private cState: StatusStore;
    private panelInfo: PanelStore;
    private groupsInfo: GroupStore;
    private panJs: PanJs;
    private eventsInfo: EventsStore;
    private peopleController: PeopleController;
    private kel: number = 0;

    private ele(x: boolean, par: string): ReactElement {
        if(!this.panJs.inps[par]) this.panJs.inps[par] = x;
        return null;
    }

    private getPan(name: any | string, namecl: string, link: string, fun: any): ReactElement {
        const cla = [paneCSS.nav_i, paneCSS.nav_iJur, namecl].join(" ");
        const refer = el=>this.panJs.gr[namecl]=el;
        // const refer = el=>console.log("ref", namecl, el);
        return link ?
                <Link className={cla} id={paneCSS.nav_i} to={link} onClick={fun} data-id={namecl} key={namecl} ref={refer}>
                    {name.nam}
                </Link>
            :
                <div className={cla} id={paneCSS.nav_i} onClick={fun} data-id={namecl} key={namecl} data-st="0" ref={refer}>
                    {this.props.cla && this.cState.role == 3 ?
                        <>
                            <div className={paneCSS.field+" "+paneCSS.fi}>
                                {name}
                            </div>
                            <img className={paneCSS.imgfield+" "+paneCSS.fi} src={ed} onClick={this.onEdGr} title="Редактировать" alt=""/>
                            <img className={paneCSS.imginp+" "+paneCSS.fi} src={no} onClick={this.onDel} title="Удалить группу" alt=""/>
                        </> : name
                    }
                </div>
    }

    private overpan(): void {
        this.panJs.eles = [];
        if(this.panJs.lGroupY) {
            let el: string;
            for(el of this.panJs.lGroupY) {
                if(this.panJs.gr[el] && this.panJs.gr[el].style.display) {
                    this.panJs.gr[el].style.display = "";
                }
            }
        }
        if(!this.panJs.refes.mor) {
            this.panJs.refes.mor = {style: {}};
        }
        const lst: string = this.panJs.refes.mor.style.display;
        this.panJs.refes.mor.style.display = "none";
        if(this.panJs.refes.lin) {
            this.panJs.refes.lin.style.display = "none";
        }
        let wid = this.panJs.nav.scrollWidth - this.panJs.nav.getBoundingClientRect().width;
        if(wid > 1 && this.panJs.lGroupY.length > 4) {
            let i1: number = 3;
            let i: number = this.panJs.lGroupY.length-1;
            for(; i > 0; i--) {
                if(wid < 1) {
                    if(i1 < 1) {
                        break;
                    } else i1--;
                }
                const el1: HTMLElement = this.panJs.gr[this.panJs.lGroupY[i]];
                const el2: ReactElement = this.panJs.gr1[this.panJs.lGroupY[i]];
                wid -= el1.getBoundingClientRect().width;
                this.panJs.eles[this.panJs.eles.length] = React.cloneElement(el2, {className: el2.props.className+" "+paneCSS.pred});
                el1.style.display = "none";
            }
            this.panJs.lel = this.panJs.gr[this.panJs.lGroupY[i--]];
            this.panJs.refes.mor.style.display = lst;
            this.updMor();
        } else {
            this.panJs.refes.mor.style.display = lst;
        }
        if(this.panJs.refes.lin) {
            this.panJs.refes.lin.style.display = "";
        }
    }

    private updateGroup(): void {
        if(this.panJs.info && this.panJs.info.groups[this.panJs.info.group]){
            this.setActivedMy(this.panJs.info.group);
            return;
        }
        if(this.panJs.lGroups && this.panJs.lGroups.length == 0){
            if(this.panJs.refes.lin) {
                this.panJs.refes.lin.style.width = "0";
            }
        } else {
            this.setActivedMy(this.props.main ? undefined : this.panJs.lGroups[0]);
        }
    }

    private updMor(): void {
        if(this.panJs.eles.length == 0) return; 

        this.panJs.refes.lmor = this.getMore(this.panJs.eles);
        this.panJs.parb.updf = true;
        this.forceUpdate();
        this.panJs.refes.mor.style.display = "flex";
    }

    private getMore(el: ReactElement[]): ReactElement[] {
        const bol: string = this.panJs.lel.getBoundingClientRect().width < 50 ? "200%" : "100%";
        this.panJs.refes.MMel.style.minWidth = bol;
        this.panJs.refes.MMel.style.marginRight = bol;
        return el.map(par => par);
    }

    private replGr(x: HTMLElement): void {
        let i: number;
        const elc: ReactElement = this.panJs.gr1[this.panJs.lel.dataset.id];
        const elr: ReactElement = React.cloneElement(elc, {className: elc.props.className+" "+paneCSS.pred});
        for (i = 0; i < this.panJs.eles.length; i++) {
            if(this.panJs.eles[i].props["data-id"] == x.dataset.id) {
                this.panJs.eles[i] = elr;
            }
        }
        this.panJs.lel.style.display = "none";
        x.style.display = "";
        this.panJs.lel = x;
        this.updMor();
    }

    private setActivedMy(name: string): void {
        const ao: HTMLElement = this.panJs.gr[this.panJs.act];
        const an: HTMLElement = this.panJs.gr[name];
        if(ao) ao.dataset.act = '0';
        if(!an) return;

        this.panJs.act = name;
        an.dataset.act = '1';
        if(an.style.display == "none") this.replGr(an);
        if(this.panJs.refes.lin) {
            this.panJs.refes.lin.style.left = an.getBoundingClientRect().left+"px";
            this.panJs.refes.lin.style.width = an.getBoundingClientRect().width+"px";
        }
    }

    private preTim(): void {
        if(this.panJs.parb.resiz) return;

        this.panJs.parb.resiz = true;
        this.panJs.timid = setTimeout(this.tim.bind(this),1000);
    }

    private tim(): void {
        if (!this.panJs.parb.resiz) return;

        this.panJs.parb.resiz = false;
        this.overpan();
        this.updateGroup();
    }

    private onEdit(e): void {
        const par: HTMLElement = e.target.parentElement;
        par.dataset.st = '1';
    }

    private onFin(e): void {
        let par: HTMLElement = e.target.parentElement;
        const inp: HTMLInputElement = par.querySelector("input");
        par = par.parentElement;
        if(!this.panJs.inps[inp.id]) return;

        if(this.panJs.edGr){
            if(this.props.cla) {
                this.peopleController.changeGroup(this.panJs.edGr, inp.value, par);
            } else {
                this.panelInfo.changePaneGroups(this.panJs.ke, inp.value, this.panJs.edGr);
                par.dataset.st = '0';
            }
            this.panJs.edGr = undefined;
            this.panJs.blockCl = false;
        } else {
            if(this.props.cla) {
                this.peopleController.addGroup(inp.value, par);
            } else {
                const groupId: number = this.panJs.lGroups.length == 0 ? 0 : parseInt(this.panJs.lGroups[this.panJs.lGroups.length - 1]) + 1;
                this.panelInfo.changePaneGroups(this.panJs.ke, inp.value, groupId);
                par.dataset.st = '0';
            }
        }
    }

    private onClose(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        par.dataset.st = '0';
        this.panJs.edGr = undefined;
        this.panJs.blockCl = false;
    }

    private onEdGr(e): void {
        const par: HTMLElement = e.target.parentElement;
        this.panJs.blockCl = true;
        this.panJs.panAdd.dataset.st = '1';
        const inp: HTMLInputElement = this.panJs.panAdd.querySelector("input");
        inp.value = this.panJs.info.groups[par.dataset.id];
        this.chStatB({target: inp});
        this.panJs.edGr = par.dataset.id;
    }

    private onDel(e): void {
        const par: HTMLElement = e.target.parentElement;
        if(this.props.cla) {
            this.peopleController.deleteGroup(par.dataset.id);
        } else {
            this.panelInfo.deletePaneGroups(this.panJs.ke, par.dataset.id);
        }
    }

    private chStatB(e): void {
        const el: HTMLInputElement = e.target;
        this.panJs.inps[el.id] = !el.validity.patternMismatch && el.value.length != 0;
        if (this.panJs.inps[el.id]) {
            el.dataset.mod = '0';
        } else {
            el.dataset.mod = '1';
        }
        const state: string = +this.panJs.inps[el.id] + "";
        el.parentElement.querySelector(".yes").setAttribute("data-enable", state);
    }

    private getAdd(name: string): ReactElement {
        if(!this.props.cla || this.cState.role != 3) return;

        const cla: string = [paneCSS.nav_i, paneCSS.nav_iZag, paneCSS.nav_iJur].join(" ");
        return <div className={cla} data-st="0" ref={el=>this.panJs.panAdd = el}>
            <div className={paneCSS.nav_i+" "+paneCSS.chPass} id={paneCSS.nav_i} onClick={this.onEdit}>
                {name}
            </div>
            <div className={paneCSS.nav_i+" "+paneCSS.blNew} id={paneCSS.nav_i}>
                <input className={paneCSS.inp+" "+paneCSS.in} id={"inpt_"} onChange={this.chStatB} type="text" pattern="^[A-Za-zА-Яа-яЁё\s0-9.-]+$"/>
                {this.ele(false, "inpt_")}
                <img className={paneCSS.imginp+" yes "+paneCSS.in} src={yes} onClick={this.onFin} title="Подтвердить" alt=""/>
                <img className={paneCSS.imginp+" "+paneCSS.in} style={{marginRight: "1vw"}} src={no} onClick={this.onClose} title="Отменить изменения и выйти из режима редактирования" alt=""/>
            </div>
        </div>;
    }

    private setGroup(param: string): void {
        if(this.panJs.blockCl) return;

        if(this.props.cla == true){
            this.groupsInfo.changeGroupsGroups(this.panJs.ke, param);
        } else {
            this.panelInfo.changePaneGroup(this.panJs.ke, param);
        }
    }

    private setInfoPanel(): void {
        // console.log(this.props.gro.group);
        // console.log(this.panelInfo.els[this.panJs.ke]?.group);
        if(this.panJs.ke == undefined || this.props.gro?.group != this.panJs.info?.group) {
        // if(this.panJs.ke == undefined) {
            this.panJs.pari.paels = 0;
            if(this.panJs.ke == undefined) this.panJs.ke = this.kel++;
            if(!this.props.cla) {
                this.panelInfo.changePane(this.panJs.ke, this.props.gro);
                this.panJs.info = this.panelInfo.els[this.panJs.ke];
            } else {
                this.panJs.nav.style.gridTemplate = "7vh/ 15% auto";
                this.forceUpdate();
                this.panJs.info = this.groupsInfo.els;
            }
        }
        if(!this.panJs.info) return;

        this.panJs.lGroups = Object.getOwnPropertyNames(this.panJs.info.groups);
        this.panJs.gr1 = {};
        this.panJs.gr = {};
        this.panJs.g = this.panJs.lGroups.map((param: string) =>
            this.panJs.info.groups[param] &&
            (this.panJs.gr1[param] = this.getPan(this.panJs.info.groups[param], param, this.panJs.info.groups[param].linke, () => this.setGroup(param)))
        );
        this.panJs.lGroupY = Object.getOwnPropertyNames(this.panJs.gr1);
    }

    public constructor(props: Props) {
        super(props);
        this.panJs = new PanJs();
    }

    public UNSAFE_componentWillMount(): void {
		const {statusStore, groupStore, panelStore, eventsStore} = this.context.stores;
		const {peopleController} = this.context.controllers;
		this.cState = statusStore;
        this.groupsInfo = groupStore;
        this.panelInfo = panelStore;
        this.eventsInfo = eventsStore;
        this.peopleController = peopleController;
    }

    public componentDidMount(): void {
        this.setInfoPanel();
        this.eventsInfo.changeEventsStep(1);
        if(this.props.cla && this.cState.role == 3) {
            this.chStatB({target: this.panJs.nav.querySelector("." + paneCSS.nav_iZag + " input")});
        }
        console.log("I was triggered during componentDidMount Pane.jsx ke: " + this.panJs.ke);
        window.addEventListener('resize', this.preTim.bind(this));
        // setInterval(()=>{this.forceUpdate()}, 2000);
    }

    public UNSAFE_componentWillUpdate(): void {
        this.setInfoPanel();
        if(this.panJs.parb.updf){
            console.log('componentDidUpdate onlyRender Pane1.jsx');
            return;
        }
        if(this.panJs.lGroups.length != this.panJs.pari.paels) {
            this.panJs.pari.paels = this.panJs.lGroups.length;
            this.overpan();
        }
        console.log('componentwillUpdate Pane');
    }

    public componentDidUpdate(): void {
        if(this.panJs.parb.updf){
            this.panJs.parb.updf = false;
            console.log('componentDidUpdate onlyRender Pane1.jsx');
            return;
        }
        this.updateGroup();
        console.log('componentDidUpdate Pane');
    }

    public componentWillUnmount(): void {
        this.eventsInfo.changeEventsStep(-1);
        window.removeEventListener('resize', this.preTim.bind(this));
        this.panJs.pari.paels = 0;
        clearTimeout(this.panJs.timid);
        console.log("I was triggered during componentWillUnmount Pane");
    }

    public render(): ReactElement {
        const updateComponent: any = this.panelInfo.els[0]?.group;
        return <nav className={paneCSS.panel} id="pan" data-mod={this.props.main ? "1" : "0"} data-ke={this.panJs.ke} ref={el=>this.panJs.nav = el}>
            {this.getAdd("Добавить группу")}
            {this.panJs.g/*@ts-ignore*/}
            <div className={paneCSS.predBlock} ref={re=>this.panJs.refes.mor = re} upd={updateComponent}>
                <div className={paneCSS.nav_i+' '+paneCSS.nav_iJur+' '+paneCSS.predEl} id={paneCSS.nav_i}>
                    <div className={paneCSS.predInf}>...</div>
                </div>
                <div className={paneCSS.predMenu+" pre "+paneCSS.predMM} ref={re=>this.panJs.refes.MMel = re}>
                    <div>
                        {this.panJs.refes.lmor}
                    </div>
                </div>
            </div>
            {!this.props.main &&
                <div className={paneCSS.lin} ref={ele=>this.panJs.refes.lin = ele}/>
            }
        </nav>;
    }
}