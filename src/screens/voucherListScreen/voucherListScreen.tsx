import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import { observer } from 'mobx-react';
import I18n from 'react-native-i18n';
import { NavigationScreenProp } from 'react-navigation';
import { stores } from '../../stores';
import { VoucherListScreenStore } from './voucherListScreenStore';
import { bottomBarHeight, defaultMargin, deviceHeight } from '../../commons/constant';
import VoucherCard from '../../components/voucherCard/voucherCard';
import * as mobx from 'mobx';
import Loading from '../../components/loading/loading';

export const voucherListScreenParams = {
    store: 'store',
}

interface Props {
    navigation: NavigationScreenProp<any>,
}

@observer
export default class VoucherListScreen extends Component<Props> {
    //@ts-ignore
    static navigationOptions = () => ({
        title: I18n.t('promotions'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    store!: VoucherListScreenStore;

    constructor(props: Props) {
        super(props);
        const store = props.navigation?.getParam(voucherListScreenParams.store);
        this.store = store || new VoucherListScreenStore();
        stores.voucherListScreenStore = this.store;
        stores.navigation = props.navigation;
    };

    render() {
        return (
            <View style={defaultStyles.whiteScreen}>
                <ScrollView style={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={this.store.isRefreshing} onRefresh={this.store.onRefresh} />
                    }
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={this.store.loadMore}
                >
                    <View style={styles.scrollViewContent}>
                        {
                            this.store.vouchers.map(voucher => {
                                const v = mobx.toJS(voucher);
                                return (
                                    <View key={v.id} style={styles.voucherContainer}>
                                        <VoucherCard navigation={this.props.navigation} voucher={v} />
                                    </View>

                                )
                            })
                        }
                        {
                            this.store.isLoadingMore &&
                            <Loading />
                        }
                    </View>

                </ScrollView>

            </View>
        )
    }
}



const styles = StyleSheet.create({
    scrollView: {
        minHeight: deviceHeight,
    },
    scrollViewContent: {
        margin: defaultMargin,
        marginBottom: bottomBarHeight,
    },
    voucherContainer: {
        marginBottom: defaultMargin,
    }
})