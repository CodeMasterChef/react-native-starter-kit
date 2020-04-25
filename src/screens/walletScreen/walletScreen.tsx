import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import { observer } from 'mobx-react';
import { WalletScreenStore } from './walletScreenStore';
import I18n from 'react-native-i18n';
import NumberFormat from 'react-number-format';
import { Colors } from '../../commons/colors';
import { defaultLoyalPointCurrency, defaultMargin, defaultBorderWidth, defaultBorderRadius, processCircleSnailSpinDuration } from '../../commons/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp } from 'react-navigation';
import BrandList from '../../components/brandList/brandList';
import * as Progress from 'react-native-progress';
import { stores } from '../../stores';
import { NeomorphBox } from 'react-native-neomorph-shadows';

interface Props {
    navigation: NavigationScreenProp<any>
}

@observer
export default class WalletScreen extends Component<Props> {
    //@ts-ignore
    static navigationOptions = () => ({
        title: I18n.t('point_wallet'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    store = new WalletScreenStore();

    constructor(props: Props) {
        super(props);
        stores.walletScreenStore = this.store;
        stores.navigation = props.navigation;
    };

    componentDidMount() {
        this.store.setNavigation(this.props.navigation);
    }

    render() {
        return (
            <View style={defaultStyles.container}>
                <View
                    style={styles.background}
                >
                    <View style={defaultStyles.margin}>
                        <Text style={defaultStyles.textWhite}>{I18n.t('balance')}:</Text>
                        <View style={defaultStyles.row}>
                            {

                                (this.store.isRefreshingLop) ? <Progress.CircleSnail
                                    size={40}
                                    color={[Colors.white, Colors.highlight]}
                                    spinDuration={processCircleSnailSpinDuration}
                                /> :
                                    <NumberFormat value={this.store.loyalPoints} displayType={'text'} thousandSeparator={true}
                                        renderText={(value: string) =>
                                            <View style={defaultStyles.row}>
                                                <Text style={[styles.balance]}>{value}</Text>
                                                <Text style={[defaultStyles.textWhite]}>{defaultLoyalPointCurrency}</Text>
                                            </View>
                                        } />

                            }

                            <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                <TouchableOpacity style={styles.refillButton} onPress={this.store.onPressTopUpButton}>
                                    <Text style={styles.refillText}>{I18n.t('refill_more')} </Text>
                                    <MaterialCommunityIcons style={styles.refillIcon} name='plus-circle-outline' size={26}
                                        color={Colors.highlight} />
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                </View>
                <View style={styles.round}></View>

                <BrandList navigation={this.props.navigation}
                    isLinkedBrand={false}
                    store={this.store.brandListStore}
                    onRefresh={this.store.onRefresh}
                />
                <View style={styles.empty}></View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.addWalletButton} onPress={this.store.onPressAddWalletButton}>
                        <NeomorphBox
                            lightShadowColor={Colors.black}
                            darkShadowColor={Colors.black}
                            style={styles.addWalletShadowBox}
                        >
                            <MaterialCommunityIcons name='plus' size={32} color={Colors.white} />
                        </NeomorphBox>
                        <Text style={styles.addWalletText}>{I18n.t('add_point_wallet')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    balance: {
        color: Colors.white,
        fontSize: 37,
    },
    background: {
        width: '100%',
        backgroundColor: Colors.third,
    },
    refillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    refillText: {
        color: Colors.highlight,
        fontSize: 22,
        paddingLeft: defaultMargin,
        paddingVertical: defaultMargin,
    },
    refillIcon: {
        color: Colors.highlight,
        fontSize: 22,
        paddingRight: defaultMargin,
        paddingVertical: defaultMargin,
    },
    sectionsContainer: {
    },
    tabBar: {
        backgroundColor: '#fff',
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1
    },
    tabContainer: {
        borderBottomColor: '#090909'
    },
    tabText: {
        padding: 15,
        color: '#9e9e9e',
        fontSize: 18,
        fontWeight: '500'
    },
    separator: {
        height: 0.5,
        width: '96%',
        alignSelf: 'flex-end',
        backgroundColor: '#eaeaea'
    },
    sectionHeaderContainer: {
        height: 10,
        backgroundColor: '#f6f6f6',
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1
    },
    sectionHeaderText: {
        color: '#010101',
        backgroundColor: '#fff',
        fontSize: 23,
        fontWeight: 'bold',
        paddingTop: 25,
        paddingBottom: 5,
        paddingHorizontal: 15
    },
    itemContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff'
    },
    itemTitle: {
        flex: 1,
        fontSize: 20,
        marginHorizontal: defaultMargin,
    },
    itemPrice: {
        fontSize: 18,
    },
    itemDescription: {
        marginTop: 10,
        fontSize: 16
    },
    itemRow: {
        flexDirection: 'row',
    },
    itemColumn: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    avatarContainer: {
        backgroundColor: Colors.lightGray,
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    itemAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    searchArea: {
        backgroundColor: Colors.lightGray,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: Colors.secondary,
        borderWidth: defaultBorderWidth,
        borderRadius: defaultBorderRadius / 2,
        margin: defaultMargin,
    },
    searchIcon: {
        backgroundColor: Colors.white,
        padding: defaultMargin,
    },
    searchInput: {
        flex: 1,
        paddingLeft: 0,
        backgroundColor: Colors.white,
    },
    empty: {
        marginTop: 38,
    },
    footer: {
        position: 'absolute',
        paddingVertical: defaultMargin,
        bottom: 0,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    addWalletButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: defaultMargin,
    },
    addWalletShadowBox: {
        shadowRadius: 2,
        borderRadius: 25,
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
    },
    addWalletText: {
        ...defaultStyles.text,
        color: Colors.secondary,
    },
    round: {
        backgroundColor: Colors.white,
        height: 8,
        borderTopLeftRadius: defaultBorderRadius,
        borderTopRightRadius: defaultBorderRadius,
        top: -5,
    },
});


