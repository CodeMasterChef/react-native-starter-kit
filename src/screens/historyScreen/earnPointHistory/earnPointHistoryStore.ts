import { EarnPointTransaction } from './../../../@model/earnPointTransaction';
import { loyaltyApi } from './../../../api/loyaltyApi';
import I18n from 'react-native-i18n';
import { observable, autorun } from 'mobx';
import { NavigationScreenProp } from 'react-navigation';
import { StatusCodeEnum } from '../../../enum/statusCodeEnum';
import { toastHelper } from '../../../helpers/toastHelper';

const limit = 10;

export class EarnPointHistoryStore {
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
    transactions = [] as EarnPointTransaction[];

    constructor() {
        autorun(async () => {
            this.isLoadingPage = true;

            // TODO: remove hard code bellow
            // this.transactions.push(
            //     {
            //         branchId: "a123-asdasd-123123-",
            //         number: "403",
            //         memberBrandId: "abc",
            //         totalAmount: 1000,
            //         point: 10,
            //         message: "abc",
            //         // @ts-ignore
            //         brand: {
            //             name: 'American Food',
            //             brandPointCode: 'BTC'
            //         },
            //         createDate: 1583898199093
            //     }
            // );
            
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
        responseData = await loyaltyApi.geEarnPointTransactionHistory(this.offset, limit);
        if (responseData.status_code === StatusCodeEnum.success && responseData.data) {
            if (!loadMore) {
                this.transactions = responseData.data.items;
            } else if (responseData.data.items && responseData.data.items.length) {
                this.transactions = [...this.transactions, ...responseData.data.items];
            } else {
                this.finishLoading = true;
                toastHelper.info(I18n.t('all_loading_information'));
            }
        }
    }

    onPressDepositTransactionItem = () => {

    }

    handleLoadMoreDepositTransactions = async () => {
        this.offset++;
        await this.getTransactions(true);
    }


}