import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import React, { useState } from 'react'
import {auth} from '../includes/FireBase'
import { signInWithEmailAndPassword } from 'firebase/auth'



const LoginScreen = ({navigation}) => {
  
    const [email, setEmail] = useState("shameem@example.com")
    const [password, setPassword] = useState("adminshameem")


   
    const handleLogin = () => {
        
        signInWithEmailAndPassword(auth, email, password).then((userCredintail) => {
            navigation.navigate('Home')
            
        }).catch((error) => {
            console.log(error)
        })
    }

    

    
  return (
    <View>
        <View style={styles.topSection}>
            <Text>LoginScreen</Text>
        </View>
      <TextInput style={styles.input} placeholder='Enter your email' value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder='Enter your password' value={password} onChangeText={setPassword} />
      <View style={styles.loginButton}>
        <Button  title='Login' onPress={() => handleLogin()} />
      </View>
      <View>
        <Text>not a account?</Text>
        <Text onPress={() => navigation.navigate("Register")}>Register</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        marginHorizontal: 10,
        marginTop: 10
    },

    loginButton: {
        marginVertical: 20,
        marginHorizontal: 20
    },
    topSection: {
        alignItems: 'center'
    }
})

export default LoginScreen