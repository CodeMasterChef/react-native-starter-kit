import React from 'react';
import { Colors } from '../commons/colors';
import HomeScreen from '../screens/homeScreen/homeScreen';
import { appRoutes } from './appRoutes';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountScreen from '../screens/accountScreen/accountScreen';
import I18n from 'react-native-i18n'; 
import { defaultFontFamily, bottomBardIconSize } from '../commons/constant';
import ScannerButtonOnBottomBar from '../components/scannerButtonOnBottomBar/scannerButtonOnBottomBar';
import { Image } from 'react-native';
import { appStore } from '../appStore';
import { FoodDetailStore } from '../screens/foodDetailScreen/foodDetailScreenStore';
import FoodDetailScreen from '../screens/foodDetailScreen/foodDetailScreen';

const iconSize = bottomBardIconSize;

const homeStack = createStackNavigator({
    [appRoutes.homeScreen]: HomeScreen,
    [appRoutes.foodDetailScreen]: FoodDetailScreen,
});

homeStack.navigationOptions = () => ({
    tabBarLabel: 'Food',
    tabBarOptions: {
        showLabel: true,
        activeTintColor: Colors.primary,
        labelStyle: {
            fontFamily: defaultFontFamily,
        }
    },
    tabBarIcon: ({ focused }: { focused: boolean }) => (
        <MaterialCommunityIcons name='food-apple-outline' size={iconSize}
            color={focused ? Colors.secondary : Colors.gray} />
    ),
});


const accountStack = createStackNavigator({
    [appRoutes.accountScreen]: AccountScreen,
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
            tabBarLabel: I18n.t('add'),
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
