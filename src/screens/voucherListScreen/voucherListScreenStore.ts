import { loyaltyApi } from './../../api/loyaltyApi';
import { Voucher } from './../../@model/voucher';
import { observable } from 'mobx';
import { StatusCodeEnum } from '../../enum/statusCodeEnum';
import { toastHelper } from '../../helpers/toastHelper';
import I18n from 'react-native-i18n';

const limit = 10;

export class VoucherListScreenStore {

    @observable
    vouchers = [] as Voucher[];

    offset = 0;

    @observable
    isRefreshing = false;

    @observable
    isLoadingMore = false;

    finishFirstLoad = false;


    constructor() {
        this.onRefresh();

    }

    onRefresh = async () => {
        this.isRefreshing = true;
        this.offset = 0;
        await this.getVouchers(true);
        this.isRefreshing = false;
        this.finishFirstLoad = true;
    }

    loadMore = async () => {
        this.offset++;
        this.isLoadingMore = true;
        const haveMore = await this.getVouchers(false);
        if (!haveMore) {
            this.offset--;
        }
        this.isLoadingMore = false;

    }

    getVouchers = async (isRefresh: boolean) => {
        const responseData = await loyaltyApi.getBrandVouchers(undefined, this.offset, limit);
        if (responseData.status_code === StatusCodeEnum.success && responseData.data) {
            const gotVouchers = responseData.data.items;
            if (gotVouchers && gotVouchers.length) {
                if (isRefresh) {
                    this.vouchers = gotVouchers;
                } else {
                    this.vouchers = [...this.vouchers, ...gotVouchers];
                }
            } else {
                toastHelper.info(I18n.t('all_loading_information'));
            }
            return true;
        } else {
            toastHelper.warning(I18n.t('can_not_load_data_now'));
            return false;
        }

    }
}