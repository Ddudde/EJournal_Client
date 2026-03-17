import type { ReactElement} from "react";
import {Component} from "react";
import withRouterHOC from "../../utils/withRouterHOC";
import Main from "./Main";
import type { NavigateFunction } from "react-router-dom";

interface Props {
    navigate?: any;
};

class Redirect extends Component {
    private navigate: NavigateFunction

    public constructor(props: Props) {
        super(props);
        this.navigate = props.navigate;
    }

    private navigateWithSkipWarning(path: string): void{
        setTimeout(() => {this.navigate(path)});
    }

    public componentDidMount(): void {
        console.log("I was triggered during componentDidMount Redirect");
        this.navigateWithSkipWarning(Main.prefSite);
    }

    public render(): ReactElement {
        return <></>;
    }
}

export default withRouterHOC(Redirect);