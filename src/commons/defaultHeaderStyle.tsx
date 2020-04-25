import { Colors } from './colors';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Header } from 'react-navigation-stack';
import React from 'react';
import { deviceWidth, defaultFontFamily } from './constant';

export const HeaderNavigation = (props: any) => {
  return (
    <View>
      <ImageBackground
        style={styles.imageBackground}
        resizeMode='cover'
        source={require('../assets/images/header.png')}
      >
        <View style={styles.overlay}>
          <Header {...props} style={styles.header} />
        </View>

      </ImageBackground>

    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: deviceWidth,
  },
  overlay: {
    backgroundColor: 'rgba(33,0,68,0.6)',
  },
  header: {
    backgroundColor: 'transparent',
  },
})

export const DefaultNavigationOptions = {
  headerStyle: {
    backgroundColor: 'transparent',
  },
  headerTintColor: Colors.white,
  headerTitleStyle: {
    fontFamily: defaultFontFamily,
  },
}


