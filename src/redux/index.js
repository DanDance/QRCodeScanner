import { combineReducers } from 'redux'

import shipment from './shipment'
import inputData from './inputData'
import workingDirectory from './workingDirectory'
import outputList from './outputList'

const appReducer = combineReducers({
  shipment,
  inputData,
  workingDirectory,
  outputList
})

export default appReducer
