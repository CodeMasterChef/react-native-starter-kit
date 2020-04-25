import { stores } from './../../stores';
import { toastHelper } from './../../helpers/toastHelper';
import { numberHelper } from './../../helpers/numberHelper';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { loyaltyApi } from './../../api/loyaltyApi';
import { BrandMemberSetting } from './../../@model/brandMemberSetting';
import { defaultDateFormat } from './../../commons/constant';
import { observable, computed, action } from 'mobx';
import { Brand } from '../../@model/brand';
import { NavigationScreenProp } from 'react-navigation';
import { DatePickerStore } from '../../components/datePicker/datePickerStore';
import { RequestEarnPoint } from '../../@model/requestEarnPoint';
import I18n from 'react-native-i18n';
import { BrandMember } from '../../@model/brandMember';
import { LinkOrRegisterMemberModalStore } from '../../components/linkOrRegisterMemberModal/linkOrRegisterMemberModalStore';

export class RequestEarnPointScreenStore {
    @observable
    brand!: Brand;

    datePickerStore = new DatePickerStore();

    @observable
    billNumber = '';

    @observable
    billValue = '';

    billValueNumber = 0;

    @observable
    earnedPoints = '';

    @observable
    isLoadingSubmit = false;

    @observable
    brandMemberSetting!: BrandMemberSetting;

    @observable
    brandMember!: BrandMember;

    @observable
    isVisibleSuccessModal = false;

    @observable
    noSupport = false;

    @observable
    notMember = false;

    @observable
    isVisibleRegisterMemberModal = false;

    @observable
    isFirstLoading = true;

    linkOrRegisterMemberModalStore!: LinkOrRegisterMemberModalStore;

    constructor(brand: Brand) {
        this.brand = brand;
        this.datePickerStore.setSelectedDate(new Date());
        this.linkOrRegisterMemberModalStore = new LinkOrRegisterMemberModalStore(brand, true);
        this.fetchData(brand.id);
    }

    @action setBrand = async (brand: Brand) => {
        this.brand = brand;
        await this.resetForm();
        this.isVisibleSuccessModal = false;
    }

    @computed get isInvalidForm() {
        if (this.datePickerStore?.dateDisplay === defaultDateFormat || !this.brand?.id || !this.billNumber || !this.billValue || !this.earnedPoints || this.earnedPoints === '0') {
            return true;
        } else {
            return false;
        }
    }

    private resetForm = () => {
        this.datePickerStore.dateDisplay = defaultDateFormat;
        this.billNumber = '';
        this.billValue = '';
        this.earnedPoints = '';
        this.noSupport = false;
    }

    fetchData = async (brandId: string) => {
        this.isFirstLoading = true;
        if (brandId) {

            const memberSettingResponse = await loyaltyApi.getBrandMemberSetting(brandId);
            if (memberSettingResponse.status_code === StatusCodeEnum.success) {
                this.brandMemberSetting = memberSettingResponse.data;
                if (this.brandMemberSetting.point === 0) {
                    this.noSupport = true;
                }
            }

            const brandMemberResponse = await loyaltyApi.getBrandMemberInfo(brandId);
            if (brandMemberResponse.status_code === StatusCodeEnum.success) {
                this.brandMember = brandMemberResponse.data;
            } else if (brandMemberResponse.status_code === StatusCodeEnum.notFound) {
                this.notMember = true;
            } else {
                this.notMember = true;
            }
        }
        this.isFirstLoading = false;

    }


    onPressRegisterMemberButton = () => {
        this.linkOrRegisterMemberModalStore.isRegisterMember = true;
        this.linkOrRegisterMemberModalStore.isVisible = true;
    }


    onPressBackButton = (navigation: NavigationScreenProp<any>) => {
        navigation?.goBack();
    }


    onChangeBillNumberInput = (text: string) => {
        this.billNumber = text;
    }

    onChangeBillValueInput = (text: string) => {
        this.billValue = text;
        if (this.billValue && this.billValue.length > 0 && this.brandMemberSetting?.money > 0 && this.brandMemberSetting?.point > 0) {
            try {
                const value = numberHelper.textToNumber(text);
                if (value) {
                    this.billValueNumber = value;
                    const earnedPoints = Math.floor(value / this.brandMemberSetting?.money) * this.brandMemberSetting?.point;
                    this.earnedPoints = earnedPoints.toString();
                }

            } catch (err) {
                console.log(err);
            }
        }
    }



    onPressSubmitButton = async () => {
        if (this.isInvalidForm) {
            return;
        }
        this.isLoadingSubmit = true;
        const requestEarnPoint: RequestEarnPoint = {
            brandId: this.brand.id,
            number: this.billNumber,
            transactionDate: this.datePickerStore.dateDisplay,
            totalAmount: this.billValueNumber,
        }

        const response = await loyaltyApi.createEarnPointRequest(requestEarnPoint);
        if (response.status_code === StatusCodeEnum.created) {
            this.isVisibleSuccessModal = true;
            this.resetForm();
        } else if (response.status_code === StatusCodeEnum.userInvalid) {
            toastHelper.error(I18n.t('can_not_get_user_information'));
        } else if (response.status_code === StatusCodeEnum.idInvalid) {
            toastHelper.error(I18n.t('can_not_get_member_information'));
        } else if (response.status_code === StatusCodeEnum.invalidStatus) {
            toastHelper.error(I18n.t('user_is_spam_and_can_not_send_request'));
        } else if (response.status_code === StatusCodeEnum.dataInvalid) {
            toastHelper.error(I18n.t('information_is_missing'));
        } else if (response.status_code === StatusCodeEnum.dataIsExisted) {
            toastHelper.error(I18n.t('bill_number_is_existed'));
        } else if (response.status_code === StatusCodeEnum.overRequest) {
            toastHelper.error(I18n.t('over_earn_point_request'));
        }
        this.isLoadingSubmit = false;
    }

    onPressCloseModal = () => {
        this.isVisibleSuccessModal = false;
    }

}