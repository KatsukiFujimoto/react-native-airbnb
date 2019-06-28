import { REHYDRATE } from 'redux-persist/constants';

import { SET_ACCESS_TOKEN, SET_PROFILE, SET_PAYMENT } from '../actions/user';

const initialState = {
  accessToken: null,
  profile: null,
  payment: null,
};

export default function(state = initialState, action) {
  if (action.type === SET_ACCESS_TOKEN) {
    return {
      ...state,
      accessToken: action.accessToken
    }
  }

  if (action.type === SET_PROFILE) {
    return {
      ...state,
      profile: action.profile
    }
  }

  if (action.type === SET_PAYMENT) {
    return {
      ...state,
      payment: action.payment
    }
  }

  if (action.type === REHYDRATE) {
    const savedUser = action.payload.user || state;
    return {
      ...state,
      accessToken: savedUser.accessToken,
      profile: savedUser.profile,
      payment: savedUser.payment,
    };
  }

  return state;
};