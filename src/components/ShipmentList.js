import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import Prompt from 'react-native-prompt';

import {
  ORDER,
  MARK,
  WEIGHT
} from '../constants/inputDataFields'

class ShipmentItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    changeItemCount: PropTypes.func.isRequired,
  }

  state = {
    isEditing: false,
    count: null,
  }

  @autobind
  openAlert () {
    const {item} = this.props
    Alert.alert(
      item[MARK],
      'Выберите действие',
      [
        {text: 'Редактировать кол-во', onPress: this.toggleEditing},
        {text: 'Удалить', onPress: this.props.onDelete}
      ],
      {cancelable: true}
    )
  }

  @autobind
  toggleEditing () {
    this.setState({isEditing: !this.state.isEditing})
  }

  @autobind
  increaseAmount () {
    const {count} = this.state
    let itemCount = count
    if (!count) itemCount = this.props.item.count
    this.setState({count: itemCount + 1})
  }

  @autobind
  decreaseAmount () {
    const {count} = this.state
    let itemCount = count
    if (count === null) itemCount = this.props.item.count
    this.setState({count: (itemCount - 1) || 1})
  }

  @autobind
  saveChanges () {
    if (this.state.count !== null) this.props.changeItemCount(this.state.count)
    this.setState({count: null})
    this.toggleEditing()
  }

  @autobind
  renderEditingCount () {
    return (
      <View style={itemStyles.container}>
        <TouchableOpacity
          onPress={this.decreaseAmount}
          style={itemStyles.decrementButton}>
          <Text style={itemStyles.changeAmountButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={itemStyles.countEditingText}>{this.state.count || this.props.item.count}</Text>
        <TouchableOpacity
          onPress={this.increaseAmount}
          style={itemStyles.incrementButton}>
          <Text style={itemStyles.changeAmountButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    )
  }

  @autobind
  renderSaveButton () {
    return (
      <TouchableOpacity
        style={itemStyles.saveButton}
        onPress={this.saveChanges}>
        <Text>Сохранить</Text>
      </TouchableOpacity>
    )
  }

  render () {
    const {item} = this.props
    return (
      <TouchableOpacity
        onLongPress={this.openAlert}
        style={itemStyles.container}>
        <Text style={itemStyles.text}>{item[MARK]}</Text>
        <Text style={itemStyles.text}>{item[ORDER]}</Text>
        <Text style={itemStyles.text}>{item[WEIGHT] + ' кг'}</Text>
        {this.state.isEditing
          ? this.renderEditingCount()
          : <Text style={itemStyles.text}>Кол-во {item.count}</Text>
        }
        {this.state.isEditing
          ? this.renderSaveButton()
          : null
        }
      </TouchableOpacity>
    )
  }
}

@connect(
  store => ({
    shipment: store.shipment,
    inputData: store.inputData
  }),
  dispatch => bindActionCreators({}, dispatch)
)
export default class ShipmentList extends Component {
  static propTypes = {
    openScanner: PropTypes.func.isRequired,
    buildOutput: PropTypes.func.isRequired,
    changeItemCountByIndex: PropTypes.func.isRequired,
    deleteShipmentItemByIndex: PropTypes.func.isRequired,
    openInputList: PropTypes.func.isRequired,
    openOutputList: PropTypes.func.isRequired,
    shipment: PropTypes.object.isRequired
  }

  state = {
    promptVisible: false
  }

  @autobind
  renderSummary () {
    const {shipment} = this.props
    let error = null
    let sumWeight = 0
    shipment.items.forEach(item => {
      try {
        sumWeight += (+item[WEIGHT] * item.count)
      } catch (err) {
        error = 'Не удалось посчитать общую массу'
      }
    })
    return (
      <View style={styles.summaryContainer}>
        <Text>{error || 'Общая масса: ' + (sumWeight).toFixed(2)}</Text>
      </View>
    )
  }

  @autobind
  showPrompt () {
    this.setState({promptVisible: true})
  }

  @autobind
  hidePrompt () {
    this.setState({promptVisible: false})
  }

  @autobind
  onPromptSubmit (carNumber) {
    this.props.buildOutput(carNumber)
    this.hidePrompt()
  }

  @autobind
  handleLoadOutPress () {
    const {items} = this.props.shipment
    if (!items.length) return alert('Нет данных для выгрузки')
    this.showPrompt()
  }

  @autobind
  renderList () {
    const {items} = this.props.shipment
    return (
      <View style={styles.listContainer}>
        <ScrollView style={styles.list}>
          {items.map((item, i) => {
            const onDelete = () => this.props.deleteShipmentItemByIndex(i)
            const changeItemCount = count => this.props.changeItemCountByIndex({i, count})
            return (
              <ShipmentItem
                changeItemCount={changeItemCount}
                onDelete={onDelete}
                item={item}
                key={i}/>
            )
          })}
        </ScrollView>
        {this.renderSummary()}
      </View>
    )
  }

  render () {
    const {shipment} = this.props
    return (
      <View style={styles.container}>
        {shipment.items.length
          ? this.renderList()
          : <View style={styles.list}/>
        }
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={this.props.openScanner}
            style={[styles.button, styles.buttonLeftRadius]}>
            <Text>Сканировать код</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.openInputList}
            style={styles.button}>
            <Text>Ручной выбор</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleLoadOutPress}
            style={styles.button}>
            <Text>Выгрзуить .xlsx</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.openOutputList}
            style={[styles.button, styles.buttonRightRadius]}>
            <Text>История</Text>
          </TouchableOpacity>
        </View>
        <Prompt
          title='Введите номер автомобиля'
          visible={this.state.promptVisible}
          onCancel={this.hidePrompt}
          onSubmit={this.onPromptSubmit} />
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
  list: {
    alignSelf: 'stretch',
    paddingTop: 20,
    flex: 1,
    backgroundColor: 'grey'
  },
  button: {
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    height: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLeftRadius: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  },
  buttonRightRadius: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 20
  },
  listContainer: {
    flex: 1,
    alignSelf: 'stretch'
  },
  summaryContainer: {
    borderBottomWidth: 1,
    borderColor: 'black',
    alignSelf: 'stretch'
  }
})

const itemStyles = StyleSheet.create({
  container: {
    height: 40,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginHorizontal: 20
  },
  text: {
    fontSize: 18,
    marginLeft: 20,
    color: 'black'
  },
  incrementButton: {
    width: 30,
    height: 30,
    backgroundColor: '#219e2f',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  decrementButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ff5f67',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  countEditingText: {
    fontSize: 20,
    marginHorizontal: 20,
    fontWeight: 'bold'
  },
  changeAmountButtonText: {
    fontSize: 35
  },
  saveButton: {
    backgroundColor: '#6b71ff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    right: 10
  }
})
