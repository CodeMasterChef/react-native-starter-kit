import { NavigationScreenProp } from 'react-navigation';
import React, { Component } from 'react';
import { VoucherDetailScreenStore } from './voucherDetailScreenStore';
import { observer } from 'mobx-react';
import { View, StyleSheet, Image, Text, Platform, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import I18n from 'react-native-i18n';
import { DefaultNavigationOptions } from '../../commons/defaultHeaderStyle';
import { defaultMargin, deviceWidth, processCircleSnailColors, processCircleSnailSpinDuration, defaultBorderRadius, processCircleSnailSize } from '../../commons/constant';
import { Colors } from '../../commons/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AutoHeightWebView from 'react-native-autoheight-webview';
import * as Progress from 'react-native-progress';
import QRCode from 'react-native-qrcode-svg';
import { VoucherType } from '../../@model/voucher';
import OpeningPageModal from '../../components/openingPageModal/openingPageModal';

export const voucherDetailScreenParams = {
    store: 'store',
}

interface Props {
    navigation: NavigationScreenProp<any>,

}
const avatarWidth = 70;
const avatarBorderRadius = 20;
const loadingSize = 50;

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 70 : 40;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

@observer
export default class VoucherDetailScreen extends Component<Props> {

    //@ts-ignore
    static navigationOptions = () => ({
        header: null,
        ...DefaultNavigationOptions,
    });

    store: VoucherDetailScreenStore;
    state = {
        scrollY: new Animated.Value(0),
    };

    constructor(props: Props) {
        super(props);
        this.store = props.navigation ? props.navigation.getParam(voucherDetailScreenParams.store) : {} as VoucherDetailScreenStore;
    };

    render() {

        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        const imageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });



        return (
            <View style={defaultStyles.screen}>
                <ScrollView
                    style={defaultStyles.container}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],

                    )}
                >
                    <View style={styles.scrollViewContent}>
                        <View style={styles.voucherHeader}>
                            <View style={styles.avatarContainer}>
                                {
                                    !!(this.store && this.store.voucher && this.store.voucher.brand && this.store.voucher.brand.urlAvatar) ?
                                        <Image style={styles.avatar} source={{ uri: this.store.voucher.brand.urlAvatar }} />
                                        :
                                        <Image style={styles.avatar} source={require('../../assets/images/loyal_one.png')} />
                                }
                            </View>
                            <Text style={styles.voucherTitle}>{this.store.voucher.title}</Text>

                            {
                                (this.store.voucher && (this.store.voucher.expDate || this.store.voucher.startDate)) &&
                                <Text style={styles.expiredDate}>{I18n.t('expiry_date')}: {this.store.getExpiredDateFormat}</Text>
                            }

                            {
                                ((this.store.voucher?.type === VoucherType.LOYA && this.store.voucher?.code) || (this.store.voucher?.type === VoucherType.CRAWLER && this.store.voucher?.code && this.store.isPressedShowCrawlerVoucherCode)) &&
                                <View style={defaultStyles.horizontalCenter}>
                                    <View style={styles.voucherCodeContainer}>
                                        <Text style={defaultStyles.text}>{I18n.t('code')}:</Text>
                                        <Text style={styles.voucherCode}>{this.store.voucher?.code}</Text>
                                        <TouchableOpacity style={defaultStyles.marginHorizontal} onPress={this.store.onPressCopyButton}>
                                            <MaterialCommunityIcons name='content-copy' size={24} color={Colors.third} />
                                        </TouchableOpacity>

                                    </View>
                                    <View style={styles.codeContainer}>
                                        <QRCode
                                            value={`https://loya.one/userapp?a=v&code=${this.store.voucher?.code}`}
                                            size={160}
                                            logoBackgroundColor='transparent'
                                            enableLinearGradient={true}
                                            linearGradient={[Colors.black]}
                                        />
                                    </View>

                                </View>
                            }
                        </View>
                        <View style={styles.voucherDescription}>
                            {
                                !this.store.isWebviewLoadEnd &&
                                <View style={defaultStyles.horizontalCenter}>
                                    <View style={{ width: loadingSize }}>
                                        <Progress.CircleSnail
                                            size={loadingSize}
                                            color={processCircleSnailColors}
                                            spinDuration={processCircleSnailSpinDuration}
                                        />
                                    </View>
                                </View>
                            }

                            {
                                !!(this.store && this.store.voucher && this.store.voucher.content) &&
                                <AutoHeightWebView
                                    onLoadEnd={this.store.onLoadEndWebView}
                                    style={{ width: deviceWidth - 15, marginTop: 10 }}
                                    viewportContent={'width=device-width, user-scalable=no'}
                                    scrollEnabled={false}
                                    source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${this.store.voucher.content}</body></html>` }}
                                >
                                </AutoHeightWebView>
                            }
                        </View>
                    </View>



                </ScrollView>

                <Animated.View style={[styles.header, { height: headerHeight }]}>
                    <Animated.Image
                        style={[
                            styles.backgroundImage,
                            { opacity: imageOpacity, transform: [{ translateY: imageTranslate }] },
                        ]}
                        source={(this.store.voucher && this.store.voucher.image) ? { uri: this.store.voucher.image } : require('../../assets/images/gift.png')}
                    />
                    <Animated.View style={styles.navbar}>
                        <View style={styles.backButtonContainer}>
                            <TouchableOpacity style={styles.backButton} onPress={() => this.store.onPressBackButton(this.props.navigation)}>
                                {
                                    Platform.OS == 'ios' ?
                                        <MaterialCommunityIcons name='chevron-left' size={42} color={Colors.white} /> :
                                        <MaterialCommunityIcons name='arrow-left' size={36} color={Colors.white} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.navbarTitle}>
                            <Text style={styles.navbarTitleText} numberOfLines={1} ellipsizeMode='tail'>{this.store.voucher.title}</Text>
                        </View>
                    </Animated.View>


                </Animated.View>

                <View style={defaultStyles.backgroundWhite}>
                    {
                        (this.store?.voucher?.type === VoucherType.CRAWLER && this.store?.voucher?.code) &&
                        <TouchableOpacity style={styles.getCodeButton} onPress={this.store?.onPressCrawlerVoucherButton}>
                            <View style={[styles.getButtonCodeArea, this.store?.isPressedShowCrawlerVoucherCode ? styles.getButtonCodeAreaShow : styles.getButtonCodeAreaHide]}>
                                <Text style={[styles.codeText, this.store?.isPressedShowCrawlerVoucherCode ? styles.codeTextShow : styles.codeTextHide]}>{this.store?.voucher.code}</Text>
                            </View>
                            {
                                (!this.store.isPressedShowCrawlerVoucherCode) &&
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
                        (this.store?.voucher?.type === VoucherType.LOYA && !this.store?.voucher?.code) &&
                        <TouchableOpacity
                            disabled={this.store.isSubmitting}
                            style={[styles.submitButton, this.store.isSubmitting ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}
                            onPress={this.store.onPressReceiveVoucherButton}>
                            {
                                (this.store.isSubmitting) ?
                                    <Progress.CircleSnail
                                        size={processCircleSnailSize}
                                        color={Colors.white}
                                        spinDuration={processCircleSnailSpinDuration}
                                    />
                                    : <Text style={[defaultStyles.hightButtonText]}>{I18n.t('get_now')}</Text>
                            }

                        </TouchableOpacity>
                    }
                </View>
                <OpeningPageModal store={this.store?.openingPageModalStore} />
            </View>
        )

    }
}

const getButtonBorderRadius = 6;
const getButtonHeight = 36;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.primary,
        overflow: 'hidden',
    },
    navbar: {
        flexDirection: 'row',
    },
    navbarTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        left: -20,
        top: (Platform.OS === 'ios') ? 15 : 0,
    },
    navbarTitleText: {
        ...defaultStyles.textWhite,
        maxWidth: 200,
    },
    scrollViewContent: {
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: deviceWidth,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    backButtonContainer: {

    },
    backButton: {
        marginTop: Platform.OS === 'ios' ? 25 : 0,
        marginLeft: Platform.OS === 'ios' ? 5 : 10,
    },
    voucherHeader: {
        paddingTop: HEADER_MAX_HEIGHT,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    expiredDate: {
        ...defaultStyles.text,
        margin: defaultMargin,
        textAlign: 'center',
    },
    voucherDescription: {
        marginTop: 1,
        backgroundColor: Colors.white,
        padding: defaultMargin,
    },
    avatarContainer: {
        backgroundColor: Colors.lightGray,
        borderRadius: avatarBorderRadius,
        width: avatarWidth,
        height: avatarWidth,
        margin: defaultMargin,

    },
    avatar: {
        borderRadius: avatarBorderRadius,
        margin: 0,
        width: avatarWidth,
        height: avatarWidth,
        resizeMode: 'cover',
    },
    voucherTitle: {
        ...defaultStyles.text,
        fontSize: 18,
        color: Colors.primary,
        margin: defaultMargin,
        textAlign: 'center',
    },
    voucherCode: {
        ...defaultStyles.text,
        ...defaultStyles.textBold,
        fontSize: 20,
        margin: defaultMargin,
    },
    voucherCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeContainer: {
        borderColor: Colors.black,
        borderWidth: 1,
        padding: 20,
        borderRadius: defaultBorderRadius,
    },
    submitButton: {
        ...defaultStyles.horizontalCenter,
        ...defaultStyles.margin,
        backgroundColor: Colors.secondary,
        borderRadius: defaultBorderRadius,
        minHeight: 43,
        justifyContent: 'center',
    },
    getCodeButton: {

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
    getButtonCodeArea: {
        flex: 1,
        borderTopLeftRadius: getButtonBorderRadius,
        borderBottomLeftRadius: getButtonBorderRadius,
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: getButtonHeight,

    },
    getButtonLabelArea: {
        backgroundColor: Colors.secondary,
        borderTopRightRadius: getButtonBorderRadius,
        borderTopLeftRadius: 24,
        borderBottomRightRadius: getButtonBorderRadius,
        height: getButtonHeight,
    },
    getCodeText: {
        ...defaultStyles.textWhite,
        margin: 8,
        paddingHorizontal: 32,
        textAlign: 'center'
    },

    codeText: {
        ...defaultStyles.text,
        color: Colors.gray,
        fontSize: 20,
        right: -25,
    },
    getButtonCodeAreaHide: {
        alignItems: 'flex-end',
    },
    getButtonCodeAreaShow: {
        alignItems: 'center',
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
})