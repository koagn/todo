//Importing Tools Or The Ingredients for the recipe
//AsyncStorage is Like a small database on your phone to save data
//useState is Remembers things that can change (like your todo list)
//useEffect is Does something when the app starts or when things change
//  StyleSheet,Text,TextInput,TouchableOpacity,View,  = Building blocks to create buttons, text
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";//useEffect, useState are Special tools from React that 
// help manage memory and timing

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from "react-native";

const Index = () => {// we can say i'am building a house called Index
  const [todoList, setTodoList] = useState<string[]>([]);//todoList is Your list of tasks 
  const [todoItem, setTodoItem] = useState<string>("");//todoItem Is The task you're currently typing
  const [isEdit, setIsEdit] = useState<boolean>(false);//isEdit is If you're changing a task instead of adding a new one
  const [editingTodo, setEditingTodo] = useState<string | null>(null);// storedValue is The task saved in your phone from last time
 // perfoming crud operations
 //Creating Functions (the recipes) by adding, deleting, editing, storing, and retrieving tasks  (Adding a Task)
// example:If you type "Buy milk" and click Add: Buy milk gets saved to phone 
// "Buy milk" is remembered
//"Buy milk" gets added to your list
//The typing box clears so you can type a new task
  

  const addTodo = async (todo: string) => {  //add todo to the list
    if (todo.trim() === "") {
      console.log("Tried to add empty todo!");
      return;
    }
    
    console.log("Adding todo:", todo);
    
    const updatedList = [...todoList, todo];
    setTodoList(updatedList);
    setTodoItem("");
    
    // Save the entire list to AsyncStorage
    await storeData("todoList", JSON.stringify(updatedList));
    console.log("Saved todo list:", updatedList);
  };
//(Deleting a Task)
// example: If you have: "Buy milk", "Walk dog", "Cook dinner"
//And you delete "Walk dog" 
//The filter keeps everything except "Walk dog"
//New list becomes: ["Buy milk", "Cook dinner"]
  const deleteTodo = async (todoToDelete: string) => {
    console.log("Deleting todo:", todoToDelete);
    
    const updatedTodoList = todoList.filter(todo => todo !== todoToDelete);
    setTodoList(updatedTodoList);
    
    // Save updated list to AsyncStorage
    await storeData("todoList", JSON.stringify(updatedTodoList));
    console.log("Updated todo list after deletion:", updatedTodoList);
  };
//(Editing a Task)
// example: If you have: "Buy milk", "Walk dog", "Cook dinner"
//And you edit "Walk dog" to "Walk the dog" 
  const editTodo = (todo: string) => {
    console.log("Editing todo:", todo);
     //edit todoitem
     //
    setIsEdit(true);
    setEditingTodo(todo);
    setTodoItem(todo);
  };

  const updateTodo = async () => {
    if (todoItem.trim() === "") {
      console.log("Tried to update with empty todo!");
      return;
    }
    
    console.log("Updating todo from:", editingTodo, "to:", todoItem);
    
    const updatedTodoList = todoList.map(todo => 
      todo === editingTodo ? todoItem : todo
    );
    setTodoList(updatedTodoList);
    setTodoItem("");
    setIsEdit(false);
    setEditingTodo(null);
    
    //Saving Data to Phone  
// example: If you type "Buy milk" and click Add
//"Buy milk" gets saved to phone
// This how the function stores data
//The key is "todo" and the value is "Buy milk"
//async and await  "Wait until saving is done before continuing"
//You can use different keys to save different things
    await storeData("todoList", JSON.stringify(updatedTodoList));
    console.log("Updated todo list:", updatedTodoList);
  };

  const cancelEdit = () => {
    console.log("Edit cancelled");
    setIsEdit(false);
    setEditingTodo(null);
    setTodoItem("");
  };

  const storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log("Data stored successfully for key:", key);
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const retrieveData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log("Retrieved data for key:", key);
        
        if (key === "todoList") {
          // Parse the todo list from JSON
          const parsedList = JSON.parse(value);
          setTodoList(parsedList);
          console.log("Loaded todo list:", parsedList);
        }
      } else {
        console.log("No data found for key:", key);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    console.log("Component mounted - loading data");
    retrieveData("todoList");
  }, []);
 //delete data

  useEffect(() => {
    // Retrieve 
    //it is like opening a saved file:
    //When the app starts, it looks for saved tasks
    //If it finds any, it shows them on the screen
    //If not, it starts with an empty list
    retrieveData("todo");
  }, []);
  // const profile = {
  //   name: "John Doe",
  //   age: 30,
  //   address: "123 Main St",
  //   phone: "123-456-7890",
  // };
  // Store object data
  // const storeObjectData = async (
  //   key: string,
  //   value: {
  //     name: string;
  //     age: number;
  //     address: string;
  //     phone: string;
  //   }
  // ) => {
  //   try {
  //     const jsonValue = JSON.stringify(value);
  //     await AsyncStorage.setItem(key, jsonValue);
  //     console.log("Object stored successfully");
  //   } catch (error) {
  //     console.error("Error storing object:", error);
  //   }
  // };

  // //call the function to store the profile object
  // storeObjectData("profile", profile);

  // Retrieve object data
  // const retrieveObjectData = async (key: string) => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem(key);
  //     const profile = jsonValue != null ? JSON.parse(jsonValue) : null;
  //     console.log("Retrieved object:", profile);
  //   } catch (error) {
  //     console.error("Error retrieving object:", error);
  //   }
  // };
  // // Call the function to retrieve the profile object
  // retrieveObjectData("profile");
return (
  // Background image for the entire screen
  <ImageBackground
    source={require('../assets/images/cloud.png')} // Loads cloud image from assets
    style={styles.backgroundImage} // Applies styling to make it full screen
    resizeMode="cover" // Ensures the image covers the entire screen
  >
    {/* Keyboard handling for iOS/Android to prevent keyboard from hiding inputs */}
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined} // On iOS, push content up when keyboard appears
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust position if needed
    >
      {/* Semi-transparent overlay to make text more readable on the background */}
      <View style={styles.overlay} />
      
      {/* Header section with app title and subtitle */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Cloud Todo List</Text> {/* Main title */}
        <Text style={styles.subHeader}>Keep your tasks organized</Text> {/* Subtitle */}
      </View>

      {/* Scrollable area for the todo list content */}
      <ScrollView 
        style={styles.content}
        keyboardShouldPersistTaps="handled" // Keyboard stays when tapping on scroll view
        contentContainerStyle={styles.scrollContent} // Additional styling for content
      >
        {/* Input area for adding new todos */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter a new task..." // Hint text
            placeholderTextColor="#888" // Color of hint text
            onChangeText={(text) => {
              console.log("Typing:", text); // Log what user is typing
              setTodoItem(text); // Update state with current input
            }}
            value={todoItem} // Controlled component - value comes from state
          />
          
          {/* Container for Add/Update/Cancel buttons */}
          <View style={styles.buttonContainer}>
            {isEdit ? ( // If we're in edit mode, show Update and Cancel buttons
              <>
                <TouchableOpacity
                  onPress={updateTodo} // Calls function to save edited todo
                  style={[styles.button, styles.updateButton]} // Combined styles
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelEdit} // Cancels editing mode
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : ( // If not in edit mode, show Add button
              <TouchableOpacity
                onPress={() => addTodo(todoItem)} // Calls function to add new todo
                style={[styles.button, styles.addButton]}
                disabled={todoItem.trim() === ""} // Disable button if input is empty
              >
                <Text style={styles.buttonText}>Add Task</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Conditional rendering based on whether we have todos */}
        {todoList.length === 0 ? ( // If no todos, show empty state message
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
          </View>
        ) : ( // If we have todos, map through them and display each one
          todoList.map((todo, index) => (
            <View key={index} style={styles.todoItem}> {/* Each todo item container */}
              <Text style={styles.todoText}>{todo}</Text> {/* The todo text itself */}
              <View style={styles.todoActions}> {/* Container for Edit/Delete buttons */}
                <TouchableOpacity
                  onPress={() => editTodo(todo)} // Switch to edit mode for this todo
                  style={[styles.actionButton, styles.editButton]}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteTodo(todo)} // Delete this todo
                  style={[styles.actionButton, styles.deleteButton]}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  </ImageBackground>
);
          {todoList.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
            </View>
          ) : (
            todoList.map((todo, index) => (
              <View key={index} style={styles.todoItem}>
                <Text style={styles.todoText}>{todo}</Text>
                <View style={styles.todoActions}>
                  <TouchableOpacity
                    onPress={() => editTodo(todo)}
                    style={[styles.actionButton, styles.editButton]}
                  >
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteTodo(todo)}
                    style={[styles.actionButton, styles.deleteButton]}
                  >
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 20,
  },
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "rgba(95, 139, 233, 0.8)",
    borderRadius: 15,
    margin: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: "whiteblue",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 6,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subHeader: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 5,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(220, 220, 220, 0.5)',
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "#e1e5eb",
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    marginBottom: 15,
    color: "#2d3748",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 110,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  addButton: {
    backgroundColor: "#2563EB",
  },
  updateButton: {
    backgroundColor: "#10B981",
  },
  cancelButton: {
    backgroundColor: "#6B7280",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  todoItem: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(220, 220, 220, 0.4)',
  },
  todoText: {
    fontSize: 16,
    flex: 1,
    color: "#2d3748",
    fontWeight: '500',
  },
  todoActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  editButton: {
    backgroundColor: "#F59E0B",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  actionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 15,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#718096",
    textAlign: "center",
    fontStyle: 'italic',
  },
});

export default Index;