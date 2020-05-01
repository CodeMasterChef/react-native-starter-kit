import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Linking,
} from 'react-native';
import AppNavigator from './navigators/appNavigator';
import { defaultStyles } from './commons/defaultStyles';
import I18n from 'react-native-i18n';
import { en } from './assets/languages/en';
import { vi } from './assets/languages/vi';
import { observer } from 'mobx-react';
import { appStore } from './appStore';
import Toast from './components/toast/index.js';
import { Colors } from './commons/colors';
import { defaultToastPosition, processCircleSnailSpinDuration, deviceWidth, deviceHeight } from './commons/constant';
import IntroScreen from './screens/introScreen/introScreen';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import NetInfo from "@react-native-community/netinfo";
import NetworkErrorPanel from './components/networkErrorPanel/networkErrorPanel';
import { NavigationScreenProp } from 'react-navigation';
import { appRoutes, deepLinkRoutes } from './navigators/appRoutes';
import { pointApi } from './api/pointApi';
import { StatusCodeEnum } from './enum/statusCodeEnum';
import { stores } from './stores';
import Modal from 'react-native-modal';
import ScannerScreen from './screens/scannerScreen/scannerScreen';
import DeepLinkSelect from './components/deepLinkSelect/deepLinkSelect';
import { localAppStorageHelper } from './helpers/localAppStorageHelper';

I18n.fallbacks = true;
I18n.locale = 'vi-VN';
I18n.translations = {
  en: en,
  vi: vi,
};

interface Props {
  navigation: NavigationScreenProp<any>,
}

@observer
export default class App extends Component<Props> {

  state = {
    isConnectedInternet: true,
  }

  networkSubscribe!: any;

  constructor(props: Props) {
    super(props);
    this.networkSubscribe = NetInfo.addEventListener(state => {
      this.setState({ isConnectedInternet: state.isConnected });
    });

  }

  componentWillUnmount() {
    this.networkSubscribe();
    Linking.removeEventListener('url', () => { });
  }

  componentDidMount() {
    // Handle deep link when the app is killed and open first time.
    // Deep linking don't work on ios simulator when "Debug JS remotely" is enabled, but work well when the debug is disabled.
    Linking.getInitialURL().then((url) => {
      this.handleDeepLink(url);
    });

    // Handle deep link when the app is on foreground or background.
    Linking.addEventListener('url', (event) => {
      this.handleDeepLink(event.url);
    });
  }

  handleDeepLink = async (url: string | null) => {
    if (!url) {
      return;
    }
    // The URL will have format: loyal-one-user-mobile://?a=all&id=a9901433-e4f6-4b00-88c7-65610ebb676b
    const linkAndParams = url!.split('//');
    const paramString = linkAndParams[1];
    const params = paramString ? JSON.parse('{"' + decodeURI(paramString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}') : null;
    const routeName = params.a;
    const brandId = params.id;

    if (deepLinkRoutes.hasOwnProperty(routeName)) {
      if (routeName === deepLinkRoutes.all) {
        // if account is not login, we don't show option modal, we need to mark it is open by deep link and open options modal after login successfully.
        const accessToken = await localAppStorageHelper.getAccessToken();
        if (accessToken) {
          appStore.deepLinkSelectStore.setBrandId(brandId);
          appStore.deepLinkSelectStore.isVisible = true;
        } else {
          await localAppStorageHelper.setSavedDeepLinkBrandId(brandId);
        }

      }
      else if (routeName === deepLinkRoutes.point) {
        if (params.id) {
          // const brandId = params.id;
          // const response = await pointApi.getBrandDetails(brandId);
          // if (response.status_code === StatusCodeEnum.success) {
          //   const brand = response.data;
          //   // const store = new RequestEarnPointScreenStore(brand);
          //   // this.navigate(appRoutes.requestEarnPointScreen, { [requestEarnPointScreenParams.store]: store });
          //   // With react-navigation, we can not navigate when the current route is requestEarnPointScreen, 
          //   // so that we need to update data on the store
          //   stores.requestEarnPointScreenStore?.setBrand(brand);
          // }
        }
      }
    } else if (appRoutes.hasOwnProperty(routeName)) {
      this.navigate(routeName, params);
    }
  }

  private navigate = (routeName: string, params: any) => {
    // The this.props.navigation is always null. 
    // When getInitialURL, appStore.navigation will be also null. 
    if (stores.navigation) {
      stores.navigation?.navigate(routeName, params);
    } else {
      // Fix the bug: appStore.navigation is null when getInitialURL
      setTimeout(() => {
        stores.navigation?.navigate(routeName, params);
      }, 2000);
    }
  }

  render() {
    return (
      <View style={defaultStyles.container}>
        <StatusBar barStyle='light-content' />
        {
          appStore.isLoading ?
            <LinearGradient
              colors={['#210044', '#3A0069', '#3A0069']} style={styles.loadingContainer}>
              <Progress.CircleSnail
                size={50}
                color={[Colors.white, Colors.highlight]}
                spinDuration={processCircleSnailSpinDuration}
              />
            </LinearGradient>
            :
            <View style={defaultStyles.container}>
              {
                !(this.state.isConnectedInternet) && <NetworkErrorPanel />
              }
              {
                <AppNavigator />
              }
            </View>
        }

        <DeepLinkSelect store={appStore.deepLinkSelectStore} />

        <Modal
          isVisible={appStore.isVisibleScannerModal}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          style={defaultStyles.modal}
        >
          {
            appStore.isVisibleScannerModal &&
            <ScannerScreen />
          }
        </Modal>

        <Toast ref={(ref: Toast) => {
          if (ref && appStore.successToast === undefined) {
            appStore.successToast = ref;
          }
        }}
          position='center'
          showCheckIcon={true}
          style={defaultStyles.successCenterToast}
          textStyle={styles.toastText}
        />

        <Toast ref={(ref: Toast) => {
          if (ref && appStore.errorToast === undefined) {
            appStore.errorToast = ref;
          }
        }}
          position='center'
          showErrorIcon={true}
          style={defaultStyles.errorCenterToast}
          textStyle={styles.toastText}
        />

        <Toast ref={(ref: Toast) => {
          if (ref && appStore.warningToast === undefined) {
            appStore.warningToast = ref;
          }
        }}
          position='top'
          positionValue={defaultToastPosition}
          style={defaultStyles.warningToast}
          textStyle={styles.toastText} />

        <Toast ref={(ref: Toast) => {
          if (ref && appStore.bottomInfoToast === undefined) {
            appStore.bottomInfoToast = ref;
          }
        }}
          position='bottom'
          positionValue={70}
          style={defaultStyles.grayToast}
          textStyle={{
            color: Colors.white,
          }} />

        <Toast ref={(ref: Toast) => {
          if (ref && appStore.centerInfoToast === undefined) {
            appStore.centerInfoToast = ref;
          }
        }}
          position='center'
          style={defaultStyles.successCenterToast}
          showWarningIcon={true}
          textStyle={styles.toastText} />
      </View>

    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    ...defaultStyles.text,
    color: Colors.white,
    textAlign: 'center',
  }
})



console.disableYellowBox = true;