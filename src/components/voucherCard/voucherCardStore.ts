import { Voucher } from './../../@model/voucher';
import { NavigationScreenProp } from 'react-navigation';
import { VoucherDetailScreenStore } from '../../screens/voucherDetailScreen/voucherDetailScreenStore';
import { appRoutes } from '../../navigators/appRoutes';
import { voucherDetailScreenParams } from '../../screens/voucherDetailScreen/voucherDetailScreen';
import { observable, action, computed } from 'mobx';
import I18n from 'react-native-i18n';
import { timeHelper } from '../../helpers/timeHelper';
import { Clipboard, Linking } from 'react-native';
import { toastHelper } from '../../helpers/toastHelper';
import { OpeningPageModalStore } from '../openingPageModal/openingPageModalStore';
import { CopyVoucherCodeSuccessModalStore } from '../copyVoucherCodeSuccessModal/copyVoucherCodeSuccessModalStore';

export class VoucherCardStore {

    @observable
    voucher!: Voucher;

    @observable
    isPressed = false;

    @observable
    isOpenWeb = false;

    openingPageModalStore = new OpeningPageModalStore();

    successToast: any;

    copyVoucherCodeSuccessModalStore = new CopyVoucherCodeSuccessModalStore();

    @action
    setVoucher = (voucher: Voucher) => {
        this.voucher = voucher;
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

    onPressVoucherCard = (navigation: NavigationScreenProp<any>) => {
        const voucherDetailScreenStore = new VoucherDetailScreenStore(this.voucher);
        navigation?.navigate(appRoutes.voucherDetailScreen,
            {
                [voucherDetailScreenParams.store]: voucherDetailScreenStore,
            });
    }

    onPressCrawlerVoucherButton = () => {
        this.isPressed = true;
        const code = this.voucher?.code;
        if (code) {
            Clipboard.setString(code);
            this.copyVoucherCodeSuccessModalStore.show();
            this.copyVoucherCodeSuccessModalStore.navigate();
        } else if (this.voucher?.url) {
            const url = this.voucher?.url as string;
            this.openingPageModalStore.show();
            setTimeout(() => {
                this.openingPageModalStore.hide();
                Linking.openURL(url).then(() => {
                    this.isOpenWeb = true;
                }).catch(() => { });
            }, 1500);
        }


    }

}

