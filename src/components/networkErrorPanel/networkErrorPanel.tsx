import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { observer } from 'mobx-react';
import { Colors } from '../../commons/colors';
import I18n from 'react-native-i18n';
import { defaultStyles } from '../../commons/defaultStyles';
import { SafeAreaView } from 'react-navigation';

interface Props {

}

@observer
export default class NetworkErrorPanel extends Component<Props> {

    constructor(props: Props) {
        super(props);

    };

    render() {
        return (
            <SafeAreaView style={styles.errorContainer}>       
                    <Text style={styles.errorText}>{I18n.t('no_internet_connection')}</Text>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    errorContainer: {
        width: '100%',
        padding: 10,
        alignSelf: 'center',
        backgroundColor: Colors.toastDanger,
    },
    errorText: {
        ...defaultStyles.textWhite,
        fontSize: 12,
        textAlign: 'center'
    }
});


