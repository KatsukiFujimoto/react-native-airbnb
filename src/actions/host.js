import { HOST } from '../constants';
import { normalizeRooms, normalizeReservations } from '../utils';

export const SET_LISTINGS = 'SET_LISTINGS';
export const SET_RESERVATIONS = 'SET_RESERVATIONS';

export function setListings(rooms) {
  return {
    type: SET_LISTINGS,
    rooms,
  }
}

export function setReservations(reservations) {
  return {
    type: SET_RESERVATIONS,
    reservations,
  }
}

export function getListings() {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken;

    return fetch(`${HOST}/api/v1/listings?access_token=${accessToken}`)
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(setListings(normalizeRooms(json.rooms)));
        } else {
          alert(json.error);
        }
      })
      .catch(e => alert(e));
  }
}

export function getReservations(roomId) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken;

    return fetch(`${HOST}/api/v1/rooms/${roomId}/reservations?access_token=${accessToken}`)
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(setReservations(normalizeReservations(json.reservations)));
        } else {
          alert(json.error);
        }
      })
      .catch(e => alert(e));
  }
}

export function changeReservation(roomId, reservationId, approve) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken;
    let url = `${HOST}/api/v1/reservations/${reservationId}/`;
    if (approve) {
      url += 'approve';
    } else {
      url += 'decline';
    }
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        access_token: accessToken,
      }),
      headers: { "content-type": "application/json" }
    })
    .then(response => response.json())
    .then(json => {
      if (json.is_success) {
        dispatch(getReservations(roomId));
      } else {
        alert(json.error);
      }
    })
    .catch(e => alert(e));
  }
}