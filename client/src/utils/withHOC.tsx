import type { ElementType } from "react";
import type {NavigateFunction, Params} from "react-router-dom";
import { useNavigate, useParams} from "react-router-dom";

const withRouterHOC: any = (WrappedComponent: ElementType, enableParam?: boolean) => (props: any) => {
    const navigate: NavigateFunction = useNavigate();
    let params: Readonly<Params<string>> | undefined;
    if(enableParam) params = useParams();
    return <WrappedComponent {...props} navigate={navigate} params={params}/>;
}

export const withParamsHOC: any = (WrappedComponent: ElementType) => (props: any) => {
    const params: Readonly<Params<string>> = useParams();
    return <WrappedComponent {...props} params={params}/>;
}

export default withRouterHOC;