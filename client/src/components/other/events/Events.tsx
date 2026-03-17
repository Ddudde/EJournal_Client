import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import eventsCSS from './events.module.css';
import warn from '../../../media/warning.png';
import no from "../../../media/no.png";
import { ContextStores } from "../../../utils/context";
import type EventsStore from "../../../store/other/EventsStore";

interface Props {
};

@observer
export default class Events extends Component {
    static contextType = ContextStores;
    context: any;
    private eventsInfo: EventsStore;
    private isFirstUpdate: boolean = true;

    private onDel(e: any): void {
        const par: HTMLElement = (e.target as HTMLElement);
        if (par.hasAttribute("data-id")) {
            const id: number = parseInt(par.getAttribute("data-id"));
            this.eventsInfo.deleteEvents(id);
        }
    }

    private deleteTimer(id: any): void {
        this.eventsInfo.deleteEvents(id, true);
    }

    public constructor(props: Props) {
        super(props);
    }

	public UNSAFE_componentWillMount(): void {
		const {eventsStore} = this.context.stores;
		this.eventsInfo = eventsStore;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Events");
        for(const id in this.eventsInfo.time){
            if(this.eventsInfo.time[id].init) continue;

            setTimeout(()=>this.deleteTimer(id), this.eventsInfo.time[id].long*1000);
            this.eventsInfo.changeEventTimer(id, true);
        }
    }

    public componentDidUpdate(): void {
        if (this.isFirstUpdate) {
            this.isFirstUpdate = false;
            return;
        }
        for(const id in this.eventsInfo.time){
            if(this.eventsInfo.time[id].init) continue;
            setTimeout(()=>this.deleteTimer(id), this.eventsInfo.time[id].long*1000);
            this.eventsInfo.changeEventTimer(id, true);
        }
        console.log('componentDidUpdate App');
    }

    public render(): ReactElement {
        return <div className={eventsCSS.evHeader} style={{top: (7*this.eventsInfo.steps) + "vh", left: this.eventsInfo.right ? "" : "0", right: this.eventsInfo.right ? "0" : "", display: this.eventsInfo.visible ? "block" : "none"}}>
            {Object.getOwnPropertyNames(this.eventsInfo.evs).reverse().map(param =>
                <div className={eventsCSS.warne} key={param}>
                    <img src={warn} className={eventsCSS.warnimg} alt=""/>
                    <span className={eventsCSS.title}>
                        {this.eventsInfo.evs[param].title}
                    </span>
                    <img className={eventsCSS.imgCl} data-id={param} src={no} onClick={this.onDel.bind(this)} title="Удалить" alt=""/>
                    <div className={eventsCSS.text}>
                        {this.eventsInfo.evs[param].text}
                    </div>
                    <div className={eventsCSS.time}>
                        {this.eventsInfo.evs[param].dtime}
                    </div>
                </div>
            )}
        </div>;
    }
}