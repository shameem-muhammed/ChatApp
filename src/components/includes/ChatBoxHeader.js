import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import BACKARROW from "../../assets/icons/arrow.svg"

const ChatBoxHeader = ({navigation ,profilePic, userName, currentUserDetails}) => {
  return (
    <View style={{flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 5, alignItems: 'center', backgroundColor: "#9BCDD2"}}>
      <View style={{marginRight: 10}}>
        <TouchableOpacity onPress={() => navigation.navigate("Home", {currentUserDetails: currentUserDetails})}>
            <BACKARROW width={30} height={20} />
        </TouchableOpacity>
      </View>
      <View style={{marginRight: 10}}>
        <Image style={{width: 40, height: 40, resizeMode: 'contain', borderRadius: 50}} source={{uri: profilePic}} />
      </View>
      <View>
        <Text style={{fontSize:30, fontWeight: 'bold'}}>{userName}</Text>
      </View>
    </View>
  )
}

export default ChatBoxHeader