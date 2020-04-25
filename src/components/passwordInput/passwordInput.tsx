import React, { Component } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import { PasswordInputStore } from './passwordInputStore';
import { Colors } from '../../commons/colors';
import { defaultMargin, defaultBorderWidth, defaultBorderRadius } from '../../commons/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
   onChangePassword: (password: string) => void;
}

@observer
export default class PasswordInput extends Component<Props> {

    store = new PasswordInputStore();

    constructor(props: Props) {
        super(props);
        this.store.setOnChangePasswordCallback(props.onChangePassword);
    };

    componentDidMount() {
    }

    render() {

        return (
            <View style={styles.textInputContainer}>
            <View style={styles.textInputIcon}>
                <MaterialCommunityIcons name='lock-outline' size={32}
                    color={Colors.gray} />
            </View>
            <TextInput style={styles.textInputInput}
                returnKeyType='done'
                secureTextEntry={!this.store.showingPassword}
                value={this.store.password}
                onChangeText={this.store.onChangePasswordInput}
            />
            <View style={styles.textInputIcon}>
                <TouchableOpacity onPress={this.store.onPressEyeIcon}>
                    <MaterialCommunityIcons name={(this.store.showingPassword) ? 'eye-outline' : 'eye-off-outline'} size={32}
                        color={Colors.gray} />
                </TouchableOpacity>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({

    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: Colors.white,
        borderWidth: defaultBorderWidth,
        borderRadius: defaultBorderRadius,
     
    },
    textInputIcon: {
        backgroundColor: Colors.white,
        padding: defaultMargin,
    },
    textInputInput: {
        flex: 1,
        paddingLeft: 10,
        backgroundColor: Colors.white,
    },
    phoneInput: {
        fontSize: 16,
        paddingTop: 5,
        paddingLeft: 10,
        borderLeftColor: Colors.lightGray,
        borderLeftWidth: 2,
    },
});


