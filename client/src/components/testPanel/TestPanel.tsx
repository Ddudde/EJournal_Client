import { ContextStores } from "../../utils/context";
import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import type EventsStore from "../../store/other/EventsStore";
import {Helmet} from "react-helmet-async";
import testCSS from './test.module.css';
import ErrFound from "../other/error/ErrFound";
import CheckBox from "../other/checkBox/CheckBox";
import type CheckboxStore from "../../store/other/CheckboxStore";
import Main from "../main/Main";
import type TestPanelStore from "../../store/TestPanelStore";
import type TestPanelController from "../../controllers/TestPanelController";

interface Props {
};

@observer
export default class TestPanel extends Component {
    static contextType = ContextStores;
	context: any;
    private eventsStore: EventsStore;
    private testInfo: TestPanelStore;
    private testPanelController: TestPanelController;
    private checkBoxInfo: CheckboxStore;
    private errText = "Данные для тестирования не сформированы...";

    private getPeople(dataPeople: any): ReactElement {
        return <div className={testCSS.infGrid}>
            <div className={testCSS.nav_i+" "+testCSS.nav_iTable}>
                №
            </div>
            <div className={testCSS.nav_i+" "+testCSS.nav_iTable} style={{gridColumn: "2"}}>
                ФИО
            </div>
            <div className={testCSS.nav_i+" "+testCSS.nav_iTable} style={{gridColumn: "3"}}>
                Логин
            </div>
            <div className={testCSS.nav_i+" "+testCSS.nav_iTable} style={{gridColumn: "4"}}>
                Код-приглашение
            </div>
            {Object.getOwnPropertyNames(dataPeople).map((id, i) =>
                <>
                    <div className={testCSS.nav_i+" "+testCSS.nav_iTable}>
                        {i + 1}
                    </div>
                    <div className={testCSS.nav_i+" "+testCSS.nav_iTable}>
                        {dataPeople[id].fio}
                    </div>
                    <div className={testCSS.nav_i+" "+testCSS.nav_iTable}>
                        {dataPeople[id].login}
                    </div>
                    <div className={testCSS.nav_i+" "+testCSS.nav_iTable}>
                        {dataPeople[id].code}
                    </div>
                </>
            )}
        </div>;
    }

    private visB(e): void {
        const el: HTMLElement = e.target.nextElementSibling;
        el.dataset.act = el.dataset.act == "0" ? "1" : "0";
    }

    private getSchool(id: string): JSX.Element {
        const school: any = this.testInfo.info.schools[id];
        return <>
            <div className={testCSS.zag1} id={testCSS.nav_i} onClick={this.visB}>
                {school.name}
            </div>
            <div className={testCSS.blockOtv} data-act="0">
                Информация необходимая для тестирования учебных организаций
                <div className={testCSS.zag1} id={testCSS.nav_i} onClick={this.visB}>
                    Данные завучей
                </div>
                <div className={testCSS.blockOtv} data-act="0">
                    Общие данные аккаунтов завучей
                    {this.getPeople(school.hteachers)}
                </div>
                <div className={testCSS.zag1} id={testCSS.nav_i} onClick={this.visB}>
                    Данные педагогов
                </div>
                <div className={testCSS.blockOtv} data-act="0">
                    Общие данные аккаунтов педагогов
                    {this.getPeople(school.teachers)}
                </div>
                {Object.getOwnPropertyNames(school.groups).map(param1 => <>
                    <div className={testCSS.zag1} id={testCSS.nav_i} onClick={this.visB}>
                        {school.groups[param1].name}
                    </div>
                    <div className={testCSS.blockOtv} data-act="0">
                        <div className={testCSS.zag1} id={testCSS.nav_i} onClick={this.visB}>
                            Данные учеников
                        </div>
                        <div className={testCSS.blockOtv} data-act="0">
                            Общие данные аккаунтов учеников
                            {this.getPeople(school.groups[param1].kids)}
                        </div>
                        <div className={testCSS.zag1} id={testCSS.nav_i} onClick={this.visB}>
                            Данные родителей
                        </div>
                        <div className={testCSS.blockOtv} data-act="0">
                            Общие данные аккаунтов родителей
                            {this.getPeople(school.groups[param1].parents)}
                        </div>
                    </div>
                </>
                )}
            </div>
        </>;
    }

	public UNSAFE_componentWillMount(): void {
		const {eventsStore} = this.context.stores;
        this.eventsStore = eventsStore;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount TestPanel");
        Main.setActivedForPanel(12);
        this.testPanelController.didMount();
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount TestPanel");
        this.testPanelController.willUnmount();
        this.eventsStore.clearEvents();
    }

    public render(): ReactElement {
        return <div className={testCSS.header}>
            <Helmet>
                <title>Тестирование</title>
            </Helmet>
            {!Object.getOwnPropertyNames(this.testInfo.info).length ?
                    <ErrFound text={this.errText}/>
                :
                    <div className={testCSS.block}>
                        <div className={testCSS.inf}>
                            <div className={testCSS.nav_i} id={testCSS.nav_i} onClick={e=>this.testPanelController.chNotif("checkbox_debug")}>
                                <CheckBox text={"Режим отладки"} checkbox_id={"checkbox_debug"}/>
                            </div>
                            <div className={testCSS.nav_i} id={testCSS.nav_i} onClick={e=>this.testPanelController.chNotif("checkbox_test")}>
                                <CheckBox text={"Режим тестирования"} checkbox_id={"checkbox_test"}/>
                            </div>
                            <div className={testCSS.blockInfo} data-act={(this.checkBoxInfo.checkBoxes.checkbox_test || false) ? '1' : '0'}>
                                <div className={testCSS.nav_i} id={testCSS.nav_i}>
                                    Пароль для всех тестовых аккаунтов: {this.testInfo.info.testPassword}
                                </div>
                                <div className={testCSS.nav_i} id={testCSS.nav_i}>
                                    Данные:
                                </div>
                                <div className={testCSS.nav_iZag+" "+testCSS.nav_i}>
                                    <div className={testCSS.zag} id={testCSS.nav_i}>
                                        Система
                                    </div>
                                    <div className={testCSS.razd}>
                                        <div className={testCSS.zag1} id={testCSS.nav_i} onClick={this.visB}>
                                            Данные администраторов
                                        </div>
                                        <div className={testCSS.blockOtv} data-act="0">
                                            Общие данные аккаунтов администраторов
                                            {this.getPeople(this.testInfo.info.admins)}
                                        </div>
                                    </div>
                                </div>
                                <div className={testCSS.nav_iZag+" "+testCSS.nav_i}>
                                    <div className={testCSS.zag} id={testCSS.nav_i}>
                                        Учебные организации
                                    </div>
                                    <div className={testCSS.razd}>
                                        {Object.getOwnPropertyNames(this.testInfo.info.schools).map((id: string) =>
                                            this.getSchool(id)
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>;
    }
}