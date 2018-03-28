import { all } from 'redux-saga/effects'

import inputData from './inputData'

export default function * rootSaga () {
  yield all([
    inputData()
  ])
}
