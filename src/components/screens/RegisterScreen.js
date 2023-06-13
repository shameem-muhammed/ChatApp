import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native'
import React, {useCallback, useState} from 'react'
import { ref, uploadBytesResumable, getDownloadURL, uploadString, uploadBytes,  } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../includes/FireBase";
import { updateProfile } from "firebase/auth";
import DocumentPicker from 'react-native-document-picker'
import ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import RegisterLoadingScreen from '../includes/RegisterLoadingScreen';

const RegisterScreen = ({navigation}) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showLoader, setShowLoader] = useState(true);
    const [image, setImage] = useState(null);
    const [showError, setShowError] = useState(false)
    const [showAuthError, setShowAuthError] = useState("")

    let uriToBlob = (uri) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          // return the blob
          resolve(xhr.response);
        };
        
        xhr.onerror = function() {
          // something went wrong
          reject(new Error('uriToBlob failed'));
        };
        // this helps us get a blob
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        
        xhr.send(null);
      });
    }

    const selectImage = () => {
      const options = {
        maxWidth: 2000,
        maxHeight: 2000,
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };
    
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          
          console.log(response["assets"]);
          setImage(response["assets"][0]);
        }
      });
    };

    const handleRegister = async () => {
      if(email == "" || password == "" || name == "") {
        setShowError(true)
      } else {

        setShowLoader(false)
          try {
              createUserWithEmailAndPassword(auth, email, password).then((user) => {
                const storageRef = ref(storage, name);
                uriToBlob(image.uri).then((blob) => {
                  const uploadTask = uploadBytesResumable(storageRef, blob);
  
                  uploadTask.then(() => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                      async (downloadURL) => {
                        await updateProfile(user.user, {
                          displayName: name,
                          photoURL: downloadURL,
                        });
                        await setDoc(doc(db, "users", user.user.uid), {
                          uid: user.user.uid,
                          name: name,
                          email: email,
                          profilePic: downloadURL,
                          incomingcount: 0,
                          ispinned: false,
                        });
        
                        await setDoc(doc(db, "userchats", user.user.uid), {})
                      }
                    ).catch((error) => {
                      console.log(error)
                      setShowAuthError(error.code)
                      setShowLoader(true)
                    })
                    
                    navigation.navigate("Login")
  
                  }).catch((error) => {
                    console.log(error)
                    setShowAuthError(error.code)
                    setShowLoader(true)
                  })
  
                }).catch((error) => {
                  setShowLoader(true)
                  setShowAuthError(error)
                  console.log(error);
                }) 
                
              });
            } catch (err) {
              setShowLoader(true)
              setShowAuthError(err)
              console.log(err);
            }
      }
    }


  return showLoader ? (
    <View style={styles.mainContainer}>
        <View style={styles.topSection}>
            <Text>RegisterScreen</Text>
        </View>
      <TextInput style={styles.input} placeholder={showError && name == "" ? "Name field is empty" : "Enter your name"} value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder={showError && email == "" ? "Email field is empty" : "Enter your email"} value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder={showError && password == "" ? "Password field is empty" : "Enter your password"} value={password} onChangeText={setPassword} />
      <View style={styles.profileView}>
        {
          image ? <Image style={styles.profileImage} source={{uri: image.uri}} /> : null
        }
      </View>
      <View>
        <TouchableOpacity style={styles.loginButton} onPress={() => selectImage()}>
          <Text style={{fontSize: 20, color: "white", fontWeight: 'bold'}}>Select profile picture</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.loginButton} onPress={() => handleRegister()}>
          <Text style={{fontSize: 20, color: "white", fontWeight: 'bold'}}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginView}>
        <Text style={{marginRight: 5}}>Already an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{textDecorationLine: 'underline'}}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <RegisterLoadingScreen />
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

    profilePickerButton: {
      marginVertical: 20,
      marginHorizontal: 20,
      marginTop: 10
    },
    profileView: {
      alignItems: 'center',
      marginVertical: 10
    },

    profileImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      borderRadius: 50
    },

    loginView: {
      flexDirection: 'row',
      paddingHorizontal: 10
    }
})

export default RegisterScreen