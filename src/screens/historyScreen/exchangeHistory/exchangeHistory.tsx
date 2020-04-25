import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { defaultStyles } from '../../../commons/defaultStyles';
import { observer, Observer } from 'mobx-react';
import { ExchangeHistoryStore } from './exchangeHistoryStore';
import I18n from 'react-native-i18n';
import { NavigationScreenProp, FlatList } from 'react-navigation';
import { Colors } from '../../../commons/colors';
import { deviceHeight, defaultLoyalPointCurrency, defaultBorderBottomWidth, loadingCircleSize, processCircleSnailColors, processCircleSnailSpinDuration, defaultMargin } from '../../../commons/constant';
import { timeHelper } from '../../../helpers/timeHelper';
import { ExchangeTransactionStatusEnum, ExchangeType } from '../../../api/pointApi';
import * as Progress from 'react-native-progress';

interface Props {
    navigation: NavigationScreenProp<any>,
}

@observer
export default class ExchangeHistory extends Component<Props> {


    store = new ExchangeHistoryStore();

    constructor(props: Props) {
        super(props);
    };

    componentDidMount() {
        this.store.setNavigation(this.props.navigation);
    }

    private getStatusStyle = (status: ExchangeTransactionStatusEnum) => {
        if (status === ExchangeTransactionStatusEnum.new) {
            return styles.pending;
        } else if (status === ExchangeTransactionStatusEnum.cancelled || status === ExchangeTransactionStatusEnum.rejected) {
            return styles.fail;
        } else if (status === ExchangeTransactionStatusEnum.completed) {
            return styles.completed;
        } else {
            return status;
        }
    }

    render() {
        return (
            <View style={defaultStyles.container}>
                {
                    this.store.isLoadingPage &&
                    <View style={{ height: loadingCircleSize }}>
                        <View style={defaultStyles.horizontalCenter}>
                            <View style={{ width: loadingCircleSize }}>
                                <Progress.CircleSnail
                                    size={loadingCircleSize}
                                    color={processCircleSnailColors}
                                    spinDuration={processCircleSnailSpinDuration}
                                />
                            </View>
                        </View>
                    </View>
                }
                {
                    !!(this.store.transactions && this.store.transactions.length) &&
                    <View style={defaultStyles.container}>
                        <FlatList
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            onRefresh={this.store.onRefreshTransactions}
                            refreshing={this.store.isRefreshingTransactions}
                            data={this.store.transactions.slice()}
                            extraData={this.store}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                return <Observer>{() =>
                                    <TouchableOpacity key={item.id}
                                        style={styles.item}
                                        disabled
                                        onPress={this.store.onPressDepositTransactionItem}>
                                        <View style={styles.iconContainer}>
                                            <Image style={styles.icon} source={require('../../../assets/images/exchange.png')} />
                                        </View>
                                        <View style={[defaultStyles.column1, defaultStyles.margin]}>
                                            {
                                                (item.type === ExchangeType.withdraw) ?
                                                    <View style={defaultStyles.currencyContainer}>
                                                        <Text style={defaultStyles.text}>{I18n.t('exchange_from')} {item.brand?.name} {I18n.t('to')} {defaultLoyalPointCurrency} </Text>
                                                    </View>
                                                    :
                                                    <View style={defaultStyles.currencyContainer}>
                                                        <Text style={defaultStyles.text}>{I18n.t('exchange_from')} {defaultLoyalPointCurrency} {I18n.t('to')} {item.brand?.name} </Text>
                                                    </View>
                                            }

                                            <Text style={defaultStyles.textSmall}>{timeHelper.convertTimestampToDayMonthYearHourMinute(item.createDate)}</Text>
                                        </View>
                                        <View style={[styles.statusContainer, defaultStyles.margin]}>
                                            {

                                                (item.type === ExchangeType.withdraw) ?
                                                    <View style={defaultStyles.row}>
                                                        <View style={defaultStyles.currencyContainer}>
                                                            <Text style={[defaultStyles.text]}>-{item.brandPoint}</Text>
                                                            <Text style={defaultStyles.textCurrency}>{item.brand.brandPointCode ? item.brand.brandPointCode : I18n.t('points')}</Text>
                                                        </View>
                                                        <Text> | </Text>
                                                        <View style={defaultStyles.currencyContainer}>
                                                            <Text style={[defaultStyles.text]}>+{item.point}</Text>
                                                            <Text style={defaultStyles.textCurrency}>{defaultLoyalPointCurrency}</Text>
                                                        </View>

                                                    </View>
                                                    :
                                                    <View>
                                                        <View style={defaultStyles.row}>
                                                            <View style={defaultStyles.currencyContainer}>
                                                                <Text style={[defaultStyles.text]}>-{item.point}</Text>
                                                                <Text style={defaultStyles.textCurrency}>{defaultLoyalPointCurrency}</Text>
                                                            </View>
                                                            <Text> | </Text>
                                                            <View style={defaultStyles.currencyContainer}>
                                                                <Text style={[defaultStyles.text]}>+{item.brandPoint}</Text>
                                                                <Text style={defaultStyles.textCurrency}>{item.brand.brandPointCode ? item.brand.brandPointCode : I18n.t('points')}</Text>
                                                            </View>

                                                        </View>
                                                    </View>
                                            }

                                            <Text style={[defaultStyles.text, this.getStatusStyle(item.status)]}>{this.store.getStatusTranslatedLabel(item.status)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }</Observer>;
                            }}
                            onEndReachedThreshold={0.01}
                            onEndReached={this.store.handleLoadMoreDepositTransactions}
                        />

                    </View>
                }
                {
                    !!(!this.store.isLoadingPage && !this.store.transactions.length) &&
                    <View style={[defaultStyles.horizontalCenter, defaultStyles.margin]}>
                        <Text style={defaultStyles.text}>{I18n.t('no_history')}</Text>
                    </View>
                }
            </View>
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
        alignItems: 'center',
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: defaultBorderBottomWidth,

    },
    statusContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    pending: {
        color: Colors.transactionPending,
    },
    completed: {
        color: Colors.transactionSuccess,
    },
    fail: {
        color: Colors.transactionFail,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 20,
        marginLeft: defaultMargin,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 32,
        height: 32,
    }

});

