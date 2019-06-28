import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import { logout, addPayment } from '../../actions/user';
import { resetRoute } from '../../actions/nav';
import stripe from 'tipsi-stripe'
import Config from 'react-native-config';

stripe.setOptions({
  publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
  androidPayMode: 'test',
});

const options = {
  smsAutofillDisabled: true,
  requiredBillingAddressFields: 'full',
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#555',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 80,
  },
  menuButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
    paddingVertical: 20,
  },
  menuButtonText: {
    fontSize: 20,
  },
});

class ProfileTab extends React.Component {

  addPayment = async() => {
    const token = await stripe.paymentRequestWithCardForm(options);
    this.props.addPayment(token.tokenId);
  }

  switchType() {
    const { resetRoute, firstRouteName } = this.props;

    if (firstRouteName === 'Main') {
      resetRoute({ routeName: 'Host' });
    } else {
      resetRoute({ routeName: 'Main' });
    }
  }

  render() {
    const profile = this.props.profile || {}
    const { payment, firstRouteName } = this.props;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.profile}>
          <Text style={styles.name}>{profile.fullname}</Text>
          <Image style={styles.avatar} source={{ uri:  profile.avatar }} />
        </View>

        <TouchableOpacity
          onPress={ () => this.addPayment().catch(e => console.log(e)) }
          style={styles.menuButton}>
          <Text>{`${payment ? 'Update' : 'Add'}`} Your Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ () => this.switchType() } style={styles.menuButton}>
          <Text>Switch To {`${firstRouteName === 'Main' ? 'Host' : 'Guest'}`}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ () => this.props.logout() } style={styles.menuButton}>
          <Text>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.user.profile,
  payment: state.user.payment,
  firstRouteName: state.nav.routes[0].routeName,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  addPayment: (stripeToken) => dispatch(addPayment(stripeToken)),
  resetRoute: (route) => dispatch(resetRoute(route)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileTab);