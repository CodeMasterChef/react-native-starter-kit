import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { defaultStyles } from '../../../commons/defaultStyles';
import { observer, Observer } from 'mobx-react';
import { DepositHistoryStore } from './depositHistoryStore';
import I18n from 'react-native-i18n';
import { NavigationScreenProp, FlatList } from 'react-navigation';
import { Colors } from '../../../commons/colors';
import { deviceHeight, defaultLoyalPointCurrency, defaultBorderBottomWidth, processCircleSnailColors, processCircleSnailSpinDuration, loadingCircleSize, defaultMargin } from '../../../commons/constant';
import { timeHelper } from '../../../helpers/timeHelper';
import { ExchangeTransactionStatusEnum } from '../../../api/pointApi';
import * as Progress from 'react-native-progress';
interface Props {
    navigation: NavigationScreenProp<any>,
}

@observer
export default class DepositHistory extends Component<Props> {


    store = new DepositHistoryStore();

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
                    !!(this.store.depositTransactions && this.store.depositTransactions.length) &&
                    <View style={defaultStyles.container}>
                        <FlatList
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            onRefresh={this.store.onRefreshDepositTransactions}
                            refreshing={this.store.isRefreshingDepositTransactions}
                            data={this.store.depositTransactions.slice()}
                            extraData={this.store}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                return <Observer>{() =>
                                    <TouchableOpacity key={item.id}
                                        style={styles.item}
                                        onPress={() => this.store.onPressDepositTransactionItem(item)}>
                                        <View style={styles.iconContainer}>
                                            <Image style={styles.icon} source={require('../../../assets/images/spend.png')} />
                                        </View>
                                        <View style={[defaultStyles.column1, defaultStyles.margin]}>
                                            <Text style={defaultStyles.textBold}>{I18n.t('refill')} {item.point} {defaultLoyalPointCurrency}</Text>
                                            <Text style={defaultStyles.text}>{I18n.t('transfer_content')}: {item.message}</Text>
                                            <Text style={defaultStyles.textSmall}>{timeHelper.convertTimestampToDayMonthYearHourMinute(item.createDate)}</Text>
                                        </View>
                                        <View style={[styles.statusContainer, defaultStyles.margin]}>
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
                    !!(!this.store.isLoadingPage && !this.store.depositTransactions.length) &&
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
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: defaultBorderBottomWidth,
        alignItems: 'center',

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
    },


});

