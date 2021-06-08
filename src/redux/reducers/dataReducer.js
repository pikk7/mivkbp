import {
  SET_EVENTS,
  APPLY_EVENT,
  LEAVE_EVENT,
  LOADING_DATA,
  DELETE_EVENT,
  POST_EVENT,
  SET_EVENT,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  events: [],
  event: {},
  loading: false,
};
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  let index;
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload,
        loading: false,
      };
    case SET_EVENT:
      return {
        ...state,
        event: action.payload,
      };
    case APPLY_EVENT:
    case LEAVE_EVENT:
      index = state.events.findIndex(
        (event) => event.Id === action.payload.eventId
      );
      state.events[index] = action.payload;
      if (state.event.eventId === action.payload.eventId) {
        state.event = action.payload;
      }
      return {
        ...state,
      };
    case DELETE_EVENT:
      index = state.events.findIndex(
        (event) => event.eventId === action.payload
      );
      state.events.splice(index, 1);
      return { ...state };
    case POST_EVENT:
      return {
        ...state,
        events: [action.payload, ...state.events],
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        event: {
          ...state.event,
          comments: [action.payload, ...state.event.comments],
        },
      };
    default:
      return state;
  }
}
