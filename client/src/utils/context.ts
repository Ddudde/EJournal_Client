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
import MainController from '../controllers/MainController';
import MainApi from '../api/MainApi';
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
    adminsStore: AdminsStore
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
    newsController: NewsController
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
        adminsStore: new AdminsStore()
    };

    const mainApi = new MainApi();
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
        peopleController: new PeopleController(
            mainApi,
            stores.groupStore,
            new PeopleApi()
        ),
        newsController: new NewsController(
            mainApi,
            stores.newsStore,
            new NewsApi()
        )
    };

    return {
        stores,
        controllers,
    };
}