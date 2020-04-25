import React, { Component } from 'react';
import { Text, View, StyleSheet, RefreshControl, ScrollView, TouchableOpacity, Image } from 'react-native';
import { observer, Observer } from 'mobx-react';
import { NavigationScreenProp } from 'react-navigation';
import I18n from 'react-native-i18n';
import { GiftListStore } from './giftListStore';
import { defaultStyles } from '../../../commons/defaultStyles';
import { defaultBorderRadius, defaultMargin, deviceHeight } from '../../../commons/constant';
import { Colors } from '../../../commons/colors';

interface Props {
    navigation: NavigationScreenProp<any>,
    store: GiftListStore,
}


@observer
export default class GiftList extends Component<Props> {


    store: GiftListStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store;
    }

    render() {

        return (
            <View style={defaultStyles.screen}>
                <ScrollView
                    style={defaultStyles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.store.isRefreshing}
                            onRefresh={this.store.onRefresh} />
                    }
                >
                    <View style={styles.scrollViewContent}>
                        {
                            (this.store && this.store.vouchers && !this.store.vouchers.length) &&
                            <View style={styles.noGiftContainer}>
                                <Text style={defaultStyles.text}>{I18n.t('no_gift')}</Text>
                            </View>
                        }
                        {
                            this.store && this.store.vouchers &&
                            <View style={defaultStyles.container}>
                                {this.store.vouchers.map(voucher => {
                                    const isExpired = !voucher.active || (voucher.expDate && voucher.expDate < this.store.todayMilliseconds);
                                    return <Observer>
                                        {
                                            () =>
                                                <TouchableOpacity
                                                    key={voucher.id}
                                                    style={[styles.listItem, (voucher.used || isExpired) ? styles.listItemInactive : styles.listItemActive]}
                                                    onPress={() => this.store.onPressVoucherItem(voucher, this.props.navigation)}
                                                >
                                                    <View style={styles.voucherImageContainer}>
                                                        {
                                                            !!(voucher.brand && voucher.brand.urlAvatar) ?
                                                                <Image style={[styles.avatarImage , (voucher.used || isExpired) ? styles.avatarImageInactive : styles.avatarImageActive ]} source={{ uri: voucher.brand.urlAvatar }} />
                                                                :
                                                                <Image style={[styles.avatarImage, (voucher.used || isExpired)  ? styles.avatarImageInactive : styles.avatarImageActive ]} source={require('../../../assets/images/loyal_one.png')} />
                                                        }
                                                    </View>
                                                    <View style={styles.voucherTextContainer}>
                                                        <Text style={styles.voucherTitle}>{voucher.title}</Text>
                                                        {
                                                            (voucher.expDate || voucher.startDate) &&
                                                            <Text style={styles.expiredDate}>{I18n.t('exp_date')}: {this.store.getExpiredDateFormat(voucher)}</Text>
                                                        }
                                                        {

                                                            <View style={styles.statusContainer}>
                                                                <Text style={(voucher.used || isExpired) ? styles.usedOrExpiredText : styles.useNowText}>{voucher.used ? I18n.t('used') : (isExpired ? I18n.t('expired') : I18n.t('use_now'))}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                    </Observer>
                                })}
                            </View>
                        }
                    </View>

                </ScrollView>

            </View>
        )
    }
}

const avatarWidth = 50;
const avatarBorderRadius = 10;


const styles = StyleSheet.create({
    scrollViewContent: {
    },
    listItem: {
        borderRadius: defaultBorderRadius * 2,
        marginHorizontal: defaultMargin,
        marginVertical: defaultMargin / 2,
        flexDirection: 'row',
        padding: 5,
        backgroundColor: Colors.white,
    },
    listItemActive: {
        opacity: 1,
    },
    listItemInactive: {
        opacity: 0.5,
        backgroundColor: Colors.white,
        borderColor: Colors.lightGray,
        borderWidth: 1,
    },
    voucherImageContainer: {
        justifyContent: 'center',
        padding: defaultMargin * 1.5,
    },
    avatarImage: {
        borderRadius: avatarBorderRadius,
        margin: 0,
        width: avatarWidth,
        height: avatarWidth,
        resizeMode: 'cover',
    },
    avatarImageActive: {
        opacity: 1,
    },
    avatarImageInactive: {
        opacity: 0.5,
    },
    voucherTextContainer: {
        padding: defaultMargin,
        flex: 1,
        flexDirection: 'column',
        borderLeftWidth: 1,
        borderLeftColor: Colors.lightGray,
    },
    voucherTitle: {
        ...defaultStyles.text,
        ...defaultStyles.textBold,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    useNowText: {
        ...defaultStyles.text,
        color: Colors.secondary,
    },
    usedOrExpiredText: {
        ...defaultStyles.text,
        color: Colors.gray,
    },
    noGiftContainer: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingVertical: defaultMargin,
        height: deviceHeight,
    },
    expiredDate: {
        ...defaultStyles.text,
    },
});
