import { toastHelper } from './../../helpers/toastHelper';
import { appStore } from './../../appStore';
import { LinkOrRegisterMemberModalStore } from './../../components/linkOrRegisterMemberModal/linkOrRegisterMemberModalStore';
import { RequestEarnPointScreenStore } from './../requestEarnPointScreen/requestEarnPointScreenStore';
import { appRoutes } from './../../navigators/appRoutes';
import { Voucher } from './../../@model/voucher';
import { loyaltyApi } from './../../api/loyaltyApi';
import { NavigationScreenProp } from 'react-navigation';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { pointApi } from './../../api/pointApi';
import { observable } from 'mobx';
import { Brand } from '../../@model/brand';
import I18n from 'react-native-i18n';
import { VoucherDetailScreenStore } from '../voucherDetailScreen/voucherDetailScreenStore';
import { voucherDetailScreenParams } from '../voucherDetailScreen/voucherDetailScreen';
import { requestEarnPointScreenParams } from '../requestEarnPointScreen/requestEarnPointScreen';

export class BrandProfileScreenStore {

    @observable
    brand = {} as Brand;

    @observable
    isRefreshing = false;

    @observable
    isRefreshingVoucher = false;

    @observable
    backTitle = I18n.t('brand');

    @observable
    vouchers = [] as Voucher[];

    brandId!: string;

    @observable
    isRegisterMember = false;

    linkOrRegisterMemberModalStore = new LinkOrRegisterMemberModalStore();


    constructor(brandId: string, showRegisterForm?: boolean) {
        this.init(brandId, showRegisterForm);
    }

    init = async (brandId: string, showRegisterForm?: boolean) => {
        this.brandId = brandId;
        await this.onRefresh();
        if (showRegisterForm) {
            this.onPressRegisterMemberButton();
        }
    }


    onPressBackButton = (navigation: NavigationScreenProp<any>) => {
        navigation?.goBack();
    }

    onPressVoucher = (voucher: Voucher, navigation: NavigationScreenProp<any>) => {
        const voucherDetailScreenStore = new VoucherDetailScreenStore(voucher);
        navigation?.navigate(appRoutes.voucherDetailScreen,
            {
                [voucherDetailScreenParams.store]: voucherDetailScreenStore,
            });
    }

    onRefresh = async () => {
        this.isRefreshing = true;
        const brandId = this.brandId;
        const response = await pointApi.getBrandDetails(brandId);
        if (response && response.status_code === StatusCodeEnum.success) {
            this.brand = response.data;
            this.linkOrRegisterMemberModalStore.initStore(this.brand);
            this.vouchers = await this.getBrandVouchers(brandId);
        }
        this.isRefreshing = false;
    }

    private getBrandVouchers = async (brandId: string) => {
        this.isRefreshingVoucher = true;
        const response = await loyaltyApi.getBrandVouchers(brandId);
        if (response.status_code === StatusCodeEnum.success) {
            this.isRefreshingVoucher = false;
            return response.data.items;
        } else {
            this.isRefreshingVoucher = false;
            return [];
        }

    }

    onPressExchangeButton = (navigation: NavigationScreenProp<any>) => {
        navigation?.navigate(appRoutes.exchangePointScreen);
    }

    onPressLinkMemberButton = () => {
        if (this.brand && this.brand.id) {
            this.linkOrRegisterMemberModalStore.initStore(this.brand);
            this.linkOrRegisterMemberModalStore.setIsRegisterMember(false);
            this.linkOrRegisterMemberModalStore.show();
        }
    }

    onPressRegisterMemberButton = () => {
        if (this.brand && this.brand.id) {
            this.linkOrRegisterMemberModalStore.initStore(this.brand);
            this.linkOrRegisterMemberModalStore.setIsRegisterMember(true);
            this.linkOrRegisterMemberModalStore.show();
        }
    }

    onPressEarnPointButton = (navigation: NavigationScreenProp<any>) => {
        const store = new RequestEarnPointScreenStore(this.brand);
        navigation?.navigate(appRoutes.requestEarnPointScreen, {
            [requestEarnPointScreenParams.store]: store
        });
    }

}