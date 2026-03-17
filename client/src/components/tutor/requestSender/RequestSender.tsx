import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import { ContextStores } from "../../../utils/context";
import requestCSS from './request.module.css';
import tutorCSS from '../tutor.module.css';
import button from "../../button.module.css";
import type TutorController from "../../../controllers/TutorController";

interface Props {
};

@observer
export default class RequestSender extends Component {
    static contextType = ContextStores;
    context: any;
    private tutorController: TutorController;
    private inps: any = {};

    private chStatB(e): void {
        const el: HTMLInputElement = e.target;
        this.inps[el.id] = !el.validity.patternMismatch || !el.validity.typeMismatch ? el.value : false;
        if (this.inps[el.id]) {
            el.setAttribute("data-mod", '0');
        } else {
            el.setAttribute("data-mod", '1');
        }
        const but: HTMLElement = el.parentElement.parentElement.querySelector("."+button.button);
        if(but) {
            const state: string = +(this.inps.inpnnt_ && this.inps.inpnet_) + "";
            but.setAttribute("data-enable", state);
        }
    }

    private ele (x: boolean, nameProperty: string): ReactElement {
        if(!this.inps[nameProperty]) this.inps[nameProperty] = x;
        return null;
    }

	public UNSAFE_componentWillMount(): void {
		const {tutorController} = this.context.controllers;
        this.tutorController = tutorController;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount RequestSender");
        let el: HTMLInputElement | Element;
        for(el of document.querySelectorAll(" *[id^='inpn']")){
            this.chStatB({target: el});
        }
    }

    public render(): ReactElement {
        return <div className={tutorCSS.nav_iZag+" "+tutorCSS.nav_i+" req"}>
            <div className={tutorCSS.zag} id={tutorCSS.nav_i}>
                Заявка на подключение
            </div>
            <div className={tutorCSS.block}>
                Вы не имеете аккаунта и ваша школа ещё не подключена к нашей системе?
                <br/>Заполните форму ниже оставив ваши контактные данные и адрес электронной почты, мы с вами
                свяжемся.
                <div className={requestCSS.blockInp}>
                    <div className={requestCSS.preinf}>
                        ФИО:
                    </div>
                    <input className={requestCSS.inp} id={"inpnnt_"} placeholder={"Фамилия Имя Отчество"} onChange={this.chStatB.bind(this)} type="text"/>
                    {this.ele(false, "inpnnt_")}
                </div>
                <div className={requestCSS.blockInp}>
                    <div className={requestCSS.preinf}>
                        E-Mail:
                    </div>
                    <input className={requestCSS.inp} id={"inpnet_"} placeholder={"example@gmail.com"} onChange={this.chStatB.bind(this)} type="email"/>
                    {this.ele(false, "inpnet_")}
                </div>
                <div className={button.button} data-mod="2" onClick={e=>this.tutorController.addRequest(this.inps)}>
                    Отправить!
                </div>
            </div>
        </div>;
    }
}