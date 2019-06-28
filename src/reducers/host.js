import { SET_LISTINGS, SET_RESERVATIONS } from '../actions/host';

const initialState = {
  listings: [],
  reservations: [],
};

export default function(state = initialState, action) {
  if (action.type === SET_LISTINGS) {
    return {
      ...state,
      listings: action.rooms
    }
  }

  if (action.type === SET_RESERVATIONS) {
    return {
      ...state,
      reservations: action.reservations
    }
  }

  return state;
};