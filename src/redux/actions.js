import {
  ADD_TODO,
  TOGGLE_TODO,
  SET_FILTER,
  CREATE_ROOM_REQUEST,
  CREATE_ROOM_SUCCESS,
  CREATE_ROOM_FAILURE,
  JOIN_ROOM_REQUEST,
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  JOIN_USER_REQUEST,
  JOIN_USER_SUCCESS,
  JOIN_USER_FAILURE
} from "./actionTypes";
import Axios from "axios";

let nextTodoId = 0;

export const addTodo = content => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content
  }
});

export const toggleTodo = id => ({
  type: TOGGLE_TODO,
  payload: {
    id
  }
});

export const setFilter = filter => ({
  type: SET_FILTER,
  payload: {
    filter
  }
});

export const createRoom = form => (dispatch, getState) => {
  dispatch({
    type: CREATE_ROOM_REQUEST,
  })
  Axios.post(`http://localhost:3000/rooms`, {
    password: form.password,
    roomname: form.roomname
  }).then(
    (res) => {// process after creating room finished
      dispatch({type: CREATE_ROOM_SUCCESS})
      alert("CREATING ROOM SUCCESS, Room Id : "+ res.data.id)
    },
    (error) => {
      dispatch({type: CREATE_ROOM_FAILURE, error: error})
      alert("CREATING ROOM FAILURE.")
    })
};

export const joinRoom = (form, props) => (dispatch, getState) => {
  dispatch({
    type: JOIN_ROOM_REQUEST,
  })
  Axios.post(`http://localhost:3000/rooms/${form.roomId}`, {
    password: form.password
  }).then(
    (res) => {// process after joining room finished
      dispatch({type: JOIN_ROOM_SUCCESS, roomId: form.roomId})
      alert("JOIN ROOM SUCCESS. now connecting...")
      props.history.push(`/rooms/${form.roomId}`)
    },
    (error) => {
      dispatch({type: JOIN_ROOM_FAILURE, error: error})
    alert("JOINING ROOM FAILURE. 정확하지 않은 입력입니다.")
  })
};

export const createUser = form => (dispatch, getState) => {
  dispatch({
    type: CREATE_USER_REQUEST,
  })
  let {roomId} = getState().joinRoom
  Axios.post(`http://localhost:3000/rooms/${roomId}/people`, {
    name: form.username
  }).then(
    (res) => {// process after creating user finished
      dispatch({type: CREATE_USER_SUCCESS})
      alert("CREATING USER SUCCESS, User Name : "+ form.username)
    },
    (error) => {dispatch({type: CREATE_USER_FAILURE, error: error})
    alert("CREATING USER FAILURE. 이미 존재하는 이름입니다.")
  })
  
};

export const joinUser = (form, props) => (dispatch, getState) => {
  dispatch({
    type: JOIN_USER_REQUEST,
  })
  debugger
  let {roomId} = getState().joinRoom
  Axios.get(`http://localhost:3000/rooms/${roomId}/people/${form.username}`).then(
    (res) => {// process after joining user finished
      dispatch({type: JOIN_USER_SUCCESS, username: form.username})
      alert("JOIN USER SUCCESS. now connecting...")
      props.history.push(`${props.history.location.pathname}/people/${form.username}`)
    },
    (error) => {
      dispatch({type: JOIN_USER_FAILURE, error: error})
      alert("JOIN USER FAILURE. 존재하지 않는 이름입니다.")
    })
};