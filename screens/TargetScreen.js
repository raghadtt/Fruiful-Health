import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import {
  Ionicons,
  AntDesign,
  SimpleLineIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { RadioButton } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const ScreenOne = ({ navigation, route }) => {
  //const userData = route.params.userData;
  const [flag, setflag] = React.useState(null);
  const user = route.params.user;
  const gender = route.params.gender;
  const weight = route.params.weight;
  const height = route.params.height / 100.0;
  let BMI = weight / (height * height);
  let classi = "";
  let sys = "";
  let least = height * height * 18.5;
  let highest = height * height * 24.9;
  let ideal = 0;
  let BMIPrinted = Math.round((BMI + Number.EPSILON) * 10) / 10;
  if (gender == 0) {
    ideal = (height * 100 - 150) * 1.1 + 48;
  } else {
    ideal = (height * 100 - 150) * 0.9 + 45;
  }
  least = Math.round((least + Number.EPSILON) * 10) / 10;
  highest = Math.round((highest + Number.EPSILON) * 10) / 10;
  if (BMI < 18.5) {
    classi = "Under Weight";
    sys = "Gain Weight";
  } else if (BMI >= 18.5 && BMI < 25) {
    classi = "Perfect Weight";
    sys = "Maintains Weight";
  } else if (BMI >= 25 && BMI < 30) {
    classi = "Over Weight";
    sys = "Lose Weight";
  } else if (BMI >= 30 && BMI < 35) {
    classi = "Obesity Class 1";
    sys = "Lose Weight";
  } else if (BMI >= 35 && BMI < 40) {
    classi = "Obesity Class 2";
    sys = "Lose Weight";
  } else if (BMI >= 40) {
    classi = "Extreme Obesity";
    sys = "Lose Weight";
  }
  const [value, setValue] = React.useState(
    sys == "Gain Weight" ? "third" : sys == "Lose Weight" ? "first" : "second"
  );

  const maintane = () => {
    if (value == "second") {
      navigation.navigate("ScreenThree", {
        w: weight,
        //sign: sign,
        user: user,
        value: value,
        weight: weight,
        height: height,
        gender: gender,
      });
    } else {
      navigation.navigate("ScreenTwo", {
        ideal: ideal,
        least: least,
        highest: highest,
        value: value,
        user: user,
        weight: weight,
        gender: gender,
        flag: flag,
        height: height,
      });
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Calculate new Plan",
      headerRight: () => <Button onPress={maintane} title="Next" />,
    });
  }, [navigation, value]);

  return (
    <ImageBackground
      style={{ width: "100%", height: "105%" }}
      source={require("../assets/bg2.png")}
      imageStyle={{ opacity: 0.15 }} //so any children of it don't affected
    >
      <View style={{ justifyContent: "center" }}>
        <Text style={styles.text1}>
          Your BMI (Body Mass Index) = {BMIPrinted}
        </Text>
        <Text style={styles.text2}>Based on BMI calculation Your Body has</Text>
        <Text style={styles.bodyclass}>({classi})</Text>

        <View style={styles.systemtargetView}>
          <Text style={styles.text3}>Your System Target</Text>

          <RadioButton.Group
            onValueChange={(value) => setValue(value)}
            value={value}
          >
            <RadioButton.Item
              label={
                sys == "Lose Weight" || sys == "Maintains Weight" ? (
                  <Text style={{ color: "black", fontFamily: "balsam-f" }}>
                    <Feather name="arrow-down-right" size={24} color="black" />
                    {"    Lose Weight"}
                  </Text>
                ) : (
                  <View>
                    <Text style={{ color: "gray", fontFamily: "balsam-f" }}>
                      <Feather name="arrow-down-right" size={24} color="gray" />
                      {"    Lose Weight"}
                    </Text>
                  </View>
                )
              }
              disabled={
                sys == "Lose Weight" || sys == "Maintains Weight" ? false : true
              }
              value="first"
              onPress={(flag) => setflag(value)}
            />
            <RadioButton.Item
              label={
                sys == "Maintains Weight" ? (
                  <Text style={{ color: "black", fontFamily: "balsam-f" }}>
                    <SimpleLineIcons name="emotsmile" size={24} color="black" />
                    {"    Maintain"}
                  </Text>
                ) : (
                  <Text style={{ color: "gray", fontFamily: "balsam-f" }}>
                    <SimpleLineIcons name="emotsmile" size={24} color="gray" />
                    {"    Maintain"}
                  </Text>
                )
              }
              disabled={sys == "Maintains Weight" ? false : true}
              value="second"
              onPress={(flag) => setflag(value)}
            />
            <RadioButton.Item
              label={
                sys == "Gain Weight" || sys == "Maintains Weight" ? (
                  <Text style={{ color: "black", fontFamily: "balsam-f" }}>
                    <Feather name="arrow-up-right" size={24} color="black" />
                    {"    Gain Weight"}
                  </Text>
                ) : (
                  <Text style={{ color: "gray", fontFamily: "balsam-f" }}>
                    {" "}
                    <Feather name="arrow-up-right" size={24} color="gray" />
                    {"    Gain Weight"}
                  </Text>
                )
              }
              disabled={
                sys == "Gain Weight" || sys == "Maintains Weight" ? false : true
              }
              value="third"
              onPress={(flag) => setflag(value)}
            />
          </RadioButton.Group>
        </View>
      </View>
    </ImageBackground>
  );
};

const ScreenTwo = ({ navigation, route }) => {
  // const userData = route.params.userData;
  const [w, setweight] = React.useState(null);
  const user = route.params.user;
  const least = route.params.least;
  const highest = route.params.highest;
  const value = route.params.value;
  const ideal = route.params.ideal;
  const weight = route.params.weight;
  const gender = route.params.gender;
  const height = route.params.height;
  const flag = route.params.flag;
  const [idealw, setideal] = React.useState(ideal);
  let differance = weight - ideal;
  let differanceprinted = Math.round((differance + Number.EPSILON) * 10) / 10;
  //let sign = weight - w;
  if (differance < 0) differanceprinted = differanceprinted * -1;
  //alert(value);
  const validation = () => {
    if (w == null) {
      alert("Please Fill Your Goal Weight");
    } else {
      if (value == "first") {
        if (w < least || w > highest) {
          alert(
            "Please enter Goal weight between" +
              "\n" +
              least +
              " Kg - " +
              highest +
              " Kg"
          );
        } else if (weight > least && weight < highest) {
          if (w > weight) {
            alert(
              "Your Target is Lose Weight Please Enter Weight between" +
                "\n" +
                least +
                " Kg - " +
                weight +
                " Kg "
            );
          } else {
            navigation.navigate("ScreenThree", {
              w: w,
              //sign: sign,
              value: value,
              user: user,
              weight: weight,
              height: height,
              gender: gender,
            });
          }
        } else {
          navigation.navigate("ScreenThree", {
            w: w,
            //sign: sign,
            value: value,
            user: user,
            weight: weight,
            height: height,
            gender: gender,
          });
        }
      } else if (value == "second") {
        if (w < least || w > highest) {
          alert(
            "Please enter Goal weight between" +
              "\n" +
              least +
              " Kg - " +
              highest +
              " Kg"
          );
        } else {
          navigation.navigate("ScreenThree", {
            w: w,
            // sign: sign,
            user: user,
            weight: weight,
            height: height,
            gender: gender,
          });
        }
      } else if (value == "third") {
        if (w < least || w > highest) {
          alert(
            "Please enter Goal weight between" +
              "\n" +
              least +
              " Kg - " +
              highest +
              " Kg"
          );
        } else if (weight > least && weight < highest) {
          if (w < weight) {
            alert(
              "Your Target is Gain Weight Please Enter Weight between" +
                "\n" +
                weight +
                " Kg -" +
                highest +
                " Kg"
            );
          } else {
            navigation.navigate("ScreenThree", {
              w: w,
              //sign: sign,
              user: user,
              weight: weight,
              height: height,
              gender: gender,
            });
          }
        } else {
          navigation.navigate("ScreenThree", {
            w: w,
            //sign: sign,
            value: value,
            user: user,
            weight: weight,
            height: height,
            gender: gender,
          });
        }
      }
    }
  };

  //console.log(value);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Calculate new Plan",
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          onPress={() => navigation.goBack(null)}
          size={35}
        ></Ionicons>
      ),
      headerRight: () => <Button onPress={validation} title="Next" />,
    });
  }, [navigation, w]);
  return (
    <DismissKeyboard>
      <ImageBackground
        style={{ width: "100%", height: "105%" }}
        source={require("../assets/bg2.png")}
        imageStyle={{ opacity: 0.15 }} //so any children of it don't affected
      >
        <View style={{ justifyContent: "center" }}>
          <View style={styles.view1}>
            <Text style={styles.t2}>Your Goal Weight</Text>

            <TextInput
              style={styles.textinput}
              textDecorationLine="Underline"
              keyboardType="numeric"
              placeholderTextColor="lightgrey"
              value={idealw}
              placeholder={"ex: " + String(ideal) + "  Kg"}
              onChangeText={(w) => {
                setweight(w);
              }}
            ></TextInput>
          </View>
        </View>
        <View style={styles.view2}>
          <Text style={{ fontSize: 24, fontFamily: "balsam-f" }}>
            Your Optimal Weight average
          </Text>
          <Text
            style={{
              fontSize: 23,
              fontWeight: "bold",
              color: "goldenrod",
              fontFamily: "balsam-f",
              paddingTop: 10,
            }}
          >
            ({least + " - " + highest})
          </Text>
          <TextInput
            editable="false"
            multiline={true}
            style={{
              color: "lightslategrey",
              fontFamily: "balsam-f",
              borderBottomWidth: 0.5,
              borderBottomColor: "lightslategrey",
            }}
          >
            Your weight is being ideal or normal if it is not less than ({least}
            ) and not more than ({highest}).
          </TextInput>
        </View>
        <View style={styles.view2}>
          <Text style={{ fontSize: 24, fontFamily: "balsam-f" }}>
            The Best Weight for You
          </Text>
          <Text
            style={{
              fontSize: 23,
              fontWeight: "bold",
              color: "goldenrod",
              fontFamily: "balsam-f",
              paddingTop: 10,
            }}
          >
            ({ideal})
          </Text>
          <TextInput
            editable="false"
            multiline={true}
            style={{
              color: "lightslategrey",
              fontFamily: "balsam-f",
              borderBottomWidth: 0.5,
              borderBottomColor: "lightslategrey",
            }}
          >
            Your average of the best weight for you as{" "}
            {gender == "0" ? "Male" : "Female"} is ({ideal}).
          </TextInput>
        </View>
        <View style={styles.view2}>
          <Text style={{ fontSize: 24, fontFamily: "balsam-f" }}>
            What I need ?
          </Text>
          <Text
            style={{
              fontSize: 23,
              fontWeight: "bold",
              color: "goldenrod",
              fontFamily: "balsam-f",
              paddingTop: 10,
            }}
          >
            ({differance > 0 ? "Lose" : "Gain"} {differanceprinted}
            kg)
          </Text>
          <TextInput
            editable="false"
            multiline={true}
            style={{
              color: "lightslategrey",
              fontFamily: "balsam-f",
              borderBottomWidth: 0.5,
              borderBottomColor: "lightslategrey",
            }}
          >
            In order to reach the limit of the ideal weight you need to (
            {differance > 0 ? "Lose" : "Gain"} {differanceprinted}
            kg) from your weight .
          </TextInput>
        </View>
      </ImageBackground>
    </DismissKeyboard>
  );
};

const ScreenThree = ({ navigation, route }) => {
  const user = route.params.user;
  const w = route.params.w;
  const weight = route.params.weight;
  const height = route.params.height;
  const gender = route.params.gender;
  const age = route.params.age;
  let sign = weight - w;
  let kiloperweek = 0;

  const val = route.params.value;
  const [value, setValue] = React.useState(null);
  let BMR = 0;

  if (gender == 0) {
    /* Metric formula for men
BMR = 66.47 + ( 13.75 × weight in kg ) + ( 5.003 × height in cm ) − ( 6.755 × age in years )*/
    let term1 = 13.75 * weight;
    let term2 = 5.003 * (height * 100);
    let term3 = 6.755 * age;
    BMR = 66.47 + term1 + term2 - term3;
  } else {
    /*Metric formula for women
BMR = 655.1 + ( 9.563 × weight in kg ) + ( 1.85 × height in cm ) − ( 4.676 × age in years )*/
    let term4 = 9.563 * weight;
    let term5 = 1.85 * (height * 100);
    let term6 = 4.676 * age;
    BMR = 655.1 + term4 + term5 - term6;
  }
  if (value == 1) {
    BMR = BMR * 1.2;
  } else if (value == 2) {
    BMR = BMR * 1.375;
  } else if (value == 3) {
    BMR = BMR * 1.55;
  } else if (value == 4) {
    BMR = BMR * 1.725;
  } else if (value == 5) {
    BMR = BMR * 1.9;
  }

  BMR = Math.round((BMR + Number.EPSILON) * 1) / 1;
  const check = () => {
    if (value == null) {
      alert("Please Choose Your Activity Level");
    } else if (sign == 0) {
      navigation.navigate("ScreenFive", {
        w: w,
        valueactivity: value, //activity level
        user: user,
        sign: sign,
        calories: BMR,
        period: 0,
        value: kiloperweek,
      });
    } else {
      navigation.navigate("ScreenFour", {
        w: w,
        value: value,
        user: user,
        sign: sign,
        weight: weight,
        height: height,
        gender: gender,
      });
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Calculate new Plan",
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          onPress={() => navigation.goBack(null)}
          size={35}
        ></Ionicons>
      ),
      headerRight: () => <Button onPress={check} title="Next" />,
    });
  }, [navigation, value]);

  return (
    <DismissKeyboard>
      <ImageBackground
        style={{ width: "100%", height: "105%" }}
        source={require("../assets/bg2.png")}
        imageStyle={{ opacity: 0.15 }} //so any children of it don't affected
      >
        <View style={styles.viewscreen3}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "balsam-f",
                fontSize: 30,
                marginTop: 10,
              }}
            >
              Activity Level
            </Text>
          </View>
          <View style={{ justifyContent: "left" }}>
            <RadioButton.Group
              onValueChange={(value) => setValue(value)}
              value={value}
            >
              <RadioButton.Item
                label={
                  <View>
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        fontSize: 20,
                      }}
                    >
                      Sedentary
                    </Text>

                    <TextInput
                      editable="false"
                      multiline={true}
                      style={{
                        color: "lightslategrey",
                        fontFamily: "balsam-f",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightslategrey",
                        fontSize: 15,
                      }}
                    >
                      little or no exercise and desk job
                    </TextInput>
                  </View>
                }
                value="1"
                style={styles.radio}
              ></RadioButton.Item>
              <RadioButton.Item
                label={
                  <View>
                    <Text
                      style={{
                        fontFamily: "balsam-f",

                        fontSize: 20,
                      }}
                    >
                      Lightly Active
                    </Text>

                    <TextInput
                      editable="false"
                      multiline={true}
                      style={{
                        color: "lightslategrey",
                        fontFamily: "balsam-f",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightslategrey",
                        fontSize: 15,
                      }}
                    >
                      Light daily activity some exercise {"\n"}1-3 days a week
                    </TextInput>
                  </View>
                }
                value="2"
                style={styles.radio}
              />
              <RadioButton.Item
                label={
                  <View>
                    <Text
                      style={{
                        fontFamily: "balsam-f",

                        fontSize: 20,
                      }}
                    >
                      Moderately Active
                    </Text>

                    <TextInput
                      editable="false"
                      multiline={true}
                      style={{
                        color: "lightslategrey",
                        fontFamily: "balsam-f",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightslategrey",
                        fontSize: 15,
                      }}
                    >
                      Moderately Active daily life and some exercise 1-3 days a
                      week
                    </TextInput>
                  </View>
                }
                value="3"
                style={styles.radio}
              />
              <RadioButton.Item
                label={
                  <View>
                    <Text
                      style={{
                        fontFamily: "balsam-f",

                        fontSize: 20,
                      }}
                    >
                      Very Active
                    </Text>

                    <TextInput
                      editable="false"
                      multiline={true}
                      style={{
                        color: "lightslategrey",
                        fontFamily: "balsam-f",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightslategrey",
                        fontSize: 15,
                      }}
                    >
                      Physically demanding lifestyle and Hard exercise or sports
                      6-7 days a week
                    </TextInput>
                  </View>
                }
                value="4"
                style={styles.radio}
              />
              <RadioButton.Item
                label={
                  <View>
                    <Text
                      style={{
                        fontFamily: "balsam-f",

                        fontSize: 20,
                      }}
                    >
                      Extermely Active
                    </Text>

                    <TextInput
                      editable="false"
                      multiline={true}
                      style={{
                        color: "lightslategrey",
                        fontFamily: "balsam-f",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightslategrey",
                        fontSize: 15,
                      }}
                    >
                      Hard daily exercise or sports and{"\n"} physical job
                    </TextInput>
                  </View>
                }
                value="5"
                style={styles.radio}
              />
            </RadioButton.Group>
          </View>
        </View>
      </ImageBackground>
    </DismissKeyboard>
  );
};
const ScreenFour = ({ navigation, route }) => {
  const user = route.params.user;
  const w = route.params.w;
  const sign = route.params.sign;
  const weight = route.params.weight;
  const height = route.params.height;
  const gender = route.params.gender;
  const age = route.params.age;
  const valueactivity = route.params.value;
  const [value, setValue] = React.useState(null);
  let BMR = 0;
  let calories = 0;
  let period = 0;
  if (gender == 0) {
    /* Metric formula for men
BMR = 66.47 + ( 13.75 × weight in kg ) + ( 5.003 × height in cm ) − ( 6.755 × age in years )*/
    let term1 = 13.75 * weight;
    let term2 = 5.003 * (height * 100);
    let term3 = 6.755 * age;
    BMR = 66.47 + term1 + term2 - term3;
  } else {
    /*Metric formula for women
BMR = 655.1 + ( 9.563 × weight in kg ) + ( 1.85 × height in cm ) − ( 4.676 × age in years )*/
    let term4 = 9.563 * weight;
    let term5 = 1.85 * (height * 100);
    let term6 = 4.676 * age;
    BMR = 655.1 + term4 + term5 - term6;
  }
  if (valueactivity == 1) {
    BMR = BMR * 1.2;
  } else if (valueactivity == 2) {
    BMR = BMR * 1.375;
  } else if (valueactivity == 3) {
    BMR = BMR * 1.55;
  } else if (valueactivity == 4) {
    BMR = BMR * 1.725;
  } else if (valueactivity == 5) {
    BMR = BMR * 1.9;
  }
  if (sign > 0) {
    // LOSE WEIGHT
    if (value == 1) {
      calories = BMR - 550;
      period = sign / 0.5;
    } else if (value == 2) {
      calories = BMR - 1100;
      period = sign;
    } else if (value == 3) {
      calories = BMR - 1650;
      period = sign / 1.5;
    } else if (value == 4) {
      calories = BMR - 2200;
      period = sign / 2;
    }
  } else if (sign < 0) {
    //gain
    if (value == 1) {
      calories = BMR + 550;
      period = (sign * -1) / 2;
    } else if (value == 2) {
      calories = BMR + 1100;
      period = sign * -1;
    } else if (value == 3) {
      calories = BMR + 1650;
      period = (sign * -1) / 1.5;
    } else if (value == 4) {
      calories = BMR + 2200;
      period = (sign * -1) / 2;
    }
  }

  calories = Math.round((calories + Number.EPSILON) * 1) / 1;
  period = Math.round((period + Number.EPSILON) * 1) / 1;
  const check = () => {
    if (value == null) {
      alert("Please Choose Your Goal");
    } else {
      navigation.navigate("ScreenFive", {
        w: w,
        value: value, // kilo per week
        user: user,
        sign: sign,
        // weight: weight,
        //height: height,
        // gender: gender,
        calories: calories,
        valueactivity: valueactivity,
        period: period,
      });
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Calculate new Plan",
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          onPress={() => navigation.goBack(null)}
          size={35}
        ></Ionicons>
      ),
      headerRight: () => <Button onPress={check} title="Next" />,
    });
  }, [navigation, calories, value, period]);

  return (
    <DismissKeyboard>
      <ImageBackground
        style={{ width: "100%", height: "105%" }}
        source={require("../assets/bg2.png")}
        imageStyle={{ opacity: 0.15 }} //so any children of it don't affected
      >
        <View style={styles.viewscreen4}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "balsam-f",
                fontSize: 30,
                marginTop: 30,
                marginBottom: 15,
              }}
            >
              {sign > 0 ? "Lose" : "Gain"} {"weight per week"}
            </Text>
          </View>
          <View style={{ justifyContent: "left" }}>
            <RadioButton.Group
              onValueChange={(value) => setValue(value)}
              value={value}
            >
              <RadioButton.Item
                label={
                  <View>
                    <TextInput
                      editable="false"
                      multiline={true}
                      style={{
                        width: width / 2,
                        fontFamily: "balsam-f",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightslategrey",
                        fontSize: 23,
                      }}
                    >
                      Half a Kilo
                    </TextInput>
                  </View>
                }
                value="1"
                style={styles.radio2}
              ></RadioButton.Item>
              <RadioButton.Item
                label={
                  <View>
                    <TextInput
                      editable="false"
                      multiline={true}
                      style={{
                        width: width / 2,
                        fontFamily: "balsam-f",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightslategrey",
                        fontSize: 23,
                      }}
                    >
                      Kilo
                    </TextInput>
                  </View>
                }
                value="2"
                style={styles.radio2}
              />
              <RadioButton.Item
                label={
                  <View>
                    <TextInput
                      editable="false"
                      multiline={true}
                      style={{
                        width: width / 2,
                        fontFamily: "balsam-f",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightslategrey",
                        fontSize: 23,
                      }}
                    >
                      A kilo and half
                    </TextInput>
                  </View>
                }
                value="3"
                style={styles.radio2}
              />
              <RadioButton.Item
                label={
                  <View>
                    <TextInput
                      editable="false"
                      multiline={true}
                      style={{
                        width: width / 2,
                        fontFamily: "balsam-f",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightslategrey",
                        fontSize: 23,
                      }}
                    >
                      2 Kilos
                    </TextInput>
                  </View>
                }
                value="4"
                style={styles.radio2}
              />
            </RadioButton.Group>
          </View>
        </View>
      </ImageBackground>
    </DismissKeyboard>
  );
};
const ScreenFive = ({ navigation, route }) => {
  const user = route.params.user;
  const passwordsign = route.params.passwordsign;
  const emailsign = route.params.emailsign;
  const firstname = route.params.firstname;
  const lastname = route.params.lastname;
  const age = route.params.age;
  const gender = route.params.gender;
  const weight = route.params.weight;
  const height = route.params.height;
  const country = route.params.country;

  const w = route.params.w;
  const period = route.params.period;
  const calories = route.params.calories;
  const valueactivity = route.params.valueactivity;

  const sign = route.params.sign;
  const kiloperweek = route.params.value;

  let kilo = 0;
  if (kiloperweek == 1) {
    kilo = 0.5;
  } else if (kiloperweek == 2) {
    kilo = 1;
  } else if (kiloperweek == 3) {
    kilo = 1.5;
  } else if (kiloperweek == 4) {
    kilo = 2;
  }
  /* async function fetchData() {
    const response = await fetch(
      "http://192.168.1.174:2000/weight?user=" + name
    );
    const info = await response.json();
    setuserData(info);
    //alert(userData);
    //console.log(info);
  }*/

  const connect = () => {
 
    fetch("http://192.168.1.110:4008/target", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailsign: emailsign,
        firstname: firstname,
        passwordsign: passwordsign,
        lastname: lastname,
        username: user,
        age: age,
        gender: gender,
        weight: weight,
        height: height,
        country: country,
        w: w,
        period: period,
        calories: calories,
        valueactivity: valueactivity,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //alert(res.message);

          navigation.reset({
            //Using reset avoid you to go back to login Screen
            index: 0,
            routes: [
              {
                name: "DrawerScreen",
                params: {
                  name: user,
                  period: period,
                  calories: calories,
                  valueactivity: valueactivity,
                  start: res.startDate,
                  end: res.endDate,
                  firstname: res.firstname,
                  lastname: res.lastname,
                  gender: gender,
                },
              },
            ],
          });
        } else {
          alert(res.message);
        }
      })
      .done();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Calculate new Plan",
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          onPress={() => navigation.goBack(null)}
          size={35}
        ></Ionicons>
      ),
      // headerRight: () => <Button onPress={connect} title="Start" />,
    });
  }, [navigation]);

  return (
    <DismissKeyboard>
      <ImageBackground
        style={{ width: "100%", height: "105%" }}
        source={require("../assets/bg2.png")}
        imageStyle={{ opacity: 0.15 }} //so any children of it don't affected
      >
        <View style={styles.viewscreen5}>
          <View>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "balsam-f",
                fontSize: 22,
                marginTop: 20,
              }}
            >
              To {sign > 0 ? "Lose" : sign < 0 ? "Gain" : "Maintane"}{" "}
              {sign == 0 ? "Your Weight" : kilo + "Kg per week"} {"\n"}
              {sign == 0 ? "Keep eating" : "Do not"}{" "}
              {sign > 0 ? " grater than " : sign < 0 ? "less than " : ""}
              {"\n"}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "balsam-f",
                fontSize: 25,
                marginTop: 3,
                marginBottom: 7,
                color: "#1a798a",
              }}
            >
              {calories}{" "}
              <MaterialIcons
                name="local-fire-department"
                size={24}
                color="orange"
              />
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "balsam-f",
                fontSize: 13,
                marginTop: 2,
                marginBottom: 10,
                color: "black",
              }}
            >
              - Calorie per day -{" "}
            </Text>
          </View>
        </View>
        <View style={styles.viewscreen5}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "balsam-f",
              fontSize: 22,
              marginTop: 20,
            }}
          >
            We wish you a useful and enjoyable experience, let's start{" "}
          </Text>
          <TouchableOpacity onPress={connect}>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "balsam-f",
                fontSize: 28,
                marginTop: 20,
                color: "goldenrod",
                shadowColor: "goldenrod",
                shadowOpacity: 0.5,
                shadowRadius: 0.5,
              }}
            >
              {"Start"}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </DismissKeyboard>
  );
};
const Stack = createStackNavigator();
function TargetScreen({ route }) {
  //const [userData, setuserData] = useState([]);
  const {
    name,
    weight,
    height,
    gender,
    age,
    emailsign,
    firstname,
    passwordsign,
    lastname,
    country,
  } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScreenOne"
        component={ScreenOne}
        initialParams={{
          user: name,
          weight: weight,
          height: height,
          gender: gender,
        }}
        options={({ navigation, route }) => ({})}
      />
      <Stack.Screen
        name="ScreenTwo"
        component={ScreenTwo}
        initialParams={{ user: name }}
        options={({ navigation, route }) => ({})}
      />
      <Stack.Screen
        name="ScreenThree"
        component={ScreenThree}
        initialParams={{ user: name, age: age }}
        options={({ navigation, route }) => ({})}
      />
      <Stack.Screen
        name="ScreenFour"
        component={ScreenFour}
        initialParams={{ user: name, age: age }}
        options={({ navigation, route }) => ({})}
      />
      <Stack.Screen
        name="ScreenFive"
        component={ScreenFive}
        initialParams={{
          user: name,
          age: age,
          weight: weight,
          height: height,
          gender: gender,
          emailsign: emailsign,
          firstname: firstname,
          passwordsign: passwordsign,
          lastname: lastname,
          country: country,
        }}
        options={({ navigation, route }) => ({})}
      />
    </Stack.Navigator>
  );
}

export default TargetScreen;
const styles = StyleSheet.create({
  text1: {
    color: `#000000`,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width / 17,
    fontFamily: "balsam-f",
    marginTop: 50,
  },
  text2: {
    color: `#000000`,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width / 13.6,
    fontFamily: "balsam-f",
    marginTop: 30,
  },
  bodyclass: {
    color: `goldenrod`,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width / 11,
    fontFamily: "balsam-f",
    marginTop: 10,
  },
  text3: {
    color: `#000000`,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width / 13.6,
    fontFamily: "balsam-f",
    marginTop: 20,
  },
  systemtargetView: {
    backgroundColor: "white",
    width: width / 1.3,
    height: width / 1.5,
    marginLeft: width / 8,
    marginTop: width / 6,
    shadowColor: "black",
    shadowOpacity: 0.8,
    borderRadius: 10,
    shadowRadius: 5,
  },
  view1: {
    alignItems: "center",
    backgroundColor: "white",
    width: width / 1.1,
    height: width / 4,
    marginLeft: width / 20,
    marginTop: width / 18,
    shadowColor: "black",
    shadowOpacity: 0.5,
    borderRadius: 6,
    shadowRadius: 5,
  },
  t2: {
    color: `#000000`,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width / 20,
    fontFamily: "balsam-f",
    marginTop: 8,
  },
  textinput: {
    textAlign: "center",
    backgroundColor: "white",
    height: width / 8,
    fontSize: width / 20,
    fontFamily: "balsam-f",
    color: "goldenrod",
    width: width / 2,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  view2: {
    marginLeft: width / 20,
    marginTop: width / 12,
  },
  viewscreen3: {
    backgroundColor: "white",
    width: width / 1.1,
    height: width * 1.5,
    marginLeft: width / 20,
    marginTop: width / 18,
    shadowColor: "black",
    shadowOpacity: 0.5,
    borderRadius: 6,
    shadowRadius: 5,
  },
  viewscreen4: {
    backgroundColor: "white",
    width: width / 1.1,
    height: width / 1.15,
    marginLeft: width / 20,
    marginTop: width / 15,
    shadowColor: "black",
    shadowOpacity: 0.5,
    borderRadius: 8,
    shadowRadius: 5,
  },
  radio: {
    fontFamily: "balsam-f",
    paddingTop: 30,
  },
  radio: {
    fontFamily: "balsam-f",
    paddingTop: 20,
  },
  viewscreen5: {
    backgroundColor: "white",
    width: width / 1.1,
    height: width / 2,
    marginLeft: width / 20,
    marginTop: width / 15,
    shadowColor: "black",
    shadowOpacity: 0.5,
    borderRadius: 8,
    shadowRadius: 5,
  },
});
