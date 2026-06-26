import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../utils/context";
import {Helmet} from "react-helmet-async";
import newsCSS from './newsMain.module.css';
import ErrFound from "../other/error/ErrFound";
import NewsMain from "./NewsMain";
import type NewsStore from "../../store/NewsStore";
import type StatusStore from "../../store/StatusStore";
import type EventsStore from "../../store/other/EventsStore";

interface Props {
};

@observer
export default class NewsYo extends Component {
    static contextType = ContextStores;
    context: any;
    private newsInfo: NewsStore;
    private cState: StatusStore;
    private eventsInfo: EventsStore;
    private type: string = "Yo";
    private errText: string = "Новостей нет... Кажется, что новостная лента пустует не заслужено? Попробуйте попросить завуча заполнить информацию.";
    private inps = {inpntt : "Текст", inpnzt : "Заголовок", inpndt: new Date().toLocaleString("ru", {day:"2-digit", month: "2-digit", year:"numeric"})};

	public UNSAFE_componentWillMount(): void {
		const {statusStore, eventsStore, newsStore} = this.context.stores;
        this.cState = statusStore;
        this.eventsInfo = eventsStore;
        this.newsInfo = newsStore;
        NewsMain.setActNew(1);
        NewsMain.setTyp(this.type);
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount NewsYo");
        for(const el of document.querySelectorAll("." + newsCSS.ed + " > *[id^='inpn']")){
            NewsMain.chStatB({target: el}, this.inps);
        }
    }

    public componentWillUnmount(): void {
        this.eventsInfo.clearEvents();
        console.log("I was triggered during componentWillUnmount NewsYo.jsx");
    }

    public render(): ReactElement {
        return <div className={newsCSS.header}>
            <Helmet>
                <title>Объявления учебного центра</title>
            </Helmet>
            {Object.getOwnPropertyNames(this.newsInfo[this.type]).length == 0 && !(this.cState.auth && this.cState.role == 3) ?
                    <ErrFound text={this.errText}/>
                :
                    <div className={newsCSS.block}>
                        <section className={newsCSS.center_colum}>
                            {(this.cState.auth && this.cState.role == 3) && NewsMain.getAdd(this.inps, this.forceUpdate)}
                            {Object.getOwnPropertyNames(this.newsInfo[this.type]).reverse().map((id: string) =>
                                <div className={newsCSS.news_line} data-st="1" key={id}>
                                    {(this.cState.auth && this.cState.role == 3) ?
                                            NewsMain.getAdd(this.inps, this.forceUpdate, id)
                                        : <>
                                            <h2 className={newsCSS.zag}>{this.newsInfo[this.type][id].title}</h2>
                                            <span className={newsCSS.date}>{this.newsInfo[this.type][id].date}</span>
                                            <div className={newsCSS.te}>
                                                <span className={newsCSS.banner}>
                                                    <img alt="banner" src={this.newsInfo[this.type][id].img_url + ''} onError={NewsMain.errorLoad}/>
                                                </span>
                                                <pre className={newsCSS.field}>
                                                    {this.newsInfo[this.type][id].text}
                                                </pre>
                                            </div>
                                    </>}
                                </div>
                            )}
                        </section>
                    </div>
            }
        </div>;
    }
}