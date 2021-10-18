
import React, { Component } from 'react'
import {
StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform, Button
} from 'react-native'
import { Audio, Permissions, FileSystem } from 'expo-av'
import axios from 'axios'

const recordingOptions = {
android: {
  extension: '.m4a',
  outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
  audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
  sampleRate: 44100,
  numberOfChannels: 1,
  bitRate: 128000,
},
ios: {
  extension: '.wav',
  audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
  sampleRate: 44100,
  numberOfChannels: 1,
  bitRate: 128000,
  linearPCMBitDepth: 16,
  linearPCMIsBigEndian: false,
  linearPCMIsFloat: false,
},
}

const styles = StyleSheet.create({
container: {
  marginTop: 40,
  backgroundColor: '#fff',
  alignItems: 'center',
},
button: {
  backgroundColor: '#1e88e5',
  paddingVertical: 20,
  width: '90%',
  alignItems: 'center',
  borderRadius: 5,
  padding: 8,
  marginTop: 20,
},
text: {
  color: '#fff',
}
})

export default class record extends Component {
constructor(props) {
  super(props)
  this.recording = null
  this.state = {
    isFetching: false,
    isRecording: false,
    transcript: '',
    record: undefined
  }
}

deleteRecordingFile = async () => {
  try {
    const info = await this.recording.getURI();
    await info.uri;
  } catch (error) {
    console.log('There was an error deleting recorded file', error)
  }
}

getTranscription = async () => {

  this.setState({ isFetching: true });


  try {

    const uri = this.recording.getURI();

   //************* backend **************//
   const formData = new FormData();
   // put record into file
    formData.append('file', {
      uri,
      type: Platform.OS === 'ios' ? 'audio/x-wav' : 'audio/m4a',
      name: Platform.OS === 'ios' ? `${Date.now()}.wav` :`${Date.now()}.m4a`,
    })


     // post the formData to our backend
  /*   await axios.post('http://192.168.1.110:2080/speech',{
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       })

      this.setState({ transcript: data.transcript })
*/
    fetch("http://192.168.1.110:2070/speech" , {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then((res) => {
      this.setState({ transcript: res.transcript });
    })
    .catch((error) => {
    alert('Error:'+error);
    });


}



     catch (error) {
    alert('There was an error reading file'+error)
     this.stopRecording()
     this.resetRecording()
  }
  this.setState({ isFetching: false });
}

startRecording = async () => {
  try {

  await Audio.requestPermissionsAsync();
  this.setState({ isRecording: true });
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    playThroughEarpieceAndroid: true,
  });
  alert("start");
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(recordingOptions);
  await recording.startAsync();
  this.recording = recording;

  }
  catch (error) {
    alert(error);
    this.stopRecording();
  }
}

stopRecording = async () => {

 try{

 this.setState({ isRecording: false });
 await this.recording.stopAndUnloadAsync();

}
catch(error){
alert("from stop " + error);
}

}

resetRecording = () => {
  this.deleteRecordingFile()
  this.recording = null
}

handleOnPressOut = () => {
  this.stopRecording()
  this.getTranscription()
}

render() {
  const {
    isRecording, transcript, isFetching, record
  } = this.state
  return (
    <View style={styles.container}>
    <Button
        title={ isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? this.handleOnPressOut : this.startRecording}
      />
      <Text>
        {`${transcript}`}
      </Text>
    </View>
  )
}
}
