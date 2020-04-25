import { VoucherListScreenStore } from './screens/voucherListScreen/voucherListScreenStore';
import { HomeScreenStore } from './screens/homeScreen/homeScreenStore';
import { NavigationScreenProp } from 'react-navigation';
import { RequestEarnPointScreenStore } from './screens/requestEarnPointScreen/requestEarnPointScreenStore';
import { ScannerScreenStore } from './screens/scannerScreen/scannerScreenStore';
import { UserCodeScreenStore } from './screens/userCodeScreen/userCodeScreenStore';
import { AccountScreenStore } from './screens/accountScreen/accountScreenStore';
import { UserProfileScreenStore } from './screens/userProfileScreen/userProfileScreenStore';
import { BrandProfileScreenStore } from './screens/brandProfileScreen/brandProfileScreenStore';
import { PartnerBrandScreenStore } from './screens/partnerBrandScreen/partnerBrandScreenStore';
import { WalletScreenStore } from './screens/walletScreen/walletScreenStore';
import { ExchangeScreenStore } from './screens/exchangeScreen/exchangeScreenStore';
import { GiftListStore } from './screens/giftScreen/giftList/giftListStore';
import { SearchScreenStore } from './screens/searchScreen/searchScreenStore';
/**
 *  Typescript 2.7.2 included a strict class checking where all properties should be declared in constructor.
 *  So to work around that, just add a bang sign (!) like: name!:string;
 */
class Stores {
    walletScreenStore!: WalletScreenStore;
    partnerBrandScreenStore!: PartnerBrandScreenStore;
    exchangeScreenStore!: ExchangeScreenStore;
    brandProfileScreenStore!: BrandProfileScreenStore | null;
    newGiftStore!: GiftListStore;
    usedAndExpiredStore!: GiftListStore;
    userProfileScreenStore!: UserProfileScreenStore;
    accountScreenStore!: AccountScreenStore;
    userCodeScreenStore!: UserCodeScreenStore;
    scannerScreenStore!: ScannerScreenStore;
    requestEarnPointScreenStore!: RequestEarnPointScreenStore;
    homeScreenStore!: HomeScreenStore;
    voucherListScreenStore!: VoucherListScreenStore;
    searchScreenStore!: SearchScreenStore;
    navigation!: NavigationScreenProp<any>;
    
}

export const stores = new Stores();