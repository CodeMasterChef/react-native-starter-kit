import { NavigationScreenProp } from 'react-navigation';
import React, { Component } from 'react';
import { BrandProfileScreenStore } from './brandProfileScreenStore';
import { stores } from '../../stores';
import { observer } from 'mobx-react';
import { View, RefreshControl, ImageBackground, StyleSheet, Image, Text, Platform, TouchableOpacity, ScrollView , SafeAreaView } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import I18n from 'react-native-i18n';
import { DefaultNavigationOptions } from '../../commons/defaultHeaderStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { defaultMargin, deviceWidth, deviceHeight, processCircleSnailSize, processCircleSnailColors, processCircleSnailSpinDuration } from '../../commons/constant';
import { Colors } from '../../commons/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Voucher } from '../../@model/voucher';
import * as Progress from 'react-native-progress';
import { NeomorphBox } from 'react-native-neomorph-shadows';
import LinkOrRegisterMemberModal from '../../components/linkOrRegisterMemberModal/linkOrRegisterMemberModal';
export const BrandProfileScreenParams = {
    store: 'store',
    showRegisterMemberForm: 'showRegisterMemberForm',
}

interface Props {
    navigation: NavigationScreenProp<any>,

}

const avatarWidth = 70;
const avatarBorderRadius = 20;
const voucherBorderRadius = 10;
const headerBorderRadius = 14;
const voucherWidth = deviceWidth * 0.8;
const buttonWidth = 73;

@observer
export default class BrandProfileScreen extends Component<Props> {

    //@ts-ignore
    static navigationOptions = () => ({

        header: null,
        ...DefaultNavigationOptions,
    });

    store: BrandProfileScreenStore;

    constructor(props: Props) {
        super(props);
        this.store = props.navigation.getParam(BrandProfileScreenParams.store) || {} as BrandProfileScreenStore;
        stores.brandProfileScreenStore = this.store;
     
    
    };

    componentWillUnmount() {
        stores.brandProfileScreenStore = null;
    }

    render() {
        return (
            <SafeAreaView style={defaultStyles.violetScreen}>
                <KeyboardAwareScrollView

                    refreshControl={
                        <RefreshControl
                            tintColor={Colors.white}
                            refreshing={this.store.isRefreshing}
                            onRefresh={this.store.onRefresh} />
                    }
                >
                    <ImageBackground
                        style={styles.background}
                        imageStyle={styles.backgroundImageStyle}
                        source={this.store.brand.banner ? this.store.brand.banner : require('../../assets/images/header.png')}
                    >

                        <TouchableOpacity style={styles.backButton} onPress={() => this.store.onPressBackButton(this.props.navigation)}>
                            {
                                Platform.OS == 'ios' ?
                                    <View style={styles.iosBackButton}>
                                        <MaterialCommunityIcons name='chevron-left' size={32} color={Colors.white} />
                                        <Text style={styles.backButtonText}>{this.store.backTitle}</Text>
                                    </View> :
                                    <MaterialCommunityIcons name='arrow-left' size={36} color={Colors.white} />
                            }

                        </TouchableOpacity>

                        <View style={styles.panel}>
                            <View style={styles.header}>
                                <View style={styles.avatarContainer}>
                                    {
                                        !!(this.store.brand && this.store.brand.urlAvatar) &&
                                        <Image style={styles.avatar} source={{ uri: this.store.brand.urlAvatar }} />
                                    }
                                </View>
                                <View style={defaultStyles.verticalCenter}>
                                    <Text style={styles.brandName}>{this.store.brand.name}</Text>
                                    <Text style={styles.brandCategory}>{this.store.brand.category ? this.store.brand.category.name : ''}</Text>
                                </View>

                            </View>
                            <View style={styles.headerButtonView}>
                                <TouchableOpacity style={styles.headerButton}
                                    onPress={() => this.store.onPressExchangeButton(this.props.navigation)}
                                >
                                    <NeomorphBox
                                        darkShadowColor={Colors.black}
                                        lightShadowColor={Colors.lightGray}
                                        style={styles.neomorphBox}>
                                        <Image source={require('../../assets/images/exchange_point.png')} resizeMode='contain' style={styles.buttonImage} />
                                    </NeomorphBox>
                                    <Text style={styles.buttonText}>{I18n.t('exchange_points')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={this.store.onPressLinkMemberButton}
                                >
                                    <NeomorphBox
                                        darkShadowColor={Colors.black}
                                        lightShadowColor={Colors.lightGray}
                                        style={styles.neomorphBox}>
                                        <Image source={require('../../assets/images/wallet.png')} resizeMode='contain' style={styles.buttonImage} />
                                    </NeomorphBox>
                                    <Text style={styles.buttonText}>{I18n.t('link_wallet')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={this.store.onPressRegisterMemberButton}
                                >
                                    <NeomorphBox
                                        darkShadowColor={Colors.black}
                                        lightShadowColor={Colors.lightGray}
                                        style={styles.neomorphBox}>
                                        <Image source={require('../../assets/images/register_member.png')} resizeMode='contain' style={styles.buttonImage} />
                                    </NeomorphBox>
                                    <Text style={styles.buttonText}>{I18n.t('register_member')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={() => { this.store.onPressEarnPointButton(this.props.navigation) }}
                                >
                                    <NeomorphBox
                                        darkShadowColor={Colors.black}
                                        lightShadowColor={Colors.lightGray}
                                        style={styles.neomorphBox}>
                                        <Image source={require('../../assets/images/earn_point.png')} resizeMode='contain' style={styles.buttonImage} />
                                    </NeomorphBox>

                                    <Text style={styles.buttonText}>{I18n.t('earn_points')}</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                (this.store.isRefreshingVoucher) &&
                                <View style={defaultStyles.horizontalCenter} >
                                    <Progress.CircleSnail
                                        style={{ width: processCircleSnailSize }}
                                        size={processCircleSnailSize}
                                        color={processCircleSnailColors}
                                        spinDuration={processCircleSnailSpinDuration}
                                    />
                                </View>
                            }
                            {
                                (!this.store.isRefreshingVoucher && this.store && this.store.vouchers && this.store.vouchers.length > 0) &&
                                <View style={styles.section}>
                                    <View style={defaultStyles.margin}>
                                        <Text style={styles.title}>{I18n.t('promotions')}:</Text>
                                        <ScrollView
                                            horizontal={true}
                                        >
                                            {
                                                this.store.vouchers.map((voucher: Voucher) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={voucher.id}
                                                            onPress={() => this.store.onPressVoucher(voucher, this.props.navigation)}
                                                        >
                                                            <NeomorphBox
                                                                darkShadowColor={Colors.black}
                                                                lightShadowColor={Colors.lightGray}
                                                                style={styles.voucherBox}>
                                                                <Image style={styles.voucherImage} source={voucher.image ? { uri: voucher.image } : require('../../assets/images/gift.png')} />
                                                                <Text numberOfLines={2} style={styles.voucherTitle}>{voucher.title}</Text>
                                                            </NeomorphBox>

                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                    </View>
                                </View>
                            }



                        </View>

                    </ImageBackground>

                    <LinkOrRegisterMemberModal store={this.store.linkOrRegisterMemberModalStore} />

                </KeyboardAwareScrollView>

            </SafeAreaView>
        )

    }
}


const styles = StyleSheet.create({
    background: {
        width: deviceWidth,
        flex: 1,
    },
    backgroundImageStyle: {
        resizeMode: 'repeat',
    },
    backButton: {
        marginTop: 40,
        marginLeft: 10,
    },
    iosBackButton: {
        flexDirection: 'row',
    },
    backButtonText: {
        paddingVertical: defaultMargin,
        ...defaultStyles.textWhite,
    },
    panel: {
        backgroundColor: Colors.lightGray,
        marginTop: 90,
        borderTopLeftRadius: headerBorderRadius,
        borderTopRightRadius: headerBorderRadius,
        minHeight: deviceHeight - 90,
    },
    header: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        borderTopLeftRadius: headerBorderRadius,
        borderTopRightRadius: headerBorderRadius,
    },
    headerButtonView: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: defaultMargin,
    },
    headerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: defaultMargin,
    },
    neomorphBox: {
        shadowRadius: 10,
        borderRadius: 5,
        backgroundColor: Colors.lightGray,
        shadowOpacity: 0.1,
        width: buttonWidth,
        height: buttonWidth,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonImage: {
        width: 46,
        height: 46,
    },
    buttonText: {
        ...defaultStyles.textSmall,
        width: buttonWidth,
        textAlign: 'center',
        marginVertical: defaultMargin,
    },
    avatarContainer: {
        backgroundColor: Colors.lightGray,
        borderRadius: avatarBorderRadius,
        width: avatarWidth,
        height: avatarWidth,
        margin: defaultMargin,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        borderRadius: avatarBorderRadius,
        margin: 0,
        width: avatarWidth,
        height: avatarWidth,
    },
    brandName: {
        ...defaultStyles.textBold,
        ...defaultStyles.textLarge,
    },
    section: {
        backgroundColor: Colors.white,
    },
    title: {
        ...defaultStyles.textBold,
        fontSize: 20,
        color: Colors.gray,
        margin: 12,
    },
    brandCategory: {
        ...defaultStyles.text,
    },
    voucherBox: {
        margin: defaultMargin,
        borderColor: Colors.lightGray,
        shadowRadius: 2,
        borderRadius: voucherBorderRadius,
        shadowOpacity: 0.1,
        width: voucherWidth,
        backgroundColor: Colors.white,
        height: 200,
    },
    voucherImage: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: voucherBorderRadius,
        borderTopRightRadius: voucherBorderRadius,
        backgroundColor: Colors.third,
    },
    voucherTitle: {
        ...defaultStyles.text,
        paddingHorizontal: defaultMargin,
        paddingVertical: defaultMargin * 2,
        fontSize: 18,
        color: Colors.primary,
    },
    modalHeader: {
        flexDirection: 'column',
        alignItems: 'center',
    },

})