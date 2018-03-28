export const INIT_OUTPUT_LIST = 'INIT_OUTPUT_LIST'
export const LOAD_OUTPUT_FILE = 'LOAD_OUTPUT_FILE'
const SET_OUTPUT_LIST = 'SET_OUTPUT_LIST'

export function setOutputList (data) {
  return {
    type: SET_OUTPUT_LIST,
    data
  }
}

export function initOutputList (data) {
  return {
    type: INIT_OUTPUT_LIST,
    data
  }
}

export function loadOutputFile (data) {
  return {
    type: LOAD_OUTPUT_FILE,
    data
  }
}

const initialState = {
  items: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_OUTPUT_LIST: {
      return {items: action.data}
    }
  }
  return state
}
