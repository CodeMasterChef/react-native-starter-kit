import { Brand, AuthType } from '../../../@model/brand';
import { observable, computed } from 'mobx';
import { phoneRegexp } from '../../../commons/constant';
import { LinkBrandRequestData, pointApi, RegisterMemberResponseData, RegisterMemberStatus } from '../../../api/pointApi';
import md5 from 'md5';
import { StatusCodeEnum } from '../../../enum/statusCodeEnum';
import { toastHelper } from '../../../helpers/toastHelper';
import I18n from 'react-native-i18n';
import Toast from '../../../components/toast';
import { stores } from '../../../stores';

export class LinkMemberStore {

    @observable
    brand: Brand = {} as Brand;

    @observable
    fieldValues = {} as any;

    @observable
    invalidFields = {} as any;

    @observable
    invalidForm = true;

    @observable
    isVisiblePolicyModal = false;


    @observable
    policyChecked = false;

    errorToast: Toast = {} as any;

    onLinkMemberSuccess: any;

    @observable
    registerMemberInformation!: RegisterMemberResponseData;


    @observable
    isLoading = false;

    @observable
    isLinked = false;

    constructor(brand?: Brand) {
        if (brand) {
            this.setBrand(brand);
        }
    }

    setBrand = async (brand: Brand) => {
        this.isLoading = true;
        this.brand = brand;
        this.isLinked = await this.walletIsLinkedBefore(brand.id);
        this.brand.authTypes.forEach((authType) => {
            this.invalidFields[authType] = true;
            this.fieldValues[authType] = true;

        });
        this.policyChecked = false;
        await this.getBrandDetails();
        this.isLoading = false;
    }


    async walletIsLinkedBefore(brandId: string): Promise<boolean> {
        const response = await pointApi.getAllBrandPointCategories();
        if (response && response.status_code === StatusCodeEnum.success && response.data) {
            const brandPointCategories =  response.data.items;
            if (brandPointCategories && brandPointCategories.length) {
                for (let i = 0; i < brandPointCategories.length; i++) {
                    const category = brandPointCategories[i];
                    const matchedBrand = category.brandPoints.find(b => { return b.brandId === brandId });
                    if (matchedBrand) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
        return false;
    }


    private getBrandDetails = async () => {
        if (this.brand && this.brand.id) {
            const response = await pointApi.getBrandDetails(this.brand.id);
            if (response && response.status_code === StatusCodeEnum.success && response.data) {
                this.brand.policy = response.data.policy;
            }
        }
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

    private checkInvalidForm = () => {
        let invalid = false;
        Object.values(this.invalidFields).forEach(value => {
            if (value) {
                invalid = true;
            }
        })
        this.invalidForm = invalid;
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

    onPressRegisterButton = (onSwitchRegisterMember: any) => {
        if (onSwitchRegisterMember !== null && onSwitchRegisterMember !== undefined) {
            try {
                onSwitchRegisterMember();
            } catch (error) {
            }
        }
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
            fullName: this.fieldValues[AuthType.fullName] ? this.fieldValues[AuthType.fullName] : null,
            pin: this.fieldValues[AuthType.pin] ? this.fieldValues[AuthType.pin] : null,
            code: this.fieldValues[AuthType.code] ? this.fieldValues[AuthType.code] : null,
        }
        const response = await pointApi.linkBrand(requestBody);

        if (response && response.status_code === StatusCodeEnum.success) {
            if (this.onLinkMemberSuccess) {
                try {
                    this.onLinkMemberSuccess();
                } catch (error) { }
            }
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