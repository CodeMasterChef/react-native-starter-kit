import { toastHelper } from './../../helpers/toastHelper';
import { appStore } from './../../appStore';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { authApi, LoginRequestBody, SocialMethodEnum } from './../../api/authApi';
import { appRoutes } from './../../navigators/appRoutes';
import { defaultCountryCalling, phoneRegexp } from './../../commons/constant';
import { observable } from 'mobx';
import { Country, CountryCode } from 'react-native-country-picker-modal';
import { defaultCountryCode } from '../../commons/constant';
import { NavigationScreenProp } from 'react-navigation';
import { localAppStorageHelper } from '../../helpers/localAppStorageHelper';
import I18n from 'react-native-i18n';
import md5 from 'md5';

export class LoginScreenStore {
    @observable
    countryCode: CountryCode = defaultCountryCode;

    @observable
    countryCalling: string = defaultCountryCalling;

    @observable
    showingPassword = false;

    @observable
    showingCountryButton = false;

    @observable
    phone = '356957240';

    @observable
    password = '123456';

    @observable
    isProcessing = false;

    count = 0;

    navigation = null as NavigationScreenProp<any> | null;

    errorToast: any;

    constructor() {
    }

    setNavigation = (nav: any) => {
        this.navigation = nav;
    }

    validatePhoneNumber = (phoneWithCountryCode: string) => {
        return phoneRegexp.test(phoneWithCountryCode);
    }

    onChangePhoneInput = (text: string) => {
        this.phone = text;
    }

    onChangePasswordInput = (text: string) => {
        this.password = text;
    }

    onSelectCountry = (country: Country) => {
        this.countryCode = country.cca2;
        this.countryCalling = country.callingCode[0];
    }

    onPressEyeIcon = () => {
        this.showingPassword = !this.showingPassword;
    }

    onPressLoginButton = async () => {
        this.isProcessing = true;
        const validPhone = this.phone.charAt(0) === '0' ? this.phone.substr(1) : this.phone;

        const phoneWithCountryCode = `+${this.countryCalling}${validPhone}`;

        // if (this.validatePhoneNumber(phoneWithCountryCode)) {
            try {
                const requestBody: LoginRequestBody = {
                    username: phoneWithCountryCode,
                    password: md5(this.password),
                    socialMethod: SocialMethodEnum.phone,
                    type: 'USER',
                }
                // const responseBody = await authApi.login(requestBody);
                // if (responseBody.status_code === StatusCodeEnum.success) {
                //     const { account, authorization } = responseBody.data;
                //     await localAppStorageHelper.setAccessToken(authorization);
                //     await localAppStorageHelper.setAccount(account);
                if (this.navigation) {
                    this.navigation.navigate(appRoutes.mainTabNavigator);
                    //         // open deep link option modal when the app is open by deep link
                    //         const savedDeepLinkBrandId = await localAppStorageHelper.getSavedDeepLinkBrandId();
                    //         if (savedDeepLinkBrandId) {
                    //             await appStore.deepLinkSelectStore.setBrandId(savedDeepLinkBrandId);
                    //             appStore.deepLinkSelectStore.isVisible = true;
                    //             await localAppStorageHelper.setSavedDeepLinkBrandId(null);
                    //         }
                }
                // } else if (responseBody.status_code === StatusCodeEnum.notFound || responseBody.status_code === StatusCodeEnum.userInvalid) {
                //     toastHelper.error(I18n.t('phone_or_password_is_incorrect'), this.errorToast);
                // } else {
                //     toastHelper.error(I18n.t('error_undefined'), this.errorToast);
                // }
                this.isProcessing = false;
            } catch (err) {
                toastHelper.error(err.message, this.errorToast);
                console.log(err);
                this.isProcessing = false;
                return false;
            }
        // } else {
        //     toastHelper.error(I18n.t('invalid_phone'), this.errorToast);
        //     this.isProcessing = false;
        //     return false;
        // }
        this.isProcessing = false;
    }

    onPressRegisterButton = () => {
        if (this.navigation) {
            this.navigation.navigate(appRoutes.registerScreen);
        }

    }

    onPressForgotButton = () => {
        if (this.navigation) {
            this.navigation.navigate(appRoutes.registerScreen, { resetPasswordMode: true })
        }

    }


    onPressVersionLabel = () => {
        this.count++;
        if (this.count % 20 === 0) {
            appStore.devMode = false;
            toastHelper.info('debug mode is off.');
        } else if (this.count >= 10) {
            appStore.devMode = true;
            toastHelper.info('debug mode is enabled.');
        }
    }
}
