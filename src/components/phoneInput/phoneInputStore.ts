import { observable } from 'mobx';
import { CountryCode, Country } from 'react-native-country-picker-modal';
import { defaultCountryCode, defaultCountryCalling } from '../../commons/constant';

export class PhoneInputStore {
    @observable
    countryCode = defaultCountryCode as CountryCode;

    @observable
    phone = '';

    countryCalling = defaultCountryCalling;

    onChangePhoneWithCountryCodeCallback: any;

    setOnChangePhoneWithCountryCodeCallback = (fun: any) => {
        if (fun) {
            this.onChangePhoneWithCountryCodeCallback = fun;
        }
    }

    setPhone = (text: string) => {
        this.phone = text;
    }

    setCountryCode = (text: string) => {
        this.countryCode = text as CountryCode;
    }

    private getPhoneWithCountryCode = () => {
        const validPhone = this.phone.charAt(0) === '0' ? this.phone.substr(1) : this.phone;
        return `+${this.countryCalling}${validPhone}`;
    }

    onSelectCountry = (country: Country) => {
        this.countryCode = country.cca2;
        this.countryCalling = country.callingCode[0];
        if (this.onChangePhoneWithCountryCodeCallback) {
            this.onChangePhoneWithCountryCodeCallback(this.getPhoneWithCountryCode());
        }
    }

    onChangePhoneInput = (text: string) => {
        this.phone = text;
        if (this.onChangePhoneWithCountryCodeCallback) {
            this.onChangePhoneWithCountryCodeCallback(this.getPhoneWithCountryCode());
        }
    }
}