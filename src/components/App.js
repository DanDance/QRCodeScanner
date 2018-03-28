import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Navigator
} from 'react-native'
import { connect } from 'react-redux'
import QRScanner from './QRScanner'
import autobind from 'autobind-decorator'
import PDFViewer from './PDFViewer'
import { bindActionCreators } from 'redux'

import { initInputData } from '../redux/inputData'
import { FILE } from '../constants/inputDataFields'

@connect(
  store => ({
    shipment: store.shipment,
    inputData: store.inputData
  }),
  dispatch => bindActionCreators({
    initInputData
  }, dispatch)
)
export default class App extends Component {
  state = {
    showScanner: false,
    scannedText: null,
    pdfFileName: null
  }

  componentWillMount () {
    this.props.initInputData()
  }

  @autobind
  onScan (e) {
    this.setState({scannedText: e.data})
    let str = e.data.split('\n')[0].replace('\r', '')
    const dataRow = this.props.inputData.items[str]
    this.hideScanner()
    if (!dataRow) return alert('Маркировка не разпознана')
    const pdfFileName = dataRow[FILE]
    this.setState({pdfFileName})
  }

  @autobind
  renderScanner () {
    return (
      <QRScanner
        onClosePress={this.hideScanner}
        onScan={this.onScan}/>
    )
  }

  @autobind
  showScanner () {
    this.setState({showScanner: true})
  }

  @autobind
  hideScanner () {
    this.setState({showScanner: false})
  }

  @autobind
  closePdf () {
    this.setState({pdfFileName: null})
  }

  @autobind
  renderPdfView () {
    const {pdfFileName} = this.state
    return (
      <PDFViewer
        onClosePress={this.closePdf}
        pdfFileName={pdfFileName}/>
    )
  }

  @autobind
  renderMainScreen () {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.showScanner}
          style={styles.button}>
          <Text>Сканировать код</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    if (this.state.showScanner) return this.renderScanner()
    if (this.state.pdfFileName) return this.renderPdfView()
    return this.renderMainScreen()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  button: {
    alignSelf: 'stretch',
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pdfview: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'green',
    alignSelf: 'stretch'
  },
  closePdfButton: {
    position: 'absolute',
    left: 20,
    top: 20
  }
})
