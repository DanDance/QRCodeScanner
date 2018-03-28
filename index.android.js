import React from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import { store } from './src/redux/store/configureStore'
import App from './src/components/Navigator'

class QRCodeScanner extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('QRCodeScanner', () => QRCodeScanner)
