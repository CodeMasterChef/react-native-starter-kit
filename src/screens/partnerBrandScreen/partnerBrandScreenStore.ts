import { LinkOrRegisterMemberModalStore } from './../../components/linkOrRegisterMemberModal/linkOrRegisterMemberModalStore';
import { zeroUID, defaultBrandName } from './../../commons/constant';
import { BrandPointCategory } from './../../@model/brandPointCategory';
import { toastHelper } from './../../helpers/toastHelper';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { pointApi, LinkBrandRequestData } from './../../api/pointApi';
import { Brand, AuthType, BrandStatus } from './../../@model/brand';
import { observable, autorun } from 'mobx';
import { NavigationScreenProp } from 'react-navigation';
import { appRoutes } from '../../navigators/appRoutes';
import { CountryCode } from 'react-native-country-picker-modal';
import { defaultCountryCode, defaultCountryCalling, phoneRegexp } from '../../commons/constant';
import { BrandListStore } from '../../components/brandList/brandListStore';
import md5 from 'md5';
import I18n from 'react-native-i18n';
import Toast from '../../components/toast';
import { stores } from '../../stores';

export class PartnerBrandScreenStore {


    @observable
    brand: Brand = {} as Brand;

    @observable
    countryCode: CountryCode = defaultCountryCode;

    @observable
    countryCalling: string = defaultCountryCalling;

    navigation = null as NavigationScreenProp<any> | null;

    brandListStore = new BrandListStore();

    @observable
    fieldValues = {} as any;

    @observable
    invalidFields = {} as any;

    @observable
    invalidForm = true;

    @observable
    policyChecked = false;

    errorToast: Toast = {} as any;

    linkedBrandIds = [] as string[];

    @observable
    isVisiblePolicyModal = false;

    hideUnlinkBrand = false;

    linkOrRegisterMemberModalStore = new LinkOrRegisterMemberModalStore();

    setNavigation = (navigation: NavigationScreenProp<any>) => {
        this.navigation = navigation;
    }

    setBrandPointCategories = (brandPointCategories: BrandPointCategory[]) => {
        if (brandPointCategories && brandPointCategories.length) {
            const linkedBrandIds = [] as string[];
            brandPointCategories.forEach(category => {
                category.brandPoints.forEach(brand => {
                    linkedBrandIds.push(brand.brandId);
                })
            })
            this.linkedBrandIds = linkedBrandIds;
        }
    }

    constructor() {
        autorun(async () => {
            await this.onRefresh();
        })
    }



    onPressPolicyLink = async () => {
        this.isVisiblePolicyModal = true;
    }

    onPressClosePolicyModal = () => {
        this.isVisiblePolicyModal = false;
    }

    onPressCheckBox = () => {
        this.policyChecked = !this.policyChecked;
    }

    private checkInvalidForm = () => {
        let invalid = false;
        Object.values(this.invalidFields).forEach(value => {
            if (value) {
                invalid = true;
            }
        })
        this.invalidForm = invalid;
    }

    onChangePhoneWithCountryCode = (phoneWithCountryCode: string) => {
        this.fieldValues[AuthType.phone] = phoneWithCountryCode;
        this.invalidFields[AuthType.phone] = !phoneRegexp.test(phoneWithCountryCode);
        this.checkInvalidForm();
    }

    onChangeText = (text: string, authType: AuthType) => {
        this.fieldValues[authType] = text;
        if (authType === AuthType.phone) {
            this.invalidFields[authType] = !phoneRegexp.test(text);
        } else {
            this.invalidFields[authType] = !text;
        }
        this.checkInvalidForm();
    }


    onRefresh = async () => {
        this.brandListStore.isRefreshing = true;
        await this.getCategoryWithBrands();
        this.brandListStore.isRefreshing = false;
    }

    private getCategoryWithBrands = async () => {
        const responseData = await pointApi.getAllBrandsSeparatedByCategory(BrandStatus.verified);
        if (responseData.status_code === StatusCodeEnum.success && responseData.data) {
            const categoryWithBrands = responseData.data.items;
            const sections = [] as any;

            const loyalPointSection = {
                id: zeroUID,
                title: '',
                data: [{
                    name: defaultBrandName,
                    urlAvatar: '',
                    linked: true,
                    id: zeroUID,
                }],
            };
            sections.push(loyalPointSection);

            categoryWithBrands.forEach(categoryWithBrand => {
                categoryWithBrand.brands.forEach(brand => {
                    if (this.linkedBrandIds.includes(brand.id)) {
                        brand.linked = true;
                    }
                });
                const section = {
                    id: categoryWithBrand.id,
                    title: categoryWithBrand.name,
                    data: categoryWithBrand.brands ? categoryWithBrand.brands : [],
                };
                sections.push(section);
            })
            this.brandListStore.setSections(sections, this.hideUnlinkBrand);
        }
    }

    onPressAddButton = () => {
        if (this.navigation) {
            this.navigation.navigate(appRoutes.addLoyalPointScreen);
        }
    }

    onPressLinkButton = async (brand: Brand) => {
        this.brand = brand;
        this.linkOrRegisterMemberModalStore.initStore(brand);
        this.linkOrRegisterMemberModalStore.setIsRegisterMember(false);
        this.linkOrRegisterMemberModalStore.show();
    }

    onPressSubmitButton = async () => {
        const requestBody: LinkBrandRequestData = {
            brandId: this.brand.id,
            phone: this.fieldValues[AuthType.phone],
            username: this.fieldValues[AuthType.username] ? this.fieldValues[AuthType.username] : null,
            email: this.fieldValues[AuthType.email] ? this.fieldValues[AuthType.email] : null,
            memberId: this.fieldValues[AuthType.memberId] ? this.fieldValues[AuthType.memberId] : null,
            password: this.fieldValues[AuthType.password] ? md5(this.fieldValues[AuthType.password]) : null,
            firstName: this.fieldValues[AuthType.firstName] ? this.fieldValues[AuthType.firstName] : null,
            lastName: this.fieldValues[AuthType.lastName] ? this.fieldValues[AuthType.lastName] : null,
            pin: this.fieldValues[AuthType.pin] ? this.fieldValues[AuthType.pin] : null,
            code: this.fieldValues[AuthType.code] ? this.fieldValues[AuthType.code] : null,
            fullName: this.fieldValues[AuthType.fullName] ? this.fieldValues[AuthType.fullName] : null,
        }
        const response = await pointApi.linkBrand(requestBody);

        if (response && response.status_code === StatusCodeEnum.success) {
            toastHelper.success(I18n.t('link_brand_successfully'));
            this.brand.linked = true;
            if (stores.walletScreenStore) {
                await stores.walletScreenStore.onRefresh();
            }
        } else if (response && response.status_code === StatusCodeEnum.userInvalid) {
            toastHelper.error(I18n.t('session_expired_login_again'), this.errorToast);
        } else if (response && response.status_code === StatusCodeEnum.idInvalid) {
            toastHelper.error(I18n.t('brand_is_invalid_please_select_again'), this.errorToast);
        } else if (response && response.status_code === StatusCodeEnum.dataIsExisted) {
            toastHelper.error(I18n.t('brand_is_linked_before'), this.errorToast);
            this.brand.linked = true;
        } else if (response && response.status_code === StatusCodeEnum.userInactivate) {
            toastHelper.error(I18n.t('can_not_verify_credentials'), this.errorToast);
        } else if (response && response.status_code === StatusCodeEnum.invalidStatus) {
            toastHelper.error(I18n.t('brand_is_not_linked_with'), this.errorToast);
        } else if (response && response.status_code === StatusCodeEnum.userAlreadyExist) {
            toastHelper.error(I18n.t('brand_account_is_linked_with_other_user'), this.errorToast);
        } else if (response && response.status_code === StatusCodeEnum.errorUndefined) {
            toastHelper.error(I18n.t('error_undefined'), this.errorToast);
        }
    }

}
