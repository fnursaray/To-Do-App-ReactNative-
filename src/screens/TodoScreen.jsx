import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {
  AddCircle,
  CloseCircle,
  TickCircle,
  Trash,
  Edit2,
} from 'iconsax-react-native';

const TodoScreen = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);

  const saveTodos = async saveTodo => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(saveTodo));
    } catch (error) {
      console.log(error);
    }
  };

  const loadTodos = async () => {
    try {
      const storedData = await AsyncStorage.getItem('todos');
      if (storedData) {
        setTodos(JSON.parse(storedData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async id => {
    const updatedTodos = todos.filter(item => item.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const completeTodo = async id => {
    const updatedTodos = todos.map(item =>
      item.id === id ? {...item, completed: !item.completed} : item,
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const updateTodo = id => {
    const exitingTodo = todos?.find(item => item.id === id);
    if (!exitingTodo) return;

    Alert.prompt(
      'Edit todo',
      'Update',
      newUpdateText => {
        if (newUpdateText) {
          const updateTodos = todos.map(item =>
            item?.id === id ? {...item, text: newUpdateText} : item,
          );
          setTodos(updateTodos);
          saveTodos(updateTodos);
        }
      },
      'plain-text',
      exitingTodo.text,
    );
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = () => {
    if (todo.trim() === '') {
      Alert.alert('Warning', 'Please enter a valid todo.');
      return;
    }

    const updatedTodos = [...todos, {id: uuid.v4(), text: todo}];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);

    setTodo('');
  };

  return (
    <LinearGradient colors={['#fef3c7', '#a78bfa']} style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headerText}>TO-DO LIST</Text>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={text => setTodo(text)}
            value={todo}
            placeholder="Type a Todo "
            style={styles.input}
          />
          <TouchableOpacity
            onPress={addTodo}
            style={[styles.button, styles.addButton]}>
            <AddCircle size="32" color="#ff8a65" variant="Broken" />
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {todos.length === 0 && (
          <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
            No todos available. Add one to get started!
          </Text>
        )}

        <FlatList
          data={todos}
          keyExtractor={item => item?.id?.toString()}
          renderItem={({item}) => (
            <View style={styles.todoItem}>
              <Text
                style={[
                  styles.todoText,
                  item.completed && styles.completedText,
                ]}>
                {item?.text}
              </Text>

              <View style={{flexDirection: 'row'}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => completeTodo(item?.id)}
                    style={[styles.button, styles.completeButton]}>
                    <Text style={styles.buttonText}>
                      {item.completed ? (
                        <CloseCircle size="27" color="#000" variant="Broken" />
                      ) : (
                        <TickCircle
                          size="27"
                          color="#ff8a65"
                          variant="Broken"
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => deleteTodo(item?.id)}
                    style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>
                      <Trash size="27" color="#ff8a65" variant="Broken" />
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => updateTodo(item?.id)}
                    style={[styles.button, styles.updateButton]}>
                    <Text style={styles.buttonText}>
                      <Edit2 size="27" color="#ff8a65" variant="Broken" />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginTop: 15,
    marginBottom: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    borderRadius: 10,
    borderColor: 'gray',
    backgroundColor: '#f9f9f9',
  },
  todoText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '500',
    paddingTop: 13,
    paddingHorizontal: 10,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
    fontSize: 16,
  },
  button: {
    marginLeft: 10,
    borderRadius: 5,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  buttonText: {
    color: '#333',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    padding: 15,
    marginBottom: 10,
  },

  deleteButton: {
    padding: 10,
  },
  updateButton: {
    padding: 10,
  },
  completeButton: {
    padding: 10,
  },
});
