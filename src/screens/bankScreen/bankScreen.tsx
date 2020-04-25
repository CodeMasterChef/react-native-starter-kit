import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import { observer } from 'mobx-react';
import { BankScreenStore } from './bankScreenStore';
import I18n from 'react-native-i18n';
import NumberFormat from 'react-number-format';
import { Colors } from '../../commons/colors';
import { defaultMargin, defaultBorderWidth, defaultVietnameseCurrency, defaultBorderRadius, deviceWidth } from '../../commons/constant';
import { ScrollView } from 'react-native';
import { NavigationScreenProp, NavigationActions } from 'react-navigation';
import { LoyalPointDepositTransaction } from '../../api/pointApi';
import { appRoutes } from '../../navigators/appRoutes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TransactionDetailScreenParams } from '../transactionDetailScreen/transactionDetailScreen';

export const BandScreenParams = {
    loyalPointDeposit: 'loyalPointDeposit',
}

interface Props {
    navigation: NavigationScreenProp<any>,
    loyalPointDeposit?: LoyalPointDepositTransaction,
}

@observer
export default class BankScreen extends Component<Props> {

    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any> }) => ({
        title: I18n.t('bank_transfer_information'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
        headerLeft: (
            <TouchableOpacity onPress={() => {
                const transaction = navigation.getParam(BandScreenParams.loyalPointDeposit);
                const subAction = NavigationActions.navigate({
                    routeName: appRoutes.transactionDetailScreen,
                    params: {
                        [TransactionDetailScreenParams.transaction]: transaction,
                    }
                });
                navigation.navigate(appRoutes.walletScreen);
                navigation.navigate(appRoutes.accountStack, {}, subAction);
            }}>
                <View style={[defaultStyles.row]}>
                    <MaterialCommunityIcons name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left'} size={34} color={Colors.white} />
                    {
                        (Platform.OS === 'ios') &&
                        <Text style={defaultStyles.textHeaderLeft}>{I18n.t('detail')}</Text>
                    }
                </View>
            </TouchableOpacity>
        ),

    });

    store = new BankScreenStore();

    constructor(props: Props) {
        super(props);
    };


    componentDidMount() {
        if (this.props.navigation) {
            const loyalPointDeposit = (this.props.loyalPointDeposit) ? this.props.loyalPointDeposit : this.props.navigation.getParam(BandScreenParams.loyalPointDeposit) ;
            if (loyalPointDeposit) {
                this.store.setPointDeposit(loyalPointDeposit);
            }
        }
    }

    render() {

        return (
            <View>
                <Text style={[defaultStyles.text, defaultStyles.margin]}>{I18n.t('send_money_to_our_bank')}:</Text>
                <ScrollView
                    style={styles.scrollView}
                    horizontal={true}
                >
                    {
                        this.store.banks.map(bank => {
                            return (
                                <View style={styles.cardContainer}>
                                    <View style={styles.card}>
                                        <View style={styles.bankContent}>
                                            <Text style={defaultStyles.textBold}>{I18n.t('bank')}:</Text>
                                            <View style={[defaultStyles.row, defaultStyles.margin]}>
                                                <View style={[defaultStyles.column1, defaultStyles.verticalCenter]}>
                                                    <Text style={defaultStyles.text}>{bank.bankName} ({bank.bankCode})</Text>
                                                </View>

                                            </View>
                                        </View>

                                        <View style={styles.bankContent}>
                                            <Text style={defaultStyles.textBold}>{I18n.t('branch')}:</Text>
                                            <View style={[defaultStyles.row, defaultStyles.margin]}>
                                                <View style={[defaultStyles.column1, defaultStyles.verticalCenter]}>
                                                    <Text style={defaultStyles.text}>{bank.branchName}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.bankContent}>
                                            <Text style={defaultStyles.textBold}>{I18n.t('bank_account_number')}:</Text>
                                            <View style={[defaultStyles.row, defaultStyles.margin]}>
                                                <View style={[defaultStyles.column1, defaultStyles.verticalCenter]}>
                                                    <Text style={defaultStyles.text}>{bank.bankAccountNo}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.copyButton}
                                                    onPress={() => this.store.onPressCopyButton(bank.bankAccountNo)}
                                                >
                                                    <Text style={styles.copyIcon}>{I18n.t('copy')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={styles.bankContent}>
                                            <Text style={defaultStyles.textBold}>{I18n.t('account_name')}:</Text>
                                            <View style={[defaultStyles.row, defaultStyles.margin]}>
                                                <View style={[defaultStyles.column1, defaultStyles.verticalCenter]}>
                                                    <Text style={defaultStyles.text}>{bank.name}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.copyButton}
                                                    onPress={() => this.store.onPressCopyButton(bank.name)}
                                                >
                                                    <Text style={styles.copyIcon}>{I18n.t('copy')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>



                                    </View>
                                </View>
                            )

                        })
                    }



                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.bankContent}>
                        <Text style={defaultStyles.textBold}>{I18n.t('money_amount_need_to_transfer')}:</Text>
                        <View style={[defaultStyles.row, defaultStyles.margin]}>
                            <View style={[defaultStyles.column1, defaultStyles.verticalCenter]}>
                                <NumberFormat value={this.store.pointDeposit.value}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={` ${defaultVietnameseCurrency}`}
                                    renderText={(value) =>
                                        <Text style={defaultStyles.text}>{value}</Text>
                                    } />
                            </View>
                            <TouchableOpacity
                                style={styles.copyButton}
                                onPress={() => this.store.onPressCopyButton(this.store.pointDeposit.value.toString())}
                            >
                                <Text style={styles.copyIcon}>{I18n.t('copy')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bankContent}>
                        <Text style={defaultStyles.textBold}>{I18n.t('transfer_content')}:</Text>
                        <Text style={defaultStyles.textSmall}>({I18n.t('this_is_important_information')})</Text>
                        <View style={[defaultStyles.row, defaultStyles.margin]}>
                            <View style={[defaultStyles.column1, defaultStyles.verticalCenter]}>
                                <Text style={defaultStyles.textBold}>{this.store.pointDeposit.message}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.copyButton}
                                onPress={() => this.store.onPressCopyButton(this.store.pointDeposit.message)}
                            >
                                <Text style={styles.copyIcon}>{I18n.t('copy')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
    },
    cardContainer: {
        borderWidth: defaultBorderWidth,
        borderRadius: defaultBorderRadius,
        borderColor: Colors.primary,
        margin: defaultMargin,
    },
    card: {
        width: deviceWidth - 40,
        margin: defaultMargin,
    },
    copyButton: {
        borderWidth: defaultBorderWidth,
        borderBottomWidth: 1.5 * defaultBorderWidth,
        borderRadius: defaultBorderRadius,
        borderColor: Colors.secondary,
        marginVertical: defaultMargin / 2,
    },
    copyIcon: {
        padding: defaultMargin / 2,
    },
    bankContent: {
        marginBottom: defaultMargin,
    },
    footer: {
        margin: defaultMargin * 2,
    }
});


