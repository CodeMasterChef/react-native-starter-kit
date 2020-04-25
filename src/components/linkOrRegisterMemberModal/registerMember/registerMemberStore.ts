import { countryHelper } from './../../../helpers/countryHelper';
import { PhoneInputStore } from './../../phoneInput/phoneInputStore';
import { emailRegexp } from './../../../commons/constant';
import { timeHelper } from './../../../helpers/timeHelper';
import { RegisterMemberRequestData, RegisterMemberResponseData } from './../../../api/pointApi';
import { Brand, RegisterMemberType } from './../../../@model/brand';
import { observable, computed, autorun } from 'mobx';
import { phoneRegexp } from '../../../commons/constant';
import { pointApi } from '../../../api/pointApi';
import { StatusCodeEnum } from '../../../enum/statusCodeEnum';
import { appStore } from '../../../appStore';
import { toastHelper } from '../../../helpers/toastHelper';
import I18n from 'react-native-i18n';
import Toast from '../../../components/toast';
import { Platform, Alert } from 'react-native';
import { stores } from '../../../stores';
import { authApi } from '../../../api/authApi';
import { localAppStorageHelper } from '../../../helpers/localAppStorageHelper';
import { Account } from '../../../@model/account';


export class RegisterMemberStore {
    @observable
    brand = {} as Brand;

    @observable
    fieldValues = {} as any;

    @observable
    invalidFields = {} as any;

    @observable
    focusedFields = {} as any;

    @observable
    invalidForm = true;

    @observable
    isVisiblePolicyModal = false;

    @observable
    policyChecked = true;

    @observable
    isVisibleGenderModal = false;

    successToast: Toast = {} as any;

    errorToast: Toast = {} as any;

    @observable
    isVisibleDateModal = false;

    @observable
    dateDisplay = 'dd/mm/yyyy';

    @observable
    genderDisplay = '';

    @observable
    registerMemberInformation = {} as RegisterMemberResponseData;

    @observable
    isResubmit = false;

    @observable
    isVisibleDatePickerOnAndroid = false;

    private selectedDate = new Date();

    phoneInputStore = new PhoneInputStore();

    @observable
    isRefreshing = false;

    cachedRequestBody!: RegisterMemberRequestData;

    onRegisterSuccess!: any;

    genders = [
        { value: 0, label: I18n.t('male') },
        { value: 1, label: I18n.t('female') },
        { value: 2, label: I18n.t('other') },
    ]

    account!: Account;

    @observable
    agreeUpdateChecked = true;

    constructor(brand: Brand) {
        this.brand = brand;
        autorun(async () => {
            await this.onRefresh();
            await this.initForm();
        })
    }

    onRefresh = async () => {
        this.isRefreshing = true;
        await this.getRegisterMemberInformation();
        this.isRefreshing = false;
    }


    private initForm = async () => {
        const accountResponse = await authApi.getUserProfile();

        this.brand.registerMemberTypes.forEach(async (registerMemberType) => {
            this.invalidFields[registerMemberType] = (registerMemberType.endsWith('REQUIRED')) ? true : false;
            // auto fill information from account information
            if (accountResponse.status_code === StatusCodeEnum.success) {
                const account = accountResponse.data;
                this.account = account;
                if ((registerMemberType === RegisterMemberType.name || registerMemberType === RegisterMemberType.nameRequired) && account.name) {
                    this.updateAndValidateText(account.name, registerMemberType);
                } else if ((registerMemberType === RegisterMemberType.phone || registerMemberType === RegisterMemberType.phoneRequired) && account.phone) {
                    let country = countryHelper.getCountryFromFullPhoneNumber(account.phone);
                    if (country) {
                        const phoneWithoutDialCode = account.phone.substring(country.dial.length);
                        this.phoneInputStore.setCountryCode(country.code);
                        this.phoneInputStore.setPhone(phoneWithoutDialCode);
                        this.updateAndValidateText(account.phone, registerMemberType);
                    }
                } else if ((registerMemberType === RegisterMemberType.birthday || registerMemberType === RegisterMemberType.birthdayRequired) && account.dateOfBirth) {
                    this.dateDisplay = timeHelper.convertTimestampToDayMonthYear(account.dateOfBirth);
                    this.selectedDate = new Date(account.dateOfBirth);
                    this.updateAndValidateText(account.dateOfBirth, registerMemberType);
                }
                else if ((registerMemberType === RegisterMemberType.gender || registerMemberType === RegisterMemberType.genderRequired) && account.gender !== null && account.gender >= 0) {
                    const gender = this.genders.find(g => { return g.value === account.gender });
                    if (gender) {
                        this.genderDisplay = gender.label;
                        this.updateAndValidateText(account.gender, registerMemberType);
                    }
                }
                else if ((registerMemberType === RegisterMemberType.email || registerMemberType === RegisterMemberType.emailRequired) && account.email) {
                    this.updateAndValidateText(account.email, registerMemberType);
                } else if ((registerMemberType === RegisterMemberType.address || registerMemberType === RegisterMemberType.addressRequired) && (account.address || account.province)) {
                    let addressWithProvince = '';
                    if (account.address) {
                        addressWithProvince += account.address;
                        if (account.province && account.province.name) {
                            addressWithProvince += `, ${account.province.name}`;
                        }
                    } else if (account.province && account.province.name) {
                        addressWithProvince = account.province.name;
                    }

                    this.updateAndValidateText(addressWithProvince, registerMemberType);
                }
                else {
                    this.fieldValues[registerMemberType] = null;
                }
            } else {
                this.fieldValues[registerMemberType] = null;
            }
            let invalid = false;
            Object.values(this.invalidFields).forEach(value => {
                if (value) {
                    invalid = true;
                }
            })
            this.invalidForm = invalid;

        });
        if (!this.brand.policy) {
            await this.getBrandDetails();
        }
    }


    @computed get isInvalidEmailInput() {
        return (this.focusedFields[RegisterMemberType.email] && this.invalidFields[RegisterMemberType.email]) || this.focusedFields[RegisterMemberType.emailRequired] && this.invalidFields[RegisterMemberType.emailRequired];
    }

    @computed get isInvalidPhoneInput() {
        return (this.focusedFields[RegisterMemberType.phone] && this.invalidFields[RegisterMemberType.phone]) || (this.focusedFields[RegisterMemberType.phoneRequired] && this.invalidFields[RegisterMemberType.phoneRequired]);
    }

    private getRegisterMemberInformation = async () => {
        if (this.brand && this.brand.id) {
            const responseData = await pointApi.getRegisterMemberInformationOfABrand(this.brand.id);
            this.registerMemberInformation = responseData.data;
        }

    }

    private getBrandDetails = async () => {
        if (this.brand && this.brand.id) {
            const response = await pointApi.getBrandDetails(this.brand.id);
            if (response && response.status_code === StatusCodeEnum.success && response.data) {
                this.brand.policy = response.data.policy;
            }
        }
    }

    onFocusInput = (registerType: RegisterMemberType) => {
        this.focusedFields[registerType] = true;
    }

    updateAndValidateText = (value: string | number, registerType: RegisterMemberType) => {
        this.fieldValues[registerType] = value;
        this.focusedFields[registerType] = true;
        this.invalidFields[registerType] = (registerType.endsWith('REQUIRED') && (typeof (value === 'string') ? !value : (value < 0))) ? true : false;

        if ((registerType === RegisterMemberType.phone || registerType === RegisterMemberType.phoneRequired) && typeof value === 'string' && value.length) {
            this.invalidFields[registerType] = !phoneRegexp.test(value);
        } else if (registerType === RegisterMemberType.genderRequired) {
            this.invalidFields[registerType] = !this.genders.some(gender => { return gender.value === value });
        } else if (registerType === RegisterMemberType.birthdayRequired) {
            this.invalidFields[registerType] = value < 0;
        } else if ((registerType === RegisterMemberType.email || registerType === RegisterMemberType.emailRequired) && typeof value === 'string' && value.length) {
            this.invalidFields[registerType] = !emailRegexp.test(value);
        }

        // validate text
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

    onPressAgreeUpdateCheckBox = () => {
        this.agreeUpdateChecked = !this.agreeUpdateChecked;
    }

    onPressLinkButton = (onSwitchLinkMember: any) => {
        if (onSwitchLinkMember !== undefined && onSwitchLinkMember !== null) {
            try {
                onSwitchLinkMember();
            } catch (error) {
            }
        }
    }

    onPressSubmitButton = async () => {

        const requestBody: RegisterMemberRequestData = {
            brandId: this.brand.id,
            phone: this.fieldValues[RegisterMemberType.phone] ? this.fieldValues[RegisterMemberType.phone] : this.fieldValues[RegisterMemberType.phoneRequired],
            name: this.fieldValues[RegisterMemberType.name] ? this.fieldValues[RegisterMemberType.name] : (this.fieldValues[RegisterMemberType.nameRequired] ? this.fieldValues[RegisterMemberType.nameRequired] : null),
            dateOfBirth: this.fieldValues[RegisterMemberType.birthday] ? this.fieldValues[RegisterMemberType.birthday] : (this.fieldValues[RegisterMemberType.birthdayRequired] ? this.fieldValues[RegisterMemberType.birthdayRequired] : null),
            idCard: this.fieldValues[RegisterMemberType.idCard] ? this.fieldValues[RegisterMemberType.idCard] : (this.fieldValues[RegisterMemberType.idCardRequired] ? this.fieldValues[RegisterMemberType.idCardRequired] : null),
            email: this.fieldValues[RegisterMemberType.email] ? this.fieldValues[RegisterMemberType.email] : (this.fieldValues[RegisterMemberType.emailRequired] ? this.fieldValues[RegisterMemberType.emailRequired] : null),
            address: this.fieldValues[RegisterMemberType.address] ? this.fieldValues[RegisterMemberType.address] : (this.fieldValues[RegisterMemberType.addressRequired] ? this.fieldValues[RegisterMemberType.addressRequired] : null),
            gender: this.fieldValues[RegisterMemberType.gender] >= 0 ? this.fieldValues[RegisterMemberType.gender] : (this.fieldValues[RegisterMemberType.genderRequired] >= 0 ? this.fieldValues[RegisterMemberType.genderRequired] : null),

        }
        this.cachedRequestBody = requestBody;

        const response = await pointApi.registerMember(requestBody);
        if (response && response.status_code === StatusCodeEnum.created) {

            if (this.onRegisterSuccess) {
                try {
                    this.onRegisterSuccess();
                } catch (err) {
                }
            }
            toastHelper.success(I18n.t('register_member_successfully'));
            if (this.agreeUpdateChecked) {
                // we need to show alert when data is changed
                if (requestBody.name !== this.account.name ||
                    requestBody.dateOfBirth !== this.account.dateOfBirth ||
                    requestBody.gender !== this.account.gender ||
                    requestBody.email !== this.account.email ||
                    requestBody.address !== this.account.address
                ) {
                   await this.updateProfile();
                }
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
        } else {
            toastHelper.error(I18n.t('error_undefined_try_again'), this.errorToast);
        }
    }

    onPressGenderInput = () => {
        this.isVisibleGenderModal = true;
    }

    onPressGenderListItem = (gender: { label: string, value: number }, registerMemberType: RegisterMemberType) => {
        this.updateAndValidateText(gender.value, registerMemberType);
        this.genderDisplay = gender.label;
        this.isVisibleGenderModal = false;
    }

    onPressDatePicker = () => {
        if (Platform.OS === 'ios') {
            this.isVisibleDateModal = true;
        } else {
            this.isVisibleDatePickerOnAndroid = true;
        }
    }

    onPressCloseDateModal = () => {
        this.isVisibleDateModal = false;
    }

    onPressChooseDateModal = () => {
        if (this.selectedDate) {
            const registerType = this.brand.registerMemberTypes.some(registerType => { return registerType === RegisterMemberType.birthdayRequired }) ? RegisterMemberType.birthdayRequired : RegisterMemberType.birthday;
            this.updateAndValidateText(this.selectedDate.getTime(), registerType);
            this.dateDisplay = timeHelper.convertDateToDayMonthYear(this.selectedDate);
        }
        this.isVisibleDateModal = false;
    }

    onChangeDate = (event: any, date?: Date) => {
        if (event.type === 'dismissed') {
            this.isVisibleDatePickerOnAndroid = false;
        }
        if (date) {
            this.selectedDate = date;
            if (Platform.OS === 'android') {
                // on Android, the value changes when we click OK but on iOS, the value change when we scroll.
                this.isVisibleDatePickerOnAndroid = false;
                this.onPressChooseDateModal();
            }
        }
    }

    onPressResubmitButton = () => {
        this.isResubmit = true;
    }

    updateProfile = async () => {

        this.isRefreshing = true;
        if (this.cachedRequestBody.name) {
            this.account.name = this.cachedRequestBody.name;
        }
        if (this.cachedRequestBody.dateOfBirth) {
            this.account.dateOfBirth = this.cachedRequestBody.dateOfBirth;
        }
        if (this.cachedRequestBody.email) {
            this.account.email = this.cachedRequestBody.email;
        }
        if (this.cachedRequestBody.address) {
            this.account.address = this.cachedRequestBody.address;
        }
        if (this.cachedRequestBody.gender && this.cachedRequestBody.gender >= 0) {
            this.account.gender = this.cachedRequestBody.gender;
        }
        if (this.account.province) {
            this.account.provinceId = this.account.province.id;
        }
        console.log("updateProfile -> this.account", JSON.stringify(this.account))

        const response = await authApi.updateProfile(this.account);

        if (response.status_code === StatusCodeEnum.success) {
            toastHelper.success(I18n.t('update_successfully'));
            await localAppStorageHelper.setAccount(response.data);
            stores.accountScreenStore?.setName(response.data.name);
        }
        this.isRefreshing = false;
    }
}