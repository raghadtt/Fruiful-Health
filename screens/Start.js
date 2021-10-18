import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  LogBox,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Svg, { Image, Circle, ClipPath } from "react-native-svg";
import Animated, { Easing } from "react-native-reanimated";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
//import AsyncStorage from "@react-native-community/async-storage";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker from "react-native-country-picker-modal";
import Passreset from "./Passreset";
import moment from "moment";
//import { SlideFromRightIOS } from "@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets";

LogBox.ignoreAllLogs();

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const { width, height } = Dimensions.get("window");

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position,
  ]);
}

var radio_props = [
  { label: "Male", value: 0 },
  { label: "Female", value: 1 },
];

class Start extends Component {
  constructor(props) {
    super();

    this.state = {
      fontsLoaded: false,
      buttonState: 0,
      email: "",
      emailsign: "",
      password: "",
      passwordsign: "",
      firstname: "",
      lastname: "",
      username: "",
      confirmpass: "",
      age: "",
      weight: "",
      height: "",
      country: "",
      check_textInputChange: false,
      check_textemailChange: false,
      secureTextEntry: true,
      isValidUser: true,
      isValidemail: true,
      isValidPass: true,
      secureTextEntry2: true,
      secureTextEntry3: true,
      pass1: "",
      matching: true,
    };

    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            ),
          ]),
      },
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 2 - 50, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    this.bgY2 = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 1.04 - 50, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.textInputZindex = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP,
    });
    this.textInputY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP,
    });

    this.textInputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP,
    });

    this.onCloseState = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
            ),
          ]),
      },
    ]);
  }
  //----------------------------------------------------------------------------BACKEND CODE
  componentDidMount() {
    this._loadInitialState().done();
  }
  _loadInitialState = async () => {
    var value = await AsyncStorage.getItem("user");
    var value2 = await AsyncStorage.getItem("password");
    if (value !== null && value2 !== null) {
      this.props.navigation.navigate("DrawerScreen");
    }
  };
  setCountry = (index) => {
    this.setState({ country: index.name });
  };
  //--------------------------------------------------

  //---------------------------------------------------------------------------Login button
  home = () => {
    fetch("http://192.168.1.110:4008/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          AsyncStorage.setItem("user", res.user);
          this.props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "DrawerScreen",
                params: {
                  name: res.user,
                  valueactivity: res.level,
                  calories: res.cal,
                  start: res.startDate,
                  end: res.endDate,
                  period: res.weeks,
                  firstname: res.firstname,
                  lastname: res.lastname,
                  gender: res.gender,
                },
              },
            ],
          });
          this.props.navigation.navigate("DrawerScreen", {
            name: res.user,
            valueactivity: res.level,
            calories: res.cal,
            start: res.startDate,
            end: res.endDate,
            period: res.weeks,
            firstname: res.firstname,
            lastname: res.lastname,
            gender: res.gender,
          });
        } else {
          alert(res.message);
        }
      })
      .done();
  };
  /*-------------------------------------------------------------------------
  rest of the code of login is in Text fields email & password => On change() function
  we set the state value and on login button we call home() function
  -------------------------------------------------------------------------*/

  //---------------------------------------------------------------------------SignUp button
  signupForm = () => {
    fetch("http://192.168.1.110:4008/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailsign: this.state.emailsign,
        firstname: this.state.firstname,
        passwordsign: this.state.passwordsign,
        confirmpass: this.state.confirmpass,
        lastname: this.state.lastname,
        username: this.state.username,
        age: this.state.age,
        gender: this.state.value,
        weight: this.state.weight,
        height: this.state.height,
        country: this.state.country,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //alert(res.message);

          this.props.navigation.reset({
            //Using reset avoid you to go back to login Screen
            index: 0,
            routes: [
              {
                name: "Target",
                params: {
                  name: this.state.username,
                  weight: this.state.weight,
                  height: this.state.height,
                  gender: this.state.value,
                  age: this.state.age,
                  emailsign: this.state.emailsign,
                  firstname: this.state.firstname,
                  passwordsign: this.state.passwordsign,
                  lastname: this.state.lastname,
                  country: this.state.country,
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
  //---------------------------------------------------------------------------------
  login = () => {
    this.setState({ buttonState: 1 });
  };

  signup = () => {
    this.setState({ buttonState: 2 });
  };

  textInputChange = (val) => {
    if (val.trim().length >= 4) {
      this.setState({
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      this.setState({
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };
  //-----------------------------------------------------------------For email formate
  validate = (val) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(val) === false) {
      console.log("Email is Not Correct");
      this.setState({
        emailsign: val,
        check_textemailChange: false,
        isValidemail: false,
      });
    } else {
      this.setState({
        emailsign: val,
        check_textemailChange: true,
        isValidemail: true,
      });
      console.log("Email is Correct");
    }
  };
  //----------------------------------------------------------------------------------
  handleValidemail = (val) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(val) === false) {
      this.setState({ isValidUser: false });
    } else {
      this.setState({ isValidUser: true });
    }
  };
  //----------------------------------------------------------------------------------
  handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      this.setState({ isValidUser: true });
    } else {
      this.setState({ isValidUser: false });
    }
  };
  handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      this.setState({
        passwordsign: val,
        isValidPass: true,
      });
    } else {
      this.setState({
        passwordsign: val,
        isValidPass: false,
      });
    }
  };
  updateSecureTextEntry = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
    });
  };
  updateSecureTextEntry2 = () => {
    this.setState({
      secureTextEntry2: !this.state.secureTextEntry2,
    });
  };

  updateSecureTextEntry3 = () => {
    this.setState({
      secureTextEntry3: !this.state.secureTextEntry3,
    });
  };

  savepass1 = (val) => {
    this.setState({ pass1: val });
  };
  match = (val) => {
    if (val == this.state.pass1) this.setState({ matching: true });
    else this.setState({ matching: false });
  };

  async UNSAFE_componentWillMount() {
    try {
      await Font.loadAsync({
        Pacifico: require("../assets/fonts/Pacifico.ttf"),
        Kaushan: require("../assets/fonts/KaushanScript-Regular.ttf"),
      });
      this.setState({ fontsLoaded: true });
    } catch (e) {
      console.warn(e);
    }
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    }
    if (this.state.buttonState == 0) {
      return (
        <DismissKeyboard>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            extraHeight={200}
            scrollEnabled={false}
          >
            <Animated.View
              style={{
                ...StyleSheet.absoluteFill,
                transform: [{ translateY: this.bgY }],
              }}
            >
              <Svg height={height + 50} width={width}>
                <ClipPath id="clip">
                  <Circle r={height + 50} cx={width / 2} />
                </ClipPath>

                <Image
                  href={require("../assets/bg2.png")}
                  width={width}
                  height={height + 50}
                  opacity={0.4}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#clip)"
                />
                <View>
                  <Text style={styles.title}>Fruitful Health</Text>
                </View>
              </Svg>
            </Animated.View>

            <View style={{ height: height / 2, justifyContent: "center" }}>
              <TouchableOpacity onPress={this.login}>
                <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                  <Animated.View
                    style={{
                      ...styles.button,
                      opacity: this.buttonOpacity,
                      transform: [{ translateY: this.buttonY }],
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      {" "}
                      SIGN IN{" "}
                    </Text>
                  </Animated.View>
                </TapGestureHandler>
              </TouchableOpacity>

              <Animated.View
                style={{
                  marginLeft: 100,
                  marginRight: 100,
                  backgroundColor: "rgba(255,255,255, 0.3)",
                  fontSize: 14,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {" "}
                  Don't have an account?
                </Text>
              </Animated.View>
              <TouchableOpacity onPress={this.signup}>
                <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                  <Animated.View
                    style={{
                      ...styles.button,
                      backgroundColor: "goldenrod",
                      opacity: this.buttonOpacity,
                      transform: [{ translateY: this.buttonY }],
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      SIGN UP
                    </Text>
                  </Animated.View>
                </TapGestureHandler>
              </TouchableOpacity>
              <Animated.View
                animation="fadeInUpBig"
                style={{
                  zIndex: this.textInputZindex,
                  opacity: this.textInputOpacity,
                  transform: [{ translateY: this.textInputY }],
                  height: height / 2,
                  ...StyleSheet.absoluteFill,
                  top: null,
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                }}
              >
                <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                  <Animated.View style={styles.closeButton}>
                    <Animated.Text
                      style={{
                        fontSize: 15,
                        transform: [
                          { rotate: concat(this.rotateCross, "deg") },
                        ],
                      }}
                    >
                      X
                    </Animated.Text>
                  </Animated.View>
                </TapGestureHandler>

                <Animated.View
                  style={{
                    ...styles.button,
                    backgroundColor: "goldenrod",
                    marginTop: 50,
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                  >
                    {" "}
                    Login{" "}
                  </Text>
                </Animated.View>
              </Animated.View>
            </View>
          </KeyboardAwareScrollView>
        </DismissKeyboard>
      );
    }
    if (this.state.buttonState == 1) {
      return (
        <DismissKeyboard>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            extraHeight={200}
            scrollEnabled={false}
          >
            <Animated.View
              style={{
                ...StyleSheet.absoluteFill,
                transform: [{ translateY: this.bgY }],
              }}
            >
              <Svg height={height + 50} width={width}>
                <ClipPath id="clip">
                  <Circle r={height + 50} cx={width / 2} />
                </ClipPath>

                <Image
                  href={require("../assets/bg2.png")}
                  width={width}
                  height={height + 50}
                  opacity={0.4}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#clip)"
                />
                <View>
                  <Text style={styles.title}>Fruitful Health</Text>
                </View>
              </Svg>
            </Animated.View>

            <View style={{ height: height / 2, justifyContent: "center" }}>
              <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                <Animated.View
                  style={{
                    ...styles.button,
                    opacity: this.buttonOpacity,
                    transform: [{ translateY: this.buttonY }],
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {" "}
                    SIGN IN{" "}
                  </Text>
                </Animated.View>
              </TapGestureHandler>

              <Animated.View
                style={{
                  marginLeft: 100,
                  marginRight: 100,
                  backgroundColor: "rgba(255,255,255, 0.3)",
                  fontSize: 14,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {" "}
                  Don't have an account?
                </Text>
              </Animated.View>
              <TouchableOpacity onPress={this.signup}>
                <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                  <Animated.View
                    style={{
                      ...styles.button,
                      backgroundColor: "goldenrod",
                      opacity: this.buttonOpacity,
                      transform: [{ translateY: this.buttonY }],
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      SIGN UP
                    </Text>
                  </Animated.View>
                </TapGestureHandler>
              </TouchableOpacity>
              <Animated.View
                animation="fadeInUpBig"
                style={{
                  zIndex: this.textInputZindex,
                  opacity: this.textInputOpacity,
                  transform: [{ translateY: this.textInputY }],
                  height: height / 2,
                  ...StyleSheet.absoluteFill,
                  top: null,
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                }}
              >
                <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                  <Animated.View style={styles.closeButton}>
                    <Animated.Text
                      style={{
                        fontSize: 15,
                        transform: [
                          { rotate: concat(this.rotateCross, "deg") },
                        ],
                      }}
                    >
                      X
                    </Animated.Text>
                  </Animated.View>
                </TapGestureHandler>
                <View style={styles.view}>
                  <FontAwesome name="user-o" color="goldenrod" size={20} />
                  <TextInput
                    placeholder="Email or Username"
                    style={styles.textInput}
                    placeholderTextColor="lightslategrey"
                    fontSize="18"
                    autoCapitalize="none"
                    //-------------------------------------------------for backend
                    onChangeText={(email) => this.setState({ email })}
                    //-------------------------------------------------
                  />
                </View>
                <View
                  style={[
                    styles.view,
                    {
                      marginTop: 20,
                    },
                  ]}
                >
                  <Feather name="lock" color="goldenrod" size={20} />
                  <TextInput
                    placeholder="Password"
                    style={styles.textInput}
                    placeholderTextColor="lightslategrey"
                    fontSize="18"
                    autoCapitalize="none"
                    //-------------------------------------------------------for backend
                    onChangeText={(password) => this.setState({ password })}
                    //-------------------------------------------------------
                    secureTextEntry={this.state.secureTextEntry ? true : false}
                  />

                  <TouchableOpacity onPress={this.updateSecureTextEntry}>
                    {this.state.secureTextEntry ? (
                      <Feather
                        name="eye"
                        color="goldenrod"
                        size={20}
                        style={{ marginRight: 10 }}
                      />
                    ) : (
                      <Feather
                        name="eye-off"
                        color="goldenrod"
                        size={20}
                        style={{ marginRight: 10 }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <Text
                  onPress={() => {
                    this.props.navigation.navigate("Passreset");
                  }}
                  style={{
                    textDecorationLine: "underline",
                    fontWeight: "bold",
                    fontSize: 16,
                    fontFamily: "Kaushan",
                    marginLeft: 40,
                    marginTop: 20,
                  }}
                >
                  Forgot Your Password?
                </Text>
                <TouchableOpacity onPress={this.home}>
                  <Animated.View
                    style={{
                      ...styles.button,
                      backgroundColor: "goldenrod",
                      marginTop: 50,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {" "}
                      Login{" "}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </KeyboardAwareScrollView>
        </DismissKeyboard>
      );
    }

    if (this.state.buttonState == 2) {
      return (
        <DismissKeyboard>
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            extraHeight={250}
            scrollEnabled={false}
          >
            <Animated.View
              style={{
                ...StyleSheet.absoluteFill,
                transform: [{ translateY: this.bgY2 }],
              }}
            >
              <Svg height={height + 50} width={width}>
                <ClipPath id="clip">
                  <Circle r={height + 50} cx={width / 2} />
                </ClipPath>

                <Image
                  href={require("../assets/bg2.png")}
                  width={width}
                  height={height + 50}
                  opacity={0.4}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#clip)"
                />
                <View>
                  <Text style={styles.title}>Fruitful Health</Text>
                </View>
              </Svg>
            </Animated.View>

            <View style={{ height: height / 2, justifyContent: "center" }}>
              <TouchableOpacity onPress={this.login}>
                <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                  <Animated.View
                    style={{
                      ...styles.button,
                      opacity: this.buttonOpacity,
                      transform: [{ translateY: this.buttonY }],
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      {" "}
                      SIGN IN{" "}
                    </Text>
                  </Animated.View>
                </TapGestureHandler>
              </TouchableOpacity>
              <Animated.View
                style={{
                  marginLeft: 100,
                  marginRight: 100,
                  backgroundColor: "rgba(255,255,255, 0.3)",
                  fontSize: 14,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {" "}
                  Don't have an account?
                </Text>
              </Animated.View>

              <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                <Animated.View
                  style={{
                    ...styles.button,
                    backgroundColor: "goldenrod",
                    opacity: this.buttonOpacity,
                    transform: [{ translateY: this.buttonY }],
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}
                  >
                    SIGN UP
                  </Text>
                </Animated.View>
              </TapGestureHandler>

              <Animated.View
                style={{
                  zIndex: this.textInputZindex,
                  opacity: this.textInputOpacity,
                  transform: [{ translateY: this.textInputY }],
                  height: height / 1.1,
                  ...StyleSheet.absoluteFill,
                  top: null,
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                }}
              >
                <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                  <Animated.View style={styles.closeButton}>
                    <Animated.Text
                      style={{
                        fontSize: 15,
                        transform: [
                          { rotate: concat(this.rotateCross, "deg") },
                        ],
                      }}
                    >
                      X
                    </Animated.Text>
                  </Animated.View>
                </TapGestureHandler>
                <ScrollView>
                  <View
                    style={[
                      styles.view,
                      {
                        marginTop: 30,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Email"
                      style={styles.textInput}
                      fontSize="18"
                      placeholderTextColor="lightslategrey"
                      autoCapitalize="none"
                      //------------------------------------------------------Backend
                      onChangeText={(val) => this.validate(val)}
                      //value={this.state.emailsign}
                      onEndEditing={(e) =>
                        this.handleValidemail(e.nativeEvent.text)
                      }
                      // onChangeText={(emailsign) => this.setState({ emailsign })}
                      //------------------------------------------------------------
                    />
                    {this.state.check_textemailChange ? (
                      <Animated.View animation="bounceIn">
                        <Feather
                          name="check-circle"
                          color="green"
                          size={20}
                          style={{ marginRight: 10 }}
                        />
                      </Animated.View>
                    ) : null}
                  </View>
                  {this.state.isValidemail ? null : (
                    <Animated.View
                      animation="fadeInLeft"
                      duration={500}
                      style={{ paddingLeft: 30 }}
                    >
                      <Text style={styles.errorMsg}>Email is not correct</Text>
                    </Animated.View>
                  )}
                  <View
                    style={[
                      styles.view,
                      {
                        marginTop: 20,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="First Name"
                      style={styles.textInput}
                      fontSize="18"
                      placeholderTextColor="goldenrod"
                      autoCapitalize="none"
                      //--------------------------------------------------------backend
                      onChangeText={(firstname) => this.setState({ firstname })}
                      //-------------------------------------------------------------
                    />
                  </View>
                  <View
                    style={[
                      styles.view,
                      {
                        marginTop: 20,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Last Name"
                      style={styles.textInput}
                      fontSize="18"
                      placeholderTextColor="lightslategrey"
                      autoCapitalize="none"
                      //------------------------------------------------------ backend
                      onChangeText={(lastname) => this.setState({ lastname })}
                      //--------------------------------------------------------
                    />
                  </View>

                  <View
                    style={[
                      styles.view,
                      {
                        marginTop: 20,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Username"
                      style={styles.textInput}
                      fontSize="18"
                      placeholderTextColor="goldenrod"
                      autoCapitalize="none"
                      //----------------------------------------------------backend
                      onChangeText={(val) => this.textInputChange(val)}
                      //----------------------------------------------------
                      onEndEditing={(e) =>
                        this.handleValidUser(e.nativeEvent.text)
                      }
                    />

                    {this.state.check_textInputChange ? (
                      <Animated.View animation="bounceIn">
                        <Feather
                          name="check-circle"
                          color="green"
                          size={20}
                          style={{ marginRight: 10 }}
                        />
                      </Animated.View>
                    ) : null}
                  </View>
                  {this.state.isValidUser ? null : (
                    <Animated.View
                      animation="fadeInLeft"
                      duration={500}
                      style={{ paddingLeft: 30 }}
                    >
                      <Text style={styles.errorMsg}>
                        Username must be 4 or more characters long.
                      </Text>
                    </Animated.View>
                  )}

                  <View
                    style={[
                      styles.view,
                      {
                        marginTop: 20,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Password"
                      style={styles.textInput}
                      placeholderTextColor="lightslategrey"
                      fontSize="18"
                      autoCapitalize="none"
                      secureTextEntry={
                        this.state.secureTextEntry2 ? true : false
                      }
                      //-------------------------------------------------------backend
                      onChangeText={(val) => this.handlePasswordChange(val)}
                      //-------------------------------------------------------
                      onEndEditing={(e) => this.savepass1(e.nativeEvent.text)}
                    />

                    <TouchableOpacity onPress={this.updateSecureTextEntry2}>
                      {this.state.secureTextEntry2 ? (
                        <Feather
                          name="eye"
                          color="goldenrod"
                          size={20}
                          style={{ marginRight: 10 }}
                        />
                      ) : (
                        <Feather
                          name="eye-off"
                          color="goldenrod"
                          size={20}
                          style={{ marginRight: 10 }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  {this.state.isValidPass ? null : (
                    <Animated.View
                      animation="fadeInLeft"
                      duration={500}
                      style={{ paddingLeft: 30 }}
                    >
                      <Text style={styles.errorMsg}>
                        Password must be 8 or more characters long.
                      </Text>
                    </Animated.View>
                  )}
                  <View
                    style={[
                      styles.view,
                      {
                        marginTop: 20,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Confirm Password"
                      style={styles.textInput}
                      placeholderTextColor="goldenrod"
                      fontSize="18"
                      autoCapitalize="none"
                      secureTextEntry={
                        this.state.secureTextEntry3 ? true : false
                      }
                      onChangeText={(confirmpass) =>
                        this.setState({ confirmpass })
                      }
                      onEndEditing={(e) => this.match(e.nativeEvent.text)}
                    />

                    <TouchableOpacity onPress={this.updateSecureTextEntry3}>
                      {this.state.secureTextEntry3 ? (
                        <Feather
                          name="eye"
                          color="goldenrod"
                          size={20}
                          style={{ marginRight: 10 }}
                        />
                      ) : (
                        <Feather
                          name="eye-off"
                          color="goldenrod"
                          size={20}
                          style={{ marginRight: 10 }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  {this.state.matching ? null : (
                    <Animated.View
                      animation="fadeInLeft"
                      duration={500}
                      style={{ paddingLeft: 30 }}
                    >
                      <Text style={styles.errorMsg}>
                        Passwords doesn't match.
                      </Text>
                    </Animated.View>
                  )}

                  <View
                    style={[
                      styles.view,
                      {
                        marginTop: 20,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Age"
                      style={styles.textInput}
                      placeholderTextColor="lightslategrey"
                      fontSize="18"
                      keyboardType="numeric"
                      //------------------------------------------------backend
                      onChangeText={(age) => this.setState({ age })}
                      //-------------------------------------------------------
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: "Kaushan",
                      marginLeft: 30,
                      marginTop: 10,
                      fontSize: 18,
                    }}
                  >
                    {" "}
                    Gender:{" "}
                  </Text>
                  <View style={{ marginLeft: 30, marginTop: 20 }}>
                    <RadioForm
                      radio_props={radio_props}
                      initial={0}
                      formHorizontal={false}
                      labelStyle={{
                        fontSize: 18,
                        color: "black",
                        fontFamily: "Kaushan",
                      }}
                      buttonSize={12}
                      buttonColor={"goldenrod"}
                      animation={true}
                      onPress={(value) => {
                        this.setState({ value: value });
                      }}
                    />
                  </View>

                  <Text
                    style={{
                      fontFamily: "Kaushan",
                      marginLeft: 30,
                      marginTop: 15,
                      fontSize: 18,
                    }}
                  >
                    {" "}
                    Weight{" "}
                    <Text style={{ color: "goldenrod", fontWeight: "bold" }}>
                      {" "}
                      (in Kilograms){" "}
                    </Text>
                    :{" "}
                  </Text>
                  <TextInput
                    style={styles.textInput2}
                    placeholder="eg. 60"
                    placeholderTextColor="lightsteelblue"
                    fontSize="18"
                    keyboardType="numeric"
                    //-----------------------------------------------------backend
                    onChangeText={(weight) => this.setState({ weight })}
                    //----------------------------------------------------------
                  />

                  <Text
                    style={{
                      fontFamily: "Kaushan",
                      marginLeft: 30,
                      marginTop: 15,
                      fontSize: 18,
                    }}
                  >
                    {" "}
                    Height{" "}
                    <Text style={{ color: "goldenrod", fontWeight: "bold" }}>
                      (in Centimeter){" "}
                    </Text>
                    :{" "}
                  </Text>
                  <TextInput
                    style={styles.textInput2}
                    placeholder="eg. 160"
                    placeholderTextColor="lightsteelblue"
                    fontSize="18"
                    keyboardType="numeric"
                    //-----------------------------------------------------backend
                    onChangeText={(height) => this.setState({ height })}
                    //-------------------------------------------------------------
                  />

                  <Text
                    style={{
                      fontFamily: "Kaushan",
                      marginLeft: 30,
                      marginTop: 15,
                      fontSize: 18,
                    }}
                  >
                    {" "}
                    Country:
                  </Text>
                  <View
                    style={[
                      styles.view,
                      {
                        marginTop: 20,
                      },
                    ]}
                  >
                    <CountryPicker
                      onSelect={(val) => this.setCountry(val)}
                      withFilter={true}
                    />
                    <FontAwesome
                      name="sort-down"
                      color="goldenrod"
                      size={20}
                      style={{ marginLeft: 5 }}
                    />
                    <TextInput
                      style={[styles.textInput, { marginLeft: 15 }]}
                      fontSize="18"
                      editable={false}
                    >
                      {this.state.country}
                    </TextInput>
                  </View>
                  <TouchableOpacity onPress={this.signupForm}>
                    <Animated.View
                      style={{ ...styles.button, backgroundColor: "goldenrod" }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        {" "}
                        Sign up{" "}
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>
                </ScrollView>
              </Animated.View>
            </View>
          </KeyboardAwareScrollView>
        </DismissKeyboard>
      );
    }
  }
}
export default Start;

const styles = StyleSheet.create({
  view: {
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
    marginTop: 40,
    paddingTop: 10,
    paddingLeft: 10,
    marginHorizontal: 25,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "white",
    height: 60,
    marginHorizontal: 25,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 3,
  },
  textInput: {
    height: 50,
    flex: 1,
    marginTop: -14,
    paddingLeft: 10,
    fontFamily: "Kaushan",
  },
  textInput2: {
    paddingLeft: 20,
    height: 40,
    borderRadius: 25,
    borderWidth: 0.5,
    marginHorizontal: width / 1.4,
    marginLeft: 30,
    marginVertical: 10,
    borderColor: "rgba(0,0,0,0.2)",
    fontFamily: "Kaushan",
  },
  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -20,
    left: width / 2 - 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 3,
  },
  title: {
    fontFamily: "Pacifico",
    fontSize: width / 6.8,
    fontWeight: "bold",
    alignItems: "center",
    marginTop: 120,
    opacity: 0.7,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
});
