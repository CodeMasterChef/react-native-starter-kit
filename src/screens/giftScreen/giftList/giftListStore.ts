import { observable, autorun, computed } from 'mobx';
import { Voucher } from '../../../@model/voucher';
import { loyaltyApi } from '../../../api/loyaltyApi';
import { toastHelper } from '../../../helpers/toastHelper';
import I18n from 'react-native-i18n';
import { StatusCodeEnum } from '../../../enum/statusCodeEnum';
import { timeHelper } from '../../../helpers/timeHelper';
import { appRoutes } from '../../../navigators/appRoutes';
import { voucherDetailScreenParams } from '../../voucherDetailScreen/voucherDetailScreen';
import { NavigationScreenProp } from 'react-navigation';
import { VoucherDetailScreenStore } from '../../voucherDetailScreen/voucherDetailScreenStore';


export class GiftListStore {

    @observable
    isRefreshing = false;

    @observable
    vouchers = [] as Voucher[];

    isUsedAndExpired = false;

    todayMilliseconds = Date.now();

    constructor(isUsedAndExpired: boolean) {
        this.isUsedAndExpired = isUsedAndExpired;
        autorun(async () => {
            await this.onRefresh();
        })
    }

    onRefresh = async () => {
        this.isRefreshing = true;
        const response = await loyaltyApi.getAllReceivedVouchers(this.isUsedAndExpired);
        if (response && response.data && response.data.items && response.status_code === StatusCodeEnum.success) {
            this.vouchers = response.data.items;
        } else {
            toastHelper.infoWithCenter(I18n.t('can_not_load_data_now'));
        }
        this.isRefreshing = false;
    }


    onPressVoucherItem = (voucher: Voucher, navigation?: NavigationScreenProp<any>) => {
        const voucherDetailScreenStore = new VoucherDetailScreenStore(voucher);
        navigation?.navigate(appRoutes.voucherDetailScreen,
            {
                [voucherDetailScreenParams.store]: voucherDetailScreenStore,
            });
    }

    getExpiredDateFormat(voucher: Voucher) {
        let date = '';
        if (voucher) {
            if (voucher.startDate) {
                date += `${I18n.t('from_date')} ${timeHelper.convertTimestampToDayMonthYear(voucher.startDate)} `;
            }

            if (voucher.expDate) {
                date += `${I18n.t('to_date')} ${timeHelper.convertTimestampToDayMonthYear(voucher.expDate)} `;
            }
        }
        return date;
    }

}