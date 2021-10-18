import React, { useEffect } from "react";
import {
  View,
  Text,
  Keyboard,
  ImageBackground,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Animated from "react-native-reanimated";
import Feather from "react-native-vector-icons/Feather";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
const { width, height } = Dimensions.get("window");
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const Stack = createStackNavigator();

function Passreset({ route, navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ScreenZero"
        component={ScreenZero}
        options={({ navigation, route }) => ({})}
      />
      <Stack.Screen
        name="ScreenOne"
        component={ScreenOne}
        options={({ navigation, route }) => ({})}
      />
      <Stack.Screen
        name="ScreenTwo"
        component={ScreenTwo}
        options={({ navigation, route }) => ({})}
      />
    </Stack.Navigator>
  );
}

export default Passreset;

const ScreenZero = ({ navigation, route }) => {
  const [email, setemail] = React.useState(null);

  const connect = () => {
    if (email == null) Alert.alert("Please enter your email to continue ", "");
    else {
      fetch("http://192.168.1.110:4008/checkemailFORresetPass", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            navigation.reset({
              //Using reset avoid you to go back to login Screen
              index: 0,
              routes: [
                {
                  name: "ScreenOne",
                  params: {
                    email: email,
                  },
                },
              ],
            });
          } else {
            alert(res.message);
          }
        })
        .done();
    }
  };
  return (
    <DismissKeyboard>
      <ImageBackground
        style={{ width: "100%", height: "105%" }}
        source={require("../assets/bg2.png")}
        imageStyle={{ opacity: 0.25 }} //so any children of it don't affected
      >
        <View style={{ justifyContent: "center" }}>
          <View style={styles.view1}>
            <Text style={styles.t2}>Forget Your Password?</Text>
            <Text style={styles.t3}>
              Enter the email address associated with your account
            </Text>

            <View style={styles.view}>
              <MaterialCommunityIcons
                name="email-outline"
                size={width / 14}
                color="goldenrod"
                //style={{ marginTop: width / 10 }}
              />
              <TextInput
                placeholder="ex@gmail.com"
                style={styles.textInput}
                placeholderTextColor="lightslategrey"
                fontSize={width / 23}
                autoCapitalize="none"
                //-------------------------------------------------for backend
                onChangeText={(email) => setemail(email)}
                //-------------------------------------------------
              />
            </View>
            <TouchableOpacity onPress={() => connect()} style={styles.button}>
              <Text
                style={{
                  fontFamily: "balsam-f",
                  color: "white",
                  fontSize: width / 23,
                }}
              >
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </DismissKeyboard>
  );
};
const ScreenOne = ({ navigation, route }) => {
  const email = route.params.email;
  const [codeuser, setcodeuser] = React.useState();

  var randomString = require("random-string");
  var code = randomString({
    length: 6,
    numeric: true,
    letters: true,
    special: false,
  });
  
  const verify = () => {
    if (email == null) Alert.alert("Please enter your email to continue ", "");
    else {
	
      fetch("http://192.168.1.110:4008/resetpassverify", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          codeuser: codeuser,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            navigation.reset({
              //Using reset avoid you to go back to login Screen
              index: 0,
              routes: [
                {
                  name: "ScreenTwo",
                  params: {
                    email: email,
                  },
                },
              ],
            });
          } else {
            alert(res.message);
          }
        })
        .done();
    }
  };
  const sendEmail = () => {
	
    fetch("http://192.168.1.110:4008/resetpass", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        code: code,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          // alert(res.message);
        } else {
          alert(res.message);
        }
      })
      .done();
  };

  useEffect(() => {
    sendEmail();
  }, []);

  return (
    <DismissKeyboard>
      <ImageBackground
        style={{ width: "100%", height: "105%" }}
        source={require("../assets/bg2.png")}
        imageStyle={{ opacity: 0.25 }} //so any children of it don't affected
      >
        <View style={{ justifyContent: "center" }}>
          <View style={styles.view1}>
            <Text style={styles.t4}>
              Enter the Code that you received in your email
            </Text>

            <View style={styles.view}>
              <MaterialCommunityIcons
                name="key-variant"
                size={width / 14}
                color="goldenrod"
                //style={{ marginTop: width / 10 }}
              />
              <TextInput
                placeholder="Enter the code"
                style={styles.textInput}
                placeholderTextColor="lightslategrey"
                fontSize={width / 23}
                autoCapitalize="none"
                //-------------------------------------------------for backend
                onChangeText={(codeuser) => setcodeuser(codeuser)}
                //-------------------------------------------------
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => verify()}>
              <Text
                style={{
                  fontFamily: "balsam-f",
                  color: "white",
                  fontSize: width / 23,
                }}
              >
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </DismissKeyboard>
  );
};
const ScreenTwo = ({ navigation, route }) => {
  const email = route.params.email;

  //--------------------------------------------------------

  const [secureTextEntry2, setsecureTextEntry2] = React.useState(true);
  const [secureTextEntry3, setsecureTextEntry3] = React.useState(true);

  const [passwordsign, setpasswordsign] = React.useState("");
  const [isValidPass, setisValidPass] = React.useState(true);

  const [pass1, setpass1] = React.useState("");
  const [passOld, setpassOld] = React.useState("");

  const [matching, setmatching] = React.useState(true);
  const [confirmpass, setconfirmpass] = React.useState("");

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setpasswordsign(val);
      setisValidPass(true);
    } else {
      setpasswordsign(val);
      setisValidPass(false);
    }
  };

  const savepass1 = (val) => {
    setpass1(val);
  };

  const updateSecureTextEntry2 = () => {
    setsecureTextEntry2(!secureTextEntry2);
  };
  const updateSecureTextEntry3 = () => {
    setsecureTextEntry3(!secureTextEntry3);
  };

  const match = (val) => {
    if (val == pass1) setmatching(true);
    else setmatching(false);
  };
  //-------------------------------------------------------
  const deletepass = () => {
    fetch("http://192.168.1.110:4008/resetpassdelete", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
        } else {
          alert(res.message);
        }
      })
      .done();
  };

  useEffect(() => {
    deletepass();
  }, []);
  //------------------------
  const savepass = () => {
    if (passwordsign != null && pass1 != null) {
      fetch("http://192.168.1.110:4008/updateresetpass", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: passwordsign,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            Alert.alert(
              "Updated Successfuly ",
              " You can now go and login again",
              [
                {
                  text: "Ok",
                  onPress: () =>
                    navigation.reset({
                      //Using reset avoid you to go back to login Screen
                      index: 0,
                      routes: [
                        {
                          name: "Start",
                        },
                      ],
                    }),
                  style: "cancel",
                },
              ]
            );
          } else {
            alert(res.message);
          }
        })
        .done();
    } else {
      alert("Please fill all fields");
    }
  };
  //--------------------
  return (
    <DismissKeyboard>
      <ImageBackground
        style={{ width: "100%", height: "105%" }}
        source={require("../assets/bg2.png")}
        imageStyle={{ opacity: 0.25 }} //so any children of it don't affected
      >
        <View style={{ justifyContent: "center" }}>
          <View style={styles.view1}>
            <View style={{ flexDirection: "row", height: height / 2 }}>
              <Text
                style={{
                  fontFamily: "balsam-f",
                  marginTop: width / 12,
                  fontSize: width / 20,
                  paddingLeft: 8,
                  color: "#1a798a",
                }}
              >
                Change Your Password :
              </Text>
            </View>
            <View
              style={{
                position: "absolute",
                top: width / 7,
                left: 0,
                right: 0,
                bottom: 0,
                height: width / 2.5,
                width: width / 1.1,

                // backgroundColor: "red",
                flexDirection: "row",
                flexShrink: 1,
                flexWrap: 1,
                marginTop: width / 25,
              }}
            >
              <View
                style={[
                  styles.vieww,
                  {
                    marginTop: 20,
                  },
                ]}
              >
                <TextInput
                  placeholder="New Password"
                  style={styles.textInput2}
                  placeholderTextColor="lightslategrey"
                  fontSize="18"
                  autoCapitalize="none"
                  secureTextEntry={secureTextEntry2 ? true : false}
                  //-------------------------------------------------------backend
                  onChangeText={(val) => handlePasswordChange(val)}
                  //-------------------------------------------------------
                  onEndEditing={(e) => savepass1(e.nativeEvent.text)}
                />

                <TouchableOpacity onPress={updateSecureTextEntry2}>
                  {secureTextEntry2 ? (
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

              {isValidPass ? null : (
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
                  styles.vieww,
                  {
                    marginTop: 20,
                  },
                ]}
              >
                <TextInput
                  placeholder="Confirm Password"
                  style={styles.textInput2}
                  placeholderTextColor="goldenrod"
                  fontSize="18"
                  autoCapitalize="none"
                  secureTextEntry={secureTextEntry3 ? true : false}
                  onChangeText={(confirmpass) =>
                    setconfirmpass({ confirmpass })
                  }
                  onEndEditing={(e) => match(e.nativeEvent.text)}
                />

                <TouchableOpacity onPress={updateSecureTextEntry3}>
                  {secureTextEntry3 ? (
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
              {matching ? null : (
                <Animated.View
                  animation="fadeInLeft"
                  duration={500}
                  style={{ paddingLeft: 30 }}
                >
                  <Text style={styles.errorMsg}>Passwords doesn't match.</Text>
                </Animated.View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                // backgroundColor: "red",
                position: "absolute",
                top: width / 2,
                left: 0,
                right: 0,
                bottom: 0,
                height: width / 8,
                width: width / 1.1,

                marginTop: width / 15,
              }}
            >
              <TouchableOpacity
                style={{
                  marginLeft: width / 8.5,
                  backgroundColor: "goldenrod",
                  width: width / 7,
                  height: width / 12,
                  borderRadius: 10,
                  marginTop: width / 27,
                }}
                onPress={() => savepass()}
              >
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontFamily: "balsam-f",
                      paddingTop: width / 50,
                      color: "white",
                    }}
                  >
                    Save
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </DismissKeyboard>
  );
};
const styles = StyleSheet.create({
  view1: {
    alignItems: "center",
    backgroundColor: "white",
    width: width / 1.1,
    height: height / 2,
    marginLeft: width / 20,
    marginTop: width / 4,
    shadowColor: "black",
    shadowOpacity: 0.5,
    borderRadius: 6,
    shadowRadius: 5,
  },
  t2: {
    color: `#000000`,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width / 15,
    fontFamily: "balsam-f",
    marginTop: width / 9,
  },
  t3: {
    color: `goldenrod`,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width / 25,
    fontFamily: "balsam-f",
    marginTop: width / 13,
  },
  t4: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width / 20,
    fontFamily: "balsam-f",
    marginTop: width / 10,
    marginLeft: width / 25,
  },
  textInput: {
    height: 50,
    flex: 1,
    marginTop: -14,
    paddingLeft: 10,
    fontFamily: "balsam-f",
  },
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
  button: {
    backgroundColor: "goldenrod",
    marginTop: width / 13,
    height: 60,
    width: width / 2,
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
  textInput2: {
    height: 50,
    width: width / 2,
    flex: 1,
    marginTop: -14,
    paddingLeft: 10,
    fontFamily: "balsam-f",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  vieww: {
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
    marginTop: 40,
    paddingTop: 10,
    paddingLeft: 10,
    marginHorizontal: 25,

    width: width / 1.3,
  },
});
