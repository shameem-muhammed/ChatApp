import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Image, RefreshControl, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import BACKARROW from "../../assets/icons/arrow.svg"
import LENSICON from "../../assets/icons/zoom-lens_1.svg"

import { doc, getDocs, collection, setDoc, getDoc, updateDoc, query, onSnapshot, where, serverTimestamp } from "firebase/firestore";
import {ref, set } from "firebase/database";
import {auth, db, database} from '../includes/FireBase'
import AddUserLoadingScreen from '../includes/AddUserLoadingScreen';
import LoadingScreen from '../includes/LoadingScreen';




const SearchListScreen = ({navigation}) => {

  const [searchUser,setSearchUser] = useState("")
  const [searchList, setSearchList] = useState([])
  const [allUserList, setAllUserList] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [showLoader, setShowLoader] = useState(true)
  const [showError, setShowError] = useState(false)
  const [userFound, setUserFound] = useState(true)


  let getAllUsers = async () => {
    if(searchUser == "") {
      setSearchList([])
      let userList = []
      let q = collection(db, "users")
      let querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        if(doc.exists()) {
          userList.push(doc.data())
        }
      })
  
      if(userList !== null) {
        setAllUserList(userList)
        console.log(userList)
      } else {
        console.log("no users found")
      }
    } 
  }

  useEffect(() => {
    

    getAllUsers()
  }, [searchUser, userFound])

  let handleSearch = async () => {
    setShowError(true)
    let res = []
      const q = query(collection(db, "users"), where("name", "==", searchUser));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if(doc.exists()) {
          setShowError(false)

          res.push(doc.data())

        } else {
          setShowError(false)
        }
        
      });
      if(res.length > 0) {

        setSearchList(res)
        setRefreshing(!refreshing);

      } else {
        setUserFound(false)
      }
  }

  let handleIndiviual = async (id, user) => {
    setShowLoader(false)
    const combainid = auth.currentUser.uid > id ? auth.currentUser.uid + id : id + auth.currentUser.uid

  set(ref(database, 'userchats/' + combainid), {
    uid: combainid,
    lastmessage: "",
  });
  

  try {
    
    const docSnap = await getDoc(doc(db, 'chats', combainid));
    if(!docSnap.exists()) {
      await setDoc(doc(db, "chats", combainid), {
        messages: []
      })

      await updateDoc(doc(db, "userchats", auth.currentUser.uid), {
        [combainid+".userInfo"]: {
          uid: user.uid,
          name: user.name,
          profilePic: user.profilePic,
        },
        [combainid+".date"]: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "userchats", user.uid), {
        [combainid+".userInfo"]: {
          uid: auth.currentUser.uid,
          name: auth.currentUser.displayName,
          profilePic: auth.currentUser.photoURL,
        },
        [combainid+".date"]: serverTimestamp(),
      });

      setTimeout(() => {
        navigation.push("Home")
        
      }, 1000);

    } else {
      navigation.push("Home")
    }
  } catch(err) {
    console.log(err)
  } 

  }

  let onChangeText = () => {
    if(searchUser == "") {
      setUserFound(true)
    }
  }

  return showLoader ? (
    <SafeAreaView>
      <View style={{flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: "#9BCDD2"}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BACKARROW width={30} height={20} />
        </TouchableOpacity>
        <TextInput onChange={() => onChangeText()} style={{flex: 1, backgroundColor: "white", borderRadius: 20, height: 40, padding:10}} placeholder='Search' value={searchUser} onChangeText={setSearchUser}  />
        <TouchableOpacity onPress={() => handleSearch()}>
        <LENSICON width={30} height={30} />
        </TouchableOpacity>
        
        
      </View>
      {
        userFound ? (

          <View>
            <FlatList
              data={searchList.length > 0 ? searchList : allUserList}
              renderItem={({item}) =>  <View style={{marginTop: 10, paddingHorizontal: 5}}>
              <TouchableOpacity disabled={item.uid == auth.currentUser.uid ? true : false}  onPress={() => handleIndiviual(item.uid, item)} style={{flexDirection: "row"}}>
                <TouchableOpacity style={{marginRight: 10}}>
                  <Image style={{width: 50, height: 50, resizeMode: 'contain', borderRadius: 50}} source={{uri: item.profilePic}} />
                </TouchableOpacity>
                <View style={{justifyContent: 'center'}}>
                  <Text style={{fontSize: 20}}>{item.uid == auth.currentUser.uid ? `${item.name} (You)` : item.name}</Text>
                </View>
              </TouchableOpacity>
            </View>}
              keyExtractor={item => item.uid}
            />
          
          </View>
        ) : (
          <View>
            <Text>No user found</Text>
          </View>
        )

      }
    </SafeAreaView>
  ) : (
    <AddUserLoadingScreen />
  )
}

export default SearchListScreen