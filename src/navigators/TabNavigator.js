import React, { useCallback, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppState, Image, Platform, Pressable, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import TabMenuList from './TabMenuList';
import MenuWithoutTabList from './MenuWithoutTabList';

// pages
import HomePage from '../pages/home';
import VisualDirectorPage from '../pages/visual-director';
import MyVoteDetailPage from '../pages/visual-director/subpage/MyVoteDetail';
import MyPage from '../pages/mypage';
import FollowersPage from '../pages/mypage/subpage/Followers';
import MySettingPage from '../pages/mypage/subpage/MySetting';
import CartPage from '../pages/mypage/subpage/Cart';
import ChangePasswordPage from '../pages/mypage/subpage/ChangePassword';
import PaymentPage from '../pages/product/Payment';
import PaymentHistoryPage from '../pages/product/PaymentHistory';
import InitialPage from '../pages/initialpage';
import IntroductionPage from '../pages/initialpage/subpage/Introduction';
import UploadPage from '../pages/upload/UploadPage';
import StyleFeedPage from '../pages/style-feed';
import SinglePostDetailPage from '../pages/single-post-detail/SinglePostDetail';
import LoginPage from '../pages/auth/Login';
import SignInPage from '../pages/auth/SignIn';
import SignUpPage from '../pages/auth/SignUp';
import FindPasswordPage from '../pages/auth/FindPassword';
import SignInEmail from '../pages/auth/SignInEmail';
import PolicyPage from '../pages/auth/Policy';
import OotdPage from '../pages/ootd';
import ProductDetailPage from '../pages/product-detail/ProductDetail';
import OthersProfilePage from '../pages/others-profile/OthersProfilePage';
import OthersFollowersPage from '../pages/others-profile/subpage/OthersFollowers';
import ProductListPage from '../pages/product/ProductList';
import IMPPaymentPage from '../pages/iamport/IMPPayment';
import ReportMain from '../pages/reports/ReportMain';
import ReportForm from '../pages/reports/ReportForm';
import { MerchandiseDetail, SelectMerchandisePage } from '../pages/merchandises';
import { ChatRoom, ChatRoomList, ImageViewer } from '../pages/chats';
import { ShippingInfoForm, UsedOrderForm, UsedOrderList, UsedSalesList } from '../pages/used-orders';
import tw from 'twrnc';
import { useAtomValue } from 'jotai';
import { unreadCountAtom } from '../stores';
import { useReloadUnreadCount } from '../hooks/useReloadUnreadCount';
import { AccountInfo } from '../pages/mypage/subpage';
import { OthersMerchandisesPage } from '../pages/others-profile/subpage';
import { SearchMainPage } from '../pages/ootd/SearchMainPage';
import SearchResultPage from '../pages/ootd/SearchResultPage';
import { useNavigation } from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import BookmarkPage from '../pages/ootd/template/Bookmark';
// import SearchResultPage from "../pages/ootd/SearchResultPage";

const navigatorOptions = {
  activeTintColor: 'rgba(0, 175, 240,1)',
  inactiveTintColor: 'rgba(0,0,0,1)',
  showLabel: false,
  showIcon: true,
  keyboardHidesTabBar: true,

  style: {
    ...Platform.select({
      android: {
        minHeight: 52,
        elevation: 0,
      },
      ios: {
        minHeight: 52,
        shadowOpacity: 0,
      },
    }),
  },
  tabStyle: {
    minHeight: 52,
    backgroundColor: '#fff',
  },
};

//pageSet
const InitialPages = {
  InitialPage: InitialPage,
};
const IntroductionPages = {
  Introduction: IntroductionPage,
};

const HomePages = {
  Home: HomePage,
};
const OotdPages = {
  Ootd: OotdPage,
};
const VisualDirectorPages = {
  VisualDirector: VisualDirectorPage,
  MyVoteDetail: MyVoteDetailPage,
};
const MyPages = {
  MyPage: MyPage,
  Followers: FollowersPage,
  MySetting: MySettingPage,
  ChangePassword: ChangePasswordPage,
};
const CartPages = {
  Cart: CartPage,
};
const ProductListPages = {
  ProductList: ProductListPage,
};
const OthersProfilePages = {
  OthersProfile: OthersProfilePage,
  OthersFollowers: OthersFollowersPage,
};
const UploadPages = {
  Upload: UploadPage,
};

const StyleFeedPages = {
  StyleFeed: StyleFeedPage,
};

const ProductDetailPages = {
  ProductDetail: ProductDetailPage,
};
const PaymentPages = {
  Payment: PaymentPage,
};
const PaymentHistoryPages = {
  PaymentHistory: PaymentHistoryPage,
};

const SinglePostDetailPages = {
  SinglePostDetail: SinglePostDetailPage,
};

const IMPPaymentPages = {
  IMPPayment: IMPPaymentPage,
};

const AuthPages = {
  SignIn: SignInPage,
  SignUp: SignUpPage,
  SignInEmail: SignInEmail,
  Login: LoginPage,
  FindPassword: FindPasswordPage,
  Policy: PolicyPage,
};

const ReportPages = {
  ReportMain: ReportMain,
  ReportForm: ReportForm,
};

const ChatRoomPages = {
  ChatRoomList: ChatRoomList,
};

// const SelectMerchandisePages = {
//   SelectMerchandisePage: SelectMerchandisePage,
// };

const unwrap = (pageSet) => {
  return Object.keys(pageSet).map((x) => [x, pageSet[x]]);
};

const pages = [
  { name: 'InitialPage', pageSet: unwrap(InitialPages) },
  { name: 'Home', pageSet: unwrap(HomePages) },
  { name: 'Ootd', pageSet: unwrap(OotdPages) },
  { name: 'Upload', pageSet: unwrap(UploadPages) },
  { name: 'VisualDirector', pageSet: unwrap(VisualDirectorPages) },
  { name: 'ChatRoomPages', pageSet: unwrap(ChatRoomPages) },
  { name: 'Introduction', pageSet: unwrap(IntroductionPages) },
  { name: 'AuthPage', pageSet: unwrap(AuthPages) },
  { name: 'StyleFeed', pageSet: unwrap(StyleFeedPages) },
  { name: 'IMPPayment', pageSet: unwrap(IMPPaymentPages) },
  { name: 'MyPage', pageSet: unwrap(MyPages) },
  { name: 'Cart', pageSet: unwrap(CartPages) },
  { name: 'SinglePostDetail', pageSet: unwrap(SinglePostDetailPages) },
  { name: 'OthersProfile', pageSet: unwrap(OthersProfilePages) },
  { name: 'ProductDetail', pageSet: unwrap(ProductDetailPages) },
  { name: 'ProductList', pageSet: unwrap(ProductListPages) },
  { name: 'Payment', pageSet: unwrap(PaymentPages) },
  { name: 'PaymentHistory', pageSet: unwrap(PaymentHistoryPages) },
  { name: 'Reports', pageSet: unwrap(ReportPages) },
  // { name: 'SelectMerchandisesPage', pageSet: unwrap(SelectMerchandisePages) },
];

const BottomTab = createBottomTabNavigator();
function TabNavigator() {
  const reloadUnreadCount = useReloadUnreadCount();
  useEffect(() => {
    reloadUnreadCount();
  }, []);
  useEffect(() => {
    function handleAppStateChange(nextAppState) {
      if (nextAppState === 'active') {
        reloadUnreadCount().then(() => {});
      } else if (nextAppState.match(/inactive|background/)) {
        // 앱이 비활성화됨 또는 백그라운드로 이동함
      }
    }
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
  return (
    <BottomTab.Navigator
      initialRouteName='InitialPage'
      tabBarOptions={navigatorOptions}>
      {pages.map(({ name, pageSet }, index) => {
        const menuData = TabMenuList[name];
        const visibility = !!menuData;
        const menuWithoutTab = MenuWithoutTabList[name];
        const hidingTabBar = !!menuWithoutTab;

        const invisibleOption = {
          tabBarButton: () => null,
          visible: false,
          gestureEnabled: false,
        };

        const hidingBarOption = {
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: false,
          gestureEnabled: false,
        };

        const visibleOption = {
          tabBarIcon: ({ focused }) => {
            const textColor = focused ? 'rgb(0,0,0)' : 'rgba(0,0,0,1)';
            const title = menuData?.title;
            const icon = focused ? menuData?.activeIcon : menuData?.inactiveIcon;

            return (
              <TabIcon
                textColor={textColor}
                icon={icon}
                title={title}
              />
            );
          },
        };

        if (!visibility) {
          return (
            <BottomTab.Screen
              key={`${index}`}
              name={name}
              component={Tabs(pageSet)}
              options={hidingTabBar ? hidingBarOption : invisibleOption}
            />
          );
        } else {
          return (
            <BottomTab.Screen
              key={`${index}`}
              name={name}
              component={Tabs(pageSet)}
              options={visibleOption}
            />
          );
        }
      })}
      <BottomTab.Screen
        name={'BookmarkPage'}
        component={BookmarkPage}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'SelectMerchandisesPage'}
        component={SelectMerchandisePage}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'SearchMainPage'}
        component={SearchMainPage}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'SearchResultPage'}
        component={SearchResultPage}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'MerchandiseDetailPage'}
        component={MerchandiseDetail}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'ChatRoom'}
        component={ChatRoom}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'UsedOrderForm'}
        component={UsedOrderForm}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'UsedOrderList'}
        component={UsedOrderList}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'UsedSalesList'}
        component={UsedSalesList}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'ShippingInfoForm'}
        component={ShippingInfoForm}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'ImageViewer'}
        component={ImageViewer}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: false,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'AccountInfo'}
        component={AccountInfo}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
      <BottomTab.Screen
        name={'OthersMerchandises'}
        component={OthersMerchandisesPage}
        options={{
          tabBarButton: () => null,
          visible: false,
          tabBarVisible: true,
          gestureEnabled: false,
        }}
      />
    </BottomTab.Navigator>
  );
}

const Tabs = (pageSet) =>
  useCallback(() => {
    const Tab = createStackNavigator();
    return (
      <Tab.Navigator>
        {pageSet.map(([pageName, pageComponent], _index) => {
          return (
            <Tab.Screen
              name={pageName}
              key={`${_index}`}
              component={pageComponent}
              options={{ headerShown: false }}
            />
          );
        })}
      </Tab.Navigator>
    );
  }, []);

const TabIcon = ({ textColor, title, icon }) => {
  const navigation = useNavigation();
  const unreadCount = useAtomValue(unreadCountAtom);
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
      }}>
      {icon === TabMenuList.Home.activeIcon || icon === TabMenuList.Home.inactiveIcon ? (
        <Image
          resizeMode={'contain'}
          style={{ width: 24, height: 23, marginBottom: 4 }}
          source={icon}
        />
      ) : icon === TabMenuList.Ootd.activeIcon || icon === TabMenuList.Ootd.inactiveIcon ? (
        <Image
          resizeMode={'contain'}
          style={{ width: 24, height: 24, marginBottom: 5 }}
          source={icon}
        />
      ) : icon === TabMenuList.ChatRoomPages.activeIcon || icon === TabMenuList.ChatRoomPages.inactiveIcon ? (
        <View>
          <Image
            resizeMode={'contain'}
            style={{ width: 22, height: 23, marginBottom: 4 }}
            source={icon}
          />
          {unreadCount > 0 && (
            <View
              style={[
                tw`absolute -top-2 -right-3 bg-red-500 rounded-full w-5 h-5 justify-center items-center`,
                { height: 18, width: 18, backgroundColor: COLOR.PRIMARY },
              ]}>
              <Text style={[tw`text-white font-bold`, { fontSize: 10 }]}>{unreadCount}</Text>
            </View>
          )}
        </View>
      ) : icon === TabMenuList.MyPage.activeIcon || icon === TabMenuList.MyPage.inactiveIcon ? (
        <Image
          resizeMode={'contain'}
          style={{ width: 23, height: 23, marginBottom: 5 }}
          source={icon}
        />
      ) : (
        <Pressable
          onPress={() =>
            navigation.navigate('Upload', {
              params: {
                todo: 'create',
              },
            })
          }>
          <Image
            resizeMode={'contain'}
            style={{ width: 36, height: 36, marginBottom: 3 }}
            source={icon}
          />
        </Pressable>
      )}
      {title && (
        <Text
          style={{
            color: textColor,
            fontSize: 9,
            textAlign: 'center',
            lineHeight: 10,
            letterSpacing: -0.2,
          }}>
          {title}
        </Text>
      )}
    </View>
  );
};
export default TabNavigator;
