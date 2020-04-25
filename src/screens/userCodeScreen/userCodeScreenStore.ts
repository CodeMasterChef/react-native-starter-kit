import { localAppStorageHelper } from './../../helpers/localAppStorageHelper';
import { observable, autorun } from 'mobx';
import { Account } from '../../@model/account';

export class UserCodeScreenStore {

    @observable
    isRefreshing = false;

    @observable
    data = '';

    @observable
    account!: Account;

    constructor() {
        autorun(async () => {
            await this.onRefresh();
        })
    }

    onRefresh = async () => {
        this.isRefreshing = true;
        this.account = await localAppStorageHelper.getAccount();
       
        if (this.account && this.account.id) {
            this.data = `https://loya.one/userapp?a=all&id=${this.account.id}`;
        }
        this.isRefreshing = false;
    }
}