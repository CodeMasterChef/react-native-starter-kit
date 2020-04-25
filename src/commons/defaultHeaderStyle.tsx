import { Colors } from './colors';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Header } from 'react-navigation-stack';
import React from 'react';
import { deviceWidth, defaultFontFamily } from './constant';

export const HeaderNavigation = (props: any) => {
  return (
    <View>

      <View style={styles.overlay}>
        <Header {...props} style={styles.header} />
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: deviceWidth,
  },
  overlay: {
    backgroundColor: Colors.third,
  },
  header: {
    backgroundColor: Colors.primary,
  },
})

export const DefaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: Colors.white,
  headerTitleStyle: {
    fontFamily: defaultFontFamily,
  },
}


