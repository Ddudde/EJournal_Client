import type {NavigateFunction} from "react-router-dom";
import { Route, Routes, Navigate} from "react-router-dom";
import Main from "./components/main/Main";
import type { ReactElement} from "react";
import {Component} from "react";
import Redirect from "./components/main/Redirect";
import {observer} from "mobx-react";
import withRouterHOC from "./utils/withRouterHOC";
import Start from "./components/start/Start";
import ErrFound from "./components/other/error/ErrFound";
import type StatusStore from "./store/StatusStore";
import { ContextStores } from "./utils/context";
import Tutor from "./components/tutor/Tutor";
import ContactMain from "./components/contacts/ContactMain";
import ContactPor from "./components/contacts/ContactPor";
import ContactYo from "./components/contacts/ContactYo";
import NewsMain from "./components/news/NewsMain";
import NewsPor from "./components/news/NewsPor";
import NewsYo from "./components/news/NewsYo";
import PeopleMain from "./components/people/PeopleMain";
import Admins from "./components/people/Admins";
import RequestReceiver from "./components/requestReceiver/RequestReceiver";
import AnalyticsMain from "./components/analytics/AnalyticsMain";
import Zvonki from "./components/analytics/zvonki/Zvonki";
import Schedule from "./components/analytics/schedule/Schedule";
import HTeachers from "./components/people/HTeachers";
import Settings from "./components/main/settings/Settings";
import Dnevnik from "./components/dnevnik/Dnevnik";

interface Props {
    navigate?: any;
};

@observer
class App extends Component {
    static contextType = ContextStores;
	context: any;
    private navigate: NavigateFunction;
    private indexComp: ReactElement;
    private path: string | null | undefined;
    private cState: StatusStore;

    public constructor(props: Props) {
        super(props);
        this.navigate = props.navigate;
    }

	public UNSAFE_componentWillMount(): void {
		const {statusStore} = this.context.stores;
        this.cState = statusStore;
        this.getStartPages();
	}

    private getStartPages() {
        if (!this.cState.auth) {
            this.indexComp = <Start />;
        } else {
            if (this.cState.role < 2) this.indexComp = <Dnevnik />;
            if (this.cState.role == 2) this.indexComp = <Schedule />;
            if (this.cState.role == 3) this.indexComp = <AnalyticsMain comp={<Zvonki />} />;
            if (this.cState.role == 4) this.indexComp = <RequestReceiver />;
        }
    }

    private navigateWithSkipWarning(path : string): void{
        setTimeout(() => {this.navigate(path)});
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount App");
        this.path = localStorage.getItem('path');
        if(this.path) {
            localStorage.removeItem('path');
            console.log("path...");
            console.log(this.path);
            this.navigateWithSkipWarning(this.path);
        }
    }

    public UNSAFE_componentWillUpdate(): void {
        console.log("I was triggered during componentWillUpdate App");
        this.getStartPages();
    }

    public render(): ReactElement { 
        return <Routes>
            <Route path="/" element={<Redirect/>}/>
            <Route path="EJournal_Client" element={<Main/>}>
                <Route index element={this.indexComp}/>
                <Route path="news" element={<NewsMain/>}>
                    <Route index element={<NewsPor/>} />
                    <Route path="por" element={<NewsPor/>} />
                    {(this.cState.auth && this.cState.role != 4) && <Route path="yo" element={<NewsYo/>} />}
                </Route>
                <Route path="contacts" element={<ContactMain/>}>
                    <Route index element={<ContactPor/>} />
                    <Route path="por" element={<ContactPor/>} />
                    {(this.cState.auth && this.cState.role != 4) && <Route path="yo" element={<ContactYo/>} />}
                </Route>
                {(this.cState.auth && (this.cState.role < 2 || this.cState.role == 3)) && <Route path={this.cState.role == 3 ? "" : "analytics"} element={<AnalyticsMain/>}>
                    <Route index element={<Zvonki/>} />
                    <Route path="zvonki" element={<Zvonki/>} />
                    {/* <Route path="periods" element={<Periods/>} /> */}
                    <Route path="schedule" element={<Schedule/>} />
                    {/* {(this.cState.auth && this.cState.role < 2) && <Route path="journal" element={<AnalyticsJournal/>} />}
                    {(this.cState.auth && this.cState.role < 2) && <Route path="marks" element={<Marks/>} />} */}
                </Route>}
                <Route path="people" element={<PeopleMain/>}>
                    <Route index element={<Admins/>} />
                    {/* {(this.cState.auth && (this.cState.role < 2 || this.cState.role == 3)) && <Route path="teachers" element={<Teachers/>} />} */}
                    {this.cState.auth && <Route path="hteachers" element={<HTeachers/>} />}
                    {/* {(this.cState.auth && (this.cState.role == 0 || this.cState.role == 3)) && <Route path="class" element={<Classmates/>} />}
                    {(this.cState.auth && (this.cState.role == 0 || this.cState.role == 3)) && <Route path="parents" element={<Parents/>} />} */}
                    <Route path="admins" element={<Admins/>} />
                </Route>
                {(!this.cState.auth || this.cState.role < 4) && <Route path="tutor/:typ" element={<Tutor/>} />}
                {/* {this.cState.auth && <Route path="profiles" element={<Profile/>} />}
                {(this.cState.auth && this.cState.role == 2) && <Route path="journal" element={<Journal/>} />}
                <Route path="profiles/:log" element={<Profile/>} /> */}
                {this.cState.auth && <Route path="settings" element={<Settings/>} />}
                {/* {(this.cState.auth && this.cState.role == 4) && <Route path="test" element={<Test/>} />} */}
                <Route path="invite/:code" element={<Start mod="inv"/>} />
                <Route path="reauth/:code" element={<Start mod="rea"/>} />
                <Route path="*" element={<ErrFound/>} />
            </Route>
        </Routes>;
    }
}

export default withRouterHOC(App);