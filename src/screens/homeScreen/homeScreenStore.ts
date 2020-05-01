import { Voucher } from './../../@model/voucher';
import { appRoutes } from './../../navigators/appRoutes';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { utilityApi } from './../../api/utilityApi';
import { Category } from './../../@model/category';
import { observable } from 'mobx';
import { appStore } from '../../appStore';
import { NavigationScreenProp } from 'react-navigation';
export class HomeScreenStore {

    @observable
    categories!: Category[];

    @observable
    vouchers!: Voucher[];

    constructor() {
        this.initData();
    }

    initData = async () => {

    }

    onPressScanButton = () => {
        appStore.isVisibleScannerModal = true;
    }

    onPressVoucherButton = (navigation: NavigationScreenProp<any>) => {
        navigation.navigate(appRoutes.giftScreen);
    }

    onPressEarnPointButton = (navigation: NavigationScreenProp<any>) => {
        navigation.navigate(appRoutes.userCodeScreen);
    }

    onPressExchangePointButton = (navigation: NavigationScreenProp<any>) => {
        navigation.navigate(appRoutes.exchangePointScreen);
    }

    onPressWalletButton = (navigation: NavigationScreenProp<any>) => {
        navigation.navigate(appRoutes.walletScreen);
    }

    onPressAllVoucherButton = (navigation: NavigationScreenProp<any>) => {
        navigation.navigate(appRoutes.voucherListScreen);
    }

    onPressSearchButton = (navigation: NavigationScreenProp<any>) => {
        navigation.navigate(appRoutes.searchScreen);
    }


}

