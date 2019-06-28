import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StatusBar, View, BackHandler } from 'react-native';
import { addNavigationHelpers, StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';

import ExploreTab from '../components/MainScreen/ExploreTab';
import ProfileTab from '../components/MainScreen/ProfileTab';
import CalendarTab from '../components/HostScreen/CalendarTab';
import RoomScreen from '../components/RoomScreen';
import AuthenticationScreen from '../components/AuthenticationScreen';
import FilterModal from '../components/FilterModal';
import BookingModal from '../components/BookingModal';
import CalendarModal from '../components/CalendarModal';

import Icon from 'react-native-vector-icons/Ionicons';

const tabConfig = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    activeTintColor: '#FF5A60',
    inactiveTintColor: '#3A3A3A',
    labelStyle: {
      fontSize: 10,
      fontWeight: 'bold'
    },
    tabStyle: {
      paddingBottom: 0,
      borderTopWidth: 1,
      borderTopColor: 'lightgray',
      backgroundColor: 'white'
    },
    style: {
      backgroundColor: 'white',
    },
  },
}

export const MainScreen = TabNavigator({
  Explore: {
    screen: ExploreTab,
    navigationOptions: {
      tabBarLabel: 'EXPLORE',
      tabBarIcon: ({focused, tintColor}) => <Icon name={'ios-search'} size={30} color={tintColor}/>
    }
  },
  Profile: {
    screen: ProfileTab,
    navigationOptions: {
      tabBarLabel: 'PROFILE',
      tabBarIcon: ({focused, tintColor}) => <Icon name={'ios-person'} size={30} color={tintColor}/>
    }
  },
}, tabConfig);

export const CalendarStack = StackNavigator({
  CalendarTab: {
    screen: CalendarTab,
    navigationOptions: {
      header: null,
    }
  },
  CalendarModal: {
    screen: CalendarModal,
    navigationOptions: (props) => ({
      title: props.navigation.state.params.item.title,
    })
  },
});

export const HostScreen = TabNavigator({
  Calendar: {
    screen: CalendarStack,
    navigationOptions: {
      tabBarLabel: 'CALENDAR',
      tabBarIcon: ({focused, tintColor}) => <Icon name={'ios-calendar'} size={30} color={tintColor}/>
    }
  },
  Profile: {
    screen: ProfileTab,
    navigationOptions: {
      tabBarLabel: 'PROFILE',
      tabBarIcon: ({focused, tintColor}) => <Icon name={'ios-person'} size={30} color={tintColor}/>
    }
  },
}, {
  ...tabConfig,
  tabBarOptions: {
    ...tabConfig.tabBarOptions,
    activeTintColor: '#007b7f'
  }
});

export const AppNavigator = StackNavigator({
  Authentication: {
    screen: AuthenticationScreen,
    navigationOptions: {
      header: null,
    }
  },
  Main: {
    screen: MainScreen,
    navigationOptions: {
      header: null,
    }
  },
  Room: {
    screen: RoomScreen,
    navigationOptions: (props) => ({
      title: props.navigation.state.params.item.title,
    })
  },
  Filter: {
    screen: FilterModal,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#007b7f',
        elevation: 0,
      },
      headerTintColor: '#e2e2e2',
    }
  },
  Booking: {
    screen: BookingModal,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#007b7f',
        elevation: 0,
      },
      headerTintColor: '#e2e2e2',
    }
  },
  Host: {
    screen: HostScreen,
    navigationOptions: {
      header: null,
    }
  },
});

class AppWithNavigationState extends React.Component {

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  }

  render() {
    const { dispatch, nav } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#007b7f"/>
        <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

const mapDispatchToProps = dispatch => ({
  dispatch: (action) => dispatch(action),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState);