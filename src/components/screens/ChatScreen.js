import { View, Text, Image, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import uuid from 'react-native-uuid';

import { doc, getDoc, arrayUnion, updateDoc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import {auth, db, database} from '../includes/FireBase'
import {ref, set, child, get } from "firebase/database";


import SendIcon from "../../assets/icons/send.svg"
import MicIcon from "../../assets/icons/mic.svg"
import PaperClip from "../../assets/icons/paper-clip.svg"

const ChatScreen = ({route, navigation}) => {
    const { username, profilePic, chatboxid, selectUser, selectedUsername, selectedUserprofilePic } = route.params;
    const [message, setMessage] = useState("")
    const [load, setLoad] = useState(false)
    let [chatDetails, setChatDetails] = useState(null)
    let [render, setRender] = useState(false)

    let scrollViewRef = useRef(null)


    const fetchData = async () => {

      onSnapshot(doc(db, "chats", chatboxid), (doc) => {
        setChatDetails(doc.data());
        setRender(true)
    });

    get(child(ref(database), `userchats/${chatboxid}`)).then( async (snapshot) => {
        if (snapshot.exists()) {
            
            if(snapshot.val().lastmessage) {
                var today = new Date();
                
                await updateDoc(doc(db, "userchats", auth.currentUser.uid), {
                    [chatboxid+".lastmessage"]: snapshot.val().lastmessage,
                    [chatboxid+".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, "userchats", selectUser), {
                    [chatboxid+".lastmessage"]: snapshot.val().lastmessage,
                    [chatboxid+".date"]: serverTimestamp()
                });

            }
        } else {
          console.log("No data available");

        }
      }).catch((error) => {
        console.error(error);
      });
    }

  useEffect(() => {
    console.log(auth.currentUser)
    fetchData()
  }, [load])

  let sendMessage = async () => {
    if(message !== "") {
        const userchatRef = doc(db, "chats", chatboxid);
        var today = new Date();
        await updateDoc(userchatRef, {
            messages: arrayUnion({
                messageid: uuid.v4(),
                senderdata: {
                    name: auth.currentUser.displayName,
                    profilePic: auth.currentUser.photoURL,
                    useruid: auth.currentUser.uid
                },
                recieverdata: {
                    name: selectedUsername,
                    profilePic: selectedUserprofilePic,
                    useruid: selectUser
                },
                message: message,
                messagetype: 'text',
                timestamp: `${today.getDate()}-${today.getMonth()}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`
            })
        });
        set(ref(database, 'userchats/' + chatboxid), {
            uid: chatboxid,
            lastmessage: message,
          })
          .then(() => {
            // Data saved successfully!
            setMessage("")
            setLoad(!load)
          })
          .catch((error) => {
            console.log(error)
            // The write failed...
          });

        
      
        setLoad(!load)

    }


}

  const renderChats = () => {
    return render ? chatDetails.messages.map((chat) => (
      <View  style={chat.senderdata.useruid == auth.currentUser.uid ? {flexDirection: 'row-reverse', paddingHorizontal: 10} : {flexDirection: 'row', paddingHorizontal: 10}}>
        <View >
          {
            chat.messagetype == "text" ? (
              <View style={{backgroundColor: "blue", maxWidth: 250, minWidth: 100, marginBottom: 10, padding: 10, borderRadius: 10}}>
                <Text style={{fontSize: 20, color: "white"}}>{chat.message}</Text>
              </View>

            ): null
          }
        </View>
      </View>
    )): null
  }

  const handleScroll = () => {
    scrollViewRef.current.scrollToEnd({animated: true})
  }


  return (
    <View style={{flex: 1}}>
      <ScrollView ref={scrollViewRef} onContentSizeChange={() => handleScroll()}>
        {renderChats()}
      </ScrollView>
      <View style={{flexDirection: 'row', alignItems: 'center', width: "100%"}} >
        <View>
          <TouchableOpacity>
            <PaperClip width={20} height={20} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput onPressOut={() => handleScroll()} multiline={true} style={{flex: 10}} placeholder='enter message' value={message} onChangeText={setMessage} />
            {
              message ? (
              <TouchableOpacity onPress={sendMessage} style={{flex: 2}}>
                <SendIcon width={20} height={20} />
              </TouchableOpacity>

              ) : (
              <TouchableOpacity style={{flex: 2}}>
                <MicIcon width={20} height={20} />
              </TouchableOpacity>

              )
            }
        </View>
      </View> 
    </View>
  )
}



export default ChatScreen