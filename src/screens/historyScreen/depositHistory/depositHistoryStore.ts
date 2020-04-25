import { TransactionDetailScreenParams } from './../../transactionDetailScreen/transactionDetailScreen';
import I18n from 'react-native-i18n';
import { observable, autorun } from 'mobx';
import { NavigationScreenProp, NavigationActions } from 'react-navigation';
import { LoyalPointDepositTransaction, pointApi, ExchangeTransactionStatusEnum } from '../../../api/pointApi';
import { StatusCodeEnum } from '../../../enum/statusCodeEnum';
import { toastHelper } from '../../../helpers/toastHelper';
import { appRoutes } from '../../../navigators/appRoutes';

const limit = 10;

export class DepositHistoryStore {
    @observable
    isRefreshingDepositTransactions = false;

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
    depositTransactions = [] as LoyalPointDepositTransaction[];

    constructor() {
        autorun(async () => {
            this.isLoadingPage = true;
            await this.onRefreshDepositTransactions();
            this.isLoadingPage = false;
        })
    }

    onRefreshDepositTransactions = async () => {
        this.offset = 0;
        this.isRefreshingDepositTransactions = true;
        await this.getDepositTransactions(false);
        this.isRefreshingDepositTransactions = false;
    }

    private getDepositTransactions = async (loadMore = false) => {
        const responseData = await pointApi.getLOPDepositTransactions(this.offset, limit);
        if (responseData.status_code === StatusCodeEnum.success && responseData.data) {
            if (!loadMore) {
                this.depositTransactions = responseData.data.items;
            } else if (responseData.data.items && responseData.data.items.length) {
                this.depositTransactions = [...this.depositTransactions, ...responseData.data.items];
            } else {
                this.finishLoading = true;
                toastHelper.info(I18n.t('all_loading_information'));
            }
        } else {
            toastHelper.warning(I18n.t('can_not_load_data_now'));
        }
    }

    onPressDepositTransactionItem = (transaction: LoyalPointDepositTransaction) => {
        if (this.navigation) {
            this.navigation.navigate(appRoutes.transactionDetailScreen, {
                [TransactionDetailScreenParams.transaction]: transaction
            });
        }

    }

    handleLoadMoreDepositTransactions = async () => {
        this.offset++;
        await this.getDepositTransactions(true);
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