import { appStore } from './../../appStore';
import { deepLinkRoutes, appRoutes } from '../../navigators/appRoutes';
import { pointApi } from '../../api/pointApi';
import { StatusCodeEnum } from '../../enum/statusCodeEnum';
import { RequestEarnPointScreenStore } from '../requestEarnPointScreen/requestEarnPointScreenStore';
import { NavigationScreenProp } from 'react-navigation';
import { requestEarnPointScreenParams } from '../requestEarnPointScreen/requestEarnPointScreen';
import { stores } from '../../stores';
import { toastHelper } from '../../helpers/toastHelper';
import I18n from 'react-native-i18n';
import { Linking, Alert, Clipboard, Platform } from 'react-native';
import { observable } from 'mobx';


export class ScannerScreenStore {

    navigation!: NavigationScreenProp<any>;

    scanner: any;

    @observable
    isOpenFlash = false;

    @observable
    isLoading = false;

    @observable
    isVisibleDeepLinkSelectModal = true;

    constructor() {

    }

    onPressFlashButton = () => {
        this.isOpenFlash = !this.isOpenFlash;
    }

    onPressCloseButton = () => {
        appStore.isVisibleScannerModal = false;
    }

    onDetectCodeSuccessfully = async (event: any) => {

        const url = event.data;

        if (!url) {
            this.handleExceptionData(url);
            return;
        }

        // The URL will have format: https://loya.one/userapp?a=deepLinkRoute&param1=A&param2=B

        const temps = url?.split('?');
        if (!temps || (temps && temps.length !== 2)) {
            this.handleExceptionData(url);
            return;
        }
        const paramString = temps[1];
        const params = paramString ? JSON.parse('{"' + decodeURI(paramString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}') : null;
        if (!params) {
            this.handleExceptionData(url);
            return;
        }
        const deepLinkRoute = params.a;
        if (!deepLinkRoute) {
            this.handleExceptionData(url);
            return;
        }


        if (deepLinkRoute === deepLinkRoutes.all) {
            appStore.deepLinkSelectStore.setBrandId(params.id);
            appStore.isVisibleScannerModal = false;
            if (Platform.OS === 'ios') {
                setTimeout(() => {
                    // This is a hot fix for not open modal on iOS. May be the cause is the scanner view is not destroyed immediately.
                    // TODO: try to remove 1s timeout
                    appStore.deepLinkSelectStore.isVisible = true;
                }, 1000);
            } else {
                appStore.deepLinkSelectStore.isVisible = true;
            }
        } else if (deepLinkRoute === deepLinkRoutes.point) {
            await this.handleForEarnPointRequest(params.id);
        } else {
            this.handleExceptionData(url);
        }
    }

    private handleForEarnPointRequest = async (brandId: string) => {
        this.isLoading = true;
        const response = await pointApi.getBrandDetails(brandId);
        if (response.status_code === StatusCodeEnum.success) {
            const brand = response.data;

            const store = new RequestEarnPointScreenStore(brand);
            appStore.isVisibleScannerModal = false;
            stores.navigation.navigate(appRoutes.requestEarnPointScreen, {
                [requestEarnPointScreenParams.store]: store,
            });
            // With react-navigation, we can not navigate when the current route is requestEarnPointScreen, 
            // so that we need to update data on the store
            stores.requestEarnPointScreenStore?.setBrand(brand);
        } else {
            toastHelper.error(I18n.t('can_not_found_brand'));
        }
        this.isLoading = false;
    }

    handleExceptionData = (url: string) => {
        setTimeout(() => {
            this.scanner?.reactivate();
        }, 2000);
        if (!url) {
            return;
        }
        Linking.openURL(url).catch(() => {
            // the url does not have http:// or https://
            Alert.alert(
                I18n.t('confirm'),
                `${I18n.t('qr_content')}: ${url}`,
                [
                    { text: I18n.t('cancel'), onPress: () => { }, style: 'cancel' },
                    { text: I18n.t('copy'), onPress: () => { Clipboard.setString(url); } },
                ],
                { cancelable: true }
            )

        });

    }
}