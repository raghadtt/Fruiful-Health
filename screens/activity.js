import React,{useEffect,useState} from 'react';
import { StyleSheet, Text, View, Dimensions,Image,ImageBackground} from 'react-native';
const { width, height } = Dimensions.get('window');
import { Pedometer } from 'expo-sensors';
import WebView from "react-native-webview";


const activity = ({route, navigation}) => {
  const [pastStepCount, setpastStepCount] = React.useState(0); //steps
  var _subscription; //steps

  const _subscribe = () => {
       _subscription = Pedometer.watchStepCount();

       Pedometer.isAvailableAsync().then(
         result => {  },
         error => {alert(error) }
       );

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);
      Pedometer.getStepCountAsync(start, end).then(
        result => {
          _unsubscribe();
        },
        error => {
        setpastStepCount('Could not get stepCount: ' + error);

        }
      );

    };

const _unsubscribe = () => {

  _subscription && _subscription.remove();
  _subscription = null;
 };

 useEffect(() => {
   _subscribe();

}, []);


  return (
        <View style={styles.container}>
  <Image source={{uri: "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAQECAQEBAgICAgICAgICAQICAgICAgICAgIBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAv/CABEIAgMCAwMBEQACEQEDEQH/xAA7AAEAAAYDAQEAAAAAAAAAAAAABQYHCAkKAgMEAQsBAQAABwEBAQAAAAAAAAAAAAABAgMEBQYHCAkK/9oADAMBAAIQAxAAAADf4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8g6UfNCHyJF2HadpzPh9AAAAAAAAAAAAAAAAAAAAABC4JKgkSMKXRkkGaHdLHhJN4pakPggxL0ZOmEZZrUvTTqQSpJzjD0SVIXVpeyWKaX0HYe1GIIRZCcZlUpJqwy1KpwjNUY8gAAAAAAAAAAAAAAAeWEbMpZLVK1GCExyVal0atbKFzUelXSTUkyOP60vvlnhNWj7JZuCPnmlQeWeXsRSPRGbyzQQjDKlLgh7JJvRLPyhNB4y0+nkpzUoSVNTmeSfKFRuqqRiAAAAAAAAAAAAAABJ9OfHHUtqnxj3EQln9sJ+2EfJGHinkhtWn0zS/D6jyPiHOWZM+wj9Q+okEJvpyAhD7M4wmSyoR+QjCp5ZVhLW2nPeeqAAAAAAAAAAAAAAASrJHHXNQqbLPOMJvdUl+TS9EyExhDIw+HUj5jzxh1nyD5GP1DlCb4hyR9EHYc4ucsfWj64R9MseaELS8ac8Ylj5Iy07nluMjG4lOAAAAAAAAAAAAAABJkk2PWpbTfLNMMJpmJplm4EwwjTuaWXIIHGWDTQ7SCRhCIw4RQtDyQegisJo7BM8s0xJ5jlj7yLo9ZwjLKCHOLhLGDTSy9V"}}/>
        </View>
    );

};

export default activity;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
