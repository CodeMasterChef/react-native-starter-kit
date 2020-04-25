import { Colors } from './colors';
import { Dimensions } from 'react-native';
import { Header } from 'react-navigation-stack';

export const headerMinHeight = Header.HEIGHT;
export const bottomBarHeight = 75;
export const bottomBardIconSize = 32;

const window = Dimensions.get('window');

export const deviceWidth = window.width;
export const deviceHeight = window.height;

export const defaultMargin = 6;

export const defaultBorderWidth = 1.5;
export const defaultBorderBottomWidth = 2.5;
export const defaultBorderRightWidth = 2.5;

export const defaultBorderRadius = 6.6;

export const defaultPageBorderRadius = 10;

export const defaultFontSize = 16;

export const defaultFontFamily = 'SanFranciscoDisplay-Light';

export const defaultLoyalPointCurrency = 'LOP';

export const defaultVietnameseCurrency = 'VND';

export const defaultCountryCode = 'VN';

export const defaultCountryCalling = '84';

export const modalCloseIconSize = 32;

export const defaultToastPosition = 60;

export const zeroUID = '00000000-0000-0000-0000-000000000000';

export const defaultBrandName = 'Loyal One';

export const processCircleSnailSize = 26;

export const loadingPageCircleSize = 50;

export const processCircleSnailColors = [Colors.secondary, Colors.highlight];

export const processCircleSnailSpinDuration = 1000;

export const loadingCircleSize = 50;

export const defaultDateFormat = 'dd/mm/yyyy';
/**
 * The format of the phone number provided is incorrect. 
 * Please enter the phone number in a format that can be parsed into E.164 format. 
 * E.164 phone numbers are written in the format [+][country code][subscriber number including area code].
 */
export const phoneRegexp = /^\+\d{6,11}$/;

export const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const modalBackdropOpacity = 0.1;

export const defaultSizeNumberInTextInput = 24;