import type { Context } from 'react';
import { createContext } from 'react';
import ThemeStore from '../store/ThemeStore';
import PanelStore from '../store/other/PanelStore';
import DialogStore from '../store/other/DialogStore';
import EventsStore from '../store/other/EventsStore';
import GroupStore from '../store/GroupStore';
import CheckboxStore from '../store/other/CheckboxStore';
import IndicatorStore from '../store/other/IndicatorStore';
import StatusStore from '../store/StatusStore';
import MainController from '../controllers/main/MainController';
import MainApi from '../api/main/MainApi';
import NotificationController from '../controllers/NotificationController';
import StartController from '../controllers/StartController';
import StartApi from '../api/StartApi';
import TutorController from '../controllers/TutorController';
import ContactStore from '../store/ContactStore';
import NewsStore from '../store/NewsStore';
import AdminsStore from '../store/people/AdminsStore';
import TutorApi from '../api/TutorApi';
import ContactController from '../controllers/ContactController';
import ContactApi from '../api/ContactApi';
import AdminController from '../controllers/people/AdminController';
import PeopleController from '../controllers/people/PeopleController';
import AdminApi from '../api/people/AdminApi';
import PeopleApi from '../api/people/PeopleApi';
import NewsController from '../controllers/NewsController';
import NewsApi from '../api/NewsApi';
import RequestStore from '../store/RequestStore';
import DnevnikStore from '../store/DnevnikStore';
import HTeacherStore from '../store/people/HTeacherStore';
import ScheduleStore from '../store/analytics/ScheduleStore';
import ZvonkiStore from '../store/analytics/ZvonkiStore';
import RequestController from '../controllers/RequestController';
import DnevnikController from '../controllers/DnevnikController';
import HTeacherController from '../controllers/people/HTeacherController';
import SettingController from '../controllers/main/SettingController';
import ScheduleController from '../controllers/analytics/ScheduleController';
import RequestApi from '../api/RequestApi';
import DnevnikApi from '../api/DnevnikApi';
import HTeacherApi from '../api/people/HTeacherApi';
import SettingApi from '../api/main/SettingApi';
import ScheduleApi from '../api/analytics/ScheduleApi';

export interface IStoresContextValue {
    statusStore: StatusStore,
    themeStore: ThemeStore,
    panelStore: PanelStore,
    dialogStore: DialogStore,
    eventsStore: EventsStore,
    groupStore: GroupStore,
    checkboxStore: CheckboxStore,
    indicatorStore: IndicatorStore,
    contactsStore: ContactStore,
    newsStore: NewsStore,
    adminsStore: AdminsStore,
    requestStore: RequestStore,
    dnevnikStore: DnevnikStore,
    hteacherStore: HTeacherStore,
    scheduleStore: ScheduleStore,
    zvonkiStore: ZvonkiStore
}

export interface IControllersContextValue {
    mainApi: MainApi,
    mainController: MainController,
    notificationController: NotificationController,
    startController: StartController,
    tutorController: TutorController,
    contactController: ContactController,
    adminController: AdminController,
    peopleController: PeopleController,
    newsController: NewsController,
    requestController: RequestController,
    dnevnikController: DnevnikController,
    hteacherController: HTeacherController,
    settingController: SettingController,
    scheduleController: ScheduleController
}

const ContextStores = createContext<any | null>(
    null,
) as Context<any>;
export { ContextStores };

export function initContextsValues() {
    const stores: IStoresContextValue = {
        statusStore: new StatusStore(),
        themeStore: new ThemeStore(),
        panelStore: new PanelStore(),
        dialogStore: new DialogStore(),
        eventsStore: new EventsStore(),
        groupStore: new GroupStore(),
        checkboxStore: new CheckboxStore(),
        indicatorStore: new IndicatorStore(),
        contactsStore: new ContactStore(),
        newsStore: new NewsStore(),
        adminsStore: new AdminsStore(),
        requestStore: new RequestStore(),
        dnevnikStore: new DnevnikStore(),
        hteacherStore: new HTeacherStore(),
        scheduleStore: new ScheduleStore(),
        zvonkiStore: new ZvonkiStore()
    };

    const mainApi = new MainApi();
    const peopleController = new PeopleController(
        mainApi,
        stores.groupStore,
        new PeopleApi()
    );
    const controllers: IControllersContextValue = {
        mainApi: mainApi,
        mainController: new MainController(
            mainApi,
            stores.statusStore,
            stores.dialogStore,
            stores.eventsStore
        ),
        notificationController: new NotificationController(),
        startController: new StartController(
            new StartApi(),
            stores.dialogStore,
            stores.eventsStore,
            mainApi,
            stores.statusStore
        ),
        tutorController: new TutorController(
            mainApi,
            new TutorApi(),
            stores.eventsStore
        ),
        contactController: new ContactController(
            mainApi,
            new ContactApi(),
            stores.contactsStore
        ),
        adminController: new AdminController(
            mainApi,
            stores.eventsStore,
            new AdminApi(),
            stores.adminsStore
        ),
        peopleController: peopleController,
        newsController: new NewsController(
            mainApi,
            stores.newsStore,
            new NewsApi()
        ),
        requestController: new RequestController(
            mainApi,
            new RequestApi(),
            stores.requestStore
        ),
        dnevnikController: new DnevnikController(
            mainApi,
            new DnevnikApi(),
            stores.dnevnikStore,
            stores.scheduleStore
        ),
        hteacherController: new HTeacherController(
            mainApi,
            new HTeacherApi(),
            stores.hteacherStore,
            stores.statusStore,
            stores.eventsStore
        ),
        settingController: new SettingController(
            mainApi,
            new SettingApi(),
            stores.statusStore,
            stores.eventsStore,
            stores.dialogStore,
            stores.checkboxStore
        ),
        scheduleController: new ScheduleController(
            mainApi,
            new ScheduleApi(),
            stores.scheduleStore,
            stores.groupStore,
            stores.statusStore,
            peopleController
        )
    };

    return {
        stores,
        controllers,
    };
}