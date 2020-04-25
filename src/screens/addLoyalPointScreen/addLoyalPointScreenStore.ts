import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { VnpayScreenParams } from './../vnpayScreen/vnpayScreen';
import { appRoutes } from './../../navigators/appRoutes';
import { toastHelper } from './../../helpers/toastHelper';
import { CreateLoyalPointsDepositRequestData, PaymentTypeEnum } from './../../api/pointApi';
import { numberHelper } from './../../helpers/numberHelper';
import { observable, autorun } from 'mobx';
import { pointApi } from '../../api/pointApi';
import I18n from 'react-native-i18n';
import { Alert } from 'react-native';
import { NavigationScreenProp, StackActions } from 'react-navigation';
import { TransactionDetailScreenParams } from '../transactionDetailScreen/transactionDetailScreen';

export class AddLoyalPointScreenStore {

    @observable
    lopAmount = '0';

    @observable
    vndAmount = 0;

    @observable
    isProgressing = false;

    conversionRate = 0;

    @observable
    isVisibleBankTransferModal = false;

    private navigation = {} as NavigationScreenProp<any>;

    constructor() {
        autorun(async () => {
            await this.getLoyalPointsConversionRate();
        })
    }

    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;
    }

    private getLoyalPointsConversionRate = async () => {
        const responseData = await pointApi.getLoyalPointConversionRate();
        if (responseData.status_code === StatusCodeEnum.success && responseData.data && responseData.data.value) {
            this.conversionRate = Number(responseData.data.value);
        }
    }

    onChangeLopAmountInput = (text: string) => {
        this.lopAmount = text;
        try {
            const lop = numberHelper.textToNumber(text);
            if (lop) {
                this.vndAmount = this.conversionRate * lop;
            } else {
                this.vndAmount = 0;
            }
        } catch (err) {
            console.log(err);
        }
    }

    onFocusLoyalPointInput = () => {
        if (this.lopAmount === '0') {
            this.lopAmount = '';
        }
    }

    onPressBankTransferCard = () => {
        this.isVisibleBankTransferModal = true;
    }

    onPressAgreeBankTransfer = async () => {
        const point = numberHelper.textToNumber(this.lopAmount);
        if (point) {
            const requestData: CreateLoyalPointsDepositRequestData = {
                point,
                paymentType: PaymentTypeEnum.cash,
            };
            this.isProgressing = true;
            const responseData = await pointApi.createLoyalPointDeposit(requestData);
            if (responseData.status_code === StatusCodeEnum.success) {
                toastHelper.success(I18n.t('create_point_deposit_request_successfully'));
                if (this.navigation) {
                    this.isVisibleBankTransferModal = false;
                    const transaction = responseData.data;
                    const replaceAction = StackActions.replace({
                        routeName: appRoutes.transactionDetailScreen,
                        params: {
                            [TransactionDetailScreenParams.transaction]: transaction
                        }
                    });
                    this.navigation.dispatch(replaceAction);
                }
            } else {
                toastHelper.error(I18n.t('error_undefined_try_again'));
            }
            this.isProgressing = false;
        }


    }

    onPressCancelBankTransfer = () => {
        this.isVisibleBankTransferModal = false;
    }

    onPressVnpayTransferCard = async () => {
        Alert.alert(
            I18n.t('confirm'),
            I18n.t('confirm_vnpay_payment'),
            [
                {
                    text: I18n.t('cancel'),
                    style: 'cancel',
                    onPress: () => console.log('Cancel Pressed'),

                },
                {
                    text: I18n.t('continue'),
                    onPress: this.continueVnpay,
                },
            ],
            { cancelable: false },
        );

    }

    private continueVnpay = async () => {
        this.isProgressing = true;
        const point = numberHelper.textToNumber(this.lopAmount);
        if (point) {
            const requestData: CreateLoyalPointsDepositRequestData = {
                point,
                paymentType: PaymentTypeEnum.vnpay,
                remoteAddress: '127.0.0.1',
            };
            const responseData = await pointApi.createLoyalPointDeposit(requestData);
           
            if (responseData.status_code === StatusCodeEnum.success) {
                if (this.navigation && responseData.data && responseData.data.vnPayLink) {
                    const replaceAction = StackActions.replace({
                        routeName: appRoutes.transactionDetailScreen,
                        params: {
                            [TransactionDetailScreenParams.transaction]: responseData.data,
                            [TransactionDetailScreenParams.openVNPAY]: true,
                        }
                    });
                    this.navigation.dispatch(replaceAction);
                }
            } else if (responseData.status_code === StatusCodeEnum.userInvalid) {
                toastHelper.error(I18n.t('error_undefined_try_again'));
            } else {
                toastHelper.error(I18n.t('error_undefined_try_again'));
            }
            this.isProgressing = false;
        }


        this.isProgressing = false;
    }


}



