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
import PanelData from "./PanelData";
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
    private data: PanelData;
    private eventsInfo: EventsStore;
    private peopleController: PeopleController;
    private kel: number = 0;

    private ele(x: boolean, par: string): ReactElement {
        if(!this.data.inps[par]) this.data.inps[par] = x;
        return null;
    }

    private getPan(name: any | string, namecl: string, link: string, fun: any): ReactElement {
        const cla = [paneCSS.nav_i, paneCSS.nav_iJur, namecl].join(" ");
        const refer = el=>this.data.gr[namecl]=el;
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
                            <img className={paneCSS.imgfield+" "+paneCSS.fi} src={ed} onClick={this.onEditGroup} title="Редактировать" alt=""/>
                            <img className={paneCSS.imginp+" "+paneCSS.fi} src={no} onClick={this.onDel} title="Удалить группу" alt=""/>
                        </> : name
                    }
                </div>
    }

    private overpan(): void {
        this.data.eles = [];
        if(this.data.lGroupY) {
            let el: string;
            for(el of this.data.lGroupY) {
                if(this.data.gr[el] && this.data.gr[el].style.display) {
                    this.data.gr[el].style.display = "";
                }
            }
        }
        if(!this.data.refes.mor) {
            this.data.refes.mor = {style: {}};
        }
        const lst: string = this.data.refes.mor.style.display;
        this.data.refes.mor.style.display = "none";
        if(this.data.refes.lin) {
            this.data.refes.lin.style.display = "none";
        }
        let wid = this.data.nav.scrollWidth - this.data.nav.getBoundingClientRect().width;
        if(wid > 1 && this.data.lGroupY.length > 4) {
            let i1: number = 3;
            let i: number = this.data.lGroupY.length-1;
            for(; i > 0; i--) {
                if(wid < 1) {
                    if(i1 < 1) {
                        break;
                    } else i1--;
                }
                const el1: HTMLElement = this.data.gr[this.data.lGroupY[i]];
                const el2: ReactElement = this.data.gr1[this.data.lGroupY[i]];
                wid -= el1.getBoundingClientRect().width;
                this.data.eles[this.data.eles.length] = React.cloneElement(el2, {className: el2.props.className+" "+paneCSS.pred});
                el1.style.display = "none";
            }
            this.data.lel = this.data.gr[this.data.lGroupY[i--]];
            this.data.refes.mor.style.display = lst;
            this.updMor();
        } else {
            this.data.refes.mor.style.display = lst;
        }
        if(this.data.refes.lin) {
            this.data.refes.lin.style.display = "";
        }
    }

    private updateGroup(): void {
        if(this.data.info && this.data.info.groups[this.data.info.group]){
            this.setActivedMy(this.data.info.group);
            return;
        }
        if(this.data.lGroups && this.data.lGroups.length == 0){
            if(this.data.refes.lin) {
                this.data.refes.lin.style.width = "0";
            }
        } else {
            this.setActivedMy(this.props.main ? undefined : this.data.lGroups[0]);
        }
    }

    private updMor(): void {
        if(this.data.eles.length == 0) return; 

        this.data.refes.lmor = this.getMore(this.data.eles);
        this.data.parb.updf = true;
        this.forceUpdate();
        this.data.refes.mor.style.display = "flex";
    }

    private getMore(el: ReactElement[]): ReactElement[] {
        const bol: string = this.data.lel.getBoundingClientRect().width < 50 ? "200%" : "100%";
        this.data.refes.MMel.style.minWidth = bol;
        this.data.refes.MMel.style.marginRight = bol;
        return el.map(par => par);
    }

    private replGr(x: HTMLElement): void {
        let i: number;
        const elc: ReactElement = this.data.gr1[this.data.lel.dataset.id];
        const elr: ReactElement = React.cloneElement(elc, {className: elc.props.className+" "+paneCSS.pred});
        for (i = 0; i < this.data.eles.length; i++) {
            if(this.data.eles[i].props["data-id"] == x.dataset.id) {
                this.data.eles[i] = elr;
            }
        }
        this.data.lel.style.display = "none";
        x.style.display = "";
        this.data.lel = x;
        this.updMor();
    }

    private setActivedMy(name: string): void {
        const activedOld: HTMLElement = this.data.gr[this.data.act];
        const activedNew: HTMLElement = this.data.gr[name];
        if(activedOld) activedOld.dataset.act = '0';
        if(!activedNew) return;

        this.data.act = name;
        activedNew.dataset.act = '1';
        if(activedNew.style.display == "none") this.replGr(activedNew);
        if(this.data.refes.lin) {
            this.data.refes.lin.style.left = activedNew.getBoundingClientRect().left+"px";
            this.data.refes.lin.style.width = activedNew.getBoundingClientRect().width+"px";
        }
    }

    private preTim(): void {
        if(this.data.parb.resiz) return;

        this.data.parb.resiz = true;
        this.data.timid = setTimeout(this.tim.bind(this),1000);
    }

    private tim(): void {
        if (!this.data.parb.resiz) return;

        this.data.parb.resiz = false;
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
        if(!this.data.inps[inp.id]) return;

        if(this.data.editGroupId){
            if(this.props.cla) {
                this.peopleController.changeGroup(this.data.editGroupId, inp.value, par);
            } else {
                this.panelInfo.changePaneGroups(this.data.panelIndex, inp.value, this.data.editGroupId);
                par.dataset.st = '0';
            }
            this.data.editGroupId = undefined;
            this.data.blockCl = false;
        } else {
            if(this.props.cla) {
                this.peopleController.addGroup(inp.value, par);
            } else {
                const groupId: number = this.data.lGroups.length == 0 ? 0 : parseInt(this.data.lGroups[this.data.lGroups.length - 1]) + 1;
                this.panelInfo.changePaneGroups(this.data.panelIndex, inp.value, groupId);
                par.dataset.st = '0';
            }
        }
    }

    private onClose(e): void {
        const par: HTMLElement = e.target.parentElement.parentElement;
        par.dataset.st = '0';
        this.data.editGroupId = undefined;
        this.data.blockCl = false;
    }

    private onEditGroup(e): void {
        const par: HTMLElement = e.target.parentElement;
        this.data.blockCl = true;
        this.data.panelAdd.dataset.st = '1';
        const inp: HTMLInputElement = this.data.panelAdd.querySelector("input");
        inp.value = this.data.info.groups[par.dataset.id];
        this.chStatB({target: inp});
        this.data.editGroupId = par.dataset.id;
    }

    private onDel(e): void {
        const par: HTMLElement = e.target.parentElement;
        if(this.props.cla) {
            this.peopleController.deleteGroup(par.dataset.id);
        } else {
            this.panelInfo.deletePaneGroups(this.data.panelIndex, par.dataset.id);
        }
    }

    private chStatB(e): void {
        const el: HTMLInputElement = e.target;
        this.data.inps[el.id] = !el.validity.patternMismatch && el.value.length != 0;
        if (this.data.inps[el.id]) {
            el.dataset.mod = '0';
        } else {
            el.dataset.mod = '1';
        }
        const state: string = +this.data.inps[el.id] + "";
        el.parentElement.querySelector(".yes").setAttribute("data-enable", state);
    }

    private getAdd(name: string): ReactElement {
        if(!this.props.cla || this.cState.role != 3) return;

        const cla: string = [paneCSS.nav_i, paneCSS.nav_iZag, paneCSS.nav_iJur].join(" ");
        return <div className={cla} data-st="0" ref={el=>this.data.panelAdd = el}>
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
        if(this.data.blockCl) return;

        if(this.props.cla == true){
            this.groupsInfo.changeGroupsGroups(this.data.panelIndex, param);
        } else {
            this.panelInfo.changePaneGroup(this.data.panelIndex, param);
        }
    }

    private setInfoPanel(): void {
        // console.log(this.props.gro.group);
        // console.log(this.panelInfo.els[this.panJs.ke]?.group);
        if(this.data.panelIndex == undefined || this.props.gro?.group != this.data.info?.group) {
        // if(this.panJs.ke == undefined) {
            this.data.pari.paels = 0;
            if(this.data.panelIndex == undefined) this.data.panelIndex = this.kel++;
            if(!this.props.cla) {
                this.panelInfo.changePane(this.data.panelIndex, this.props.gro);
                this.data.info = this.panelInfo.els[this.data.panelIndex];
            } else {
                this.data.nav.style.gridTemplate = "7vh/ 15% auto";
                this.forceUpdate();
                this.data.info = this.groupsInfo.els;
            }
        }
        if(!this.data.info) return;

        this.data.lGroups = Object.getOwnPropertyNames(this.data.info.groups);
        this.data.gr1 = {};
        this.data.gr = {};
        this.data.g = this.data.lGroups.map((param: string) =>
            this.data.info.groups[param] &&
            (this.data.gr1[param] = this.getPan(this.data.info.groups[param], param, this.data.info.groups[param].linke, () => this.setGroup(param)))
        );
        this.data.lGroupY = Object.getOwnPropertyNames(this.data.gr1);
    }

    public constructor(props: Props) {
        super(props);
        this.data = new PanelData();
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
            this.chStatB({target: this.data.nav.querySelector("." + paneCSS.nav_iZag + " input")});
        }
        console.log("I was triggered during componentDidMount Pane.jsx ke: " + this.data.panelIndex);
        window.addEventListener('resize', this.preTim.bind(this));
        // setInterval(()=>{this.forceUpdate()}, 2000);
    }

    public UNSAFE_componentWillUpdate(): void {
        this.setInfoPanel();
        if(this.data.parb.updf){
            console.log('componentDidUpdate onlyRender Pane1.jsx');
            return;
        }
        if(this.data.lGroups.length != this.data.pari.paels) {
            this.data.pari.paels = this.data.lGroups.length;
            this.overpan();
        }
        console.log('componentwillUpdate Pane');
    }

    public componentDidUpdate(): void {
        if(this.data.parb.updf){
            this.data.parb.updf = false;
            console.log('componentDidUpdate onlyRender Pane1.jsx');
            return;
        }
        this.updateGroup();
        console.log('componentDidUpdate Pane');
    }

    public componentWillUnmount(): void {
        this.eventsInfo.changeEventsStep(-1);
        window.removeEventListener('resize', this.preTim.bind(this));
        this.data.pari.paels = 0;
        clearTimeout(this.data.timid);
        console.log("I was triggered during componentWillUnmount Pane");
    }

    public render(): ReactElement {
        const updateComponent: any = this.panelInfo.els[0]?.group;
        return <nav className={paneCSS.panel} id="pan" data-mod={this.props.main ? "1" : "0"} data-ke={this.data.panelIndex} ref={el=>this.data.nav = el}>
            {this.getAdd("Добавить группу")}
            {this.data.g/*@ts-ignore*/}
            <div className={paneCSS.predBlock} ref={re=>this.data.refes.mor = re} upd={updateComponent}>
                <div className={paneCSS.nav_i+' '+paneCSS.nav_iJur+' '+paneCSS.predEl} id={paneCSS.nav_i}>
                    <div className={paneCSS.predInf}>...</div>
                </div>
                <div className={paneCSS.predMenu+" pre "+paneCSS.predMM} ref={re=>this.data.refes.MMel = re}>
                    <div>
                        {this.data.refes.lmor}
                    </div>
                </div>
            </div>
            {!this.props.main &&
                <div className={paneCSS.lin} ref={ele=>this.data.refes.lin = ele}/>
            }
        </nav>;
    }
}