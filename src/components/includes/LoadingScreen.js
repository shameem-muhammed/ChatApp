import { StyleSheet, View, Text } from "react-native";
import React, {useState} from 'react'
import LottieView from "lottie-react-native";

const LoadingScreen = () => {
    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FAF0E4"}}>
            <LottieView
                    source={require("../../assets/animated-icons/authuserloader.json")}
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

export default LoadingScreen