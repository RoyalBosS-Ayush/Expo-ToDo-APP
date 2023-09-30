import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, FlatList, Modal, ActivityIndicator } from 'react-native';
import Colors from './Colors';
import { AntDesign } from "@expo/vector-icons";
import TodoList from './components/TodoList';
import AddListModal from './components/AddListModal';
import { detach, getLists, initFirebase, addTodoList, updateTodo } from './firebaseConfig';

export default class App extends Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true,
  }

  componentDidMount() {
    initFirebase((error, user) => {
      if (error) {
        Alert.alert("Uh oh, something went wrong");
      } else {
        getLists(lists => this.setState({ lists, user }, () => {
          this.setState({ loading: false });
        }));
      }
    });
  }

  componentWillUnmount() {
    detach();
  }

  toggleAddTodoModal = () => this.setState(prev => ({ addTodoVisible: !prev.addTodoVisible }))

  renderList = list => <TodoList updateList={this.updateList} list={list} />

  addList = list => {
    addTodoList({
      name: list.name,
      color: list.color,
      todos: [],
    });
  }

  updateList = list => {
    updateTodo(list);
  }

  render() {
    if (this.state.loading)
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.blue} />
        </View>)

    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.toggleAddTodoModal()}
          animationType='slide'
        >
          <AddListModal addList={this.addList} closeModal={() => this.toggleAddTodoModal()} />
        </Modal>

        <View style={{ flexDirection: "row" }}>
          <View style={styles.divider} />
          <Text style={styles.title}>
            Todo <Text style={{ fontWeight: "300", color: Colors.blue, }}>Lists</Text>
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={{ marginVertical: 48 }}>
          <TouchableOpacity onPress={() => this.toggleAddTodoModal()} style={styles.addList}>
            <AntDesign name="plus" size={16} color={Colors.blue} />
          </TouchableOpacity>

          <Text style={styles.add}>Add List</Text>
        </View>

        <View style={{ height: 275, paddingLeft: 32 }}>
          <FlatList
            data={this.state.lists}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: Colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center"
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: Colors.black,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: Colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: Colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8
  },
});
