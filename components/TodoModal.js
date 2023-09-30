import React, { Component } from 'react'
import { Platform, Animated, SafeAreaView, FlatList, Text, StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from '../Colors'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

export default class TodoModal extends Component {
    state = {
        newTodo: "",
    }

    toggleTodoCompleted = index => {
        let list = this.props.list;
        list.todos[index].completed = !list.todos[index].completed;
        this.props.updateList(list);
    }

    addTodo = () => {
        let list = this.props.list;
        if (!list.todos.some(todo => todo.title === this.state.newTodo)) {
            list.todos.push({ title: this.state.newTodo, completed: false });
            this.props.updateList(list);
        }

        this.setState({ newTodo: "" });

        Keyboard.dismiss();
    }

    deleteTodo = (index) => {
        let list = this.props.list;
        list.todos.splice(index, 1);

        this.props.updateList(list);
    }

    rightActions = (dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.9],
            extrapolate: "clamp"
        })
        const opacity = dragX.interpolate({
            inputRange: [-100, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: "clamp"
        })
        return (
            <TouchableOpacity onPress={() => this.deleteTodo(index)}>
                <Animated.View style={[styles.deleteButton, { opacity }]}>
                    <Animated.Text style={{ color: Colors.white, fontWeight: "800", transform: [{ scale }] }}>Delete</Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        )
    }

    renderTodo = (todo, index) => {
        return (
            <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)}>
                <View style={styles.todoContainer}>
                    <TouchableOpacity
                        onPress={() => this.toggleTodoCompleted(index)}
                        style={{}}>
                        <Ionicons name={todo.completed ? "ios-square" : "ios-square-outline"} size={24} color={Colors.gray} style={{ width: 32 }} />
                    </TouchableOpacity>

                    <Text style={[styles.todo, { textDecorationLine: todo.completed ? "line-through" : "none", color: todo.completed ? Colors.gray : Colors.black }]}>{todo.title}</Text>
                </View>
            </Swipeable>
        )
    }

    render() {
        const list = this.props.list;
        const taskCount = list.todos.length;
        const completedCount = list.todos.filter(todo => todo.completed).length;

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <SafeAreaView style={styles.container} >
                    <TouchableOpacity
                        onPress={this.props.closeModal}
                        style={{ position: "absolute", top: 32, right: 32, zIndex: 10 }}
                    >
                        <AntDesign name="close" size={24} color={Colors.black} />
                    </TouchableOpacity>
                    <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
                        <View>
                            <Text style={styles.title}>{list.name}</Text>
                            <Text style={styles.taskCount}>
                                {completedCount} of {taskCount} tasks
                            </Text>
                        </View>
                    </View>

                    <GestureHandlerRootView style={[styles.section, { flex: 3, marginVertical: 16 }]}>
                        <FlatList
                            data={list.todos}
                            renderItem={({ item, index }) => this.renderTodo(item, index)}
                            keyExtractor={item => item.title}
                            showsVerticalScrollIndicator={false}
                        />
                    </GestureHandlerRootView>

                    <View style={[styles.section, styles.footer]} >
                        <TextInput onChangeText={text => this.setState({ newTodo: text })} value={this.state.newTodo} style={[styles.input, { borderColor: list.color }]} />
                        <TouchableOpacity onPress={this.addTodo} style={[styles.addTodo, { backgroundColor: list.color }]}>
                            <AntDesign name={"plus"} size={16} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    section: {
        alignSelf: "stretch",
    },
    header: {
        justifyContent: "flex-end",
        marginLeft: 64,
        borderBottomWidth: 3,
        paddingTop: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: Colors.black,
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: Colors.gray,
        fontWeight: "600",
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        marginRight: 8,
        paddingHorizontal: 8,
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 32,
    },
    todo: {
        color: Colors.black,
        fontWeight: "700",
        fontSize: 16,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: Colors.red,
        justifyContent: "center",
        alignItems: "center",
        width: 80,
    }
})