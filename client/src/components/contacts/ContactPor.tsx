import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../utils/context";
import {Helmet} from "react-helmet-async";
import contactCSS from './contactMain.module.css';
import ErrFound from "../other/error/ErrFound";
import ContactMain from "./ContactMain";
import type ContactStore from "../../store/ContactStore";
import type StatusStore from "../../store/StatusStore";
import type EventsStore from "../../store/other/EventsStore";

interface Props {
};

@observer
export default class ContactPor extends Component {
    static contextType = ContextStores;
    context: any;
    private contactsInfo: ContactStore;
    private cState: StatusStore;
    private eventsInfo: EventsStore;
    private type: string = "Por";
    private inps = {};
    private errText: string = "К сожалению, информация не найдена... Ждите новой информации.";

	public UNSAFE_componentWillMount(): void {
		const {statusStore, eventsStore, contactsStore} = this.context.stores;
        this.cState = statusStore;
        this.eventsInfo = eventsStore;
        this.contactsInfo = contactsStore;
        ContactMain.setActNew(0);
        ContactMain.setTyp(this.type);
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount ContactPor");
        ContactMain.setTyp(this.type);
        for(const el of document.querySelectorAll("." + contactCSS.ed + " > *[id^='inpn']")){
            ContactMain.chStatB({target: el}, this.inps);
        }
    }

    public componentWillUnmount(): void {
        this.eventsInfo.clearEvents();
        console.log("I was triggered during componentWillUnmount ContactPor.jsx");
    }

    public render(): ReactElement {
        return <div className={contactCSS.header}>
            <Helmet>
                <title>Контакты портала</title>
            </Helmet>
            {(!this.contactsInfo[this.type].contact && !this.contactsInfo[this.type].mapPr && !(this.cState.auth && this.cState.role == 4)) ?
                    <ErrFound text={this.errText}/>
                :
                    <div className={contactCSS.block}>
                        {(this.cState.auth && this.cState.role == 4) ?
                                ContactMain.getEdCon(this.inps, this.forceUpdate)
                            :
                                <section className={contactCSS.center_colum}>
                                    <div className={contactCSS.blockTel}>
                                        <h1 className={contactCSS.zag}>Телефоны для связи</h1>
                                        <pre className={contactCSS.field}>
                                            {this.contactsInfo[this.type].contact}
                                        </pre>
                                    </div>
                                    <div className={contactCSS.map+" "+contactCSS.blockTel}>
                                        <h1 className={contactCSS.zag}>Карта проезда</h1>
                                        <pre className={contactCSS.field}>
                                            {this.contactsInfo[this.type].mapPr.text}
                                        </pre>
                                        <span className={contactCSS.banner}>
                                            <img alt="banner" src={this.contactsInfo[this.type].mapPr.imgUrl+''} onError={ContactMain.errorLoad}/>
                                        </span>
                                    </div>
                                </section>
                        }
                    </div>
            }
        </div>;
    }
}