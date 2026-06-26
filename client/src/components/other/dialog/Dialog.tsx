import type { ReactElement} from "react";
import {Component} from "react";
import button from "../../button.module.css";
import dialogCSS from './dialog.module.css';
import {observer} from "mobx-react";
import type DialogStore from "../../../store/other/DialogStore";
import { ContextStores } from "../../../utils/context";

interface Props {
};

@observer
export default class Dialog extends Component {
    static contextType = ContextStores;
	context: any;
    private dialogInfo: DialogStore;

    public constructor(props: Props) {
        super(props);
    }

	public UNSAFE_componentWillMount(): void {
		const {dialogStore} = this.context.stores;
		this.dialogInfo = dialogStore;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Dialog");
    }

    componentWillUnmount(): void {
        console.log("I was triggered during componentWillUnmount Dialog");
    }

    public render(): ReactElement {
        return this.dialogInfo.obj && <div className={dialogCSS.over}>
            <div className={dialogCSS.block}>
                {this.dialogInfo.obj}
                <div className={dialogCSS.blockBut}>
                    {this.dialogInfo.buts && Object.getOwnPropertyNames(this.dialogInfo.buts).map((param, i, x, but = this.dialogInfo.buts[param]) =>
                        <div className={button.button+" "+dialogCSS.but} onClick={but.fun} data-enable={+but.enab} key={i}>
                            {but.text}
                        </div>
                    )}
                </div>
            </div>
        </div>;
    }
}