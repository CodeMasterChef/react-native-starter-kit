import { Colors } from './colors';
import { StyleSheet } from 'react-native';
import { defaultMargin, defaultFontSize, defaultBorderRadius, deviceWidth, defaultFontFamily, deviceHeight } from './constant';


export const defaultStyles = StyleSheet.create({
    /**
     * Layout
     */
    container: {
        flex: 1,
    },
    screen: {
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    whiteScreen: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    violetScreen: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    screenContentContainer: {
        flex: 1,
        backgroundColor: Colors.third,
    },
    scrollViewStyle: {
        flex: 1,
    },
    scrollViewContentContainerStyle: {
        flexGrow: 1,
    },
    screenContent: {
        flex: 1,
        marginTop: 10,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    backgroundWhite: {
        backgroundColor: Colors.white,
    },
    margin: {
        margin: defaultMargin,
    },
    padding: {
        padding: defaultMargin,
    },
    paddingHorizontal: {
        paddingHorizontal: defaultMargin,
    },
    paddingVertical: {
        paddingVertical: defaultMargin,
    },
    marginVertical: {
        marginVertical: defaultMargin,
    },
    marginHorizontal: {
        marginHorizontal: defaultMargin,
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
    column1: {
        flex: 1,
    },
    column2: {
        flex: 2,
    },
    horizontalCenter: {
        alignItems: 'center',
    },
    verticalCenter: {
        justifyContent: 'center',
    },
    floatRight: {
        alignItems: 'flex-end',
    },
    centerCenter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    /** Modal
     * 
     */
    modal: {
        margin: 0,
        backgroundColor: 'white',
    },
    modalContent: {
        backgroundColor: 'white',
        margin: defaultMargin * 2,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalCloseButtonContainer: {
        alignItems: 'flex-end',
        marginTop: 20,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    modalHeader: {
        margin: defaultMargin,
        alignItems: 'flex-end',
    },
    modalBody: {
        margin: defaultMargin,
    },
    /**
     * Text
     */
    text: {
        fontSize: defaultFontSize,
        fontFamily: defaultFontFamily,
    },
    textLarge: {
        fontSize: defaultFontSize * 1.4,
        fontFamily: defaultFontFamily,
    },
    textWhite: {
        color: Colors.white,
        fontSize: defaultFontSize,
        fontFamily: defaultFontFamily,
    },
    textHeaderLeft: {
        color: Colors.white,
        fontSize: defaultFontSize,
        paddingVertical: 7,
        fontFamily: defaultFontFamily,
    },
    textHeaderRight: {
        color: Colors.white,
        fontSize: defaultFontSize,
        paddingVertical: 7,
        marginRight: 2,
        fontFamily: defaultFontFamily,
    },
    textDanger: {
        color: Colors.danger,
        fontSize: defaultFontSize,
        fontFamily: defaultFontFamily,
    },
    textRed: {
        color: Colors.toastDanger,
        fontSize: defaultFontSize,
        fontFamily: defaultFontFamily,
    },
    textBold: {
        fontWeight: 'bold',
        fontSize: defaultFontSize,
        fontFamily: defaultFontFamily,
    },
    textSmall: {
        fontSize: defaultFontSize * 0.8,
        fontFamily: defaultFontFamily,
    },
    textMedium: {
        fontSize: defaultFontSize * 1.2,
        fontFamily: defaultFontFamily,
    },
    textLink: {
        fontSize: defaultFontSize,
        color: Colors.secondary,
        textDecorationLine: 'underline',
        fontFamily: defaultFontFamily,
    },
    textRight: {
        fontSize: defaultFontSize,
        textAlign: 'right',
        fontFamily: defaultFontFamily,
    },
    /**
     * button
     */
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonActivate: {
        opacity: 1,
    },
    lightButton: {
        backgroundColor: Colors.lightGray,
        borderRadius: defaultBorderRadius,
    },
    lightButtonText: {
        fontSize: defaultFontSize,
        color: Colors.gray,
        margin: defaultMargin * 2,

    },
    highlightButton: {
        backgroundColor: Colors.highlight,
        borderRadius: defaultBorderRadius,
    },
    hightButtonText: {
        fontSize: defaultFontSize,
        color: Colors.white,
        margin: defaultMargin * 2,
    },
    /***
     * Toast
     */
    successToast: {
        backgroundColor: Colors.toastSuccess,
        borderRadius: 5,
    },
    errorToast: {
        backgroundColor: Colors.toastDanger,
        borderRadius: 5,
    },
    textToast: {
        fontSize: defaultFontSize,
        fontFamily: defaultFontFamily,
        color: Colors.white,
        textAlign: 'center',
    },
    warningToast: {
        backgroundColor: Colors.toastWarning,
        borderRadius: 5,
    },
    grayToast: {
        backgroundColor: Colors.gray,
        borderRadius: 5,
    },
    errorCenterToast: {
        backgroundColor: 'rgba(212,75,73,0.98)',
        width: deviceWidth / 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    successCenterToast: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        width: deviceWidth / 2,
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
    },
    /**
     * ScrollableTabView
     */
    tabUnderlineStyle: {
        height: 0,
    },
    tabsContainerStyle: {
        margin: 1,
        justifyContent: 'flex-start',
    },
    tabsStyle: {
        height: 39,
    },
    scrollableTabBarTabStyle: {
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 6,
        paddingLeft: 20,
        paddingRight: 20,
        height: 28,
        marginLeft: 1,
        marginRight: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 4,
    },

    /**Components */

    currencyContainer: {
        flexDirection: 'row',
    },
    textCurrency: {
        fontSize: defaultFontSize * 0.8,
        fontFamily: defaultFontFamily,
    },

    /**Shadow */
    defaultShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    }
});