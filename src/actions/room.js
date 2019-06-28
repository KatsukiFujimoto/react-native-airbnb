import { HOST } from '../constants';
import { normalizeRooms, normalizeRoom } from '../utils';
import { navigate } from './nav';

export const SET_ROOMS = 'SET_ROOMS';
export const SET_ROOM = 'SET_ROOM';
export const SET_FILTER = 'SET_FILTER';

export function setRooms(rooms) {
  return {
    type: SET_ROOMS,
    rooms
  }
}

export function setRoom(room) {
  return {
    type: SET_ROOM,
    room
  }
}

export function setFilter(filter) {
  return {
    type: SET_FILTER,
    filter
  }
}

export function getRooms() {
  return (dispatch, getState) => {
    const filter = getState().room.filter;

    return fetch(`${HOST}/api/v1/rooms?address=${filter.address}&start_date=${filter.startDate}&end_date=${filter.endDate}`)
    .then(response => response.json())
    .then(json => {
      console.log("getRooms", json);

      if (json.is_success) {
        dispatch(setRooms(normalizeRooms(json.rooms)));
      } else {
        alert(json.error);
      }
    })
    .catch(e => alert(e));
  }
}

export function getRoom(roomId) {
  return (dispatch) => {
    return fetch(`${HOST}/api/v1/rooms/${roomId}`)
    .then(response => response.json())
    .then(json => {
      console.log("get a single room:", json);

      if (json.is_success) {
        dispatch(setRoom(normalizeRoom(json.room)));
      } else {
        alert(json.error);
      }
    })
    .catch(e => alert(e));
  }
}

export function bookRoom(roomId, startDate, endDate) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken;

    return fetch(`${HOST}/api/v1/reservations`, {
      method: 'POST',
      body: JSON.stringify({
        room_id: roomId,
        start_date: startDate,
        end_date: endDate,
        access_token: accessToken
      }),
      headers: {
        "content-type": "application/json"
      }
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      if (json.is_success) {
        alert("Booked successfully");
        dispatch(navigate({ routeName: 'Explore' }));
      } else {
        alert(json.error);
      }
    })
    .catch(e => alert(e));
  }
}