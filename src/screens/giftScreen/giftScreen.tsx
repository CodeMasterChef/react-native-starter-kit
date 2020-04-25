import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { NavigationScreenProp } from 'react-navigation';
import I18n from 'react-native-i18n';
import { HeaderNavigation, DefaultNavigationOptions } from '../../commons/defaultHeaderStyle';
import { GiftScreenStore } from './giftScreenStore';
import { deviceWidth } from '../../commons/constant';
import { Colors } from '../../commons/colors';
import GiftList from './giftList/giftList';
import { TabView, TabBar } from 'react-native-tab-view';
import { GiftListStore } from './giftList/giftListStore';
import { stores } from '../../stores';

interface Props {
    navigation: NavigationScreenProp<any>,
}

@observer
export default class GiftScreen extends Component<Props> {
    //@ts-ignore
    static navigationOptions = () => ({
        title: I18n.t('promotions'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    store: GiftScreenStore;
    newGiftStore: GiftListStore;
    usedAndExpiredStore: GiftListStore;
    state = {
        index: 0,
        routes: [
            { key: 'first', title: I18n.t('new') },
            { key: 'second', title: I18n.t('used') },
        ],
    };


    constructor(props: Props) {
        super(props);
        this.store = new GiftScreenStore();
        this.newGiftStore = new GiftListStore(false);
        this.usedAndExpiredStore = new GiftListStore(true);
        stores.newGiftStore = this.newGiftStore;
        stores.usedAndExpiredStore = this.usedAndExpiredStore;
        stores.navigation = props.navigation;
    }

    onChangeTabViewState = (index: any) => {
        this.setState({ index: index });
    }

    renderScene = ({ route }: { route: any }) => {
        switch (route.key) {
            case 'first':
                return <GiftList navigation={this.props.navigation} store={this.newGiftStore} />;
            case 'second':
                return <GiftList navigation={this.props.navigation} store={this.usedAndExpiredStore} />;
        }
    };

    render() {
        return (
            <TabView
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: Colors.primary }}
                        style={{ backgroundColor: Colors.third }}
                    />
                }
                navigationState={this.state}
                renderScene={this.renderScene}
                onIndexChange={this.onChangeTabViewState}
                initialLayout={{ width: deviceWidth }}
            />
        )
    }
}



