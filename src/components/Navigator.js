import React, { Component } from 'react'
import { Navigator } from 'react-native-deprecated-custom-components'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import {
  initInputData,
  buildOutput
} from '../redux/inputData'
import {
  initOutputList,
  loadOutputFile
} from '../redux/outputList'
import {
  pushShipmentItem,
  deleteShipmentItemByIndex,
  changeItemCountByIndex,
} from '../redux/shipment'
import {
  SHIPMENT_LIST,
  QR_SCANNER,
  PDF_VIEWER,
  INPUT_LIST,
  OUTPUT_LIST
} from '../constants/routes'
import ShipmentList from './ShipmentList'
import QRScanner from './QRScanner'
import PDFViewer from './PDFViewer'
import InputList from './InputList'
import OutputList from './OutputList'

@connect(
  store => ({
    shipment: store.shipment,
    inputData: store.inputData,
    outputList: store.outputList,
    workingDirectory: store.workingDirectory
  }),
  dispatch => bindActionCreators({
    initInputData,
    pushShipmentItem,
    buildOutput,
    deleteShipmentItemByIndex,
    changeItemCountByIndex,
    initOutputList,
    loadOutputFile
  }, dispatch)
)
export default class MainNavigator extends Component {
  static propTypes = {
    initInputData: PropTypes.func.isRequired,
    initOutputList: PropTypes.func.isRequired,
    loadOutputFile: PropTypes.func.isRequired,
    pushShipmentItem: PropTypes.func.isRequired,
    changeItemCountByIndex: PropTypes.func.isRequired,
    buildOutput: PropTypes.func.isRequired,
    deleteShipmentItemByIndex: PropTypes.func.isRequired,
    workingDirectory: PropTypes.string.isRequired,
    inputData: PropTypes.object.isRequired,
    outputList: PropTypes.object.isRequired,
  }

  componentWillMount () {
    this.props.initInputData()
  }

  @autobind
  onScan (e) {
    let str = e.data.split('\n')[0].replace('\r', '')
    const dataRow = this.props.inputData.items[str]
    if (!dataRow) return alert('Маркировка не разпознана')
    const item = dataRow
    this.navigator.push({
      name: PDF_VIEWER,
      props: {
        item
      }
    })
  }

  @autobind
  openScanner () {
    this.navigator.push({name: QR_SCANNER})
  }

  @autobind
  openInputList () {
    this.navigator.push({name: INPUT_LIST})
  }

  @autobind
  openOutputList () {
    this.navigator.push({name: OUTPUT_LIST})
  }

  @autobind
  navigationPop () {
    this.navigator.pop()
  }

  @autobind
  selectShipmentItem (item) {
    this.props.pushShipmentItem(item)
    this.navigator.popN(2)
  }

  @autobind
  onItemSelect (item) {
    this.navigator.push({
      name: PDF_VIEWER,
      props: {
        item
      }
    })
  }

  @autobind
  handlePdfViewerClose () {
    const routes = this.navigator.getCurrentRoutes()
    const prevRouteName = routes[routes.length - 2].name
    switch (prevRouteName) {
      case INPUT_LIST:
        this.navigator.pop()
        break
      default:
        this.navigator.popN(2)
    }
  }

  @autobind
  renderScene (route, navigator) {
    if (!this.navigator) this.navigator = navigator
    const closeScanner = () => {
      this.handlePdfViewerClose()
    }
    switch (route.name) {
      case SHIPMENT_LIST:
        return <ShipmentList
          openOutputList={this.openOutputList}
          openInputList={this.openInputList}
          changeItemCountByIndex={this.props.changeItemCountByIndex}
          deleteShipmentItemByIndex={this.props.deleteShipmentItemByIndex}
          buildOutput={this.props.buildOutput}
          openScanner={this.openScanner}/>
      case QR_SCANNER:
        return <QRScanner
          onScan={this.onScan}
          onClosePress={this.navigator.pop}/>
      case PDF_VIEWER:
        return <PDFViewer
          workingDirectory={this.props.workingDirectory}
          onItemSelect={this.selectShipmentItem}
          onClosePress={closeScanner}
          {...route.props} />
      case INPUT_LIST:
        return <InputList
          onItemSelect={this.onItemSelect}
          inputData={this.props.inputData}
          onClosePress={this.navigator.pop}
        />
      case OUTPUT_LIST:
        return <OutputList
          initOutputList={this.props.initOutputList}
          onItemSelect={this.props.loadOutputFile}
          outputList={this.props.outputList}
          onClosePress={this.navigator.pop}
        />
    }
  }

  render () {
    const initialRoute = {name: SHIPMENT_LIST}
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={this.renderScene}/>
    )
  }
}
