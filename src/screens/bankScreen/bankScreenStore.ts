import { toastHelper } from './../../helpers/toastHelper';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { utilityApi, LoyalBank } from './../../api/utilityApi';
import { LoyalPointDepositTransaction } from '../../api/pointApi';
import { observable, autorun } from 'mobx';
import { Clipboard } from 'react-native';
import I18n from 'react-native-i18n';


export class BankScreenStore {

    @observable
    pointDeposit = {} as LoyalPointDepositTransaction;

    @observable.shallow
    banks = [] as LoyalBank[];

    constructor() {
        autorun(async () => {
            await this.getLoyalOneBanks();
        })
    }

    setPointDeposit = (pointDeposit: LoyalPointDepositTransaction) => {
        this.pointDeposit = pointDeposit;
    }

    getLoyalOneBanks = async () => {
        const responseData = await utilityApi.getLoyalOneBanks();
        if (responseData.status_code === StatusCodeEnum.success && responseData.data && responseData.data.items) {
            this.banks = responseData.data.items;
        }
    }

    onPressCopyButton = (content: string) => {
        Clipboard.setString(content);
        toastHelper.success(`${I18n.t('copied')}: ${content}`)
    }



}
