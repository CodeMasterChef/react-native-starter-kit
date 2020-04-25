import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import { observer } from 'mobx-react';
import I18n from 'react-native-i18n';
import NumberFormat from 'react-number-format';
import { Colors } from '../../commons/colors';
import { defaultLoyalPointCurrency, defaultMargin, processCircleSnailSize, processCircleSnailSpinDuration, defaultVietnameseCurrency } from '../../commons/constant';
import { NavigationScreenProp, ScrollView } from 'react-navigation';
import * as Progress from 'react-native-progress';
import { TransactionDetailScreenStore } from './transactionDetailScreenStore';
import { PaymentTypeEnum, ExchangeTransactionStatusEnum } from '../../api/pointApi';
import { timeHelper } from '../../helpers/timeHelper';
import BankScreen from '../bankScreen/bankScreen';

export const TransactionDetailScreenParams = {
    transaction: 'transaction',
    openVNPAY: 'openVNPAY',
}

interface Props {
    navigation: NavigationScreenProp<any>,
}

@observer
export default class TransactionDetailScreen extends Component<Props> {

    static navigationOptions = () => ({
        title: I18n.t('transaction_detail'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    store = new TransactionDetailScreenStore();

    constructor(props: Props) {
        super(props);
        const transaction = props.navigation.getParam(TransactionDetailScreenParams.transaction);
        this.store.setNavigation(props.navigation);
        this.store.setTransaction(transaction);
        const openVNPAY = props.navigation.getParam(TransactionDetailScreenParams.openVNPAY);
        if (openVNPAY && transaction && transaction.id) {
            this.store.onPressPayButton();
        }
    };

    componentDidMount() {
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
            <ScrollView
                style={defaultStyles.container}
                refreshControl={
                    <RefreshControl refreshing={this.store.isRefreshing} onRefresh={this.store.onRefresh} />
                }
            >
                <View style={defaultStyles.margin}>
                    <View style={[defaultStyles.row, defaultStyles.marginVertical]}>
                        <View style={defaultStyles.column1}>
                            <Text style={defaultStyles.textBold}>{I18n.t('loyal_points_want_to_add')}:</Text>
                        </View>

                        <NumberFormat value={this.store.transaction.point}
                            displayType={'text'}
                            thousandSeparator={true}
                            renderText={(value) =>
                                <View style={defaultStyles.currencyContainer}>
                                    <Text style={defaultStyles.text}>{value}</Text>
                                    <Text style={defaultStyles.textCurrency}>{defaultLoyalPointCurrency}</Text>
                                </View>
                            } />
                    </View>

                    <View style={[defaultStyles.row, defaultStyles.marginVertical]}>
                        <View style={defaultStyles.column1}>
                            <Text style={defaultStyles.textBold}>{I18n.t('money_to_send')}:</Text>
                        </View>

                        <NumberFormat value={this.store.transaction.value}
                            displayType={'text'}
                            thousandSeparator={true}
                            renderText={(value) =>
                                <View style={defaultStyles.currencyContainer}>
                                    <Text style={defaultStyles.text}>{value}</Text>
                                    <Text style={defaultStyles.textCurrency}>{defaultVietnameseCurrency}</Text>
                                </View>
                            } />
                    </View>


                    <View style={[defaultStyles.row, defaultStyles.marginVertical]}>
                        <View style={defaultStyles.column1}>
                            <Text style={defaultStyles.textBold}>{I18n.t('created_time')}:</Text>
                        </View>
                        <Text style={defaultStyles.text}>{timeHelper.convertTimestampToDayMonthYearHourMinute(this.store.transaction.createDate)}</Text>
                    </View>

                    <View style={[defaultStyles.row, defaultStyles.marginVertical]}>
                        <View style={defaultStyles.column1}>
                            <Text style={defaultStyles.textBold}>{I18n.t('status')}:</Text>
                        </View>
                        <Text style={[defaultStyles.textRight, this.getStatusStyle(this.store.transaction.status)]}>{this.store.getStatusTranslatedLabel(this.store.transaction.status)}</Text>

                    </View>
                    {
                        (this.store.transaction.status === ExchangeTransactionStatusEnum.rejected) &&
                        <Text style={[defaultStyles.textRight, defaultStyles.textRed, defaultStyles.textSmall]}>{I18n.t('reason')}: {this.store.transaction.note}</Text>
                    }

                    <View>
                        {
                            (this.store.transaction.status === ExchangeTransactionStatusEnum.new) &&
                            <Text style={[defaultStyles.textRed, defaultStyles.textRight, defaultStyles.textSmall]}>{I18n.t('your_transaction_has_not_been_paid_yet')}</Text>
                        }
                    </View>
                    <View style={[defaultStyles.row, defaultStyles.marginVertical]}>
                        <View style={defaultStyles.column1}>
                            <Text style={defaultStyles.textBold}>{I18n.t('payment_method')}:</Text>
                        </View>
                        <View>
                            <Text style={defaultStyles.text}>{(this.store.transaction.paymentType === PaymentTypeEnum.cash) ? I18n.t('manual_transfer') : (this.store.transaction.paymentType === PaymentTypeEnum.vnpay ? 'VNPAY' : '')}</Text>
                        </View>
                    </View>
                </View>
                {
                    (this.store.transaction.paymentType === PaymentTypeEnum.cash && this.store.transaction.status === ExchangeTransactionStatusEnum.new) &&
                    <BankScreen navigation={this.props.navigation} loyalPointDeposit={this.store.transaction} />
                }
                {
                    (this.store.transaction.status === ExchangeTransactionStatusEnum.new) &&
                    <View style={[defaultStyles.margin, defaultStyles.row]}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton, defaultStyles.column1,
                        (this.store.isLoadingCancel) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate,
                        ]}
                            onPress={this.store.onPressCancelButton}
                            disabled={this.store.isLoadingCancel}
                        >
                            {
                                this.store.isLoadingCancel ?
                                    <Progress.CircleSnail
                                        size={processCircleSnailSize}
                                        color={Colors.white}
                                        spinDuration={processCircleSnailSpinDuration}
                                    />
                                    :
                                    <Text style={[defaultStyles.textWhite, defaultStyles.margin]}>{I18n.t('destroy_transaction')}</Text>
                            }
                        </TouchableOpacity>
                        {
                            (this.store.transaction.paymentType === PaymentTypeEnum.vnpay) &&
                            <TouchableOpacity style={[styles.button, styles.payButton, defaultStyles.column1,
                            (this.store.isLoadingCancel) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate,
                            ]}
                                onPress={this.store.onPressPayButton}
                                disabled={this.store.isLoadingCancel}
                            >
                                {
                                    this.store.isLoadingPay ?
                                        <Progress.CircleSnail
                                            size={processCircleSnailSize}
                                            color={Colors.white}
                                            spinDuration={processCircleSnailSpinDuration}
                                        />
                                        :
                                        <Text style={[defaultStyles.textWhite, defaultStyles.margin]}>{I18n.t('pay')}</Text>
                                }
                            </TouchableOpacity>
                        }

                    </View>
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    pending: {
        color: Colors.transactionPending,
    },
    completed: {
        color: Colors.transactionSuccess,
    },
    fail: {
        color: Colors.transactionFail,
    },
    button: {
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: defaultMargin,
    },
    cancelButton: {
        backgroundColor: Colors.gray,
    },
    payButton: {
        backgroundColor: Colors.highlight,
    },

});


