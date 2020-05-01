import { observable } from 'mobx';
import { pointApi } from '../../api/pointApi';
import { StatusCodeEnum } from '../../enum/statusCodeEnum';
import { appRoutes } from '../../navigators/appRoutes';
import { toastHelper } from '../../helpers/toastHelper';
import { stores } from '../../stores';
import I18n from 'react-native-i18n';

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
             
        }

    }


    onPressBackdrop = () => {
        this.isVisible = false;
    }


}