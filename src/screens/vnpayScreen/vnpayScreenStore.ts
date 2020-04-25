import { BrandPointCategory } from '../../@model/brandPointCategory';
import { BrandListStore } from './../../components/brandList/brandListStore';
import { observable, autorun } from 'mobx';
import { NavigationScreenProp } from 'react-navigation';

export class VnpayScreenStore {

    @observable
    isLoadEnd = false;

    navigation = null as NavigationScreenProp<any> | null;

    brandListStore = new BrandListStore();

    brandPointCategories = [] as BrandPointCategory[];

    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;
    }

    constructor() {
        autorun(async () => {

        })
    }

    onLoadEndWebview = () => {
        this.isLoadEnd = true;
    }




}
