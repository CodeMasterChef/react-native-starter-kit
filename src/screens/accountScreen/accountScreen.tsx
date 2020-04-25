import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import I18n from 'react-native-i18n';
import { Colors } from '../../commons/colors';
import { defaultBorderWidth, defaultMargin, defaultBorderRadius } from '../../commons/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';
import { appStore } from '../../appStore';
import { stores } from '../../stores';
import { AccountScreenStore } from './accountScreenStore';

interface Props {
    navigation: any
}

@observer
export default class AccountScreen extends Component<Props> {

    static navigationOptions = ({ }) => ({
        title: I18n.t('account'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
        headerBackTitle: I18n.t('account'),

    });

    store = new AccountScreenStore();

    constructor(props: any) {
        super(props);
        this.store.setNavigation(props.navigation);
        stores.navigation = props.navigation;
        stores.accountScreenStore = this.store;

    };

    async componentDidMount() {
        this.store.setNavigation(this.props.navigation);
        await this.store.getAccountInfo();
    }

    render() {
        return (
            <View style={[defaultStyles.container, styles.screen]}>
                <TouchableOpacity style={styles.accountArea}
                    onPress={this.store.onPressUserProfileButton}
                >
                    <View style={styles.item}>
                        <View style={styles.itemContent}>
                            <View style={styles.avatarContainer}>
                                <Image style={styles.avatar} source={this.store.urlAvatar ? { uri: this.store.urlAvatar } : require('../../assets/images/user.png')} />
                            </View>
                            <Text style={defaultStyles.textWhite}>{this.store.name}</Text>
                            <View style={styles.rightArrowContainer}>
                                <MaterialCommunityIcons name='chevron-right' size={32} color={Colors.white} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.body}>
                    <TouchableOpacity style={styles.item} onPress={this.store.onPressUserCodeButton}>
                        <View style={styles.itemContent}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name='qrcode' size={32} color={Colors.secondary} />
                            </View>
                            <Text style={[defaultStyles.text, styles.iconText]}>{I18n.t('earn_point_code')}</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.item} onPress={this.store.onPressHistoryButton}>
                        <View style={styles.itemContent}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name='history' size={32}
                                    color={Colors.secondary} />
                            </View>
                            <Text style={[defaultStyles.text, styles.iconText]}>{I18n.t('transaction_history')}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={this.store.onPressLogoutButton}>
                        <View style={styles.itemContent}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name='logout-variant' size={32}
                                    color={Colors.secondary} />
                            </View>
                            <Text style={[defaultStyles.text, styles.iconText]}>{I18n.t('logout')}</Text>
                        </View>
                    </TouchableOpacity>



                    <View style={styles.versionContainer}>
                        <Text style={styles.version} >
                            {appStore.envName} v.{appStore.version}
                        </Text>
                        <Text style={styles.provider} >
                            {I18n.t('development_by_loya_world')}
                        </Text>
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    screen: {

    },
    item: {
        borderColor: Colors.lightGray,
        borderBottomWidth: defaultBorderWidth,
    },
    itemContent: {
        flexDirection: 'row',
        marginVertical: defaultMargin,
        alignItems: 'center',
    },
    rightArrowContainer: {
        alignItems: 'flex-end',
        flex: 1,
    },
    avatarContainer: {
        backgroundColor: Colors.white,
        borderColor: Colors.white,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: defaultMargin * 2,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
    },
    iconContainer: {
        width: 58,
        alignItems: 'center',
    },
    iconText: {

    },
    versionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    version: {
        ...defaultStyles.text,
        color: Colors.gray,
        fontSize: 8,
        marginTop: 10,
    },
    provider: {
        ...defaultStyles.text,
        fontSize: 9,
        color: Colors.gray,
        ...defaultStyles.marginVertical,
    },
    body: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: defaultBorderRadius * 2,
        borderTopRightRadius: defaultBorderRadius * 2,
        top: -26,
        flex: 1,
    },
    accountArea: {
        backgroundColor: Colors.third,
        marginBottom: 14,
    }
});