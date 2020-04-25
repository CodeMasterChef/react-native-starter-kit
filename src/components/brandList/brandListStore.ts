import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { CategoryWithBrands as CategoryWithBrand, pointApi } from './../../api/pointApi';
import { Brand } from './../../@model/brand';
import { observable, action } from 'mobx';
import { NavigationScreenProp } from 'react-navigation';
import { appRoutes } from '../../navigators/appRoutes';
import * as mobx from 'mobx';

export interface BrandListSection {
    title: string;
    data: Brand[],
    index?: number;
}
export class BrandListStore {

    @observable
    sections = [] as BrandListSection[];

    backupSections = [] as BrandListSection[];

    @observable
    isRefreshing = false;

    onPressLinkButtonCallback: any;

    onRefreshCallback: any;

    @observable
    enabledPressRowItem = false;

    onPressRowItemCallback = {} as (brand: Brand) => void;

    @observable
    searchText = '';

    @action
    setSections = (sections: any, hideUnlinkBrands?: boolean) => {
        const noEmptySections = [] as BrandListSection[];
        if (sections) {
            sections.forEach((section: BrandListSection) => {
                if (section.data && section.data.length > 0) {
                    if (hideUnlinkBrands) {
                        section.data = section.data.filter((d) => { return d.linked === true }) as Brand[];
                        if (section.data.length > 0) {
                            noEmptySections.push(section);
                        }
                    } else {
                        noEmptySections.push(section);
                    }
                }
            });
        }
        this.sections = noEmptySections;
        this.backupSections = mobx.toJS(this.sections);
    }

    @observable
    hideLinkButton = false;

    @observable
    showLoyalPointItem = false;

    categoryWithBrands: CategoryWithBrand[] = [];

    navigation = null as NavigationScreenProp<any> | null;

    constructor() {
    }

    onPressSyncButton = async (item: Brand) => {
        if (item && item.brandId) {
            item.isRefreshing = true;
            const response = await pointApi.getBrandPoint(item.brandId);
            if (response && response.status_code === StatusCodeEnum.success && response.data) {
                item.point = response.data.point;
                item.lopPoint = response.data.lopPoint;
            }
            item.isRefreshing = false;
        }
    }

    onChangeSearchTextInput = (text: string) => {

        this.searchText = text;
        if (text === undefined || text === null) {
            return;
        }
        text = text.trim();
        if (!text.length) {
            this.sections = this.backupSections;
            return;
        }
        text = text.toLowerCase();
        const filteredSections = [];

        for (let i = 0; i < this.backupSections.length; i++) {
            const section = this.backupSections[i];
            const newSection = {
                title: section.title,
                data: [] as Brand[],
                index: section.index,
            };
            for (let j = 0; j < section.data.length; j++) {
                const brand: Brand = section.data[j];
                if ((brand.name && brand.name.trim().toLowerCase().indexOf(text)) === 0 || (brand.brandName && brand.brandName.trim().toLowerCase().indexOf(text)) === 0) {
                    newSection.data.push(brand);
                }
            }
            filteredSections.push(newSection);

        }
        this.sections = filteredSections;

    }


    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;
    }

    setOnPressLinkButtonCallback = (fun: any) => {
        if (fun) {
            this.onPressLinkButtonCallback = fun;
        }

    }

    setOnPressRowItemCallback = (func: any) => {
        if (func) {
            this.onPressRowItemCallback = func;
            this.enabledPressRowItem = true;
        }
    };

    onPressRowItem = (brand: Brand) => {
        if (this.onPressRowItemCallback) {
            this.onPressRowItemCallback(brand);
        }
    }

    setOnRefreshCallback = (fun: any) => {
        if (fun) {
            this.onRefreshCallback = fun;
        }
    }

    onRefresh = async () => {
        this.isRefreshing = true;
        if (this.onRefreshCallback) {
            this.onRefreshCallback();
        }
        this.isRefreshing = false;
    }



    onPressAddButton = () => {
        if (this.navigation) {
            this.navigation.navigate(appRoutes.addLoyalPointScreen);
        }

    }

    onPressLinkBrandButton = (brand: Brand) => {
        if (this.onPressLinkButtonCallback) {
            this.onPressLinkButtonCallback(brand);
        }
    }
}
