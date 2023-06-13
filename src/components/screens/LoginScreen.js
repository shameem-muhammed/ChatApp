import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import {auth} from '../includes/FireBase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../includes/LoadingScreen';



const LoginScreen = ({navigation}) => {


  
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPage, setShowPage] = useState(false)
    const [showError, setShowError] = useState(false)
    const [showAuthError, setShowAuthError] = useState("")


    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@user_details')
        if(value !== null) {
          setShowPage(false)
          signInWithEmailAndPassword(auth, JSON.parse(value).email, JSON.parse(value).password).then((userCredintail) => {
            navigation.navigate('Home')
            
          }).catch((error) => {
              console.log(error)
          })

          // value previously stored
        } else {
          setShowPage(true)
        }
      } catch(e) {
        // error reading value
      }
    }

    useEffect(() => {
      getData()
    }, [])

    const storeData = async () => {
      const userCredintail = {
        email: email,
        password: password
      }
      try {
        await AsyncStorage.setItem('@user_details', JSON.stringify(userCredintail))
      } catch (e) {
        // saving error
      }
    }


   
    const handleLogin = () => {
      if(email == "" || password == "") {
        setShowError(true)
      } else {
        setShowPage(false)
        signInWithEmailAndPassword(auth, email, password).then((userCredintail) => {
            storeData()
            navigation.push('Home')
            
        }).catch((error) => {
            setShowPage(true)
            setShowAuthError(error.code)
            console.log(error.code)
        })
      }
        
    }

    

    
  return showPage ? (
    <View style={styles.mainContainer}>
      <View style={styles.topSection}>
          <Text>LoginScreen</Text>
      </View>
      <TextInput keyboardType='email-address' textContentType='emailAddress' style={styles.input} placeholder={showError && email == "" ? "Email field is empty" : "Enter your email"} value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} secureTextEntry={true} textContentType='password' placeholder={showError && password == "" ? "Password field is empty" : "Enter your password"} value={password} onChangeText={setPassword} />
      <View style={{alignItems: 'center'}}>
        <Text style={{color: "red"}}>{showAuthError}</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin()}>
          <Text style={{fontSize: 20, color: "white", fontWeight: 'bold'}}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.registerView}>
        <Text style={{marginRight: 5}}>Not an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={{textDecorationLine: 'underline'}}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <LoadingScreen />
  )
}

const styles = StyleSheet.create({
    mainContainer: {
      justifyContent: 'center',
      flex: 1,
      backgroundColor: "#FAF0E4"
    },

    input: {
      borderWidth: 1,
      marginHorizontal: 10,
      marginTop: 10,
      borderRadius: 20,
      padding: 10,
      fontSize: 20
  },

    loginButton: {
        marginVertical: 20,
        marginHorizontal: 20,
        backgroundColor: "#FF8551",
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
    },
    topSection: {
        alignItems: 'center'
    },

    registerView: {
      flexDirection: 'row',
      paddingHorizontal: 10
    }
})

export default LoginScreen