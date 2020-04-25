import Ionicons from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StyleSheet, View, Text, Image } from 'react-native';
import React, { Component } from 'react';
import { Colors } from '../../commons/colors';
import I18n from 'react-native-i18n';
import { defaultMargin } from '../../commons/constant';
import { defaultStyles } from '../../commons/defaultStyles';
import { appStore } from '../../appStore';
import { localAppStorageHelper } from '../../helpers/localAppStorageHelper';




export default class IntroScreen extends Component {

    slides = [
        {
            key: '1',
            title: I18n.t('membership_points'),
            text: I18n.t('points_for_all'),
            image: require('../../assets/images/intro1.png'),
        },
        {
            key: '2',
            title: I18n.t('voucher_world'),
            text: I18n.t('a_lot_of_vouchers'),
            image: require('../../assets/images/voucher_intro.png'),
        },
        {
            key: '3',
            title: I18n.t('exchange_points'),
            text: I18n.t('exchange_your_points_between_member_programs'),
            image: require('../../assets/images/intro2.png'),
        },
        {
            key: '4',
            title: I18n.t('one_point_for_all'),
            text: I18n.t('no_need_to_purchase_a_reward_point'),
            image: require('../../assets/images/intro3.png'),
        }
    ];

    renderNextButton = () => {
        return (
            <View style={[styles.buttonCircle, styles.buttonCircleNext]}>
                <Ionicons
                    name='md-arrow-round-forward'
                    color='rgba(255, 255, 255, 1)'
                    size={24}
                    style={{ backgroundColor: 'transparent' }}
                />
            </View>
        );
    };

    renderSkipButton = () => {
        return (
            <View style={styles.skipButton}>
                <Text style={styles.textSkip}>{I18n.t('skip')}</Text>
            </View>
        );
    };

    renderDoneButton = () => {
        return (
            <View style={[styles.buttonCircle, styles.buttonCircleNext]}>
                <Ionicons
                    name='md-checkmark'
                    color='rgba(255, 255, 255, .9)'
                    size={24}
                    style={{ backgroundColor: 'transparent' }}
                />
            </View>
        );
    };

    renderItem = ({ item }: { item: any }) => {
        return (
            <View style={styles.slide}>
                <Image style={styles.image} resizeMode='contain' source={item.image} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subTitle}>{item.text}</Text>
            </View>
        );
    }

    onDone = async () => {
        appStore.isReadIntro = true;
        await localAppStorageHelper.setIsReadIntro(true);
    }

    render() {
        return (
            <AppIntroSlider
                slides={this.slides}
                renderItem={this.renderItem}
                renderDoneButton={this.renderDoneButton}
                renderNextButton={this.renderNextButton}
                activeDotStyle={styles.activeDotStyle}
                onDone={this.onDone}
                showSkipButton={true}
                renderSkipButton={this.renderSkipButton}
                onSkip={this.onDone}
            />
        );
    }
}

const styles = StyleSheet.create({
    buttonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButton: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textSkip: {
        ...defaultStyles.text,
        color: Colors.gray,
    },
    buttonCircleNext: {
        backgroundColor: Colors.highlight,
    },
    image: {
        width: 296,
        height: 296,
    },
    title: {
        ...defaultStyles.text,
        ...defaultStyles.textBold,
        fontSize: 20,
        color: Colors.primary,
        backgroundColor: 'transparent',
        textAlign: 'center',
        margin: defaultMargin * 2,
        textTransform: 'uppercase',

    },
    subTitle: {
        ...defaultStyles.text,
        color: Colors.primary,
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
        fontSize: 16,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDotStyle: {
        backgroundColor: Colors.highlight,
    }
});