import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { NavigationScreenProp, SafeAreaView } from 'react-navigation';
import { Colors } from '../../commons/colors';
import { ScrollView, } from 'react-native-gesture-handler';
import { deviceWidth, defaultBorderRadius, defaultMargin, deviceHeight, bottomBarHeight } from '../../commons/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultStyles } from '../../commons/defaultStyles';
import I18n from 'react-native-i18n';
import { SearchScreenStore } from './searchScreenStore';
import { stores } from '../../stores';
import VoucherCard from '../../components/voucherCard/voucherCard';
import * as mobx from 'mobx';
import { TabView, TabBar } from 'react-native-tab-view';
import VoucherListScreen from '../voucherListScreen/voucherListScreen';
interface Props {
    navigation: NavigationScreenProp<any>
}
@observer
export default class SearchScreen extends Component<Props> {

    store!: SearchScreenStore;

    static navigationOptions = ({ }) => ({
        title: I18n.t('search'),
        header: null,
    });

    state = {
        index: 0,
        routes: [
            { key: 'first', title: I18n.t('all_results') },
            { key: 'second', title: I18n.t('partners') },
        ],
    };

    constructor(props: Props) {
        super(props);
        this.store = new SearchScreenStore();
        stores.searchScreenStore = this.store;
        stores.navigation = props.navigation;

    };

    renderScene = ({ route }: { route: any }) => {
        switch (route.key) {
            case 'first':
                return <VoucherListScreen navigation={this.props.navigation}/>;
            case 'second':
                return <View></View>;
        }
    };


    onChangeTabViewState = (index: any) => {
        this.setState({ index: index });
    }


    render() {
        return (
            <View style={styles.screen}>
                <View style={styles.header}>
                    <SafeAreaView>
                        <View style={styles.headerContent}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => { this.props.navigation?.goBack() }}
                            >
                                <MaterialCommunityIcons name='arrow-left' size={36} color={Colors.white} />
                            </TouchableOpacity>
                            <TextInput style={styles.searchInput}
                                placeholder={`${I18n.t('search')}...`}
                                placeholderTextColor={Colors.gray}
                                autoFocus={true}
                            >

                            </TextInput>
                        </View>
                    </SafeAreaView>

                </View>

                <View style={defaultStyles.container} >
                    <TabView
                        renderTabBar={props =>
                            <TabBar
                                {...props}
                                indicatorStyle={styles.tabBarIndicatorStyle}
                                style={styles.tabBarStyle}
                                activeColor={Colors.secondary}
                                inactiveColor={Colors.gray}
                                labelStyle={styles.tabBarLabelStyle}
                            />
                        }
                        navigationState={this.state}
                        renderScene={this.renderScene}
                        onIndexChange={this.onChangeTabViewState}
                        initialLayout={{ width: deviceWidth }}
                    />
                </View>
                {/* <ScrollView style={styles.scrollView}
                >
                    <View style={styles.scrollViewContent}>

                    </View>

                </ScrollView> */}
            </View>

        )
    }
}





const headerContentHeight = 35;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    header: {
        width: deviceWidth,
        backgroundColor: Colors.primary,

    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        height: headerContentHeight,
    },
    scrollView: {
        minHeight: deviceHeight,
    },
    scrollViewContent: {
        marginBottom: 150,
    },
    backButton: {
    },
    searchInput: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: defaultBorderRadius,
        backgroundColor: Colors.white,
        marginHorizontal: defaultMargin,
        height: headerContentHeight,
        paddingHorizontal: defaultMargin,
    },
    tabBarIndicatorStyle: {
        backgroundColor: Colors.secondary,
    },
    tabBarStyle: {
        backgroundColor: Colors.white,
    },
    tabBarLabelStyle: {
        ...defaultStyles.text,
        textTransform: 'capitalize',
    }
});