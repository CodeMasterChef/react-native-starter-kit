import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import { bottomBardIconSize } from '../../commons/constant';
import { Colors } from '../../commons/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationScreenProp } from 'react-navigation';
import { appStore } from '../../appStore';

interface Props {
    navigation: NavigationScreenProp<any>
}

@observer
export default class ScannerButtonOnBottomBar extends Component<Props> {


    constructor(props: Props) {
        super(props);
    }

    onPressButton = () => {
        appStore.isVisibleScannerModal = true;

    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.onPressButton}
                style={styles.button}>
                <Ionicons name='md-qr-scanner' size={bottomBardIconSize}
                    color={Colors.gray} />
            </TouchableOpacity>
        );
    }

};



const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});


