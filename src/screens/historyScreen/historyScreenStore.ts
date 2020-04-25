import { NavigationScreenProp } from 'react-navigation';
import { observable, autorun } from 'mobx';


export class HistoryScreenStore {
    @observable
    isRefreshingDepositTransactions = false;

    navigation = null as NavigationScreenProp<any> | null;


    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;
    }

    constructor() {
        autorun(async () => {

        })
    }

  

}