import { BrandListSection } from './../../components/brandList/brandListStore';
import { zeroUID } from './../../commons/constant';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { pointApi, GetConversionRateResponseData, GetConversionRateRequestParams, ExchangePointBetweenTwoBrandRequestData } from './../../api/pointApi';
import { numberHelper } from './../../helpers/numberHelper';
import { BrandPointCategory } from './../../@model/brandPointCategory';
import { Brand } from './../../@model/brand';
import { partnerBrandScreenParams } from './../partnerBrandScreen/partnerBrandScreen';
import { appRoutes } from './../../navigators/appRoutes';
import { NavigationScreenProp, NavigationActions } from 'react-navigation';
import { observable, autorun, action, computed } from 'mobx';
import I18n from 'react-native-i18n';
import * as _ from 'lodash';
import { toastHelper } from '../../helpers/toastHelper';
import { Alert } from 'react-native';
import { stores } from '../../stores';

export enum SelectTypeEnum {
    from = 'FROM',
    to = 'TO',
}
export class ExchangeScreenStore {

    navigation = null as NavigationScreenProp<any> | null;

    @observable
    fromAmountText = '0';

    @observable
    toAmountNumber = 0;

    @observable
    toAmountText = '0';

    @observable
    fromAmountNumber = 0;

    @observable
    selectedFromBrand = {} as Brand;

    @observable
    selectedToBrand = {} as Brand;

    @observable
    fromBalance = 0;

    @observable
    toBalance = 0;

    brandPointCategories = [] as BrandPointCategory[];

    selectType: SelectTypeEnum = SelectTypeEnum.from;

    @observable
    invalidFromAmount = false;

    @observable
    invalidToAmount = false;

    @observable
    invalidForm = true;

    @observable
    errorMessage = '';

    @observable
    refreshingFromBrand = false;

    @observable
    refreshingToBrand = false;

    @observable
    isLoadingSubmit = false;

    @observable
    conversionRateData = {} as GetConversionRateResponseData;

    @observable
    isRefreshing = false;

    @observable
    isLoadingFromAmount = false;

    @observable
    isLoadingToAmount = false;


    constructor() {
        autorun(async () => {
        })
    }

    @computed get invalidFromBrand() {
        return !this.selectedFromBrand || (this.selectedFromBrand && ! this.selectedFromBrand.id);
    }

    @computed get invalidToBrand() {
        return !this.selectedToBrand || (this.selectedToBrand && ! this.selectedToBrand.id);
    }
    
    onRefresh = () => {
        this.isRefreshing = true;
        this.isRefreshing = false;
        setTimeout(() => {
            Alert.alert(
                I18n.t('confirm'),
                I18n.t('confirm_refresh'),
                [
                    {
                        text: I18n.t('cancel'),
                        style: 'cancel',
                        onPress: () => {
                        },

                    },
                    {
                        text: I18n.t('continue'),
                        onPress: this.resetForm,
                    },
                ],
                { cancelable: false },
            );
        }, 350)


    }

    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;

    }

    onFocusAmount = (type: SelectTypeEnum) => {
        const text = (type === SelectTypeEnum.from) ? this.fromAmountText : this.toAmountText;
        if (text === '0') {
            if (type === SelectTypeEnum.from) {
                this.fromAmountText = '';
            } else {
                this.toAmountText = '';
            }
        }
    }

    onBlurAmount = (type: SelectTypeEnum) => {
        const text = (type === SelectTypeEnum.from) ? this.fromAmountText : this.toAmountText;
        this.onChangeAmount(text, type);
    }


    onChangeAmount = (text: string, type: SelectTypeEnum) => {
        this.updateAmountNumber(text, type);
        this.changeAmountDebounce(type);
        this.validateForm();

    }

    private updateAmountNumber = (text: string, type: SelectTypeEnum) => {
        let number = numberHelper.textToNumber(text);
        number = number ? number : 0;
        if (type === SelectTypeEnum.from) {
            this.fromAmountText = text;
            this.fromAmountNumber = number ? number : 0;
        } else {
            this.toAmountText = text;
            this.toAmountNumber = number ? number : 0;
        }
    }

    private changeAmountDebounce = _.debounce(action(async (type: SelectTypeEnum) => {
        await this.getConversionRateResponseData(type === SelectTypeEnum.from);
    }), 800);


    onPressBrandListItem = async (brand: Brand) => {
        if (brand.linked) {
            this.navigation?.navigate(appRoutes.exchangePointScreen);

            if (this.selectType == SelectTypeEnum.from) {
                this.selectedFromBrand = brand;
            } else {
                this.selectedToBrand = brand;
            }

            if (brand.id === zeroUID) {
                const response = await pointApi.getLoyalPoints();
                if (response && response.status_code === StatusCodeEnum.success) {
                    const loyPoints = response.data.value;
                    if (this.selectType == SelectTypeEnum.from) {
                        this.fromBalance = loyPoints;
                    } else {
                        this.toBalance = loyPoints;
                    }
                    // update LOP balance on the wallet screen
                    if (stores.walletScreenStore) {
                        stores.walletScreenStore.loyalPoints = loyPoints;
                    }
                }
            } else {
                if (brand && brand.id) {
                    const response = await pointApi.getBrandPoint(brand.id);
                    if (response.status_code === StatusCodeEnum.success) {
                        if (this.selectType == SelectTypeEnum.from && response.data) {
                            this.fromBalance = response.data.point;
                        } else {
                            this.toBalance = response.data.point;
                        }
                        // update brand point balance on the wallet screen
                        if (stores.walletScreenStore && stores.walletScreenStore.brandListStore && stores.walletScreenStore.brandListStore.sections) {
                            stores.walletScreenStore.brandListStore.sections.forEach((section: BrandListSection) => {
                                section.data.forEach((brandRef) => {
                                    if (brandRef.brandId === brand.id) {
                                        brandRef.point = response.data.point;
                                        brandRef.lopPoint = response.data.lopPoint;
                                    }
                                })
                            });
                        }
                    }
                }
            }

            if (this.selectedFromBrand.id && this.selectedToBrand.id) {
                await this.getConversionRateResponseData(this.selectType === SelectTypeEnum.from);
            }

            this.validateForm();
        } else {
            stores.partnerBrandScreenStore.onPressLinkButton(brand);
        }
    }

    private validateForm = () => {
        let invalid = false;
        let errorMessage = '';

        if (this.selectedFromBrand.id && this.selectedToBrand.id && this.selectedFromBrand.id === this.selectedToBrand.id) {
            errorMessage = I18n.t('can_not_exchange_with_same_brands');
            invalid = true;
        }

        if (!this.selectedFromBrand.id || !this.selectedToBrand.id) {
            invalid = true;
        } else if (!this.toAmountNumber || !this.fromAmountNumber) {
            invalid = true;
        }

        if (this.fromAmountNumber > this.fromBalance ||
            (this.selectedFromBrand && this.selectedFromBrand.minValue && this.fromAmountNumber < this.selectedFromBrand.minValue) ||
            (this.selectedFromBrand && this.selectedFromBrand.maxValue && this.fromAmountNumber > this.selectedFromBrand.maxValue)
        ) {
            this.invalidFromAmount = true;
            invalid = true;
        } else {
            this.invalidFromAmount = false;
        }

        if (
            (this.selectedToBrand && this.selectedToBrand.minValue && this.toAmountNumber < this.selectedToBrand.minValue) ||
            (this.selectedToBrand && this.selectedToBrand.maxValue && this.toAmountNumber > this.selectedToBrand.maxValue)
        ) {
            this.invalidToAmount = true;
            invalid = true;
        } else {
            this.invalidToAmount = false;
        }


        this.invalidForm = invalid;
        this.errorMessage = errorMessage;

    }

    onPressTrademarkCard = async (selectType: SelectTypeEnum) => {
        this.selectType = selectType;
        if (selectType === SelectTypeEnum.from) {
            this.refreshingFromBrand = true;
        } else {
            this.refreshingToBrand = true;
        }
        await this.getAllCategoriesWithBrandPoint();
        if (selectType === SelectTypeEnum.from) {
            this.refreshingFromBrand = false;
        } else {
            this.refreshingToBrand = false;
        }

        if (this.navigation) {
            const subAction = NavigationActions.navigate({
                routeName: appRoutes.partnerBrandScreen,
                params: {
                    [partnerBrandScreenParams.onPressItemRow]: this.onPressBrandListItem,
                    [partnerBrandScreenParams.brandPointCategories]: this.brandPointCategories,
                    [partnerBrandScreenParams.hideUnlinkBrands]: true,
                }
            });
            // partnerBrandScreen is used both on walletStack and exchangePointStack
            //this.navigation?.navigate(appRoutes.exchangePointStack, {}, subAction);
            this.navigation?.navigate(subAction);
        }
    }

    private getAllCategoriesWithBrandPoint = async () => {
        const response = await pointApi.getAllBrandPointCategories();
        if (response && response.status_code === StatusCodeEnum.success && response.data) {
            this.brandPointCategories = response.data.items;
        }
    }

    private getConversionRateResponseData = async (convertAtoB: boolean) => {
        if (!this.selectedFromBrand.id || !this.selectedToBrand.id) {
            return;
        }
        const params: GetConversionRateRequestParams = {
            fromId: this.selectedFromBrand.id,
            toId: this.selectedToBrand.id,
        }
        if (convertAtoB) {
            params.fromPoint = this.fromAmountNumber;
            this.isLoadingToAmount = true;
        } else {
            params.toPoint = this.toAmountNumber;
            this.isLoadingFromAmount = true;
        }

        const response = await pointApi.getConversionRate(params);
        if (response && response.status_code === StatusCodeEnum.success) {
            this.conversionRateData = response.data;
            if (convertAtoB) {
                this.updateAmountNumber(this.conversionRateData.toPoint.toString(), SelectTypeEnum.to);
                this.isLoadingToAmount = false;
            } else {
                this.updateAmountNumber(this.conversionRateData.fromPoint.toString(), SelectTypeEnum.from);
                this.isLoadingFromAmount = false;
            }
            this.validateForm();
        }

    }

    private resetForm = () => {
        this.fromAmountText = '0';
        this.fromAmountNumber = 0;
        this.toAmountText = '0';
        this.toAmountNumber = 0;
        this.selectedFromBrand = {} as Brand;
        this.selectedToBrand = {} as Brand;
        this.fromBalance = 0;
        this.toBalance = 0;
        this.brandPointCategories = [] as BrandPointCategory[];
        this.invalidFromAmount = false;
        this.invalidToAmount = false;
        this.invalidForm = true;
        this.errorMessage = '';
        this.isRefreshing = false;
        this.conversionRateData = {} as GetConversionRateResponseData;
    }

    onPressConfirmButton = async () => {
        this.isLoadingSubmit = true;

        const requestData: ExchangePointBetweenTwoBrandRequestData = {
            fromId: this.selectedFromBrand.id,
            toId: this.selectedToBrand.id,
            fromRate: this.conversionRateData.fromRate,
            toRate: this.conversionRateData.toRate,
            fromPoint: this.fromAmountNumber,
            toPoint: this.toAmountNumber,
            lopPoint: this.conversionRateData.lopPoint,
        }
        const response = await pointApi.exchangePointBetweenTwoBrand(requestData);
        if (response && response.status_code === StatusCodeEnum.success) {
            toastHelper.success(I18n.t('exchange_point_successfully'));
            this.resetForm();
            this.isLoadingSubmit = false;
            if (stores.walletScreenStore) {
                stores.walletScreenStore.onRefresh();
            }
        } else if (response && response.status_code === StatusCodeEnum.userInvalid) {
            toastHelper.error(I18n.t('session_expired_login_again'));
        } else if (response && response.status_code === StatusCodeEnum.idInvalid) {
            toastHelper.error(I18n.t('brand_is_invalid_please_select_again'));
        } else if (response && response.status_code === StatusCodeEnum.dataInvalid) {
            toastHelper.error(I18n.t('conversion_rate_has_changed'));
            await this.getConversionRateResponseData(this.selectType === SelectTypeEnum.from);
        } else if (response && response.status_code === StatusCodeEnum.paymentFailed) {
            toastHelper.error(I18n.t('balance_is_not_enough'));
        } else if (response && response.status_code === StatusCodeEnum.errorUndefined) {
            toastHelper.error(I18n.t('error_undefined'));
        }
        this.isLoadingSubmit = false;

    }
} 