import MainApi from "../api/MainApi";
import { cSettings } from "../utils/apiPath";

export enum NotifEvent {
    REQUEST_PERMISSON = "REQUEST_PERMISSON"
}

export default class NotificationController {
    private userServFin: boolean = false;

    public constructor() {
    }

    public async requestPerm(messaging: any): Promise<string | undefined> {
        try {
            console.log("try request perm");
            await messaging.requestPermission();
            const token: string = await messaging.getToken();
            console.log('Your token is:', token);
            if(!token) return;

            if(this.userServFin){
                this.delNotifToken();
                this.addNotifToken(token);
            } else {
                window.addEventListener(NotifEvent.REQUEST_PERMISSON, e=> {
                    this.userServFin = true;
                    this.delNotifToken();
                    this.addNotifToken(token);
                }, {once: true});
            }
            return token;
        } catch (error) {
            console.log(error);
        }
    }

    private delNotifToken(): void {
        if(localStorage.getItem("notifToken")) {
            console.log("delNotifToken", localStorage.getItem("notifToken"));
            MainApi.sendToServer({
                notifToken: localStorage.getItem("notifToken")
            }, 'POST', cSettings + "remNotifToken");
            localStorage.removeItem("notifToken");
        }
    }

    private addNotifToken(token: string): void {
        console.log("addNotifToken", token);
        MainApi.sendToServer({
            notifToken: token
        }, 'POST', cSettings + "addNotifToken");
        localStorage.setItem("notifToken", token);
    }
}