import { HOST } from '../constants';
import { resetRoute } from './nav';
import { normalizeProfile } from '../utils';
import { BackHandler } from 'react-native';

export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
export const SET_PROFILE = 'SET_PROFILE';
export const SET_PAYMENT = 'SET_PAYMENT'

export function setAccessToken(accessToken) {
  return {
    type: SET_ACCESS_TOKEN,
    accessToken,
  };
}

export function setProfile(profile) {
  return {
    type: SET_PROFILE,
    profile,
  };
}

export function setPayment(payment) {
  return {
    type: SET_PAYMENT,
    payment,
  };
}

export function loginWithFacebook(facebookAccessToken) {
  return (dispatch) => {
    return fetch(`${HOST}/api/v1/facebook`, {
      method: 'POST',
      body: JSON.stringify({
        facebook_access_token: facebookAccessToken,
      }),
      headers: { "content-type": "application/json" },
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);

      if (json.access_token) {
        dispatch(setAccessToken(json.access_token));
        dispatch(setProfile(normalizeProfile(json.email, json.fullname, json.image)));
        dispatch(setPayment(!!json.stripe_id));
        dispatch(resetRoute({ routeName: 'Main' }));
      } else {
        alert(json.error);
      }
    })
    .catch(e => alert(e));
  };
}

export function logout() {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken;
    dispatch(setAccessToken(null));
    dispatch(setProfile(null));
    dispatch(setPayment(null));

    fetch(`${HOST}/api/v1/logout?access_token=${accessToken}`)
    .then(response => BackHandler.exitApp())
    .catch(e => BackHandler.exitApp());
  };
}

export function addPayment(stripeToken) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken;
    return fetch(`${HOST}/api/v1/payment`, {
      method: 'POST',
      body: JSON.stringify({
        stripe_token: stripeToken,
        access_token: accessToken,
      }),
      headers: {
        "content-type": "application/json",
      }
    })
    .then(response => response.json())
    .then(json => {
      if (json.is_success) {
        dispatch(setPayment(true));
      } else {
        alert(json.error);
      }
    })
    .catch(e => alert(e));
  }
}