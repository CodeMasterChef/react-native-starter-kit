import { observable } from 'mobx';
import I18n from 'react-native-i18n';
import { NavigationScreenProp } from 'react-navigation';
import { appRoutes } from '../../navigators/appRoutes';


export class FoodItemStore {


    @observable food = {} as any;

    onPressItem = (navigation: NavigationScreenProp<any>) => {
        navigation.navigate(appRoutes.foodDetailScreen, { food: this.food })

    }



}