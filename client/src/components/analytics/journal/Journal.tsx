import { ContextStores } from "../../../utils/context";
import type { ReactElement} from "react";
import {Component} from "react";
import {Helmet} from "react-helmet-async";
import journalCSS from './journal.module.css';
import {observer} from "mobx-react";
import ErrFound from "../../other/error/ErrFound";
import type EventsStore from "../../../store/other/EventsStore";
import type StatusStore from "../../../store/StatusStore";
import AnalyticsMain from "../AnalyticsMain";
import type JournalStore from "../../../store/analytics/JournalStore";
import type JournalController from "../../../controllers/analytics/JournalController";

interface Props {
};

@observer
export default class Journal extends Component {
    static contextType = ContextStores;
	context: any;
    private eventsStore: EventsStore;
    private errText = "К сожалению, информация не найдена... Можете попробовать попросить завуча заполнить информацию.";
    private maxEl = 0;
    private journalController: JournalController;
    private journalsInfo: JournalStore;
    private cState: StatusStore;

    private getDate(rawDate: string): Date {
        const arrayDate = rawDate.split('.');
        return new Date("20" + [arrayDate[2], arrayDate[1], arrayDate[0]].join("-"));
    }

    private updDateP(id: string): void {
        for(const el of document.querySelectorAll("." + journalCSS.daysGrid + " #" + journalCSS.nav_i)) {
            el.innerHTML = "";
        }
        if(!this.journalsInfo.info[id] || !this.journalsInfo.info[id].days) return;
        const mas = Object.getOwnPropertyNames(this.journalsInfo.info[id].days);
        let lastMonth;
        for(let i = 0; i < mas.length; i++) {
            const date: Date = this.getDate(mas[i]);
            const month: string = date.toLocaleString("ru", {month:"2-digit"});
            const dat: string = date.toLocaleString("ru", month == lastMonth ? {day:"2-digit"} : {day:"2-digit", month:"short"});
            lastMonth = month;
            const el = document.querySelector("." + journalCSS.daysGrid + " div:nth-child(" + (i + 2) + ")");
            if(el) el.innerHTML = dat;
        }
    }

    private updDate(e: Event): void {
        const el = e.target as HTMLElement;
        this.updDateP(el.id);
    }

    private calculateMaxElement(): void {
        for (const el of Object.getOwnPropertyNames(this.journalsInfo.info)) {
            if (!this.journalsInfo.info[el].days) continue;
            const len = Object.getOwnPropertyNames(this.journalsInfo.info[el].days).length;
            if (len > this.maxEl) this.maxEl = len;
        }
    }

    private getMarkField(nameLesson: string): JSX.Element {
        const days: string[] = this.journalsInfo.info[nameLesson].days ? Object.getOwnPropertyNames(this.journalsInfo.info[nameLesson].days) : [];
        return <div className={journalCSS.predmGrid} id={nameLesson}>
            <div className={journalCSS.nav_i + " nam " + journalCSS.nam} id={journalCSS.nav_i}>
                {nameLesson}
            </div>
            <div className={journalCSS.nav_i + " " + journalCSS.nav_iBr} id={journalCSS.nav_i}>
                <br />
            </div>
            {days.map((param1, i1, x1, les = this.journalsInfo.info[nameLesson].days[param1]) =>
                <div className={journalCSS.nav_i + " " + journalCSS.blockMark} id={journalCSS.nav_i} data-tooltip={les.type}>
                    {les.mark}
                    {les.weight > 1 && <div className={journalCSS.nav_iWeight}>
                        {les.weight}
                    </div>}
                </div>
            )}
            {days.length < this.maxEl && Array(this.maxEl - days.length).fill('').map(param =>
                <div className={journalCSS.nav_i} id={journalCSS.nav_i}>
                    <br />
                </div>
            )}
            {<div className={journalCSS.nav_i + " " + journalCSS.nav_iTextM} style={{ fontSize: "0.85vw" }}>
                {this.journalsInfo.info[nameLesson]?.avg?.mark || <br />}
            </div>}
        </div>;
    }

	public UNSAFE_componentWillMount(): void {
		const {eventsStore} = this.context.stores;
        this.eventsStore = eventsStore;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount AnalyticsJournal");
        this.journalController.didMount();
        for(const el of document.querySelectorAll("div[class='" + journalCSS.predmGrid+"']")) {
            el.addEventListener('mouseover', this.updDate);
        }
        this.updDateP(Object.getOwnPropertyNames(this.journalsInfo.info)[0]);
        const scr: HTMLElement = document.querySelector("." + journalCSS.days);
        if(scr) scr.scrollTo(scr.scrollWidth, 0);
        this.eventsStore.changeEventsRL(false);
        AnalyticsMain.setActNew(3);
        this.calculateMaxElement();
    }

    public componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount AnalyticsJournal");
        this.journalController.willUnmount();
        this.eventsStore.clearEvents();
        this.eventsStore.changeEventsRL(true);
    }

    public UNSAFE_componentWillUpdate(): void {
        console.log("I was triggered during componentWillUpdate AnalyticsJournal");
        this.calculateMaxElement();
        if(this.cState.role == 1 && this.cState.kid && this.journalController.selKid != this.cState.kid) {
            this.journalController.selKid = this.cState.kid;
            this.journalController.getInfo();
        }
    }

    public render(): ReactElement {
        return <div className={journalCSS.AppHeader}>
            <Helmet>
                <title>Журнал</title>
            </Helmet>
            {!Object.getOwnPropertyNames(this.journalsInfo.info).length ?
                    <ErrFound text={this.errText}/>
                :
                    <div className={journalCSS.blockPredm}>
                        <div className={journalCSS.predm}>
                            <div className={journalCSS.days}>
                                <div className={journalCSS.nav_i+" "+journalCSS.namd} id={journalCSS.nav_i}>
                                    <br/>
                                </div>
                                <div className={journalCSS.daysGrid}>
                                    <div className={journalCSS.nav_i} id={journalCSS.nav_i}>
                                        <br/>
                                    </div>
                                    {Array(this.maxEl).fill('').map(param =>
                                        <div className={journalCSS.nav_i+" "+journalCSS.nav_iTextD} id={journalCSS.nav_i}>
                                            <br/>
                                        </div>
                                    )}
                                    <div className={journalCSS.nav_i}>
                                        <div className={journalCSS.nav_iText}>
                                            Средняя
                                        </div>
                                    </div>
                                </div>
                                {Object.getOwnPropertyNames(this.journalsInfo.info).map((nameLesson: string) =>
                                    this.getMarkField(nameLesson)
                                )}
                            </div>
                        </div>
                    </div>
            }
        </div>;
    }
}