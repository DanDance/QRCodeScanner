import { all, select, put, takeEvery } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import XLSX from 'xlsx'
import moment from 'moment'

import {
  INIT_INPUT_DATA,
  BUILD_OUTPUT,
  setInputData
} from '../redux/inputData'
import {
  INIT_OUTPUT_LIST,
  LOAD_OUTPUT_FILE,
  setOutputList
} from '../redux/outputList'
import {
  clearShipment,
  setShipment
} from '../redux/shipment'
import {
  ORDER,
  UID,
  MARK
} from '../constants/inputDataFields'
import { setWorkingDirectory } from '../redux/workingDirectory'

function sheetToWorkbook (sheet, opts) {
  let n = opts && opts.sheet ? opts.sheet : 'Sheet1'
  let sheets = {}
  sheets[n] = sheet
  return {SheetNames: [n], Sheets: sheets}
}

function aoaToWorkbook (data, opts) {
  return sheetToWorkbook(XLSX.utils.aoa_to_sheet(data, opts), opts)
}

const STORAGE = 'file:///storage'
let PATH = 'file:///emulated/0'
const DEFAULT_WORKING_FOLDER_NAME = '/Scanned QR'
const DEFAULT_OUTPUT_FOLDER_NAME = '/Outputs'
const DEFAULT_INPUT_FOLDER_NAME = '/Input'
let workingDirectory = null

function alertNoData () {
  alert('Не удалось найти данные в папке')
}

const PATHS = [
  STORAGE + '/emulated/0',
  STORAGE + '/sdcard0',
  STORAGE + '/sdcard1'
]

function * initWorkingDirectory (i = 0) {
  function * checkDirectory () {
    workingDirectory = PATHS[i] + DEFAULT_WORKING_FOLDER_NAME + DEFAULT_INPUT_FOLDER_NAME
    let pathExists = yield RNFS.exists(workingDirectory)
    if (pathExists) {
      workingDirectory = PATHS[i] + DEFAULT_WORKING_FOLDER_NAME
      yield put(setWorkingDirectory(workingDirectory))
    } else throw new Error('Directory doesn\'t exists')
  }
  try {
    yield checkDirectory()
  } catch (e) {
    workingDirectory = null
    if (PATH.length >= i + 1) yield initWorkingDirectory(i + 1)
  }
}

function * initInputData (action) {
  yield initWorkingDirectory()
  if (!workingDirectory) {
    alertNoData(workingDirectory)
  } else {
    let directory = yield RNFS.readDir(workingDirectory + DEFAULT_INPUT_FOLDER_NAME)
    if (!directory.length) alertNoData(workingDirectory + DEFAULT_INPUT_FOLDER_NAME)
    else if (directory.length > 1) alert('В директории Inputs должен быть только один файл')
    else {
      const supportedInputExtensions = ['xls', 'xlsx']
      const inputFileName = directory[0].name
      const splitName = inputFileName.split('.')
      const fileExt = splitName[splitName.length - 1]
      if (supportedInputExtensions.indexOf(fileExt) === -1) alert('Неподдерживаемый формат данных: ' + fileExt)
      else {
        let input
        try {
          input = yield RNFS.readFile('file://' + directory[0].path, 'base64')
        } catch (e) {
          console.log(e)
          alert('Не удалось прочесть файл данных')
        }
        if (input) {
          const workbook = XLSX.read(input, {type: 'base64'})
          const fileData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
          if (fileData && fileData.length) {
            let inputData = {}
            fileData.forEach(item => {
              inputData[item[UID]] = item
            })
            yield put(setInputData(inputData))
          }
        }
      }
    }
  }
}

function * buildOutput (action) {
  let shipmentItems = (yield select()).shipment.items
  if (!shipmentItems.length) return alert('Нет данных для выгрузки')
  const date = moment().format('DD.MM HH:mm')
  const fileName = date + ` car_${action.data}` + '.xlsx'
  let sheetData = [[ORDER, MARK, 'Количество']]
  shipmentItems.forEach(item => {
    sheetData.push([item[ORDER], item[MARK], item.count])
  })
  let wb = aoaToWorkbook(
    sheetData,
    {sheet: date})
  let wbout = XLSX.write(wb, {type: 'binary'})
  try {
    const success = yield RNFS.writeFile(workingDirectory + DEFAULT_OUTPUT_FOLDER_NAME + '/' + fileName, wbout, 'ascii')
    alert('Файл успешно записан')
    yield put(clearShipment())
  } catch (e) {
    console.log(e)
    alert('Ошибка при записи файла')
  }
}

function * testData () {
  RNFS.readDir(FILE_PATH)
    .then((success) => {
      let wb = aoaToWorkbook(
        [
          ['aff', 'bfff', 'cff'],
          [1, 2, 3],
          ['asd', 'asdf', 'zzz', '123123123']
        ],
        {sheet: 'Test sheet'})
      let wbout = XLSX.write(wb, {type: 'binary'})
      RNFS.writeFile(FILE_PATH + FILE_NAME, wbout, 'ascii')
        .then((success) => {
          console.log('FILE WRITTEN!')
        })
        .catch((err) => {
          console.log(err.message)
        })
      // RNFS.readFile(FILE_PATH + FILE_NAME, 'base64')
      //   .then(res => {
      //     const workbook = XLSX.read(res, {type: 'base64'})
      //     const file = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      //     console.log(file)
      //   })
      // success.forEach(item => console.log(item.name))
    })
    .catch((err) => {
      console.log(err.message)
    })
}

function * initOutputList () {
  const outputFiles = yield RNFS.readdir(workingDirectory + DEFAULT_OUTPUT_FOLDER_NAME)
  yield put(setOutputList(outputFiles))
}

function * loadOutputFile (action) {
  const outputFile = yield RNFS.readFile(workingDirectory + DEFAULT_OUTPUT_FOLDER_NAME + '/' + action.data, 'base64')
  const workbook = XLSX.read(outputFile, {type: 'base64'})
  const fileData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
  let inputData = (yield select()).inputData.items
  let ok = true
  let shipment = fileData.map(item => {
    let inputItem = inputData[item[ORDER] + '_' + item[MARK]]
    if (!inputItem) {
      ok = false
      return {}
    }
    console.log(inputItem)
    inputItem.count = +item['Количество']
    return inputItem
  })
  if (!ok) return alert('Не удалось найти элемент из файла в исходных данных.')
  yield put(setShipment(shipment))
  console.log(shipment)
}

function * watchInitInputData () {
  yield takeEvery(INIT_INPUT_DATA, initInputData)
}

function * watchBuildOutput () {
  yield takeEvery(BUILD_OUTPUT, buildOutput)
}

function * watchInitOutput () {
  yield takeEvery(INIT_OUTPUT_LIST, initOutputList)
}

function * watchLoadOutput () {
  yield takeEvery(LOAD_OUTPUT_FILE, loadOutputFile)
}

export default function * () {
  yield all([
    watchInitInputData(),
    watchBuildOutput(),
    watchInitOutput(),
    watchLoadOutput()
  ])
}
