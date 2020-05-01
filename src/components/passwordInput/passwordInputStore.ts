import { observable } from 'mobx';
import { CountryCode, Country } from 'react-native-country-picker-modal';
import { defaultCountryCode, defaultCountryCalling } from '../../commons/constant';

export class PasswordInputStore {

    @observable
    showingPassword = false;

    @observable
    password = '';

    onChangePasswordCallback: (password: string) => void = {} as (password: string) => void;

    setOnChangePasswordCallback = (fun: (password: string) => void) => {
        this.onChangePasswordCallback = fun;
    }

    onChangePasswordInput = (text: string) => {
        this.password = text;
        if (this.onChangePasswordCallback) {
            this.onChangePasswordCallback(this.password);
        }
    }

    onPressEyeIcon = () => {
        this.showingPassword = !this.showingPassword;
    }



}