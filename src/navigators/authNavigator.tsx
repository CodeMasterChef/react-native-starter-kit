import { createStackNavigator } from 'react-navigation-stack';
import { appRoutes } from './appRoutes';
import LoginScreen from '../screens/loginScreen/loginScreen';
import RegisterScreen from '../screens/registerScreen/registerScreen';

export const AuthNavigator = createStackNavigator({
  [appRoutes.loginScreen]: LoginScreen,
  [appRoutes.registerScreen]: RegisterScreen,
});
