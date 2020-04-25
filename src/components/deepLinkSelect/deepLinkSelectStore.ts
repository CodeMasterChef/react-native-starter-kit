import { BrandProfileScreenStore } from './../../screens/brandProfileScreen/brandProfileScreenStore';
import { observable } from 'mobx';
import { pointApi } from '../../api/pointApi';
import { StatusCodeEnum } from '../../enum/statusCodeEnum';
import { RequestEarnPointScreenStore } from '../../screens/requestEarnPointScreen/requestEarnPointScreenStore';
import { appRoutes } from '../../navigators/appRoutes';
import { toastHelper } from '../../helpers/toastHelper';
import { stores } from '../../stores';
import I18n from 'react-native-i18n';
import { requestEarnPointScreenParams } from '../../screens/requestEarnPointScreen/requestEarnPointScreen';
import { BrandProfileScreenParams } from '../../screens/brandProfileScreen/brandProfileScreen';
import { loyaltyApi } from '../../api/loyaltyApi';

export class DeepLinkSelectStore {

    brandId!: string;

    @observable
    isVisible = false;

    @observable
    isNotMember = false;

    constructor() {
    }

    setBrandId = async (brandId: string) => {
        this.brandId = brandId;
        await this.fetchData(this.brandId);
    }

    onPressCloseButton = () => {
        this.isVisible = false;
    }

    fetchData = async (brandId: string) => {
        if (brandId) {
            const brandMemberResponse = await loyaltyApi.getBrandMemberInfo(brandId);
            if (brandMemberResponse.status_code === StatusCodeEnum.success) {
                this.isNotMember = false;
            } else {
                this.isNotMember = true;
            }
        }

    }


    onPressBackdrop = () => {
        this.isVisible = false;
    }

    onPressEarnPointRequestOption = async () => {
        if (!this.brandId) {
            toastHelper.error(I18n.t('can_not_load_data_now'));
        }
        const response = await pointApi.getBrandDetails(this.brandId);
        if (response.status_code === StatusCodeEnum.success) {
            const brand = response.data;

            const store = new RequestEarnPointScreenStore(brand);
            this.isVisible = false;

            stores.navigation.navigate(appRoutes.requestEarnPointScreen, {
                [requestEarnPointScreenParams.store]: store,
            });

            // With react-navigation, we can not navigate when the current route is requestEarnPointScreen, 
            // so that we need to update data on the store
            stores.requestEarnPointScreenStore?.setBrand(brand);
        } else {
            toastHelper.error(I18n.t('can_not_found_brand'));
        }
        this.isVisible = false;

    }


    onPressRegisterMemberOption = async () => {
        if (!this.brandId) {
            toastHelper.error(I18n.t('can_not_load_data_now'));
        }
        const store = new BrandProfileScreenStore(this.brandId, true);
        stores.navigation.navigate(appRoutes.brandProfileScreen, {
            [BrandProfileScreenParams.store]: store,
        });
        // With react-navigation, we can not navigate when the current route is brandProfileScreenStore, 
        // so that we need to update data on the store
        if (stores.brandProfileScreenStore) {
            await stores.brandProfileScreenStore.init(this.brandId, true);
        }
        this.isVisible = false;
    }
}