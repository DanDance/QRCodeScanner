import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image
} from 'react-native'
import PDFView from 'react-native-pdf-view'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import RNFS from 'react-native-fs'

import {
  FILE,
  ORDER
} from '../constants/inputDataFields'

class ItemSelector extends Component {
  static propTypes = {
    select: PropTypes.func.isRequired
  }

  state = {
    amount: 1
  }

  @autobind
  increaseAmount () {
    this.setState({amount: this.state.amount + 1})
  }

  @autobind
  decreaseAmount () {
    this.setState({amount: this.state.amount - 1 || 1})
  }

  @autobind
  selectItem () {
    this.props.select(this.state.amount)
  }

  render () {
    return (
      <View style={selectorStyles.container}>
        <Text style={selectorStyles.amountText}>Кол-во</Text>
        <TouchableOpacity
          onPress={this.decreaseAmount}
          style={selectorStyles.decrementButton}>
          <Text style={selectorStyles.changeAmountButton}>-</Text>
        </TouchableOpacity>
        <Text style={selectorStyles.amountText}>{this.state.amount}</Text>
        <TouchableOpacity
          onPress={this.increaseAmount}
          style={selectorStyles.incrementButton}>
          <Text style={selectorStyles.changeAmountButton}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.selectItem}
          style={selectorStyles.submitButton}>
          <Text style={selectorStyles.submitText}>Ок</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default class PDFViewer extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onClosePress: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    workingDirectory: PropTypes.string.isRequired
  }

  state = {
    filePathChecked: false,
    fileExists: null,
    rotate: 0
  }

  componentWillMount () {
    this.checkFileExists()
  }

  @autobind
  checkFileExists () {
    const {
      item,
      workingDirectory
    } = this.props
    RNFS.readdir(`${workingDirectory}/Schemes/${item[ORDER]}/`)
      .then(dir => {
        if (dir.indexOf(`${item[FILE]}.pdf`) !== -1) {
          this.setState({
            fileExists: true,
            filePathChecked: true
          })
        } else {
          this.setState({
            fileExists: false,
            filePathChecked: true
          })
        }
      })
      .catch(err => {
        this.setState({
          fileExists: false,
          filePathChecked: true
        })
      })
  }

  @autobind
  onItemSelect (count) {
    const {item} = this.props
    this.props.onItemSelect({...item, count})
  }

  @autobind
  rotateView () {
    if (this.state.rotate !== 270) this.setState({rotate: this.state.rotate + 90})
    else this.setState({rotate: 0})
  }

  @autobind
  renderPDFView () {
    const {
      filePathChecked,
      fileExists,
      rotate
    } = this.state
    const {
      workingDirectory,
      item
    } = this.props
    const rotateStyle = {
      transform: [{rotate: `${rotate}deg`}]
    }
    if (!filePathChecked) return null
    if (!fileExists) return <Text style={styles.errorText}>Не удалось найти pdf файл</Text>
    const path = workingDirectory.replace('file:///', '')
    return (
      <PDFView
        style={[styles.pdfview, rotateStyle]}
        path={`${path}/Schemes/${item[ORDER]}/${item[FILE]}.pdf`} />
    )
  }

  render () {
    const {
      onClosePress,
    } = this.props
    return (
      <View style={styles.container}>
        {this.renderPDFView()}
        <ItemSelector select={this.onItemSelect} />
        <TouchableOpacity
          onPress={onClosePress}
          style={styles.closePdfButton}>
          <Text style={styles.closeButtonText}>Закрыть</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.rotateView}
          style={styles.rotateButton}>
          <Image
            style={styles.rotateButtonImage}
            source={require('../assets/rotate_icon_clockwise.png')}/>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
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
    backgroundColor: '#6f80de',
    padding: 10,
    borderRadius: 2,
    left: 20,
    top: 20
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white'
  },
  errorText: {
    fontSize: 24
  },
  rotateButton: {
    position: 'absolute',
    top: 20,
    right: 20
  },
  rotateButtonImage: {
    width: 40,
    height: 40
  }
})

const selectorStyles = StyleSheet.create({
  container: {
    borderRadius: 4,
    paddingLeft: 20,
    backgroundColor: '#6f80de',
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#168603',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    // flex: 1,
    width: 60,
    height: 60
  },
  amountText: {
    fontSize: 20,
    color: 'black',
    marginHorizontal: 20
  },
  decrementButton: {
    backgroundColor: '#ff5f67',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  incrementButton: {
    backgroundColor: '#219e2f',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 50
  },
  changeAmountButton: {
    fontSize: 35
  },
  submitText: {
    color: 'white',
    fontSize: 22
  }
})
