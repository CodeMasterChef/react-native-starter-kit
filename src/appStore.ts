import { appConfig } from './appConfig';
import { DeepLinkSelectStore } from './components/deepLinkSelect/deepLinkSelectStore';
import Toast from './components/toast/index';
import { observable, autorun } from 'mobx';
import { localAppStorageHelper } from './helpers/localAppStorageHelper';

class AppStore {
    sessionExpiredModalStore = {};

    successToast!: Toast;

    errorToast!: Toast;

    warningToast!: Toast;

    bottomInfoToast!: Toast;

    centerInfoToast!: Toast;

    @observable
    envName: string = appConfig.config.name;

    @observable
    version: string = appConfig.config.appVersion;

    @observable
    devMode = false;

    @observable
    isReadIntro = false;

    @observable
    isLoading = true;

    @observable
    isVisibleScannerModal = false;


    deepLinkSelectStore = new DeepLinkSelectStore();


    constructor() {
        autorun(async () => {
            this.isLoading = true;
            appStore.isReadIntro = await localAppStorageHelper.getIsReadIntro();
            this.isLoading = false;
        })
    }
}

export const appStore = new AppStore();