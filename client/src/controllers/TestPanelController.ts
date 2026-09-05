import type MainApi from "../api/main/MainApi";
import type TestPanelApi from "../api/TestPanelApi";
import type CheckboxStore from "../store/other/CheckboxStore";
import type TestPanelStore from "../store/TestPanelStore";

export default class TestPanelController {
    private mainApi: MainApi;
    private testPanelApi: TestPanelApi;
    private testInfo: TestPanelStore;
    private checkBoxInfo: CheckboxStore;

    public constructor(mainApi: MainApi, testPanelApi: TestPanelApi, testInfo: TestPanelStore, checkBoxInfo: CheckboxStore) {
        this.mainApi = mainApi;
        this.testPanelApi = testPanelApi;
        this.testInfo = testInfo;
        this.checkBoxInfo = checkBoxInfo;
    }

    public async chNotif(id: string): Promise<void> {
        console.log(id, this.checkBoxInfo.checkBoxes[id]);
        const data: any = await this.testPanelApi.chNotif(id, !this.checkBoxInfo.checkBoxes[id]);
        if(data.status == 200){
            this.testInfo.cloneTest(data.body.bodyT);
        }
    }

    public async getInfo(): Promise<void> {
        const data: any = await this.testPanelApi.getInfo();
        if(data.status == 200){
            for(const id in data.body.bodyS) {
                this.checkBoxInfo.changeCheckBox(id, !data.body.bodyS[id]);
            }
            this.testInfo.cloneTest(data.body.bodyT);
        }
    }
    
    public didMount(): void {
        if(this.mainApi.getReadyStateSSE() == EventSource.OPEN) this.getInfo();
        this.mainApi.addEventListenerSSE('connect', this.getInfo.bind(this));
    }

    public willUnmount(): void {
        this.mainApi.removeEventListenerSSE('connect', this.getInfo.bind(this));
    }
}