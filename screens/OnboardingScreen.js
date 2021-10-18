import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import Onboarding from "react-native-onboarding-swiper";

const fetchFont = () => {
  return Font.loadAsync({
    "pac-f": require("../assets/fonts/Pacifico-Regular.ttf"),
    "balsam-f": require("../assets/fonts/BalsamiqSans-Regular.ttf"),
    Kaushan: require("../assets/fonts/KaushanScript-Regular.ttf"),
  });
};
const { width, height } = Dimensions.get("window");

export default function OnboardingScreen({ navigation, item }) {
  const [fontLoaded, setfontLoaded] = useState(false);
  //Skip
  const skip = ({ ...props }) => {
    return (
      <TouchableOpacity style={{ marginHorizontal: 8 }} {...props}>
        <Text style={{ fontFamily: "Kaushan", fontSize: 20 }}>Skip</Text>
      </TouchableOpacity>
    );
  };
  //Next
  const next = ({ ...props }) => {
    return (
      <TouchableOpacity style={{ marginHorizontal: 8 }} {...props}>
        <Text style={{ fontFamily: "Kaushan", fontSize: 20 }}>Next</Text>
      </TouchableOpacity>
    );
  };
  //Done
  const done = ({ ...props }) => {
    return (
      <TouchableOpacity style={{ marginHorizontal: 8 }} {...props}>
        <Text
          style={{
            fontFamily: "Kaushan",
            fontSize: 24,
            color: "goldenrod",
            fontWeight: "bold",
          }}
        >
          Let's Start
        </Text>
      </TouchableOpacity>
    );
  };
  //Dots
  const dots = ({ selected }) => {
    let backgroundColor;
    let width;
    backgroundColor = selected ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.3)";
    width = selected ? 13 : 6;
    return (
      <View
        style={{
          width,
          height: 6,
          marginHorizontal: 3,
          backgroundColor,
          borderRadius: 5,
        }}
      ></View>
    );
  };
  //Main---------------------------------------------
  if (fontLoaded) {
    return (
      <Onboarding
        SkipButtonComponent={skip}
        NextButtonComponent={next}
        DoneButtonComponent={done}
        DotComponent={dots}
        onSkip={() => navigation.replace("Start")}
        onDone={() => navigation.navigate("Start")}
        pages={[
          {
            backgroundColor: "#fff",
            image: (
              <ImageBackground
                style={{ width: "100%", height: "105%" }}
                source={require("../assets/salsa2.gif")}
                imageStyle={{ opacity: 0.5 }} //so any children of it don't affected
              >
                <View
                  style={{
                    position: "absolute",
                    top: -150,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.appName}>Fruitful Health</Text>
                  <Text style={styles.paragh}>
                    Welcome to your Health Life Style Application,Wishing you a
                    Great Experience.
                  </Text>
                </View>
              </ImageBackground>
            ),
            title: "",
            subtitle: "",
          },

          {
            backgroundColor: "#fff",
            image: (
              <ImageBackground
                style={{ width: "100%", height: "105%" }}
                source={require("../assets/put.gif")}
                imageStyle={{ opacity: 0.5 }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: -150,
                    left: 2,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.titlee}>Health Recipes</Text>
                  <Text style={styles.paragh}>
                    Learn different recipes , Prepare a Delicious and Healthy
                    meals.
                  </Text>
                </View>
              </ImageBackground>
            ),
            title: "",
            subtitle: "",
          },

          {
            backgroundColor: "#fff",
            image: (
              <ImageBackground
                style={{ width: "100%", height: "104%" }}
                source={require("../assets/sport1.jpg")}
                imageStyle={{ opacity: 0.6 }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: -150,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.titlee}>Workout Exercises</Text>
                  <Text style={styles.paragh}>
                    Enjoy different Exercise for each body part and for
                    different fitness level.
                  </Text>
                </View>
              </ImageBackground>
            ),
            title: "",
            subtitle: "",
          },

          {
            backgroundColor: "#fff",
            image: (
              <ImageBackground
                style={{ width: "100%", height: "108%" }}
                source={require("../assets/water.gif")}
                imageStyle={{ opacity: 0.5 }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: -150,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.titlee}>Tips & Advices </Text>
                  <Text style={styles.paragh}>
                    Get a Helpful Advices and Tips for your Health.
                  </Text>
                </View>
              </ImageBackground>
            ),
            title: "",
            subtitle: "",
          },
        ]}
      />
    );
  }
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFont}
        onError={() => console.log("ERROR")}
        onFinish={() => {
          setfontLoaded(true);
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    color: `#000000`,
    fontWeight: "500",
    fontSize: width / 6.8,
    flexDirection: "row",
    fontFamily: "pac-f",
  },
  paragh: {
    color: `#000000`,
    fontSize: width / 15,
    marginTop: 65,
    fontFamily: "Kaushan",
  },
  titlee: {
    color: `#000000`,
    fontWeight: "bold",
    fontSize: 40,
    fontFamily: "Kaushan",
    opacity: 0.8,
    //left: 45,
  },
  titlee3: {
    color: `#000000`,
    fontWeight: "bold",
    fontSize: 40,
    fontFamily: "Kaushan",
    opacity: 0.7,
    //  left: 20,
  },
});
