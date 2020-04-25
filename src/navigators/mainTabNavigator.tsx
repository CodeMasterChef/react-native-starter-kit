import React from 'react';
import { Colors } from '../commons/colors';
import HomeScreen from '../screens/homeScreen/homeScreen';
import { appRoutes } from './appRoutes';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import WalletScreen from '../screens/walletScreen/walletScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountScreen from '../screens/accountScreen/accountScreen';
import I18n from 'react-native-i18n';
import AddLoyalPointScreen from '../screens/addLoyalPointScreen/addLoyalPointScreen';
import BankScreen from '../screens/bankScreen/bankScreen';
import PartnerBrandScreen from '../screens/partnerBrandScreen/partnerBrandScreen';
import HistoryScreen from '../screens/historyScreen/historyScreen';
import ExchangePointScreen from '../screens/exchangeScreen/exchangeScreen';
import VnpayScreen from '../screens/vnpayScreen/vnpayScreen';
import TransactionDetailScreen from '../screens/transactionDetailScreen/transactionDetailScreen';
import BrandProfileScreen from '../screens/brandProfileScreen/brandProfileScreen';
import VoucherDetailScreen from '../screens/voucherDetailScreen/voucherDetailScreen';
import GiftScreen from '../screens/giftScreen/giftScreen';
import UserProfileScreen from '../screens/userProfileScreen/userProfileScreen';
import { defaultFontFamily, bottomBardIconSize } from '../commons/constant';
import UserCodeScreen from '../screens/userCodeScreen/userCodeScreen';
import RequestEarnPointScreen from '../screens/requestEarnPointScreen/requestEarnPointScreen';
import ScannerButtonOnBottomBar from '../components/scannerButtonOnBottomBar/scannerButtonOnBottomBar';
import { Image } from 'react-native';
import { appStore } from '../appStore';
import VoucherListScreen from '../screens/voucherListScreen/voucherListScreen';
import SearchScreen from '../screens/searchScreen/searchScreen';

const iconSize = bottomBardIconSize;

const homeStack = createStackNavigator({
    [appRoutes.homeScreen]: HomeScreen,
    [appRoutes.searchScreen]: SearchScreen,
    [appRoutes.giftScreen]: GiftScreen,
    [appRoutes.voucherDetailScreen]: VoucherDetailScreen,
    [appRoutes.userCodeScreen]: UserCodeScreen,
    [appRoutes.exchangePointScreen]: ExchangePointScreen,
    [appRoutes.partnerBrandScreen]: PartnerBrandScreen,
    [appRoutes.walletScreen]: WalletScreen,
    [appRoutes.brandProfileScreen]: BrandProfileScreen,
    [appRoutes.voucherDetailScreen]: VoucherDetailScreen,
    [appRoutes.addLoyalPointScreen]: AddLoyalPointScreen,
    [appRoutes.bankScreen]: BankScreen,
    [appRoutes.partnerBrandScreen]: PartnerBrandScreen,
    [appRoutes.vnpayScreen]: VnpayScreen,
    [appRoutes.transactionDetailScreen]: TransactionDetailScreen,
    [appRoutes.exchangePointScreen]: ExchangePointScreen,
    [appRoutes.requestEarnPointScreen]: RequestEarnPointScreen,
    [appRoutes.voucherListScreen]: VoucherListScreen,
});

homeStack.navigationOptions = () => ({
    tabBarLabel: 'Loyal One',
    tabBarOptions: {
        showLabel: true,
        activeTintColor: Colors.primary,
        labelStyle: {
            fontFamily: defaultFontFamily,
        }
    },
    tabBarIcon: ({ focused }: { focused: boolean }) => (
        focused ?
            <Image resizeMode='contain' style={{ width: 24 }} source={require('../assets/images/home_active.png')} /> :
            <Image resizeMode='contain' style={{ width: 24 }} source={require('../assets/images/home_inactive.png')} />

    ),
});


const accountStack = createStackNavigator({
    [appRoutes.accountScreen]: AccountScreen,
    [appRoutes.historyScreen]: HistoryScreen,
    [appRoutes.transactionDetailScreen]: TransactionDetailScreen,
    [appRoutes.userProfileScreen]: UserProfileScreen,
    [appRoutes.userCodeScreen]: UserCodeScreen,
});

accountStack.navigationOptions = () => ({
    tabBarLabel: I18n.t('account'),
    tabBarOptions: {
        showLabel: true,
        activeTintColor: Colors.primary,
        labelStyle: {
            fontFamily: defaultFontFamily,
        }
    },
    tabBarIcon: ({ focused }: { focused: boolean }) => (
        focused ?
            <MaterialCommunityIcons name='account' size={iconSize}
                color={Colors.primary} /> :
            <MaterialCommunityIcons name='account-outline' size={iconSize}
                color={Colors.gray} />
    ),
});


export default createBottomTabNavigator({
    [appRoutes.homeStack]: homeStack,
    scannerButton: {
        screen: () => null,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: I18n.t('scan'),
            tabBarIcon: (<ScannerButtonOnBottomBar navigation={navigation} />),
            tabBarOnPress: () => {
                appStore.isVisibleScannerModal = true;
            }
        })
    },
    [appRoutes.accountStack]: accountStack,
}, {
    initialRouteName: appRoutes.homeStack,


});
