import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { NavigationScreenProp } from 'react-navigation';
import I18n from 'react-native-i18n';
import { HeaderNavigation, DefaultNavigationOptions } from '../../commons/defaultHeaderStyle';
import { stores } from '../../stores';
import { defaultStyles } from '../../commons/defaultStyles';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { UserCodeScreenStore } from './userCodeScreenStore';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../../commons/colors';
import { defaultBorderRadius } from '../../commons/constant';

interface Props {
    navigation: NavigationScreenProp<any>,
}
@observer
export default class UserCodeScreen extends Component<Props> {

    //@ts-ignore
    static navigationOptions = () => ({
        title: I18n.t('earn_point_code'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    store: UserCodeScreenStore;


    constructor(props: Props) {
        super(props);
        this.store = new UserCodeScreenStore();
        stores.userCodeScreenStore = this.store;
        stores.navigation = props.navigation;
    }


    render() {
       
        const logo = this.store.account?.urlAvatar ? {uri:this.store.account?.urlAvatar } : require('../../assets/images/logo_sticker.png');
       
        const logoBorderRadius =  this.store.account?.urlAvatar? 140: 0;
    
        return (
            <View style={defaultStyles.whiteScreen}>
                <ScrollView
                    style={defaultStyles.scrollViewStyle}
                    contentContainerStyle={defaultStyles.scrollViewContentContainerStyle}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.store.isRefreshing}
                            onRefresh={this.store.onRefresh} />
                    }
                >
                    {
                        !!(this.store.data) &&
                        <View style={defaultStyles.screenContentContainer}>
                            <View style={[defaultStyles.screenContent, styles.centerCenter]}>
                                <Text style={styles.title}>{this.store.account?.name}</Text>
                                <Text style={[styles.subTitle]}>{I18n.t('scan_this_to_earn_points')}</Text>
                                <View style={styles.codeContainer}>
                                    <QRCode
                                        value={this.store.data}
                                        logo={logo}
                                        logoBorderRadius={logoBorderRadius}
                                        size={280}
                                        logoBackgroundColor='transparent'
                                        enableLinearGradient={true}
                                        linearGradient={[Colors.primary, Colors.secondary]}
                                    />
                                </View>
                            </View>
                        </View>
                    }
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    centerCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
    },
    title: {
        ...defaultStyles.textBold,
        fontSize: 22,
    },
    subTitle: {
       ... defaultStyles.text, 
       ...defaultStyles.margin,
       textAlign: 'center',
    },
    codeContainer: {
        borderTopColor: Colors.primary,
        borderLeftColor: Colors.primary,
        borderRightColor: Colors.secondary,
        borderBottomColor: Colors.secondary,
        borderWidth: 2,
        padding: 20,
        borderRadius: defaultBorderRadius,
    },

})


