import {
  SET_EVENTS,
  LOADING_DATA,
  APPLY_EVENT,
  LEAVE_EVENT,
  DELETE_EVENT,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  POST_EVENT,
  SET_EVENT,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
} from "../types";
import axios from "axios";

//get all events
export const getEvents = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/events")
    .then((res) => {
      dispatch({
        type: SET_EVENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_EVENTS,
        payload: [],
      });
      console.log(err);
    });
};

export const getEvent = (eventId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/event/${eventId}`)
    .then((res) => {
      dispatch({
        type: SET_EVENT,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};
//Post event

export const postEvent = (newEvent) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/event", newEvent)
    .then((res) => {
      dispatch({ type: POST_EVENT, payload: res.data });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

//like event
export const applyEvent = (eventId) => (dispatch) => {
  axios
    .get(`/event/${eventId}/apply`)
    .then((res) => {
      dispatch({ type: APPLY_EVENT, payload: res.data });
    })
    .catch((err) => console.log(err));
};

//unlike event
export const leaveEvent = (eventId) => (dispatch) => {
  axios
    .get(`/event/${eventId}/leave`)
    .then((res) => {
      dispatch({ type: LEAVE_EVENT, payload: res.data });
    })
    .catch((err) => console.log(err));
};

export const deletEvent = (eventId) => (dispatch) => {
  axios
    .delete(`/event/${eventId}`)
    .then(() => {
      dispatch({ type: DELETE_EVENT, payload: eventId });
    })
    .catch((err) => console.log(err));
};

//submit comment

export const submitComment = (eventId, commentData) => (dispatch) => {
  axios
    .post(`/event/${eventId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const getUserData = (username) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${username}`)
    .then((res) => {
      dispatch({ type: SET_EVENTS, payload: res.data.events });
    })
    .catch((err) => {
      dispatch({ type: SET_EVENTS, payload: null });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
