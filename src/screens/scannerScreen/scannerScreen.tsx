import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { NavigationScreenProp } from 'react-navigation';
import I18n from 'react-native-i18n';
import { HeaderNavigation, DefaultNavigationOptions } from '../../commons/defaultHeaderStyle';
import { stores } from '../../stores';
import { defaultStyles } from '../../commons/defaultStyles';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { ScannerScreenStore } from './scannerScreenStore';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { deviceWidth, defaultBorderRadius } from '../../commons/constant';
import { Colors } from '../../commons/colors';
import LottieView from 'lottie-react-native';
import { RNCamera } from 'react-native-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const qrMarkerSize = deviceWidth * 0.9;

interface Props {
    navigation?: NavigationScreenProp<any>,
}
@observer
export default class ScannerScreen extends Component<Props> {

    //@ts-ignore
    static navigationOptions = () => ({
        title: I18n.t('scan'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });


    store: ScannerScreenStore;


    constructor(props: Props) {
        super(props);
        this.store = new ScannerScreenStore();
        stores.scannerScreenStore = this.store;
    }

    componentDidMount() {

    }


    render() {
        return (
            <View style={styles.screen}>
                <SafeAreaView>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={this.store.onPressCloseButton}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name='arrow-left' size={30} color={Colors.black} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <QRCodeScanner
                    cameraStyle={styles.cameraContainer}
                    ref={(node) => { this.store.scanner = node }}
                    onRead={this.store.onDetectCodeSuccessfully}
                    // @ts-ignore
                    flashMode={this.store.isOpenFlash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                    showMarker={true}
                    customMarker={
                        <View style={defaultStyles.centerCenter}>
                            <LottieView style={styles.marker} source={require('../../assets/animations/scanner.json')} autoPlay />
                            {
                                this.store.isLoading && <Text style={styles.loadingText}>{I18n.t('loading')}</Text>
                            }
                        </View>
                    }
                    topContent={
                        <View style={styles.topArea}>
                            <Text style={styles.title}>{I18n.t('scan_qr_code_to')}</Text>
                        </View>
                    }
                    bottomContent={
                        <View style={styles.bottomArea}>
                            <TouchableOpacity style={[styles.button, this.store.isOpenFlash ? styles.buttonActive : styles.buttonNormal]} onPress={this.store.onPressFlashButton}>
                                {
                                    this.store.isOpenFlash ?
                                        <Ionicons name='md-flashlight' size={28} color={Colors.white} /> :
                                        <MaterialCommunityIcons name='flashlight' size={28} color={Colors.white} />
                                }
                            </TouchableOpacity>
                        </View>
                    }

                />



            </View>
        )
    }
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#00000070',
        flex: 1,
    },
    header: {

    },
    backButton: {
        paddingLeft: 5,
        paddingTop: 5,
    },
    iconContainer: {
        backgroundColor: Colors.lightGray,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    zeroContainer: {
        margin: 0,
        padding: 0,
    },
    cameraContainer: {
        marginHorizontal: deviceWidth * 0.05,
        width: qrMarkerSize,
    },
    topArea: {
        width: qrMarkerSize,
        marginHorizontal: deviceWidth * 0.1,
        paddingVertical: 20,
    },
    bottomArea: {
        ...defaultStyles.centerCenter,
        paddingVertical: 20,
        width: deviceWidth,
    },
    marker: {
        width: qrMarkerSize,
        height: qrMarkerSize,
    },
    loadingText: {
        backgroundColor: Colors.primary,
        padding: 8,
        ...defaultStyles.textWhite,
        top: - qrMarkerSize / 2,
    },
    title: {
        ...defaultStyles.textWhite,
        textAlign: 'center',
    },
    button: {
        width: 50,
        height: 50,
        ...defaultStyles.centerCenter,
        borderRadius: defaultBorderRadius,
    },
    buttonNormal: {
        backgroundColor: '#666565',
    },
    buttonActive: {
        backgroundColor: Colors.highlight,
    },

});


