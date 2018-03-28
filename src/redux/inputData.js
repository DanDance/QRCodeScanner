export const INIT_INPUT_DATA = 'INIT_INPUT_DATA'
export const BUILD_OUTPUT = 'BUILD_OUTPUT'
const SET_INPUT_DATA = 'SET_INPUT_DATA'

export function setInputData (data) {
  return {
    type: SET_INPUT_DATA,
    data
  }
}

export function initInputData () {
  return {
    type: INIT_INPUT_DATA
  }
}

export function buildOutput (data) {
  return {
    type: BUILD_OUTPUT,
    data
  }
}

const initialState = {
  items: {}
}

export default function (state = {initialState}, action) {
  switch (action.type) {
    case SET_INPUT_DATA:
      return {items: {...action.data}}
  }
  return state
}
