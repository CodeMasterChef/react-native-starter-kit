import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import { observer } from 'mobx-react';
import { VnpayScreenStore } from './vnpayScreenStore';
import { Colors } from '../../commons/colors';
import { processCircleSnailColors, processCircleSnailSpinDuration } from '../../commons/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp, StackActions } from 'react-navigation';
import * as Progress from 'react-native-progress';
import { WebView } from 'react-native-webview';
import { appRoutes } from '../../navigators/appRoutes';
import { TransactionDetailScreenParams } from '../transactionDetailScreen/transactionDetailScreen';
import { LoyalPointDepositTransaction, pointApi } from '../../api/pointApi';
import { StatusCodeEnum } from '../../enum/statusCodeEnum';
import { toastHelper } from '../../helpers/toastHelper';
import I18n from 'react-native-i18n';

interface Props {
    navigation: NavigationScreenProp<any>,
}

export const VnpayScreenParams = {
    transaction: 'transaction',
}

@observer
export default class VnpayScreen extends Component<Props> {
    //@ts-ignore
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any> }) => ({
        title: 'VNPAY',
        header: (props: any) => <HeaderNavigation {...props} />,
        headerRight: (
            <TouchableOpacity onPress={async () => {
                if (navigation) {
                    let transaction = navigation.getParam(VnpayScreenParams.transaction);
                    if (transaction) {
                        const response = await pointApi.getLOPDepositTransaction(transaction.id);
                        if (response.status_code === StatusCodeEnum.success) {
                            transaction = response.data;
                        } else {
                            toastHelper.error(I18n.t('not_refresh_now'));
                        }
                    }

                    const replaceAction = StackActions.replace({
                        routeName: appRoutes.transactionDetailScreen,
                        params: {
                            [TransactionDetailScreenParams.transaction]: transaction
                        }
                    });
                    navigation.dispatch(replaceAction);
                }
            }}>
                <MaterialCommunityIcons name={'window-close'} size={34} color={Colors.white} style={defaultStyles.paddingHorizontal} />
            </TouchableOpacity>
        ),
        headerLeft: null,
        ...DefaultNavigationOptions,
    });

    vnpayUrl = '';

    store = new VnpayScreenStore();

    constructor(props: Props) {
        super(props);
        const transaction: LoyalPointDepositTransaction = this.props.navigation.getParam(VnpayScreenParams.transaction);
        if (transaction) {
            this.vnpayUrl = transaction.vnPayLink;
        }
    };

    componentDidMount() {
        this.store.setNavigation(this.props.navigation);
    }

    render() {
        return (
            <View style={defaultStyles.container}>
                {
                    !this.store.isLoadEnd &&
                    <View style={defaultStyles.horizontalCenter}>
                        <View style={{ width: 50 }}>
                            <Progress.CircleSnail
                                size={50}
                                color={processCircleSnailColors}
                                spinDuration={processCircleSnailSpinDuration}
                            />
                        </View>
                    </View>
                }
                <WebView
                    onLoadEnd={this.store.onLoadEndWebview}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    cacheEnabled={false}
                    cacheMode='LOAD_NO_CACHE'
                    source={{ uri: this.vnpayUrl }}
                />

            </View>
        )
    }
}
