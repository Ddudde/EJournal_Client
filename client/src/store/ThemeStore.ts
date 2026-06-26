import {makeAutoObservable} from 'mobx';

const x: boolean = !window.matchMedia('(prefers-color-scheme: dark)');

export default class ThemeStore {
    public theme_ch: boolean = x
    public theme: string = x ? "светлая" : "тёмная"
    public thP = {
        true: {
            c: "theme_light",
            p: "theme_dark",
            params: {
                "--bgcV1": "#DBDBDBe6",
                "--bgcV2": "#242424e6",
                "--bgcV3": "#000000b3",
                "--shdV1": "#fff",
                "--shdV2": "#000",
                "--cV1": "#006600",
                "--cV2": "#009900",
                "--cV3": "#090a0b",
                "--bcV1": "#4d4d4d",
                "--bcV2": "#090a0b",
            }
        },
        false: {
            c: "theme_dark",
            p: "theme_light",
            params: {
                "--bgcV1": "#242424e6",
                "--bgcV2": "#DBDBDBe6",
                "--bgcV3": "#0000004d",
                "--shdV1": "#000",
                "--shdV2": "#fff",
                "--cV1": "#009900",
                "--cV2": "#00bb00",
                "--cV3": "#f5f6f7",
                "--bcV1": "#b3b3b3",
                "--bcV2": "#f5f6f7",
            }
        }
    }
    
    public constructor() {
        makeAutoObservable(this);
    }

    public setThemeToView(): void{
        const theme_ch: string = this.theme_ch + "";
        document.body.setAttribute(this.thP[theme_ch].c, '');
        if(document.body.hasAttribute(this.thP[theme_ch].p)) {
            document.body.removeAttribute(this.thP[theme_ch].p);
        }
        Object.getOwnPropertyNames(this.thP[theme_ch].params).map(param =>
            document.documentElement.style.setProperty(param, this.thP[theme_ch].params[param])
        );
    }

	public changeTheme (themeState: boolean): void {
        const stat: boolean = !themeState;
		this.theme_ch = stat;
		this.theme = stat ? "светлая" : "тёмная";
        this.setThemeToView();
	}
}