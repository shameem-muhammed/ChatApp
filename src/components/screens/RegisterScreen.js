import { View, Text, StyleSheet, TextInput, Button, Image } from 'react-native'
import React, {useCallback, useState} from 'react'
import { ref, uploadBytesResumable, getDownloadURL, uploadString, uploadBytes,  } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../includes/FireBase";
import { updateProfile } from "firebase/auth";
import DocumentPicker from 'react-native-document-picker'
import ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';

const RegisterScreen = ({navigation}) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fileResponse, setFileResponse] = useState([]);
    const [image, setImage] = useState(null);

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
                  );
                  navigation.navigate("Login")

                }).catch((error) => {

                })

              })
              
            });
          } catch (err) {
            setErr(true);
            console.log(err);
          }
    }


  return (
    <View>
        <View style={styles.topSection}>
            <Text>RegisterScreen</Text>
        </View>
      <TextInput style={styles.input} placeholder='Name' value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder='Enter your password' value={password} onChangeText={setPassword} />
      {
        image ? <Image style={{width: 100, height: 100, resizeMode: 'contain'}} source={{uri: image.uri}} /> : null
      }
      
      <Button title="Select profile picture 📑" onPress={selectImage} />
      <View style={styles.loginButton}>
        <Button  title='Register' onPress={() => handleRegister()} />
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

export default RegisterScreen