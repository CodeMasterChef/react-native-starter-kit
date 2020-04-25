import { countryCodeAndDialList, Country } from './../components/phoneInput/countryCodeAndDialList';

const maxDialCodeLengthIncludePlusCharacter = 5;


class CountryHelper {

    /**
     * 
     * @param phoneNumberWithDialCode: +84832616161, +167222222233
     */

    getCountryFromFullPhoneNumber(phoneNumberWithDialCode: string): Country | null {
        let length = 3;
        while (length <= maxDialCodeLengthIncludePlusCharacter) {
            let dialCode = phoneNumberWithDialCode.substr(0, length);
            const matched = countryCodeAndDialList.find(c => { return c.dial === dialCode });
            if (matched) {
                return matched as Country;
            } else {
                length++;
            }
        }
        return null;
    }
}

export const countryHelper = new CountryHelper();