import { toastHelper } from './../../helpers/toastHelper';
import { appRoutes } from './../../navigators/appRoutes';
import { authApi, RegisterRequestBody, SocialMethodEnum, ResetPasswordRequestBody } from './../../api/authApi';
import { defaultCountryCalling, phoneRegexp } from '../../commons/constant';
import { observable } from 'mobx';
import { Country, CountryCode } from 'react-native-country-picker-modal';
import { defaultCountryCode } from '../../commons/constant';
import { NavigationScreenProp } from 'react-navigation';
import { Alert, Clipboard } from 'react-native';
import firebase, { RNFirebase } from 'react-native-firebase';
import I18n from 'react-native-i18n';
import { StatusCodeEnum } from '../../enum/statusCodeEnum';
import { localAppStorageHelper } from '../../helpers/localAppStorageHelper';
import md5 from 'md5';

const minPasswordLength = 6;

export class RegisterScreenStore {
    @observable
    countryCode: CountryCode = defaultCountryCode;

    @observable
    countryCalling: string = defaultCountryCalling;

    @observable
    phone = '';

    @observable
    password = '';

    @observable
    confirmPassword = '';

    @observable
    showingPassword = false;

    @observable
    showingConfirmPassword = false;

    @observable
    invalidPasswordMessage = '';

    @observable
    invalidConfirmPasswordMessage = '';

    @observable
    isVisibleOtpModal = false;

    @observable
    otp = '';

    @observable
    isValidOtp = false;

    @observable
    name = '';

    @observable
    sendCodeAgain = false;

    @observable
    invalidNameMessage = '';

    @observable
    phoneWithCountryCode = '';

    @observable
    isProgressing = false;

    @observable
    sessionInfo = '';

    private navigation = {} as NavigationScreenProp<any>;

    resetPasswordMode = false;

    successToast: any;

    errorToast: any;

    constructor() {
    }

    setNavigation = (nav: any) => {
        this.navigation = nav;
    }

    setResetPasswordMode = (isReset: boolean) => {
        this.resetPasswordMode = isReset;
    }

    onSelectCountry = (country: Country) => {
        this.countryCode = country.cca2;
        this.countryCalling = country.callingCode[0];
    }

    onChangePhoneInput = (text: string) => {
        this.phone = text;
    }

    onChangePasswordInput = (text: string) => {
        this.password = text;
        if (this.password && this.password.length < minPasswordLength) {
            this.invalidPasswordMessage = I18n.t('password_must_at_least_six_characters');
        }
        else if (this.confirmPassword && this.confirmPassword !== this.password) {
            this.invalidPasswordMessage = I18n.t('confirm_password_not_match');
        }
        else {
            this.invalidPasswordMessage = '';
        }

    }

    onChangeOtpInput = (text: string) => {
        this.otp = text;
    }

    onChangeNameInput = (text: string) => {
        this.name = text;
        if (!this.name) {
            this.invalidNameMessage = I18n.t('info_required');
        } else {
            this.invalidNameMessage = '';
        }
    }

    onChangeConfirmPasswordInput = (text: string) => {
        this.confirmPassword = text;

        if (this.confirmPassword && this.confirmPassword.length < minPasswordLength) {
            this.invalidConfirmPasswordMessage = I18n.t('password_must_at_least_six_characters');
        }
        else if (this.confirmPassword && this.confirmPassword !== this.password) {
            this.invalidConfirmPasswordMessage = I18n.t('confirm_password_not_match');
        }
        else {
            this.invalidConfirmPasswordMessage = '';
        }

    }


    onPressPasswordEyeIcon = () => {
        this.showingPassword = !this.showingPassword;
    }

    onPressConfirmPasswordEyeIcon = () => {
        this.showingConfirmPassword = !this.showingConfirmPassword;
    }

    validatePhoneNumber = (phoneWithCountryCode: string) => {
        return phoneRegexp.test(phoneWithCountryCode);
    }

    sendCode = async () => {
        const validPhone = this.phone.charAt(0) === '0' ? this.phone.substr(1) : this.phone;
        this.phoneWithCountryCode = `+${this.countryCalling}${validPhone}`;
        if (this.validatePhoneNumber(this.phoneWithCountryCode)) {
            firebase.auth()
                .verifyPhoneNumber(this.phoneWithCountryCode)
                .on('state_changed', async (phoneAuthSnapshot) => {
                    switch (phoneAuthSnapshot.state) {
                        case firebase.auth.PhoneAuthState.CODE_SENT:
                            console.log('OTP sent.', phoneAuthSnapshot.verificationId);
                            this.sendOtpSuccess(phoneAuthSnapshot);
                            return true;
                        case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
                            console.log('auto verify on android timed out');
                            this.sendOtpSuccess(phoneAuthSnapshot);
                            return true;
                        case firebase.auth.PhoneAuthState.AUTO_VERIFIED:
                            console.log('auto verified on android');
                            // TODO: send SMS with another service
                            this.sendOtpSuccess(phoneAuthSnapshot);
                            return true;
                        case firebase.auth.PhoneAuthState.ERROR:
                            this.sendOtpError(phoneAuthSnapshot);
                            return false;
                    }
                })
        } else {
            toastHelper.error(I18n.t('invalid_phone'), this.errorToast);
            return false;
        }
    }

    private sendOtpSuccess = (phoneAuthSnapshot: RNFirebase.PhoneAuthSnapshot) => {
        this.sessionInfo = phoneAuthSnapshot.verificationId;
        this.otp = '';
        this.sendCodeAgain = false;
        this.isVisibleOtpModal = true;
    }

    private sendOtpError = (phoneAuthSnapshot: RNFirebase.PhoneAuthSnapshot) => {
        const message = phoneAuthSnapshot.error ? phoneAuthSnapshot.error.message : '';
        if (message !== 'The interaction was cancelled by the user.') {
            if (message === 'A network error has occurred, please try again.' || message === 'An internal error has occurred. [ 7: ]') {
                toastHelper.error(I18n.t('device_not_connected_internet'), this.errorToast);
            }
            else {
                toastHelper.error(message, this.errorToast);
            }
        }
    }

    onPressSendCodeAgain = async () => {
        this.sendCodeAgain = true;
        this.otp = '';
        await this.sendCode();
    }

    onPressSubmitButton = async () => {
        this.isProgressing = true;
        const success = await this.sendCode();
        if (success) {
            this.otp = '';
            this.sendCodeAgain = false;
            this.isVisibleOtpModal = true;
        }
        this.isProgressing = false;
    }

    onPressCloseOtpModal = () => {
        this.sendCodeAgain = false;
        this.isVisibleOtpModal = false;
    }

    onPressLogin = () => {
        if (this.navigation) {
            this.navigation.goBack();
        }
    }

    onPressContinueButton = async () => {
        this.isProgressing = true;
        if (!this.otp) {
            Alert.alert(I18n.t('must_enter_otp'));
        }
        if (!this.resetPasswordMode) {
            await this.register();
        } else {
            await this.resetPassword();
        }
        this.isProgressing = false;

    }

    private register = async () => {
        const requestBody: RegisterRequestBody = {
            phone: this.phoneWithCountryCode,
            password: md5(this.password),
            socialMethod: SocialMethodEnum.phone,
            name: this.name,
            sessionInfo: this.sessionInfo,
            code: this.otp,
        }

        const responseBody = await authApi.register(requestBody);
        if (responseBody.status_code === StatusCodeEnum.success) {
            const { authorization, account } = responseBody.data;
            await localAppStorageHelper.setAccessToken(authorization);
            await localAppStorageHelper.setAccount(account);

            this.isVisibleOtpModal = false;
            if (this.navigation) {
                this.navigation.navigate(appRoutes.mainTabNavigator);
            }
            toastHelper.success(I18n.t('register_successfully'));
        } else if (responseBody.status_code === StatusCodeEnum.phoneNumberInvalid) {
            toastHelper.error(I18n.t('otp_invalid'), this.errorToast);

        } else if (responseBody.status_code === StatusCodeEnum.userAlreadyExist) {
            toastHelper.error(I18n.t('phone_number_registered'), this.errorToast);
        } else {
            toastHelper.error(I18n.t('error_undefined'), this.errorToast);
        }
    }

    private resetPassword = async () => {
        const requestBody: ResetPasswordRequestBody = {
            phone: this.phoneWithCountryCode,
            password: md5(this.password),
            socialMethod: SocialMethodEnum.phone,
            sessionInfo: this.sessionInfo,
            code: this.otp,
            type: 'USER',
        }
       
        const responseBody = await authApi.resetPassword(requestBody);
        if (responseBody.status_code === StatusCodeEnum.success) {
            this.isVisibleOtpModal = false;
            toastHelper.success(I18n.t('reset_password_successfully'));
        } else if (responseBody.status_code === StatusCodeEnum.phoneNumberInvalid) {
            toastHelper.error(I18n.t('otp_invalid'), this.errorToast);

        } else if (responseBody.status_code === StatusCodeEnum.notFound) {
            toastHelper.error(I18n.t('account_is_not_existed'), this.errorToast);
        } else {
            toastHelper.error(I18n.t('error_undefined'), this.errorToast);
        }
    }

    onPressCopyButton = (content: string) => {
        Clipboard.setString(content);
        toastHelper.success(`${I18n.t('copied')}: ${content}`)
    }
}

