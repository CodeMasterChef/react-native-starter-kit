import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { NavigationScreenProp, SafeAreaView } from 'react-navigation';
import { Colors } from '../../commons/colors';
import { ScrollView, } from 'react-native-gesture-handler';
import { deviceWidth, defaultBorderRadius, defaultMargin, deviceHeight, bottomBarHeight } from '../../commons/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultStyles } from '../../commons/defaultStyles';
import I18n from 'react-native-i18n';
import { HomeScreenStore } from './homeScreenStore';
import { stores } from '../../stores';
import VoucherCard from '../../components/voucherCard/voucherCard';
import * as mobx from 'mobx';
interface Props {
    navigation: NavigationScreenProp<any>
}
@observer
export default class HomeScreen extends Component<Props> {

    store!: HomeScreenStore;

    static navigationOptions = ({ }) => ({
        title: 'Loyal One',
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.store = new HomeScreenStore();
        stores.homeScreenStore = this.store;
        stores.navigation = props.navigation;

    };

    render() {
        return (
            <View style={styles.screen}>
                <View style={styles.header}>
                    <SafeAreaView>
                        <View style={styles.headerContent}>
                            <TouchableOpacity style={styles.scanButton} onPress={this.store.onPressScanButton}>
                                <Ionicons name='md-qr-scanner' size={32} color={Colors.white} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.searchButton} onPress={() => this.store.onPressSearchButton(this.props.navigation)}>
                                <Ionicons name='ios-search' size={24} color={Colors.lightGray} />
                                <Text style={styles.searchText}>{I18n.t('search')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.notificationButton}>
                                <MaterialCommunityIcons name='bell-outline' size={32} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    <View style={styles.round}>
                    </View>
                </View>
                <ScrollView style={styles.scrollView}
                >
                    <View style={styles.scrollViewContent}>
                        <View style={styles.actionButtonArea}>
                            <TouchableOpacity style={styles.actionButton}
                                onPress={() => this.store.onPressVoucherButton(this.props.navigation)}
                            >
                                <View style={styles.actionButtonImageContainer}>
                                    <Image source={require('../../assets/images/coupon.png')} resizeMode='contain' style={styles.actionButtonImage} />
                                </View>
                                <Text style={styles.actionButtonText}>{I18n.t('promotions')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}
                                onPress={() => this.store.onPressEarnPointButton(this.props.navigation)}
                            >
                                <View style={styles.actionButtonImageContainer}>
                                    <Image source={require('../../assets/images/earn_point.png')} resizeMode='contain' style={styles.actionButtonImage} />
                                </View>
                                <Text style={styles.actionButtonText} >{I18n.t('earn_points')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}
                                onPress={() => this.store.onPressExchangePointButton(this.props.navigation)}
                            >
                                <View style={styles.actionButtonImageContainer}>
                                    <Image source={require('../../assets/images/exchange_button.png')} resizeMode='contain' style={styles.actionButtonImage} />
                                </View>
                                <Text style={styles.actionButtonText}>{I18n.t('exchange_points')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => this.store.onPressWalletButton(this.props.navigation)}
                            >
                                <View style={styles.actionButtonImageContainer}>
                                    <Image source={require('../../assets/images/wallet_button.png')} resizeMode='contain' style={styles.actionButtonImage} />
                                </View>
                                <Text style={styles.actionButtonText}>{I18n.t('point_wallet')}</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.body}>
                            {
                                this.store?.categories &&
                                <View style={styles.categoryArea}>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {
                                            this.store?.categories?.map(category => {
                                                const avatar = category.urlAvatar ? { uri: category.urlAvatar } : require('../../assets/images/home_inactive.png')
                                                return (
                                                    <TouchableOpacity style={styles.categoryButton}>
                                                        <View style={styles.categoryImageContainer}>
                                                            <Image source={avatar} resizeMode='contain' style={styles.categoryImage} />
                                                        </View>
                                                        <Text style={styles.categoryButtonText} numberOfLines={2} ellipsizeMode='tail'>{category.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            }
                            {
                                this.store?.vouchers &&
                                <View style={styles.voucherArea}>
                                    <View style={defaultStyles.row}>
                                        <Text style={styles.title}>{I18n.t('promotions')}</Text>
                                        <View style={[styles.viewAllContainer]}>
                                            <TouchableOpacity onPress={() => this.store.onPressAllVoucherButton(this.props.navigation)}>
                                                <Text style={styles.viewAllText}>{I18n.t('all')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {
                                            this.store.vouchers.map(voucher => {
                                                const v = mobx.toJS(voucher);
                                                return (
                                                    <View style={styles.voucherContainer}>
                                                        <VoucherCard navigation={this.props.navigation} voucher={v} />
                                                    </View>


                                                )
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            }

                        </View>
                    </View>



                </ScrollView>
            </View>

        )
    }
}





const headerImageHeight = 150;
const headerContentHeight = 35;
const actionButtonAreaHeight = 120;
const actionButtonAreaMarginHorizontal = 16;
const categoryButtonWidth = 55;
const rabbitHearHeight = 24;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    header: {
        width: deviceWidth,
        height: headerImageHeight,
        backgroundColor: Colors.primary,
        position: 'absolute',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        height: headerContentHeight,
    },
    round: {
        height: 100,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    scrollView: {
        marginTop: headerImageHeight,
        minHeight: deviceHeight,
        top: - (headerImageHeight / 2 + headerContentHeight / 2) + (Platform.OS === 'ios' ? (headerContentHeight / 2 + rabbitHearHeight) : 0),
    },
    scrollViewContent: {
        marginBottom: 150,
    },
    scanButton: {
        paddingHorizontal: defaultMargin,
    },
    searchButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: defaultBorderRadius,
        backgroundColor: Colors.third,
        marginHorizontal: defaultMargin,
        height: headerContentHeight,
    },
    searchText: {
        ...defaultStyles.text,
        ...defaultStyles.marginHorizontal,
        color: Colors.lightGray,
    },
    notificationButton: {
        paddingHorizontal: defaultMargin,
    },
    actionButtonArea: {
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        height: actionButtonAreaHeight,
        borderRadius: defaultBorderRadius,
        marginHorizontal: actionButtonAreaMarginHorizontal,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        marginVertical: defaultMargin,
    },
    actionButtonImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.lightGray,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        marginHorizontal: defaultMargin * 2,
    },
    actionButtonImage: {
        width: 30,
    },
    actionButtonText: {
        ...defaultStyles.text,
        marginVertical: 4,
    },
    body: {
        backgroundColor: Colors.white,
        marginTop: defaultMargin,
        borderRadius: defaultBorderRadius,
        flex: 1,
    },
    categoryArea: {
        marginHorizontal: actionButtonAreaMarginHorizontal,
        marginVertical: 16,
    },
    categoryButton: {
        alignItems: 'center',
        marginHorizontal: 8,
        width: categoryButtonWidth,
    },
    categoryImageContainer: {
        backgroundColor: Colors.white,
        borderRadius: defaultBorderRadius,
        marginVertical: defaultMargin,
        width: 45,
        height: 45,
        borderColor: Colors.lightGray,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 2,
    },
    categoryImage: {
        width: 32,
        height: 32,
        margin: defaultMargin,
    },
    categoryButtonText: {
        ...defaultStyles.text,
        textAlign: 'center',
    },
    voucherArea: {
        marginHorizontal: actionButtonAreaMarginHorizontal,
        marginVertical: 16,
        flex: 1,
    },
    viewAllContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    viewAllText: {
        ...defaultStyles.textBold,
        fontSize: 18,
        color: Colors.secondary,
    },
    title: {
        ...defaultStyles.textBold,
        fontSize: 18,
        marginVertical: defaultMargin,
    },
    voucherContainer: {
        marginRight: defaultMargin,
        flex: 1,
        marginVertical: defaultMargin,
        width: 0.85 * deviceWidth,
    }
});