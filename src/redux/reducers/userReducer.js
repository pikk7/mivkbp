import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHETICATED,
  LOADING_USER,
  APPLY_EVENT,
  LEAVE_EVENT,
  MARK_NOTIFICATIONS_READ,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  // user: null,
  credentials: {
    applies: [],
    notifications: [],
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHETICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return { ...state, loading: true };
    case APPLY_EVENT:
      return {
        ...state,
        applies: [
          ...state.applies,
          {
            username: state.credentials.username,
            eventId: action.payload.eventId,
          },
        ],
      };
    case LEAVE_EVENT:
      return {
        ...state,
        applies: state.applies.filter(
          (like) => like.eventId !== action.payload.eventId
        ),
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state,
      };
    default:
      return state;
  }
}
