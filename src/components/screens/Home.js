import { View, Text, TouchableHighlight, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, BackHandler, Alert } from 'react-native'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

import LENSICON from "../../assets/icons/zoom-lens_1.svg"
import ThreeDotsIcon from "../../assets/icons/dots.svg"
import {ref, set } from "firebase/database";
import {auth, db, database} from '../includes/FireBase'
import { doc, getDocs, collection, setDoc, getDoc, updateDoc, query, onSnapshot, where, serverTimestamp } from "firebase/firestore";




const Home = ({navigation, route}) => {

  const [userList, setUserList] = useState([]);
  const [showSettings, setShowSettings] = useState(false)


  const getChats = async () => {
    const userRef = doc(db, "userchats", auth.currentUser.uid)
    try {
      const users = await getDoc(userRef)

      if(users.exists()) {
        setUserList(users.data())

      }
       

    } catch(error) {
      console.log("some thing wrong")
    }
      
  }

  useEffect(() => {
    setShowSettings(false)
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };
    auth.currentUser && getChats()

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
    

  }, [auth.currentUser])

  let removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@user_details')
    } catch(e) {
      // remove error
    }
  
    console.log('Done.')
  }

  let handleLogout = () => {
    signOut(auth).then(() => {
        console.log('sign out successfully')
        removeValue()
        navigation.push("Login")
    }).catch((error) => {
        console.log('something went wrong')
    })
}

  

  

  const selectUser = (userid, userinfo) => {
    if(showSettings) {
      setShowSettings(false)
    } else {
      navigation.navigate("ChatScreen", {
        username: userinfo.name,
        profilePic: userinfo.profilePic,
        chatboxid: userid,
        selectUser: userinfo.uid,
        selectedUserprofilePic: userinfo.profilePic,
        selectedUsername: userinfo.name,
      })

    }
  } 
    
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#FAF0E4"}}>
      <View >

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, backgroundColor: '#9BCDD2', position: 'relative', zIndex: 10}}>
          <View>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>ChatX</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.push("SearchScreen")}>
              <LENSICON width={30} height={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
              <ThreeDotsIcon width={30} height={30} />
            </TouchableOpacity>
          </View>
          {
            showSettings ? (
              <View style={{position: 'absolute', bottom: -50, right: 10, width: 150, backgroundColor: "white", padding: 10, alignItems: 'center'}}>
                <View >
                  <TouchableOpacity  onPress={() => handleLogout()}>
                    <Text style={{fontSize: 20}}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }
        </View>
        <ScrollView >
          {
            Object.entries(userList).length > 0 ? (
              Object.entries(userList)?.map((item) => (
                <TouchableOpacity style={{padding: 10, marginTop: 10}} key={item[0]} onPress={() => selectUser(item[0], item[1].userInfo)}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                      <TouchableOpacity style={{marginRight: 60}}>
                        <Image style={{width: 50, height: 50, resizeMode: 'contain', borderRadius: 50}} source={{uri: item[1].userInfo.profilePic}} />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Text style={{fontSize: 20}}>{item[1].userInfo.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))

            ) : <Text>No users to chat</Text>
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Home