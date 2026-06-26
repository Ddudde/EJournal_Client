import type { ReactElement} from "react";
import {Component} from "react";
import {inject, observer} from "mobx-react";
import errCSS from './error.module.css';
import warn from '../../../media/warn_big.png';
import {Helmet} from "react-helmet-async";
import type StatusStore from "../../../store/StatusStore";
import { ContextStores } from "../../../utils/context";

interface Props {
    text?: string;
};

@observer
export default class ErrFound extends Component<Props> {
    static contextType = ContextStores;
	context: any;
    private cState: StatusStore;
    private textError: string;

    public constructor(props: Props) {
        super(props);
        this.textError = props.text;
    }

	public UNSAFE_componentWillMount(): void {
		const {statusStore} = this.context.stores;
		this.cState = statusStore;
    }

    public render(): ReactElement {
        return this.textError ?
                <div className={errCSS.block}>
                    <img alt="banner" src={warn}/>
                    <div className={errCSS.block_text}>
                        {this.textError}
                    </div>
                </div>
            :
                <div className={errCSS.AppHeader}>
                    <Helmet>
                        <title>Ошибка</title>
                    </Helmet>
                    <div className={errCSS.block}>
                        <img alt="banner" src={warn}/>
                        {!this.cState.auth &&
                            <div className={errCSS.block_text}>
                                К сожалению, страница не найдена... Предлагаем изучить страницы на выбор ("Школам", "Педагогам", "Родителям", "Учащимся"). <br/>Также можете авторизоваться, тогда система предложит вам подходящую страницу по изучению портала.
                            </div>
                        }
                        {(this.cState.auth && this.cState.role == 3) &&
                            <div className={errCSS.block_text}>
                                К сожалению, страница не найдена... Предлагаем изучить страницу "Школам".
                            </div>
                        }
                        {(this.cState.auth && this.cState.role == 2) &&
                            <div className={errCSS.block_text}>
                                К сожалению, страница не найдена... Предлагаем изучить страницу "Педагогам".
                            </div>
                        }
                        {(this.cState.auth && this.cState.role == 1) &&
                            <div className={errCSS.block_text}>
                                К сожалению, страница не найдена... Предлагаем изучить страницу "Родителям".
                            </div>
                        }
                        {(this.cState.auth && this.cState.role == 0) &&
                            <div className={errCSS.block_text}>
                                К сожалению, страница не найдена... Предлагаем изучить страницу "Обучающимся".
                            </div>
                        }
                    </div>
                </div>;
    }
}