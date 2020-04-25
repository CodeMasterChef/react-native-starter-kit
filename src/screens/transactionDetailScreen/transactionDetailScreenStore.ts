import { toastHelper } from './../../helpers/toastHelper';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { pointApi, UpdateDepositRequest, LoyalPointDepositTransaction, UpdateDepositRequestStatus, payWithVNPayRequest } from './../../api/pointApi';
import { autorun, observable } from 'mobx';
import { NavigationScreenProp } from 'react-navigation';
import { ExchangeTransactionStatusEnum } from '../../api/pointApi';
import I18n from 'react-native-i18n';
import { Alert, Linking } from 'react-native';

export class TransactionDetailScreenStore {

    navigation = null as NavigationScreenProp<any> | null;

    @observable
    isLoadingCancel = false;

    @observable
    isLoadingPay = false;

    @observable
    transaction = {} as LoyalPointDepositTransaction;

    @observable
    isRefreshing = false;

    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;

    }

    setTransaction = (transaction: LoyalPointDepositTransaction) => {
        if (transaction) {
            this.transaction = transaction;
        }
    }

    constructor() {
        autorun(async () => {

        })
    }

    onRefresh = async () => {
        this.isRefreshing = true;
        if (this.transaction) {
            const responseData = await pointApi.getLOPDepositTransaction(this.transaction.id);
            if (responseData.status_code === StatusCodeEnum.success) {
                this.transaction = responseData.data;
            } else {
                toastHelper.error(I18n.t('not_refresh_now'));
            }
        }

        this.isRefreshing = false;
    }

    getStatusTranslatedLabel = (status: ExchangeTransactionStatusEnum) => {
        if (status === ExchangeTransactionStatusEnum.new) {
            return I18n.t('pending');
        } else if (status === ExchangeTransactionStatusEnum.cancelled) {
            return I18n.t('cancelled');
        } else if (status === ExchangeTransactionStatusEnum.rejected) {
            return I18n.t('rejected');
        } else if (status === ExchangeTransactionStatusEnum.completed) {
            return I18n.t('completed');
        } else {
            return status;
        }
    }

    onPressCancelButton = async () => {
        Alert.alert(
            I18n.t('confirm'),
            I18n.t('confirm_cancel_deposit_transaction'),
            [
                {
                    text: I18n.t('close'),
                    style: 'cancel',
                    onPress: () => console.log('Cancel Pressed'),

                },
                {
                    text: I18n.t('destroy_transaction'),
                    onPress: this.onPressConfirmCancelButton,
                    style: 'destructive',
                },
            ],
            { cancelable: false },
        );

    }



    private onPressConfirmCancelButton = async () => {
        this.isLoadingCancel = true;
        const requestData: UpdateDepositRequest = {
            id: this.transaction.id,
            status: UpdateDepositRequestStatus.cancelled,
        }
        const responseData = await pointApi.updateDeposit(requestData);
        if (responseData.status_code === StatusCodeEnum.success) {
            toastHelper.success(I18n.t('cancel_deposit_transaction_successfully'));
            this.transaction.status = ExchangeTransactionStatusEnum.cancelled;
        } else if (responseData.status_code === StatusCodeEnum.notFound) {
            toastHelper.error(I18n.t('transaction_can_not_cancel'));
        } else if (responseData.status_code === StatusCodeEnum.userInvalid) {
            toastHelper.error(I18n.t('use_invalid'));
        } else if (responseData.status_code === StatusCodeEnum.errorUndefined) {
            toastHelper.error(I18n.t('error_undefined'));
        } else if (responseData.status_code === StatusCodeEnum.invalidStatus) {
            toastHelper.error(I18n.t('invalid_status'));
        } else if (responseData.status_code === StatusCodeEnum.accessDenied) {
            toastHelper.error(I18n.t('access_denied'));
        }
        this.isLoadingCancel = false;
    }

    onPressPayButton = async () => {
        this.isLoadingPay = true;
        if (this.navigation) {
            const payWithVNPayRequest: payWithVNPayRequest = {
                id: this.transaction.id,
                remoteAddress: '127.0.0.1',
            }
            const response = await pointApi.payWithVnpay(payWithVNPayRequest);
            if (response && response.status_code === StatusCodeEnum.success) {
                const { vnPayLink } = response.data;
                if (vnPayLink) {
                    Linking.openURL(vnPayLink).catch(err => {
                        toastHelper.error(I18n.t('vnpay_not_support_now'));
                        console.error('An error occurred when load url', err);
                    });
                }
            }

        }
        this.isLoadingPay = false;
    }

}
