import { loyaltyApi } from './../../api/loyaltyApi';
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
        // get all categories
        const categoriesResponse = await utilityApi.getAllCategories();
        if (categoriesResponse.status_code === StatusCodeEnum.success && categoriesResponse.data) {
            this.categories = categoriesResponse.data.items;
        }
        // get all vouchers
        const voucherResponse = await loyaltyApi.getBrandVouchers();
        if (voucherResponse.status_code === StatusCodeEnum.success && voucherResponse.data) {
            this.vouchers = voucherResponse.data.items;
        }
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

