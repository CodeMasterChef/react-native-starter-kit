import { AuthNavigator } from './authNavigator';
import { appRoutes } from './appRoutes';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './mainTabNavigator';

export default createAppContainer(
    createSwitchNavigator({
        [appRoutes.mainTabNavigator]: MainTabNavigator,
        [appRoutes.authNavigator]: AuthNavigator,
    },
        {
            initialRouteName: appRoutes.authNavigator,
        }
    )

);
