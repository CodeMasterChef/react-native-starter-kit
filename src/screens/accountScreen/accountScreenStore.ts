import { localAppStorageHelper } from './../../helpers/localAppStorageHelper';
import { appRoutes } from './../../navigators/appRoutes';
import { observable, action } from 'mobx';
import { NavigationScreenProp } from 'react-navigation';
import { Alert } from 'react-native';
import I18n from 'react-native-i18n';
import { appStore } from '../../appStore';
import { toastHelper } from '../../helpers/toastHelper';

export class AccountScreenStore {

    @observable
    name = '';

    @observable
    urlAvatar = '';

    count = 0;

    private navigation = {} as NavigationScreenProp<any>;

    @action
    setName = (name: string) => {
        this.name = name;
    }

    @action
    setUrlAvatar = (url: string) => {
        this.urlAvatar = url;
    }


    constructor() {
    }

    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;
    }

    getAccountInfo = async () => {
        const account = await localAppStorageHelper.getAccount();
        this.name = account.name;
        this.urlAvatar = account.urlAvatar;
    }



    onPressHistoryButton = () => {
        if (this.navigation) {
            this.navigation.navigate(appRoutes.historyScreen);
        }
    }

    onPressLogoutButton = () => {
        Alert.alert(
            I18n.t('confirm'),
            I18n.t('confirm_logout'),
            [
                {
                    text: I18n.t('cancel'),
                    onPress: () => { },
                    style: 'cancel',

                },
                {
                    text: I18n.t('logout'),
                    onPress: this.logout,
                },
            ],
            { cancelable: false },
        );
    }

    logout = async () => {
        if (this.navigation) {
            await localAppStorageHelper.clear();
            this.navigation.navigate(appRoutes.authNavigator);
        }
    }

    onPressVersionLabel = () => {
        this.count++;
        if (this.count % 20 === 0) {
            appStore.devMode = false;
            toastHelper.info('debug mode is off.');
        } else if (this.count >= 10) {
            appStore.devMode = true;
            toastHelper.info('debug mode is enabled.');
        }
    }

    onPressUserProfileButton = () => {
        this.navigation?.navigate(appRoutes.userProfileScreen);
    }

    onPressUserCodeButton = ()=>{
        this.navigation?.navigate(appRoutes.userCodeScreen);
    }

}