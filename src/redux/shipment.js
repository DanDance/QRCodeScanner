import {UID} from '../constants/inputDataFields'
const PUSH_SHIPMENT_ITEM = 'PUSH_SHIPMENT_ITEM'
const DELETE_SHIPMENT_ITEM_BY_INDEX = 'DELETE_SHIPMENT_ITEM_BY_INDEX'
const CHANGE_COUNT_ITEM_BY_INDEX = 'CHANGE_COUNT_ITEM_BY_INDEX'
const CLEAR_SHIPMENT = 'CLEAR_SHIPMENT'
const SET_SHIPMENT = 'SET_SHIPMENT'

export function pushShipmentItem (data) {
  return {
    type: PUSH_SHIPMENT_ITEM,
    data
  }
}

export function deleteShipmentItemByIndex (data) {
  return {
    type: DELETE_SHIPMENT_ITEM_BY_INDEX,
    data
  }
}

export function changeItemCountByIndex (data) {
  return {
    type: CHANGE_COUNT_ITEM_BY_INDEX,
    data
  }
}

export function clearShipment () {
  return {
    type: CLEAR_SHIPMENT,
  }
}

export function setShipment (data) {
  return {
    type: SET_SHIPMENT,
    data
  }
}

const initialState = {
  items: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case PUSH_SHIPMENT_ITEM: {
      let newState = {...state}
      let hasItem = false
      newState.items.forEach((item, i) => {
        if (item[UID] === action.data[UID]) {
          state.items[i].count += action.data.count
          hasItem = true
        }
      })
      if (!hasItem) newState.items.push(action.data)
      return newState
    }
    case DELETE_SHIPMENT_ITEM_BY_INDEX: {
      let newState = {...state}
      newState.items.splice(action.data, 1)
      return newState
    }
    case CHANGE_COUNT_ITEM_BY_INDEX: {
      let newState = {...state}
      newState.items[action.data.i].count = action.data.count
      return newState
    }
    case CLEAR_SHIPMENT: {
      let newState = {...state}
      newState.items = []
      return newState
    }
    case SET_SHIPMENT: {
      let newState = {...state}
      newState.items = action.data
      return newState
    }
  }
  return state
}
