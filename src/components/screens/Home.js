import { View, Text, TouchableHighlight, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

import LENSICON from "../../assets/icons/zoom-lens_1.svg"
import {ref, set } from "firebase/database";
import {auth, db, database} from '../includes/FireBase'
import { doc, getDocs, collection, setDoc, getDoc, updateDoc, query, onSnapshot, where, serverTimestamp } from "firebase/firestore";




const Home = ({navigation, route}) => {

  const [userList, setUserList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchUser,setSearchUser] = useState("")
  const [searchList, setSearchList] = useState([])
  const [currentUser, setCurrentUser] = useState()


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
    auth.currentUser && getChats()
    

  }, [auth.currentUser])

  

  let handleSearch = async (e) => {
    let res = []
      const q = query(collection(db, "users"), where("name", "==", searchUser));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if(doc.exists()) {
          res.push(doc.data())

        } else {
          setSearchList(null)
        }
        
      });
      if(res !== null) {
        setSearchList(res)
        console.log(res)

      } else {
        console.log("no user found")
      }
  }

  const selectUser = (userid, userinfo) => {
    navigation.navigate("ChatScreen", {
      username: userinfo.name,
      profilePic: userinfo.profilePic,
      chatboxid: userid,
      selectUser: userinfo.uid,
      selectedUserprofilePic: userinfo.profilePic,
      selectedUsername: userinfo.name,
    })
  } 
    
  return (
    <SafeAreaView>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, backgroundColor: 'red'}}>
        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>SpaceX</Text>
        </View>
        {
          showSearch ? (
          <View>
            <TextInput placeholder='Search' value={searchUser} onChangeText={setSearchUser} onKeyPress={(e) => handleSearch(e)} />
          </View>

          ): null
        }
        <View>
          {
            !showSearch ? (
              <TouchableOpacity onPress={() => setShowSearch(true)}>
                <LENSICON width={30} height={30} />
              </TouchableOpacity>

            ): (
              <TouchableOpacity onPress={() => setShowSearch(false)}>
                <Text style={{fontSize: 30, fontWeight: 'bold', color: "white"}}>X</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
      <ScrollView>
        {
          Object.entries(userList)?.map((item) => (
            <TouchableOpacity style={{padding: 10}} key={item[0]} onPress={() => selectUser(item[0], item[1].userInfo)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <TouchableOpacity style={{marginRight: 60}}>
                    <Image style={{width: 50, height: 50, resizeMode: 'contain'}} source={{uri: item[1].userInfo.profilePic}} />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text>{item[1].userInfo.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home