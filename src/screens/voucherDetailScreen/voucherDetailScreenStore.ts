import { timeHelper } from './../../helpers/timeHelper';
import { toastHelper } from './../../helpers/toastHelper';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { loyaltyApi } from './../../api/loyaltyApi';
import { Voucher } from './../../@model/voucher';
import { observable, computed } from 'mobx';
import { NavigationScreenProp } from 'react-navigation';
import I18n from 'react-native-i18n';
import { Clipboard, Linking } from 'react-native';
import { stores } from '../../stores';
import { OpeningPageModalStore } from '../../components/openingPageModal/openingPageModalStore';

export class VoucherDetailScreenStore {

    @observable
    isRefreshing = false;

    @observable
    voucher: Voucher;

    @observable
    isWebviewLoadEnd = false;

    @observable
    isSubmitting = false;

    @observable
    isPressedShowCrawlerVoucherCode = false;

    @observable
    isOpenWeb = false;

    openingPageModalStore = new OpeningPageModalStore();

    constructor(voucher: Voucher) {
        this.voucher = voucher;
        // We only need get voucher detail to update view number when navigating from voucher card. (id !== undefined).
        // We must not get voucher detail when navigating from my vouchers screen (id === undefined).
        if (voucher?.id) {
            this.getVoucherDetail(voucher.id);
        }
    }

    getVoucherDetail = async (voucherId: string) => {
        const response = await loyaltyApi.getVoucherById(voucherId);
        if (response.status_code === StatusCodeEnum.success) {
            this.voucher = response.data;
        }
    }

    onLoadEndWebView = () => {
        this.isWebviewLoadEnd = true;
    }
    @computed get getExpiredDateFormat() {
        let date = '';
        if (this.voucher) {
            if (this.voucher.startDate) {
                date += `${I18n.t('from_date')} ${timeHelper.convertTimestampToDayMonthYear(this.voucher.startDate)} `;
            }

            if (this.voucher.expDate) {
                date += `${I18n.t('to_date')} ${timeHelper.convertTimestampToDayMonthYear(this.voucher.expDate)} `;
            }
        }
        return date;
    }

    onPressBackButton = (navigation: NavigationScreenProp<any>) => {
        navigation?.goBack();
    }

    onPressCopyButton = () => {
        Clipboard.setString(this.voucher.code);
        toastHelper.success(`${I18n.t('copied')}: ${this.voucher.code}`);
    }

    onPressReceiveVoucherButton = async () => {
        this.isSubmitting = true;
        if (this.voucher && this.voucher.id) {
            const response = await loyaltyApi.receiveVoucher(this.voucher.id);
            if (response && response.status_code === StatusCodeEnum.success) {
                toastHelper.success(I18n.t('successfully'));
                const updatedVoucher = response.data;
                this.voucher.code = updatedVoucher.code;
                stores.newGiftStore?.onRefresh();
            } else if (response && response.status_code === StatusCodeEnum.notEnable) {
                toastHelper.error(I18n.t('out_of_amount'));
            } else if (response && response.status_code === StatusCodeEnum.accessDenied) {
                toastHelper.error(I18n.t('you_can_not_receive_this_voucher'));
            } else if (response && response.status_code === StatusCodeEnum.idInvalid) {
                toastHelper.error(I18n.t('voucher_is_invalid'));
            } else {
                toastHelper.error(I18n.t('error_undefined'));
            }
        }
        this.isSubmitting = false;
    }

    onPressCrawlerVoucherButton = () => {
        this.isPressedShowCrawlerVoucherCode = true;
        const code = this.voucher?.code;
        if (code) {
            Clipboard.setString(code);
            toastHelper.success(`${I18n.t('copied')}: ${code}`);

        }
        setTimeout(() => {
            if ((this.voucher?.url && !this.isOpenWeb) || (!code)) {
                const url = this.voucher?.url as string;
                this.openingPageModalStore.show();
                setTimeout(() => {
                    this.openingPageModalStore.hide();
                    Linking.openURL(url).then(() => {
                        this.isOpenWeb = true;
                    }).catch(() => { });
                }, 1500);
            }
        }, code ? 1500 : 0)



    }

}