import { StyleSheet, View, Text } from "react-native";
import React, {useState} from 'react'
import LottieView from "lottie-react-native";

const AddUserLoadingScreen = () => {
    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <LottieView
                    source={require("../../assets/animated-icons/adduserloader.json")}
                    style={styles.animation}
                    autoPlay
                />
        </View>
      );
}

const styles = StyleSheet.create({
    animation: {
      width: 100,
      height: 100,
    },
  });

export default AddUserLoadingScreen