import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import QRScanner from 'react-native-qrcode-scanner'

export default class Scanner extends Component {
  static propTypes = {
    onScan: PropTypes.func.isRequired,
    onClosePress: PropTypes.func.isRequired
  }

  render () {
    const {
      onScan,
      onClosePress
    } = this.props
    return (
      <View style={styles.container}>
        <QRScanner onRead={onScan} />
        <TouchableOpacity
          onPress={onClosePress}
          style={styles.closePdfButton}>
          <Text>Закрыть</Text>
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
  closePdfButton: {
    position: 'absolute',
    left: 20,
    top: 20
  }
})
