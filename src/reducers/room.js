import { SET_ROOMS, SET_ROOM, SET_FILTER, setFilter } from '../actions/room';

const initialState = {
  rooms: [],
  room: null,
  filter: {
    address: '',
    startDate: '',
    endDate: ''
  }
};

export default function(state = initialState, action) {
  if (action.type === SET_ROOMS) {
    return {
      ...state,
      rooms: action.rooms
    }
  }

  if (action.type === SET_ROOM) {
    return {
      ...state,
      room: action.room
    }
  }

  if (action.type === SET_FILTER) {
    return {
      ...state,
      filter: action.filter
    }
  }

  return state;
}