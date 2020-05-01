import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { OpeningPageModalStore } from './openingPageModalStore';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import I18n from 'react-native-i18n';
import { defaultMargin } from '../../commons/constant';
import { Colors } from '../../commons/colors';

interface Props {
    store: OpeningPageModalStore;
}

@observer
export default class OpeningPageModal extends Component<Props> {

    store!: OpeningPageModalStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store;
    };



    render() {

        return (
            <Modal isVisible={this.store?.isVisible}>
                <View style={defaultStyles.modalContent}>
                    <View style={defaultStyles.centerCenter}>

                        <LottieView style={styles.animation} source={require('../../assets/animations/going.json')} autoPlay />
                        <Text style={styles.title}>{I18n.t('is_move_to_sale_page')}</Text>
                    </View>

                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        ...defaultStyles.textBold,
        margin: defaultMargin,
        color: Colors.primary,
    },
    animation: {
        width: 200,
        height: 200,
    }
});


