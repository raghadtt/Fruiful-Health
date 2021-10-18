import React, { useState, useEffect, Fragment } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  TextInput,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import ModernHeader from "react-native-modern-header";
import Ionicons from "react-native-vector-icons/Ionicons";
import XDate from "xdate";
import Entypo from "react-native-vector-icons/Entypo";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileHeader from "react-native-profile-header";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import ProgressCircle from "react-native-progress-circle";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import _ from "lodash";

//----------------------------------------------Password
import Feather from "react-native-vector-icons/Feather";
//import Animated, { Easing } from "react-native-reanimated";
//----------------------------------------------
var bs = React.createRef();
var fall = new Animated.Value(1);
const { width, height } = Dimensions.get("window");
//--------------------------------------password
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
//---------------------------------password
const Tab = createMaterialTopTabNavigator();

const profile = ({ route, navigation }) => {
  const [image, setImage] = useState(null);
  const [profileData, setProfile] = useState([]);
  const [profileCircle, setProfileCircle] = useState();
  const [totalstate, settotalstate] = useState(0);

  const toggleSwitch = () => {
    setShowMarkedDatesExamples(!showMarkedDatesExamples);
  };

  const onDayPress = (day) => {
    setSelected(day.dateString);
    alert(day.dateString);
  };
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var now = new Date();
  var dayName = days[now.getDay()];

  var date = new Date().getDate(); //Current Date
  var month = monthNames[new Date().getMonth()]; //Current Month
  //var year = new Date().getFullYear(); //Current Year

  //---------------------------------------------------------------------Calendar Need
  const [selected, setSelected] = useState("");
  const [showMarkedDatesExamples, setShowMarkedDatesExamples] = useState(false);

  var dd = String(now.getDate()).padStart(2, "0");
  var mm = String(now.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = now.getFullYear();

  var today = yyyy + "-" + mm + "-" + dd; //current day

  const [marked, setmarked] = useState(); //days between start and end should be stright
  const [mark, setmark] = useState(); // start day should be circle
  const [mar, setmar] = useState(); // end day should be circle
  const [ma, setma] = useState(); //final contain copies all

  var first = new Array(); //array of start day
  var final = new Array(); //array of end day

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  var take = new Array(); //contain day the user take correct calories amount
  var nottake = new Array(); //contain day the user does not take correct calories amount
  var current = new Array(); //the current day to style it
  var currentnot = new Array(); //the start day if it take the correct amount to style it as startingDay because the order of copied obj will override the style
  var currentyes = new Array(); //=============== not take
  //------------------------------------------------

  //-----------------------------------------------------------------Reset Password Need

  const [isModalVisibleReset, setModalVisibleReset] = useState(false);
  const toggleModalReset = () => {
    setModalVisibleReset(!isModalVisibleReset);
  };
  const [isModalVisibleReset2, setModalVisibleReset2] = useState(false);
  const toggleModalReset2 = () => {
    setModalVisibleReset2(!isModalVisibleReset2);
    setModalVisibleReset(!isModalVisibleReset);
    setmatching(true);
    setisValidPass(true);
  };

  const [secureTextEntry2, setsecureTextEntry2] = useState(true);
  const [secureTextEntry3, setsecureTextEntry3] = useState(true);
  const [secureTextEntryOld, setsecureTextEntryOld] = useState(true);

  const [passwordsign, setpasswordsign] = useState("");
  const [isValidPass, setisValidPass] = useState(true);

  const [passwordsignOld, setpasswordsignOld] = useState("");
  const [isValidPassOld, setisValidPassOld] = useState(true);

  const [pass1, setpass1] = useState("");
  const [passOld, setpassOld] = useState("");

  const [matching, setmatching] = useState(true);
  const [confirmpass, setconfirmpass] = useState("");

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setpasswordsign(val);
      setisValidPass(true);
    } else {
      setpasswordsign(val);
      setisValidPass(false);
    }
  };
  const handlePasswordChangeOld = (val) => {
    if (val.trim().length >= 8) {
      setpasswordsignOld(val);
      setisValidPassOld(true);
    } else {
      setpasswordsignOld(val);
      setisValidPassOld(false);
    }
  };
  const savepass1 = (val) => {
    setpass1(val);
  };
  const savepassOld = (val) => {
    setpassOld(val);
  };
  const updateSecureTextEntry2 = () => {
    setsecureTextEntry2(!secureTextEntry2);
  };
  const updateSecureTextEntry3 = () => {
    setsecureTextEntry3(!secureTextEntry3);
  };
  const updateSecureTextEntryOld = () => {
    setsecureTextEntryOld(!secureTextEntryOld);
  };

  const match = (val) => {
    if (val == pass1) setmatching(true);
    else setmatching(false);
  };
  //------------------------------------------------

  const user = route.params.user;
  const level = route.params.level;
  const cal = route.params.cal;
  const start = route.params.start;
  const end = route.params.end;
  const period = route.params.period;
  const w = route.params.w;
  var totalCalories;
  var acumulativeSum = 0;
  var total = 0;
  totalCalories = period * 7 * cal;

  //------------------------------------------------------ FETCH
  async function fetchData() {
    const response = await fetch(
      "http://192.168.1.110:4008/users?user=" + user
    );
    const info = await response.json();
    setProfile(info);
  }
  /* **************************************************************************************************** */
  async function fetchCircle() {
    const response2 = await fetch(
      "http://192.168.1.110:4008/Circle?user=" + user
    );
    const info2 = await response2.json();
    setProfileCircle(info2);

    if (info2.length) {
      var diff = new Date().getTime() - new Date(start).getTime();
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    info2.forEach((element1) => {
      if (element1.day < days + 1) acumulativeSum += element1.calories;
    });
    total = (acumulativeSum / totalCalories) * 100;
    total = Math.ceil(total);
    if (total != 0) settotalstate(total);
    /* **************************************************************************************************** */
    //____________________________________here we want to get days between start and end to color them

    Date.prototype.addDays = function (days) {
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
    };

    function getDates(startDate, stopDate) {
      var dateArray = new Array();

      var currentDate = startDate;

      while (currentDate <= stopDate) {
        var dddd = String(currentDate.getDate()).padStart(2, "0");
        var mmmm = String(currentDate.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyyyy = currentDate.getFullYear();

        var todayy = yyyyyy + "-" + mmmm + "-" + dddd;

        var dif = new Date(currentDate).getTime() - new Date(start).getTime();
        var daydif = Math.floor(dif / (1000 * 60 * 60 * 24));
        //------------------------------------- for coloring as mark green or red
        if (currentDate >= new Date(start) && currentDate < new Date()) {
          info2.forEach((element1) => {
            if (element1.day == daydif + 1) {
              if (element1.calories <= cal) {
                take.push(todayy);
              } else if (element1.calories > cal) {
                nottake.push(todayy);
              }
            }
          });
        }
        //-----------------------------------------------------------
        dateArray.push(todayy); //this array will contain all days but we over ride the style of it
        currentDate = currentDate.addDays(1);
      }

      first.push(dateArray[0]); //start day
      final.push(dateArray[dateArray.length - 1]); //end day
      current.push(today); //current day

      //---------------------------- override the start day if it not current day

      if (new Date(start) != new Date()) {
        info2.forEach((element1) => {
          if (element1.day == 1) {
            if (element1.calories <= cal) {
              currentyes.push(start);
            } else if (element1.calories > cal) {
              currentnot.push(start);
            }
          }
        });
      }
      //-------------------------
      return dateArray;
    }
    //---------------------_______________________Call function-----------------------

    var dateArray = getDates(new Date(start), new Date(end));
    //--------------------______________________________-------------------------------

    /* for (var i = 0; i < dateArray.length; i++) {
      console.log(dateArray[i]);
    }*/

    var obj1 = first.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: { color: "#ffe4b5", startingDay: true },
        }),
      {}
    );
    setmark(obj1);

    var obj2 = final.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: { color: "#ffe4b5", endingDay: true },
        }),
      {}
    );

    var obj3 = take.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: {
            marked: true,
            dotColor: "green",
            color: "#fdf5e6",
          },
        }),
      {}
    );

    var obj4 = nottake.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: {
            marked: true,
            dotColor: "red",
            color: "#fdf5e6",
          },
        }),
      {}
    );
    var obj5 = current.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: {
            color: "#b0e0e6",
            startingDay: true,
            endingDay: true,
            textColor: "black",
          },
        }),
      {}
    );

    var obj6 = currentyes.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: {
            color: "#ffe4b5",
            startingDay: true,
            marked: true,
            dotColor: "green",
          },
        }),
      {}
    );

    var obj7 = currentnot.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: {
            color: "#ffe4b5",
            startingDay: true,
            marked: true,
            dotColor: "red",
          },
        }),
      {}
    );

    var obj = dateArray.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: { color: "#fdf5e6" },
        }),
      {}
    );

    var s = {
      ...obj,
      ...obj1,
      ...obj2,
      ...obj3,
      ...obj4,
      ...obj5,
      ...obj6,
      ...obj7,
    }; //order is important
    setma(s); //final result
  }

  useEffect(() => {
    fetchData();
    fetchCircle();
  }, []);
  //----------------------------------------------------------------------change password
  const verifypass = () => {
    if (passwordsignOld == "") {
      alert("Please fill the field");
    } else {
      fetch("http://192.168.1.110:4008/verify", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          password: passwordsignOld,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            //setModalVisibleReset(!isModalVisibleReset);
            setModalVisibleReset2(!isModalVisibleReset2);
          } else {
            alert(res.message);
          }
        })
        .done();
    }
  };
  const savepass = () => {
    if (passwordsign != "" && pass1 != "") {
      fetch("http://192.168.1.110:4008/savepass", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          password: passwordsign,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            //setModalVisibleReset(!isModalVisibleReset);
            alert(res.message);
            toggleModalReset2();
          } else {
            alert(res.message);
          }
        })
        .done();
    } else {
      alert("Please fill all fields");
    }
  };

  //----------------------------------------------------------------------
  let takePhotoFromCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    setImage({ localUri: pickerResult.uri });
  };

  let choosePhotoFromLibrary = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    setImage({ localUri: pickerResult.uri });
  };

  let removepp = () => {
    if (image != null) setImage(null);
  };
  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}
      >
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}
      >
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={removepp}>
        <Text style={styles.panelButtonTitle}>Remove Profile Picture</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}
      >
        <SafeAreaView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                alignSelf: "left",
                flexDirection: "row",
              }}
            >
              <View style={styles.profileImage}>
                {image != null ? (
                  <Image
                    source={{ uri: image.localUri }}
                    style={styles.image}
                    resizeMode="contain"
                  ></Image>
                ) : (
                  <Image
                    source={require("../assets/profile.png")}
                    style={styles.image}
                    resizeMode="contain"
                  ></Image>
                )}
              </View>
              <TouchableOpacity
                hitSlop={{
                  left: 20,
                  right: 20,
                  top: 20,
                  bottom: 20,
                }}
                onPress={() => bs.current.snapTo(0)}
              >
                <View style={styles.add}>
                  <Ionicons
                    name="add"
                    size={30}
                    color="white"
                    style={{ marginTop: 2, marginLeft: 3 }}
                  ></Ionicons>
                </View>
              </TouchableOpacity>
              <FlatList
                data={profileData}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.infoContainer}>
                      <Text style={[styles.text, { fontSize: width / 13 }]}>
                        {item.firstname + " " + item.lastname}
                      </Text>
                      <Text
                        style={[
                          styles.text,
                          { color: "#AEB5BC", fontSize: 14 },
                        ]}
                      >
                        @{item.username}
                      </Text>
                    </View>
                    <View style={styles.edit}>
                      <TouchableOpacity onPress={toggleModalReset}>
                        <MaterialCommunityIcons
                          name="account-edit-outline"
                          size={25}
                          //color="black"
                          style={{ marginTop: 2, marginLeft: 3 }}
                        ></MaterialCommunityIcons>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.calendar}>
                      <TouchableOpacity onPress={toggleModal}>
                        <Octicons
                          name="calendar"
                          size={25}
                          color="black"
                          style={{ marginTop: 2, marginLeft: 3 }}
                        ></Octicons>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
            <FlatList
              data={profileData}
              renderItem={({ item }) => (
                <View>
                  <View style={styles.statsContainer}>
                    <View
                      style={[
                        styles.statsBox,
                        { borderLeftWidth: 2, borderColor: "lightgrey" },
                      ]}
                    >
                      <Text style={[styles.text, { fontSize: 24 }]}>
                        {item.weight} Kg
                      </Text>
                      <Text style={[styles.text, styles.subText]}>
                        Starting weight
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statsBox,
                        {
                          borderColor: "lightgrey",
                          borderLeftWidth: 2,
                          borderRightWidth: 2,
                        },
                      ]}
                    >
                      <Text style={[styles.text, { fontSize: 24 }]}>
                        {item.target} Kg
                      </Text>
                      <Text style={[styles.text, styles.subText]}>
                        Goal Weight
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: width / 10,
                      shadowColor: "black",
                      shadowOpacity: 0.2,
                      borderRadius: 8,
                      shadowRadius: 5,
                      backgroundColor: "#f5f5f5",
                      height: height / 2,
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          fontSize: 20,
                          fontFamily: "balsam-f",
                          marginTop: width / 25,
                          marginLeft: width / 25,
                          color: "#B81D16",
                        },
                      ]}
                    >
                      {dayName}, {date} {month}
                    </Text>
                    <View
                      style={{
                        marginTop: width / 15,
                        alignContent: "canter",
                        alignItems: "canter",
                        //  backgroundColor: "red",
                        marginLeft: width / 5.5,
                      }}
                    >
                      <ProgressCircle
                        percent={totalstate}
                        radius={width / 3.5}
                        borderWidth={width / 16}
                        color="goldenrod"
                        shadowColor="#999"
                        bgColor="#fff"
                      >
                        <Text style={[styles.text, { fontSize: width / 15 }]}>
                          {totalstate}%
                          <MaterialIcons
                            name="local-fire-department"
                            size={25}
                            color="orange"
                          ></MaterialIcons>
                        </Text>

                        <Text style={[styles.text, { fontSize: width / 15 }]}>
                          Completed
                        </Text>
                      </ProgressCircle>
                    </View>
                  </View>
                </View>
              )}
            />
          </ScrollView>
        </SafeAreaView>
        <Modal isVisible={isModalVisible}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                position: "absolute",
                top: width / 4,
                left: 0,
                right: 0,
                bottom: 0,
                height: height / 1.45,
                width: width / 1.1,
                shadowOpacity: 0.5,
                borderRadius: 5,
                backgroundColor: "white",
                flexDirection: "coulmn",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    marginTop: width / 25,
                    fontSize: width / 20,
                    paddingLeft: 8,
                    color: "#1a798a",
                  }}
                >
                  Calendar
                </Text>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    alignContent: "center",
                    marginBottom: width / 20,
                    //marginTop: width / 4,
                    marginLeft: width / 1.7,
                  }}
                  onPress={toggleModal}
                >
                  <AntDesign name="close" size={30}></AntDesign>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: width / 15,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: width / 1.3,
                  width: width / 1.1,

                  backgroundColor: "white",
                  flexDirection: "row",
                  flexShrink: 1,
                  flexWrap: 1,
                  marginTop: width / 25,
                }}
              >
                <Fragment>
                  <Calendar
                    current={today}
                    style={styles.calendarr}
                    markedDates={ma}
                    onDayPress={onDayPress}
                    markingType={"period"}
                    theme={{
                      todayTextColor: "black",
                      disabledArrowColor: "#d9e1e8",
                      textDayFontWeight: "300",
                      todayTextFontWeight: "800",
                      textDayHeaderFontWeight: "300",
                      textDayFontSize: 16,
                      textMonthFontSize: 16,
                      textDayHeaderFontSize: 15,
                      week: {
                        marginTop: 5,
                        flexDirection: "row",
                      },
                    }}
                  />
                </Fragment>
              </View>
            </View>
          </View>

          <View style={{ paddingLeft: 8 }}>
            <View style={styles.recentItem}>
              <View style={styles.activityIndicator}></View>
              <View style={{ width: 250 }}>
                <Text
                  style={[styles.text, { color: "#41444B", fontWeight: "400" }]}
                >
                  committed to the specific calories.
                </Text>
              </View>
            </View>
          </View>
          <View style={{ paddingLeft: 8 }}>
            <View style={styles.recentItem2}>
              <View style={styles.activityIndicator2}></View>
              <View style={{ width: 250 }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.text,
                    {
                      color: "#41444B",
                      fontWeight: "400",
                    },
                  ]}
                >
                  didn't committed to the specific calories.
                </Text>
              </View>
            </View>
          </View>
        </Modal>

        <Modal isVisible={isModalVisibleReset} backdropOpacity={0.8}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                position: "absolute",
                top: width / 2.8,
                left: 0,
                right: 0,
                bottom: 0,
                height: height / 2.5,
                width: width / 1.1,
                shadowOpacity: 0.5,
                borderRadius: 5,
                backgroundColor: "white",
                flexDirection: "coulmn",
              }}
            >
              <View style={{ flexDirection: "coulmn", height: height / 2 }}>
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
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    marginTop: width / 15,
                    fontSize: width / 23,
                    paddingLeft: 8,
                    color: "lightslategrey",
                  }}
                >
                  To continue , first verify it's you
                </Text>
              </View>

              <View
                style={{
                  position: "absolute",
                  top: width / 4,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: width / 4,
                  width: width / 1.1,

                  backgroundColor: "white",
                  flexDirection: "row",
                  flexShrink: 1,
                  flexWrap: 1,
                  marginTop: width / 25,
                }}
              >
                <View
                  style={[
                    styles.view,
                    {
                      marginTop: 15,
                    },
                  ]}
                >
                  <TextInput
                    placeholder="Old Password"
                    style={styles.textInput}
                    placeholderTextColor="lightslategrey"
                    fontSize="18"
                    autoCapitalize="none"
                    secureTextEntry={secureTextEntryOld ? true : false}
                    //-------------------------------------------------------backend
                    onChangeText={(val) => handlePasswordChangeOld(val)}
                    //-------------------------------------------------------
                    onEndEditing={(e) => savepassOld(e.nativeEvent.text)}
                  />

                  <TouchableOpacity onPress={updateSecureTextEntryOld}>
                    {secureTextEntryOld ? (
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
                  height: width / 6,
                  width: width / 1.1,

                  marginTop: width / 25,
                }}
              >
                <TouchableOpacity
                  style={{
                    marginLeft: width / 20,
                    backgroundColor: "goldenrod",
                    width: width / 7,
                    height: width / 12,
                    borderRadius: 10,
                    marginTop: width / 27,
                  }}
                  onPress={() => verifypass()}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        paddingTop: width / 50,
                        color: "white",
                      }}
                    >
                      Next
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginLeft: width / 20,
                    backgroundColor: "goldenrod",
                    width: width / 7,
                    height: width / 12,
                    borderRadius: 10,
                    marginTop: width / 27,
                  }}
                  onPress={toggleModalReset}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        paddingTop: width / 50,
                        color: "white",
                      }}
                    >
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Modal isVisible={isModalVisibleReset2} backdropOpacity={0}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  position: "absolute",
                  top: width / 2.8,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: height / 2.3,
                  width: width / 1.1,
                  shadowOpacity: 0.5,
                  borderRadius: 5,
                  backgroundColor: "white",
                  flexDirection: "coulmn",
                }}
              >
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
                      styles.view,
                      {
                        marginTop: 20,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="New Password"
                      style={styles.textInput}
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
                      <Text style={styles.errorMsg}>
                        Passwords doesn't match.
                      </Text>
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
                  <TouchableOpacity
                    style={{
                      marginLeft: width / 8.5,
                      backgroundColor: "goldenrod",
                      width: width / 7,
                      height: width / 12,
                      borderRadius: 10,
                      marginTop: width / 27,
                    }}
                    onPress={toggleModalReset2}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontFamily: "balsam-f",
                          paddingTop: width / 50,
                          color: "white",
                        }}
                      >
                        Cancel
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Modal>
      </Animated.View>
    </View>
  );
};
export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "#52575D",
  },
  image: {
    flex: 1,
    height: width / 2.8,
    width: width / 2.8,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16,
  },
  subText: {
    fontSize: 12,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  profileImage: {
    marginTop: width / 35,
    width: width / 2.8,
    height: width / 2.8,
    borderRadius: width / 3,
    borderColor: "#cccccc",
    borderWidth: 1,
    overflow: "hidden",
  },
  dm: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  add: {
    backgroundColor: "goldenrod",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: width / 10,
    height: width / 10,
    borderRadius: width / 10,
    alignItems: "center",
    justifyContent: "center",
  },
  edit: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: width / 7,
    top: width / 3.5,
    width: width / 10,
    height: width / 10,
    borderRadius: width / 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cccccc",
    borderWidth: 1,
  },
  calendar: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: width / 3,
    top: width / 3.5,
    width: width / 10,
    height: width / 10,
    borderRadius: width / 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cccccc",
    borderWidth: 1,
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: width / 8,
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },

  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: width / 100,
  },
  recentItem2: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: width / 4.5,
  },
  activityIndicator: {
    backgroundColor: "green",
    padding: 4,
    height: 5,
    width: 5,
    borderRadius: 16,
    marginTop: 3,
    marginRight: 7,
  },
  activityIndicator2: {
    backgroundColor: "red",
    padding: 4,
    height: 5,
    width: 5,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 7,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#0f5f6e",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  calendarr: {
    height: width / 8,
    width: width / 1.1,
  },
  //-------------------------- Style Reset Password
  view: {
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
  textInput: {
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
});
