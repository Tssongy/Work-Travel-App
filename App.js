import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './colors';
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 



export default function App() {
  const STORAGE_KEY = "@toDos"
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({})
  useEffect(() => {
    loadToDos()
    loadWorking()
  }, [])
  
  useEffect(() => {
    saveWorking(working)
  }, [working])
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload)
  const saveWorking = async (toSave) => {
    const s = toSave.toString()
    await AsyncStorage.setItem("@working", s)
  }
  const saveToDos = async (toSave) => {
    const s = JSON.stringify(toSave)
    await AsyncStorage.setItem(STORAGE_KEY, s)
  }
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if(s){
        setToDos(JSON.parse(s))
      }
    }
    catch(error) {
      console.log(error)
    }
    
  }
  const loadWorking = async () => {
    try{
      const s = await AsyncStorage.getItem("@working")
      if(s === "true"){
        setWorking(true)
      }
      else if(s === "false"){
        setWorking(false)
      }
    }
    catch(error) {
      console.log(error)
    }
    
  }
  
  const addToDo = async () => {
    if(text === ""){
      return 
    }
    const newToDos = {...toDos,
      [Date.now()] : {text, working}
    }
    setToDos(newToDos)
    await saveToDos(newToDos)
    setText("")
  }

  const deleteToDo = (key) => {
    Alert.alert(
      "Delete To Do", "Are you sure?", 
      [
      {text:"Cancel"},
      {text: "I'm sure", onPress: () => {
        const newToDos = {...toDos}
        delete newToDos[key]
        setToDos(newToDos)
        saveToDos(newToDos)
      }},
    ])
  }
  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working ? theme.grey : "white"}}>Travel</Text>       
        </TouchableOpacity>
      </View>
      <TextInput 
        style={styles.input} 
        placeholder={working ? "Add a To Do": "Where do you want to go?"}
        onChangeText={onChangeText}
        onSubmitEditing={addToDo}
        returnKeyType="done"
        value={text}
      />
      <ScrollView>
        {Object.keys(toDos).map((key, index) => (
          toDos[key].working === working ? 
          <View style={styles.toDo} key={index}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteToDo(key)}>
              <Ionicons name="md-trash-bin-outline" size={24} color="black" />
            </TouchableOpacity>
          </View> : null
        ))}
      </ScrollView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: '500'
  }
});

