import React, { Component } from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import Colors from '../Colors'
import TodoModal from './TodoModal';

class TodoList extends Component {
    state = {
        showListVisible: false,
    }

    toggleListModal = () => this.setState(prev => ({ showListVisible: !prev.showListVisible }));

    render() {
        const list = this.props.list;
        const completedCount = list.todos.filter(todo => todo.completed).length;
        const remainingCount = list.todos.length - completedCount

        return (
            <View>
                <Modal
                    visible={this.state.showListVisible}
                    onRequestClose={() => this.toggleListModal()}
                    animationType='slide'
                >
                    <TodoModal list={list} closeModal={() => this.toggleListModal()} updateList={this.props.updateList} />
                </Modal>
                <TouchableOpacity
                    onPress={() => this.toggleListModal()}
                    style={[styles.listContainer, { backgroundColor: list.color }]}
                >
                    <Text numberOfLines={1} style={styles.listTitle}>{list.name}</Text>

                    <View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.count}>{remainingCount}</Text>
                            <Text style={styles.subtitle}>Remaining</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.count}>{completedCount}</Text>
                            <Text style={styles.subtitle}>Completed</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default TodoList

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 12,
        alignItems: "center",
        width: 200
    },
    listTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: Colors.white,
        marginBottom: 18,
    },
    count: {
        fontSize: 48,
        fontWeight: "200",
        color: Colors.white,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "700",
        color: Colors.white,
    },
})