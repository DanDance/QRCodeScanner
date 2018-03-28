import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import {
  ORDER,
  MARK,
  WEIGHT
} from '../constants/inputDataFields'

export default class InputList extends Component {
  static propTypes = {
    onClosePress: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    inputData: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    let orders = {}
    Object.keys(props.inputData.items).forEach(key => {
      const item = props.inputData.items[key]
      orders[item[ORDER]] = true
    })
    this.state = {
      filter: null,
      order: null,
      showOderSelectModal: false,
      orders
    }
  }

  @autobind
  handleFilterChange (filter) {
    this.setState({filter})
  }

  @autobind
  setOrder (order) {
    this.setState({order})
    this.toggleOrderSelectModal()
  }

  @autobind
  toggleOrderSelectModal () {
    this.setState({showOderSelectModal: !this.state.showOderSelectModal})
  }

  @autobind
  renderListContent () {
    if (!this.state.filter) return null
    const {items} = this.props.inputData
    const filteredData = Object.keys(items).map((key, i) => {
      const item = items[key]
      if (item[MARK].toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1 && item[ORDER] === this.state.order) {
        return this.renderItem(item, i)
      }
    })
    return filteredData
  }

  @autobind
  renderItem (item, key) {
    const onItemPress = () => this.props.onItemSelect(item)
    return (
      <View
        key={key}
        style={itemStyles.container}>
        <Text style={itemStyles.fieldText}>{item[ORDER]}</Text>
        <Text style={itemStyles.fieldText}>{item[MARK]}</Text>
        <Text style={itemStyles.fieldText}>Вес: {item[WEIGHT]}</Text>
        <TouchableOpacity
          onPress={onItemPress}
          style={itemStyles.selectButton}>
          <Text style={itemStyles.selectButtonText}>Просмотр</Text>
        </TouchableOpacity>
      </View>
    )
  }

  @autobind
  renderForm () {
    const {orders, order} = this.state
    const {items} = this.props.inputData
    return (
      <View style={styles.formContainer}>
        <TouchableOpacity
          onPress={this.toggleOrderSelectModal}
          style={styles.button}>
          <Text style={styles.closeButtonText}>{order || 'Выберите заказ'}</Text>
        </TouchableOpacity>
        {order
          ? <TextInput
            placeholder='Начните вводить номер изделия'
            style={styles.input}
            onChangeText={this.handleFilterChange} />
          : null
        }
      </View>
    )
  }

  @autobind
  renderOrderSelectModal () {
    const {orders, showOderSelectModal} = this.state
    if (!showOderSelectModal) return null
    return (
      <TouchableWithoutFeedback onPress={this.toggleOrderSelectModal}>
        <View style={styles.fullScreenModal}>
          <View style={styles.orderSelectModal}>
            {Object.keys(orders).map((order, i) => {
              const handlePress = () => this.setOrder(order)
              return (
                <TouchableOpacity
                  onPress={handlePress}
                  style={styles.button}
                  key={i}>
                  <Text style={styles.closeButtonText}>{order}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render () {
    const {items} = this.props.inputData
    return (
      <View style={styles.container}>
        {this.renderForm()}
        <ScrollView
          style={styles.list}>
          {this.renderListContent()}
        </ScrollView>
        <TouchableOpacity
          onPress={this.props.onClosePress}
          style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Закрыть</Text>
        </TouchableOpacity>
        {this.renderOrderSelectModal()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey'
  },
  button: {
    backgroundColor: '#8ca2ff',
    paddingHorizontal: 25,
    marginTop: 20,
    height: 30,
    borderRadius: 4
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
  input: {
    backgroundColor: 'white',
    flex: 1,
    fontSize: 20,
    height: 60,
    marginLeft: 20
  },
  formContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 20,
    alignSelf: 'stretch'
  },
  orderSelectModal: {
    position: 'absolute',
    left: 100,
    right: 100,
    padding: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  fullScreenModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
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
  },
  selectButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    top: 5,
    padding: 4,
    height: 40,
    backgroundColor: '#4a4bff',
    borderRadius: 4
  },
  selectButtonText: {
    fontSize: 18,
    color: 'white'
  }
})
