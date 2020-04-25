import { observable } from 'mobx';
import { appStore } from '../../appStore';
import { NavigationScreenProp } from 'react-navigation';
import { toastHelper } from '../../helpers/toastHelper';
import { appRoutes } from '../../navigators/appRoutes';

export class FoodDetailStore {

    food: any = {} as any;

    @observable showModal = false;

    @observable text = '';

    @observable toast: any

    constructor() {
        this.initData();
    }

    initData = async () => {

    }

    setState = (txt: any) => {
        this.text = txt;
    }

    onPressSubmit = (navigation: NavigationScreenProp<any>) => {
        if (this.toast) {
            this.showModal = false;
            this.toast.show('Successfully sent request', 2500);
        }
        setTimeout(() => {
            navigation.navigate(appRoutes.chatScreen)
        }, 800);
    }

    onPressRequest = () => {
        this.text = '';
        this.showModal = true;
    }

    onPressCloseRequest = () => {
        this.showModal = false;
    }

    onPressScanButton = () => {
        appStore.isVisibleScannerModal = true;
    }


}

