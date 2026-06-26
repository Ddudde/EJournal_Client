import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import mainCSS from './main.module.css';
import {Link, Outlet} from "react-router-dom";
import profd from "../../media/profd.png";
import profl from "../../media/profl.png";
import mapd from "../../media/Map_symbolD.png";
import mapl from "../../media/Map_symbolL.png";
import up from "../../media/up.png";
import Events from "../other/events/Events";
import Dialog from "../other/dialog/Dialog";
import Pane from "../other/pane/Pane";
import ls1 from "../../media/ls-icon1.png";
import ls2 from "../../media/ls-icon2.png";
import ls3 from "../../media/ls-icon3.png";
import type DialogStore from "../../store/other/DialogStore";
import type StatusStore from "../../store/StatusStore";
import type PanelStore from "../../store/other/PanelStore";
import type ThemeStore from "../../store/ThemeStore";
import { ContextStores } from "../../utils/context";
import type MainController from "../../controllers/main/MainController";
import StartController from "../../controllers/StartController";

interface Props {
};

@observer
export default class Main extends Component {
    static contextType = ContextStores;
	context: any;
    private scrolling: boolean = false;
    private static act: string;
    private static ke: number | undefined;
    private timid: number | undefined;
    private d1: HTMLImageElement | null;
    private dialogInfo: DialogStore;
    private cState: StatusStore;
    private static panelInfo: PanelStore;
    private themeInfo: ThemeStore | undefined;
    private mainController: MainController;
    public static prefSite: string = "/EJournal_Client";
    private static gr: any = {
        group: 4
    };

    private getPan(name: string, namecl: string, link: string, dopClass: string, fun?: any): ReactElement {
        const cl: string = "pan" + namecl;
        return fun ?
            <div className={mainCSS.nav_i+" "+cl+" "+(dopClass ? dopClass : "")} id={mainCSS.nav_i} onClick={fun}>
                {name}
            </div>
        :
            <Link className={mainCSS.nav_i+" "+cl+" "+(dopClass ? dopClass : "")} id={mainCSS.nav_i} to={link} onClick={() => {Main.setActivedForPanel("."+cl)}}>
                {name}
            </Link>;
    }

    private getLogin(): ReactElement {
        const icons = {
            1: ls1,
            2: ls2,
            3: ls3
        };
        return <div className={mainCSS.logBlock}>
            <div className={mainCSS.nav_i+' '+mainCSS.log} style={{width:"100%"}} id={mainCSS.nav_i}>
                <img alt="ico" src={icons[this.cState.ico]}/>
                <div className={mainCSS.logLog}>{this.cState.login}</div>
                <div className={mainCSS.logText}>Я - {this.cState.roleDesc}</div>
            </div>
            <div className={mainCSS.logMenu}>
                {this.getPan("Профиль", "Pro", "profiles", mainCSS.logMenuBlock)}
                {this.cState.roles && this.getPan("Сменить роль", "Rol", "", mainCSS.logMenuBlock,this.mainController.changeRoles.bind(this.mainController))}
                {this.getPan("Настройки", "Set", "settings", mainCSS.logMenuBlock)}
                {this.getPan("Выход", "Exi", "", mainCSS.logMenuBlock,this.onExit.bind(this))}
            </div>
        </div>
    }

    private getKids(): ReactElement {
        return this.cState.kids && <div className={mainCSS.logBlock}>
            <div className={mainCSS.nav_i+' '+mainCSS.kidEl} id={mainCSS.nav_i}>
                <img className={mainCSS.kidImg} src={this.themeInfo.theme_ch ? profd : profl} title="Перейти в профиль" alt=""/>
                <div className={mainCSS.kidInf}>Информация о:</div>
                <div className={mainCSS.kidText}>{this.cState.kids[this.cState.kid]}</div>
                <img className={mainCSS.mapImg} src={this.themeInfo.theme_ch ? mapd : mapl} title="Перейти в профиль" alt=""/>
            </div>
            <div className={mainCSS.logMenu}>
                {Object.getOwnPropertyNames(this.cState.kids).map(param1 =>
                    <div className={mainCSS.nav_i+' '+mainCSS.log+' '+mainCSS.kidBlock} id={mainCSS.nav_i} onClick={e => this.mainController.selectKid(param1)}>
                        <img className={mainCSS.kidImg} src={this.themeInfo.theme_ch ? profd : profl} title="Перейти в профиль" alt=""/>
                        <div className={mainCSS.kidInf}>Информация о:</div>
                        <div className={mainCSS.kidText}>{this.cState.kids[param1]}</div>
                    </div>
                )}
            </div>
        </div>
    }

    private onExit(): void {
        const exitField = {
            obj: <div>
                Вы желаете выйти?
            </div>,
            buts: {
                0 : {
                    text: "Да",
                    fun: () => this.mainController.exitFromAccount(localStorage.getItem("notifToken")),
                    enab: true
                },
                1 : {
                    text: "Нет",
                    fun:() => this.dialogInfo.resetDialog(),
                    enab: true
                }
            }
        };
        this.dialogInfo.cloneDialog(exitField);
    }

    /* Установка активированного состояния для разделов главной панели */
    public static setActivedForPanel(name: string | number): void {
        if(document.querySelector(Main.act)) {
            document.querySelector(Main.act).setAttribute('data-act', '0');
        }
        if(typeof name != "number"){
            if(document.querySelector(name)) {
                Main.act = name;
                document.querySelector(name).setAttribute('data-act', '1');
            }
        }
        if(Main.ke != undefined && Main.panelInfo.els[Main.ke]) {
            Main.panelInfo.changePaneGroup(Main.ke, name);
        } else {
            Main.gr.group = name;
        }
    }

    private scr(): void {
        if (window.pageYOffset >= window.innerHeight * 0.5)
            this.d1.style.display = "block";
        else
            this.d1.style.display = "none";
    }

    private tim(): void {
        if (this.scrolling) {
            this.scrolling = false;
            this.scr();
        }
    }

    private onTop(): void {
        window.scroll({
            left: 0,
            top: 0,
            behavior: "smooth"
        });
    }

    public constructor(props: Props) {
        super(props);
    }

    public UNSAFE_componentWillMount(): void {
		const {statusStore, themeStore, panelStore, dialogStore} = this.context.stores;
        const {mainController} = this.context.controllers;
        this.mainController = mainController;
        this.mainController.openStream();
        this.themeInfo = themeStore;
        this.cState = statusStore;
        Main.panelInfo = panelStore;
        this.dialogInfo = dialogStore;
        this.getMainPanel();
    }

    private getMainPanel() {
        Main.gr.groups = {
            0: !this.cState.auth ? {
                nam: "Главная",
                linke: Main.prefSite + "/"
            } : undefined,
            1: {
                nam: "Объявления",
                linke: "news"
            },
            2: {
                nam: "Контакты",
                linke: "contacts"
            },
            3: {
                nam: "Люди",
                linke: "people"
            },
            4: !this.cState.auth || (this.cState.auth && this.cState.role == 3) ? {
                nam: "Школам",
                linke: "tutor/sch"
            } : undefined,
            5: !this.cState.auth || (this.cState.auth && this.cState.role == 2) ? {
                nam: "Педагогам",
                linke: "tutor/tea"
            } : undefined,
            6: !this.cState.auth || (this.cState.auth && this.cState.role == 1) ? {
                nam: "Родителям",
                linke: "tutor/par"
            } : undefined,
            7: !this.cState.auth || (this.cState.auth && this.cState.role == 0) ? {
                nam: "Обучающимся",
                linke: "tutor/kid"
            } : undefined,
            8: this.cState.auth && this.cState.role == 2 ? {
                nam: "Расписание",
                linke: Main.prefSite + "/"
            } : undefined,
            9: this.cState.auth && this.cState.role == 2 ? {
                nam: "Журнал",
                linke: "journal"
            } : undefined,
            10: this.cState.auth && this.cState.role == 3 ? {
                nam: "Администрирование УО",
                linke: Main.prefSite + "/"
            } : undefined,
            11: this.cState.auth && this.cState.role == 4 ? {
                nam: "Заявки",
                linke: Main.prefSite + "/"
            } : undefined,
            12: this.cState.auth && this.cState.role == 4 ? {
                nam: "Тестирование",
                linke: "test"
            } : undefined,
            13: this.cState.auth && this.cState.role < 2 ? {
                nam: "Дневник",
                linke: Main.prefSite + "/"
            } : undefined,
            14: this.cState.auth && this.cState.role < 2 ? {
                nam: "Аналитика",
                linke: "analytics"
            } : undefined
        };
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Main");
        this.scr();
        this.themeInfo.setThemeToView();
        window.onpagehide = ()=>{this.componentWillUnmount()};
        window.onbeforeunload = ()=>{this.componentWillUnmount()};
        window.onscroll = () => {
            if(!this.scrolling) {
                this.scrolling = true;
                this.timid = setTimeout(this.tim,300);
            }
        };
    }

    public componentWillUnmount(): void {
        window.onwheel = undefined;
        this.mainController.closeStream();
        clearTimeout(this.timid);
        this.themeInfo = undefined;
        console.log("I was triggered during componentWillUnmount Main");
    }

    public UNSAFE_componentWillUpdate(): void {
        console.log("I was triggered during componentWillUpdate Main");
        this.getMainPanel();
    }

    public render(): ReactElement {
        const refPanel: any = ()=>Main.ke = Main.ke || Main.panelInfo.els.length-1;
        const checkedTheme: any = this.themeInfo.theme_ch ? "checked" : "";
        const refUpButton: any = (el: HTMLImageElement)=>this.d1 = el;
        return <>
            <div className={mainCSS.fon}>
                <div/>
                <div/>
            </div>
            <nav className={mainCSS.panel} id="her">
                <div className={mainCSS.pane} ref={refPanel}>
                    <Pane gro={Main.gr} main={true}/>
                </div>
                {this.cState.auth && this.getLogin()}
                {(this.cState.auth && this.cState.role == 1) && this.getKids()}
            </nav>
            <Outlet/>
            <Dialog/>
            <Events/>
            <div className={mainCSS.switcher}>
                <label className={mainCSS.switch}>
                    <input className={mainCSS.inp_sw} type="checkbox" checked={checkedTheme} onChange={() => {this.themeInfo.changeTheme(this.themeInfo.theme_ch)}}/>
                    <span className={mainCSS.slider}/>
                </label>
                <div className={mainCSS.lab_sw}>
                    Тема: {this.themeInfo.theme}
                </div>
            </div>
            <div className={mainCSS.d}>
                © 2023 ООО "Рога и Копыта" Все права защищены. Project on <a href="https://github.com/Ddudde/EJournal" style={{color: "var(--cV2)"}}>github</a>.
            </div>
            <img className={mainCSS.d1} src={up} title="Вверх" alt="" onClick={this.onTop} ref={refUpButton}/>
        </>
    }
}