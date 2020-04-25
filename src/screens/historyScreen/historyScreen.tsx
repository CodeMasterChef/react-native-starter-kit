import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import { observer } from 'mobx-react';
import { HistoryScreenStore } from './historyScreenStore';
import I18n from 'react-native-i18n';
import { NavigationScreenProp } from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from '../../components/scrollableTabBar/ScrollableTabBar';
import { Colors } from '../../commons/colors';
import { deviceHeight, defaultBorderBottomWidth } from '../../commons/constant';
import DepositHistory from './depositHistory/depositHistory';
import ExchangeHistory from './exchangeHistory/exchangeHistory';
import EarnPointHistory from './earnPointHistory/earnPointHistory';
interface Props {
    navigation: NavigationScreenProp<any>,
}

@observer
export default class HistoryScreen extends Component<Props> {

    static navigationOptions = () => ({
        title: I18n.t('transaction_history'),
        header: (props: any) => <HeaderNavigation {...props} />,
        headerBackTitle: I18n.t('history'),
        ...DefaultNavigationOptions,
    });

    store = new HistoryScreenStore();

    constructor(props: Props) {
        super(props);
    };

    componentDidMount() {
        this.store.setNavigation(this.props.navigation);
    }


    render() {
        return (
            <View style={defaultStyles.container}>
                <ScrollableTabView initialPage={0}
                    renderTabBar={() =>
                        <ScrollableTabBar
                            activeTextColor={Colors.white}
                            activeBackgroundColor={Colors.primary}
                            inactiveTextColor={Colors.primary}
                            underlineStyle={defaultStyles.tabUnderlineStyle}
                            tabsContainerStyle={defaultStyles.tabsContainerStyle}
                            style={defaultStyles.tabsStyle}
                            tabStyle={defaultStyles.scrollableTabBarTabStyle}
                        />}>
                    {
                        //@ts-ignore
                        <View tabLabel={I18n.t('refill_point')}>
                            <DepositHistory navigation={this.props.navigation} />
                        </View>
                    }
                    {
                        //@ts-ignore
                        <View tabLabel={I18n.t('exchange_points')}>
                            <ExchangeHistory navigation={this.props.navigation} />
                        </View>
                    }

                    {
                        //@ts-ignore
                        <View tabLabel={I18n.t('earn_points')}>
                            <EarnPointHistory navigation={this.props.navigation} />
                        </View>
                    }


                </ScrollableTabView>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    list: {
        minHeight: 0.8 * deviceHeight,
    },
    listContent: {
        paddingBottom: 20,
    },
    item: {
        flexDirection: 'row',
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: defaultBorderBottomWidth,

    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    pending: {
        color: Colors.transactionPending,
    },
    completed: {
        color: Colors.transactionSuccess,
    },
    fail: {
        color: Colors.transactionFail,
    }

});

