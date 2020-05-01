import { createStackNavigator } from 'react-navigation-stack';
import { appRoutes } from './appRoutes';
import LoginScreen from '../screens/loginScreen/loginScreen';

export const AuthNavigator = createStackNavigator({
  [appRoutes.loginScreen]: LoginScreen,
});
