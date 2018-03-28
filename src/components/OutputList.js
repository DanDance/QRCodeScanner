import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert
} from 'react-native'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

export default class OutputList extends Component {
  static propTypes = {
    onClosePress: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    initOutputList: PropTypes.func.isRequired,
    outputList: PropTypes.object.isRequired
  }

  componentWillMount () {
    this.props.initOutputList()
  }

  @autobind
  renderListContent () {
    const {items} = this.props.outputList
    return items.map((item, i) => this.renderItem(item, i))
  }

  @autobind
  confirmFileLoading (item) {
    Alert.alert(
      'Подтверждение',
      'Загрузить файл выгрузки? Текущие данные будут перезаписаны данными из файла.',
      [
        {text: 'Отмена', onPress: () => {}, style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            this.props.onItemSelect(item)
            this.props.onClosePress()
          }
        }
      ]
    )
  }

  @autobind
  renderItem (item, key) {
    const onItemPress = () => this.confirmFileLoading(item)
    return (
      <TouchableOpacity
        key={key}
        onPress={onItemPress}
        style={itemStyles.container}>
        <Text style={itemStyles.fieldText}>{item}</Text>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.list}>
          {this.renderListContent()}
        </ScrollView>
        <TouchableOpacity
          onPress={this.props.onClosePress}
          style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Закрыть</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey'
  },
  closeButton: {
    backgroundColor: '#8ca2ff',
    paddingHorizontal: 25,
    borderRadius: 4,
    position: 'absolute',
    left: 20,
    top: 4
  },
  closeButtonText: {
    fontSize: 22,
    color: 'white'
  },
  list: {
    flex: 1,
    paddingTop: 40,
    alignSelf: 'stretch'
  },
})

const itemStyles = StyleSheet.create({
  container: {
    height: 50,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginHorizontal: 20
  },
  fieldText: {
    marginLeft: 20,
    fontSize: 18,
    color: 'black'
  }
})
