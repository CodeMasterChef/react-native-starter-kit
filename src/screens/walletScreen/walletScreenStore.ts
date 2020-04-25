import { BrandProfileScreenStore } from './../brandProfileScreen/brandProfileScreenStore';
import { partnerBrandScreenParams } from './../partnerBrandScreen/partnerBrandScreen';
import { BrandPointCategory } from '../../@model/brandPointCategory';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { pointApi } from './../../api/pointApi';
import { BrandListStore } from './../../components/brandList/brandListStore';
import { observable, autorun } from 'mobx';
import { toastHelper } from '../../helpers/toastHelper';
import I18n from 'react-native-i18n';
import { NavigationScreenProp } from 'react-navigation';
import { appRoutes } from '../../navigators/appRoutes';
import { Brand } from '../../@model/brand';
import { BrandProfileScreenParams } from '../brandProfileScreen/brandProfileScreen';
import { zeroUID } from '../../commons/constant';

export class WalletScreenStore {

    @observable
    loyalPoints = 0;

    @observable
    isRefreshingLop = false;

    navigation = null as NavigationScreenProp<any> | null;

    brandListStore = new BrandListStore();

    brandPointCategories = [] as BrandPointCategory[];

    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;
    }

    constructor() {
        autorun(async () => {
            await this.onRefresh();
        })
    }

    onRefresh = async () => {
        this.brandListStore.isRefreshing = true;
        await this.getLoyalPoints();
        await this.getAllCategoriesWithBrandPoint();
        this.getPointBalanceForEachBrand();
        this.brandListStore.setOnPressRowItemCallback(this.onPressItemOnWalletScreen);
        this.brandListStore.isRefreshing = false;
    }

    private getLoyalPoints = async () => {
        this.isRefreshingLop = true;
        const responseData = await pointApi.getLoyalPoints();
        if (responseData.status_code === StatusCodeEnum.success && responseData.data) {
            this.loyalPoints = responseData.data.value;
        } else {
            toastHelper.warning(I18n.t('can_not_get_lop_now'));
        }
        this.isRefreshingLop = false;
    }

    private getPointBalanceForEachBrand = () => {
        if (this.brandListStore && this.brandListStore.sections) {
            this.brandListStore.sections.forEach(section => {
                section.data.forEach(async brandRef => {
                    if (brandRef.brandId) {
                        brandRef.isRefreshing = true;
                        const response = await pointApi.getBrandPoint(brandRef.brandId);
                        if (response && response.status_code === StatusCodeEnum.success) {
                            brandRef.point = response.data.point;
                            brandRef.lopPoint = response.data.lopPoint;
                        }
                        brandRef.isRefreshing = false;
                    }

                });
            })
        }
    }

    private getAllCategoriesWithBrandPoint = async () => {
        const response = await pointApi.getAllBrandPointCategories();

        if (response && response.status_code === StatusCodeEnum.success && response.data) {
            this.brandPointCategories = response.data.items;
            const sections = [] as any;
            this.brandPointCategories.forEach(category => {
                const section = {
                    id: category.id,
                    title: category.name,
                    data: (category.brandPoints) ? category.brandPoints : [],
                };
                sections.push(section);
            })

            this.brandListStore.setSections(sections, false);
        } else {
            toastHelper.warning(I18n.t('can_not_get_wallet_now'));
        }
    }

    onPressTopUpButton = () => {
        if (this.navigation) {
            this.navigation.navigate(appRoutes.addLoyalPointScreen);
        }
    }

    private onPressItemOnWalletScreen = (brand: Brand) => {

        if (brand && brand.brandId && brand.brandId !== zeroUID) {
            const brandProfileScreenStore = new BrandProfileScreenStore(brand.brandId);
            brandProfileScreenStore.backTitle = I18n.t('point_wallet');
            this.navigation?.navigate(appRoutes.brandProfileScreen,
                {
                    [BrandProfileScreenParams.store]: brandProfileScreenStore,
                });
        }
    }

    private onPressItemRowOnBrandList = (brand: Brand) => {
        if (brand && brand.id && brand.id !== zeroUID) {
            const brandProfileScreenStore = new BrandProfileScreenStore(brand.id);
            this.navigation?.navigate(appRoutes.brandProfileScreen,
                {
                    [BrandProfileScreenParams.store]: brandProfileScreenStore,
                });
        }
    }

    onPressAddWalletButton = () => {
        if (this.navigation) {
            this.navigation.navigate(appRoutes.partnerBrandScreen,
                {
                    [partnerBrandScreenParams.brandPointCategories]: this.brandPointCategories,
                    [partnerBrandScreenParams.hideUnlinkBrands]: false,
                    [partnerBrandScreenParams.onPressItemRow]: this.onPressItemRowOnBrandList,
                });
        }
    }
}
