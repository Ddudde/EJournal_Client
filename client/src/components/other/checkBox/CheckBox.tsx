import type { ReactElement} from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import checkBoxCSS from './checkBox.module.css';
import { ContextStores } from "../../../utils/context";
import type CheckboxStore from "../../../store/other/CheckboxStore";

const CheckInputWithoutStoreAndWarn = ({...rest}) => {
    return <input {...rest} className={checkBoxCSS.inp} type="checkbox"/>
}

interface Props {
    checkbox_id?: any;
    state?: any;
    text?: any;
};

@observer
export default class CheckBox extends Component<Props> {
    static contextType = ContextStores;
    context: any;
    private checkBoxState: CheckboxStore;

	public UNSAFE_componentWillMount(): void {
		const {checkboxStore} = this.context.stores;
		this.checkBoxState = checkboxStore;
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount CheckBox");
        if(this.checkBoxState.checkBoxes[this.props.checkbox_id] == undefined) {
            this.checkBoxState.changeCheckBox(this.props.checkbox_id, this.props.state ? false : true);
        }
    }

    public render(): ReactElement {
        return <div className={checkBoxCSS.block}>
            <CheckInputWithoutStoreAndWarn {...this.props}
                checked={this.checkBoxState.checkBoxes[this.props.checkbox_id] ? "checked" : ""}
                onChange={() => {this.checkBoxState.changeCheckBox(this.props.checkbox_id, this.checkBoxState.checkBoxes[this.props.checkbox_id])}}
            />
            <div className={checkBoxCSS.tex}>
                {this.props.text}
            </div>
        </div>;
    }
}