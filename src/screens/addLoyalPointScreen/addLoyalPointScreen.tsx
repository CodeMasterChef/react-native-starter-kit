import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import { observer } from 'mobx-react';
import { AddLoyalPointScreenStore } from './addLoyalPointScreenStore';
import I18n from 'react-native-i18n';
import NumberFormat from 'react-number-format';
import { Colors } from '../../commons/colors';
import { defaultLoyalPointCurrency, defaultMargin, defaultBorderWidth, defaultVietnameseCurrency, defaultBorderRadius, defaultSizeNumberInTextInput } from '../../commons/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp } from 'react-navigation';
import Modal from 'react-native-modal';

interface Props {
    navigation: NavigationScreenProp<any>,
}

const vnpayMinimumMoney = 10000;

@observer
export default class AddLoyalPointScreen extends Component<Props> {

    static navigationOptions = () => ({
        title: I18n.t('add_loyal_points'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
        headerBackTitle: I18n.t('add_loyal_points'),
    });

    store = new AddLoyalPointScreenStore();

    constructor(props: Props) {
        super(props);
    };


    componentDidMount() {
        this.store.setNavigation(this.props.navigation);
    }

    render() {

        return (
            <View style={defaultStyles.container}>
                <View style={defaultStyles.margin}>
                    <Text style={defaultStyles.textBold}>{I18n.t('loyal_points_want_to_add')}:</Text>
                    <View style={[defaultStyles.row, defaultStyles.marginVertical]}>
                        <View style={[defaultStyles.column1]}>
                            <NumberFormat value={this.store.lopAmount}
                                displayType={'text'}
                                thousandSeparator={true}
                                renderText={(value) =>
                                    <TextInput
                                        style={styles.amountInput}
                                        value={value}
                                        keyboardType='numeric'
                                        returnKeyType='done'
                                        clearButtonMode='always'
                                        onFocus={this.store.onFocusLoyalPointInput}
                                        onChangeText={text => this.store.onChangeLopAmountInput(text)} />
                                } />
                        </View>
                        <Text
                            //@ts-ignore
                            textAlign='right'
                            style={styles.currency}
                        >
                            {defaultLoyalPointCurrency}
                        </Text>
                    </View>
                </View>
                <View style={defaultStyles.margin}>
                    <Text style={defaultStyles.textBold}>{I18n.t('money_to_send')}:</Text>
                    <View style={[defaultStyles.row, defaultStyles.marginVertical]}>
                        <View style={[defaultStyles.column1]}>
                            <NumberFormat value={this.store.vndAmount}
                                displayType={'text'}
                                thousandSeparator={true}
                                renderText={(value) =>
                                    <Text
                                        style={styles.amountInput}
                                    >{value}</Text>
                                } />
                        </View>
                        <Text
                            //@ts-ignore
                            textAlign='right'
                            style={styles.currency}
                        >
                            {defaultVietnameseCurrency}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[defaultStyles.margin, styles.cardContainer, (!this.store.lopAmount || this.store.lopAmount === '0' || this.store.isProgressing) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}
                    onPress={this.store.onPressBankTransferCard}
                    disabled={!this.store.lopAmount || this.store.lopAmount === '0' || this.store.isProgressing}
                >
                    <View style={defaultStyles.margin}>
                        <View style={defaultStyles.row}>
                            <View style={[defaultStyles.column2, defaultStyles.verticalCenter]}>
                                <Text style={[defaultStyles.text, styles.cardTitle]}>{I18n.t('manual_transfer')}</Text>
                            </View>
                            <View style={styles.thumbnailContainer}>
                                <Image style={styles.thumbnail} source={require('../../assets/images/manual_transfer.png')} />
                            </View>
                        </View>
                        <View style={defaultStyles.row}>
                            <View style={[defaultStyles.column2, defaultStyles.marginVertical, defaultStyles.verticalCenter]}>
                                <Text style={[defaultStyles.textWhite]}>{I18n.t('transfer_to_our_bank')}</Text>
                            </View>
                            <View style={defaultStyles.verticalCenter}>
                                <MaterialCommunityIcons name='chevron-right' color={Colors.white} size={34} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[defaultStyles.margin, styles.cardContainer, (!this.store.lopAmount || this.store.lopAmount === '0' || this.store.isProgressing || this.store.vndAmount < vnpayMinimumMoney) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}
                    onPress={this.store.onPressVnpayTransferCard}
                    disabled={!this.store.lopAmount || this.store.lopAmount === '0' || this.store.isProgressing || this.store.vndAmount < vnpayMinimumMoney}
                >
                    <View style={defaultStyles.margin}>
                        <View style={defaultStyles.row}>
                            <View style={[defaultStyles.column2, defaultStyles.verticalCenter]}>
                                <Text style={[defaultStyles.text, styles.cardTitle]}>VNPAY</Text>
                            </View>
                            <View style={styles.thumbnailContainer}>
                                <Image style={styles.thumbnail} source={require('../../assets/images/vnpay.png')} />
                            </View>
                        </View>
                        <View style={defaultStyles.row}>
                            <View style={[defaultStyles.column2, defaultStyles.marginVertical, defaultStyles.verticalCenter]}>
                                <Text style={[defaultStyles.textWhite]}>{I18n.t('transfer_by_vnpay')}</Text>
                                <Text style={[defaultStyles.textWhite]}>{I18n.t('fee_is_free')}</Text>

                                <NumberFormat value={vnpayMinimumMoney}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={`${I18n.t('minimum_money')}: `}
                                    suffix={` ${defaultVietnameseCurrency}`}
                                    renderText={(value) =>
                                        <Text
                                            style={[styles.amountInput, defaultStyles.textWhite]}
                                        >{value}</Text>
                                    } />
                            </View>
                            <View style={defaultStyles.verticalCenter}>
                                <MaterialCommunityIcons name='chevron-right' color={Colors.white} size={34} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>


                <Modal
                    isVisible={this.store.isVisibleBankTransferModal}
                >
                    <View style={defaultStyles.modalContent}>
                        <Text style={[defaultStyles.text, defaultStyles.textBold, styles.title]}>{I18n.t('transfer_steps')}</Text>
                        <View style={[defaultStyles.row, defaultStyles.margin]}>
                            <View style={defaultStyles.column1}>
                                <View style={styles.stepContainer}>
                                    <Image style={styles.stepImage} source={require('../../assets/images/b1.png')} />
                                    <Text style={[defaultStyles.textBold]}>1</Text>
                                    <Text style={[styles.stepText]}>{I18n.t('submit_lop_points_request_by_manual_transfer')}</Text>
                                </View>
                            </View>
                            <View style={defaultStyles.column1}>
                                <View style={styles.stepContainer}>
                                    <Image style={styles.stepImage} source={require('../../assets/images/b2.png')} />
                                    <Text style={[defaultStyles.textBold]}>2</Text>
                                    <Text style={[styles.stepText]}>{I18n.t('deposit_or_transfer_the_amount_corresponding_to_the_points')}</Text>
                                </View>
                            </View>
                            <View style={defaultStyles.column1}>
                                <View style={styles.stepContainer}>
                                    <Image style={styles.stepImage} source={require('../../assets/images/b3.png')} />
                                    <Text style={[defaultStyles.textBold]}>3</Text>
                                    <Text style={[styles.stepText]}>{I18n.t('loyal_one_receives_the_money_you_transferred')}</Text>
                                </View>
                            </View>
                            <View style={defaultStyles.column1}>
                                <View style={styles.stepContainer}>
                                    <Image style={styles.stepImage} source={require('../../assets/images/b4.png')} />
                                    <Text style={[defaultStyles.textBold]}>4</Text>
                                    <Text style={[styles.stepText]}>{I18n.t('points_are_entered_into_the_wallet')}</Text>
                                </View>
                            </View>

                        </View>
                        <View style={[defaultStyles.margin, defaultStyles.horizontalCenter]}>
                            <Text style={[defaultStyles.text, defaultStyles.textBold, styles.confirmText]}>{I18n.t('are_you_sure_you_want_to_create_a_transfer_request_manually')}</Text>
                        </View>
                        <View style={[defaultStyles.margin, defaultStyles.row]}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton, defaultStyles.column1]}
                                onPress={this.store.onPressCancelBankTransfer}
                            >
                                <Text style={[defaultStyles.textWhite, defaultStyles.margin]}>{I18n.t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.agreeButton, defaultStyles.column1]}
                                onPress={this.store.onPressAgreeBankTransfer}
                            >
                                <Text style={[defaultStyles.textWhite, defaultStyles.margin]} > {I18n.t('agree')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    amountInput: {
        borderBottomColor: Colors.primary,
        borderBottomWidth: defaultBorderWidth,
        fontSize: defaultSizeNumberInTextInput,
        color: Colors.gray,
    },
    currency: {
        fontSize: 24,
        paddingLeft: defaultMargin,
        color: Colors.gray,
    },
    thumbnailContainer: {
        backgroundColor: Colors.white,
        borderRadius: defaultBorderRadius,
    },
    thumbnail: {
        width: 80,
        margin: defaultMargin,
    },
    cardContainer: {
        borderRadius: defaultBorderRadius,
        borderWidth: defaultBorderWidth,
        borderColor: Colors.primary,
        borderBottomWidth: 1.5 * defaultBorderWidth,
        borderRightWidth: 1.5 * defaultBorderWidth,
        backgroundColor: Colors.secondary,
    },
    cardTitle: {
        color: Colors.white,
        fontSize: 20,
    },
    title: {
        fontSize: 18,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    stepContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: defaultMargin,
    },
    stepImage: {
        width: 76,
        height: 76,
    },
    stepText: {
        fontSize: 10,
        textAlign: 'center',
    },
    confirmText: {
        fontSize: 18,
        textAlign: 'center',
    },
    button: {
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: defaultMargin,
    },
    agreeButton: {
        backgroundColor: Colors.highlight,
    },
    cancelButton: {
        backgroundColor: Colors.gray,
    }
});


