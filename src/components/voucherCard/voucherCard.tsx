import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { observer } from 'mobx-react';
import { NavigationScreenProp } from 'react-navigation';
import { Voucher, VoucherType } from '../../@model/voucher';
import { VoucherCardStore } from './voucherCardStore';
import { defaultStyles } from '../../commons/defaultStyles';
import { defaultMargin, deviceWidth, defaultVietnameseCurrency, defaultBorderRadius } from '../../commons/constant';
import { Colors } from '../../commons/colors';
import I18n from 'react-native-i18n';
import NumberFormat from 'react-number-format';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OpeningPageModal from '../openingPageModal/openingPageModal';
import Toast from '../toast';
import CopyVoucherCodeSuccessModal from '../copyVoucherCodeSuccessModal/copyVoucherCodeSuccessModal';

interface Props {
    navigation: NavigationScreenProp<any>,
    voucher: Voucher,
}

@observer
export default class VoucherCard extends Component<Props> {

    store = new VoucherCardStore();

    constructor(props: Props) {
        super(props);
        this.store.setVoucher(props.voucher);
    }

    render() {
        const voucherImage = this.props.voucher?.image ? { uri: this.props.voucher.image } : require('../../assets/images/gift.png');
        const brandLogo = this.props.voucher?.brand?.urlAvatar ? { uri: this.props.voucher?.brand?.urlAvatar } : require('../../assets/images/loyal_one.png');
        const saveValue = (this.store?.voucher?.value && this.store?.voucher?.unit === 'PERCENT') ? this.store?.voucher?.value * 100 : this.store?.voucher?.value;
        return (

            <TouchableOpacity
                style={styles.button}
                onPress={() => this.store.onPressVoucherCard(this.props.navigation)}
            >
                <View>
                    <Image style={styles.image} resizeMode='cover' source={voucherImage} />
                    <View style={styles.discountContainer}>
                        {
                            !!(this.store?.voucher?.value) &&
                            <Text style={styles.discountText}>{I18n.t('save_money')} <NumberFormat value={saveValue}
                                displayType={'text'}
                                thousandSeparator={true}
                                renderText={(value) =>
                                    <Text
                                        style={defaultStyles.textWhite}
                                    >{value}</Text>
                                } /><Text style={defaultStyles.textSmall}> {this.store?.voucher?.unit === 'PERCENT' ? '%' : defaultVietnameseCurrency}</Text></Text>
                        }
                    </View>
                    <View style={styles.logoContainer}>
                        <Image source={brandLogo} style={styles.logoImage} resizeMode='contain' />
                    </View>
                    <View style={styles.priceContainer}>
                        <View style={styles.price}>
                            {
                                (!this.store?.voucher?.price) ?
                                    <Text style={defaultStyles.textWhite}>{I18n.t('free')}</Text>
                                    :
                                    <NumberFormat value={this.store?.voucher?.price}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        renderText={(value) =>
                                            <Text
                                                style={defaultStyles.textWhite}
                                            >{value}{defaultVietnameseCurrency}</Text>
                                        } />

                            }
                        </View>

                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text numberOfLines={2} style={styles.title}>{this.props.voucher?.title}</Text>
                    </View>

                    <View style={styles.extraInfoArea}>
                        <View style={styles.quantityAndDate}>
                            <Text style={styles.quantityText}><AntDesign name='shoppingcart' size={12} color={Colors.gray} /> {this.store?.voucher?.quantityCodeGot} </Text>
                            {
                                (this.store?.voucher && (this.store?.voucher?.expDate || this.store?.voucher?.startDate)) &&
                                <Text style={styles.expiredDateText}>{this.store.getExpiredDateFormat}</Text>
                            }
                        </View>

                        <View style={defaultStyles.floatRight}>
                            {
                                (this.store?.voucher?.type === VoucherType.CRAWLER && this.store?.voucher?.code) &&
                                <TouchableOpacity style={styles.getCodeButton} onPress={this.store?.onPressCrawlerVoucherButton}>
                                    <View style={[styles.getButtonCodeArea, this.store?.isPressed ? styles.getButtonCodeAreaShow : styles.getButtonCodeAreaHide]}>
                                        <Text style={[styles.codeText, this.store?.isPressed ? styles.codeTextShow : styles.codeTextHide]}>{this.store?.voucher.code}</Text>
                                    </View>
                                    {
                                        (!this.store.isPressed) &&
                                        <View style={styles.getButtonLabelArea}>
                                            <Text style={styles.getCodeText}>{I18n.t('get_code')}</Text>
                                        </View>
                                    }
                                </TouchableOpacity>
                            }
                            {
                                (this.store?.voucher?.type === VoucherType.CRAWLER && !this.store?.voucher?.code) &&
                                <TouchableOpacity style={styles.getNowButton} onPress={this.store?.onPressCrawlerVoucherButton}>
                                    <Text style={styles.getCodeText}>{I18n.t('see_now')}</Text>

                                </TouchableOpacity>
                            }
                            {
                                (this.store?.voucher?.type === VoucherType.LOYA) &&
                                <TouchableOpacity style={styles.getNowButton}
                                    onPress={() => this.store.onPressVoucherCard(this.props.navigation)}
                                >
                                    <Text style={styles.getCodeText}>{I18n.t('get_now')}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
                <OpeningPageModal store={this.store?.openingPageModalStore} />
                {
                    this.store?.voucher?.code &&
                    <CopyVoucherCodeSuccessModal
                        store={this.store?.copyVoucherCodeSuccessModalStore}
                        code={this.store?.voucher?.code}
                        url={this.store?.voucher.url} />
                }

            </TouchableOpacity>

        );
    }

};

const voucherBorderRadius = 10;
const getButtonBorderRadius = 6;
const getButtonHeight = 36;

const styles = StyleSheet.create({
    button: {
        borderRadius: voucherBorderRadius,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    image: {
        flex: 1,
        height: 160,
        borderTopLeftRadius: voucherBorderRadius,
        borderTopRightRadius: voucherBorderRadius,
        backgroundColor: Colors.lightGray,
    },
    discountContainer: {
        backgroundColor: Colors.secondary,
        borderRadius: voucherBorderRadius,
        position: 'absolute',
    },
    discountText: {
        ...defaultStyles.textWhite,
        ...defaultStyles.textBold,
        ...defaultStyles.margin,
    },
    logoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        margin: 4,
    },
    logoImage: {
        borderRadius: 10,
        width: 47,
        height: 47,
    },
    priceContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: defaultMargin,
        borderRadius: 4,
    },
    price: {
        margin: defaultMargin,
    },
    contentContainer: {
        borderBottomLeftRadius: voucherBorderRadius,
        borderBottomRightRadius: voucherBorderRadius,
        overflow: 'hidden',
        backgroundColor: Colors.white,
        paddingVertical: defaultMargin * 2,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        ...defaultStyles.text,
        fontSize: 18,
        color: Colors.primary,
        paddingHorizontal: 4,

        minHeight: 44,
    },
    extraInfoArea: {
        flexDirection: 'column',
    },
    quantityAndDate: {
        flex: 1,
        paddingHorizontal: 4,
        flexDirection: 'row',
    },
    quantityText: {
        ...defaultStyles.textSmall,
        color: Colors.gray,
    },
    expiredDateText: {
        ...defaultStyles.textSmall,
        color: Colors.gray,
        textAlign: 'right',
        flex: 1,
    },
    getCodeButton: {
        width: 0.6 * deviceWidth,
        borderColor: Colors.secondary,
        backgroundColor: Colors.lightGray,
        borderWidth: 1,
        borderRadius: getButtonBorderRadius,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: defaultMargin,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1,
    },
    getCodeText: {
        ...defaultStyles.textWhite,
        margin: 8,
        paddingHorizontal: 12,
    },
    getButtonCodeArea: {
        flex: 1,
        borderTopLeftRadius: getButtonBorderRadius,
        borderBottomLeftRadius: getButtonBorderRadius,
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: getButtonHeight,
    },
    getButtonCodeAreaHide: {
        alignItems: 'flex-end',
    },
    getButtonCodeAreaShow: {
        alignItems: 'center',
    },
    getButtonLabelArea: {
        backgroundColor: Colors.secondary,
        borderTopRightRadius: getButtonBorderRadius,
        borderTopLeftRadius: 24,
        borderBottomRightRadius: getButtonBorderRadius,
        height: getButtonHeight,
    },
    codeText: {
        ...defaultStyles.text,
        color: Colors.gray,
        fontSize: 20,
        right: -25,
    },
    codeTextHide: {
        right: -25,
    },
    codeTextShow: {
        right: 0,
    },
    getNowButton: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: getButtonBorderRadius,
        margin: defaultMargin,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1,
    }
});






