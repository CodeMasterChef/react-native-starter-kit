import { ExchangeTransaction } from './../../../api/pointApi';
import I18n from 'react-native-i18n';
import { observable, autorun } from 'mobx';
import { NavigationScreenProp } from 'react-navigation';
import { LoyalPointDepositTransaction, pointApi, ExchangeTransactionStatusEnum } from '../../../api/pointApi';
import { StatusCodeEnum } from '../../../enum/statusCodeEnum';
import { toastHelper } from '../../../helpers/toastHelper';

const limit = 10;

export class ExchangeHistoryStore {
    @observable
    isRefreshingTransactions = false;

    @observable
    isLoadingPage = false;

    @observable
    finishLoading = false;

    navigation = null as NavigationScreenProp<any> | null;

    offset = 0;


    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;
    }


    @observable
    transactions = [] as ExchangeTransaction[];

    constructor() {
        autorun(async () => {
            this.isLoadingPage = true;
            await this.onRefreshTransactions();
            this.isLoadingPage = false;
        })
    }

    onRefreshTransactions = async () => {
        this.offset = 0;
        this.isRefreshingTransactions = true;
        await this.getTransactions(false);
        this.isRefreshingTransactions = false;
    }

    private getTransactions = async (loadMore = false) => {
        let responseData;
        responseData = await pointApi.getExchangeTransactionHistory(this.offset, limit);
        if (responseData.status_code === StatusCodeEnum.success && responseData.data) {
            if (!loadMore) {
                this.transactions = responseData.data.items;
            } else if (responseData.data.items && responseData.data.items.length) {
                this.transactions = [...this.transactions, ...responseData.data.items];
            } else {
                this.finishLoading = true;
                toastHelper.info(I18n.t('all_loading_information'));
            }
        } else {
            toastHelper.warning(I18n.t('can_not_load_data_now'));
        }
    }

    onPressDepositTransactionItem = () => {

    }

    handleLoadMoreDepositTransactions = async () => {
        this.offset++;
        await this.getTransactions(true);
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

}