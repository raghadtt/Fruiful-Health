import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ActivityIndicator,
  StatusBar,
  FlatList,
  Button,
  TouchableHighlight,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import ModernHeader from "react-native-modern-header";
import Ionicons from "react-native-vector-icons/Ionicons";
import Material from "react-native-vector-icons/MaterialIcons";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import WebView from "react-native-webview";
const { width, height } = Dimensions.get("window");
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Permissions from "expo-permissions";
import * as geolib from "geolib";
import MapViewDirections from "react-native-maps-directions";
import Counter from "react-native-counters";
import Modal from "react-native-modal";

import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";

const Stack = createStackNavigator();

const training = ({ navigation, route }) => {
  const user = route.params.user;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Main"
        component={Main}
        initialParams={{ user: user }}
        options={({ navigation }) => ({})}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={({ navigation }) => ({})}
      />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};
export default training;

const Main = ({ navigation, route }) => {
  const [flag1, setflag1] = useState(true);
  const [flag2, setflag2] = useState(false);
  const [flag3, setflag3] = useState(false);
  const [flag4, setflag4] = useState(false);
  const [data, setData] = useState([]);
  const user = route.params.user;

  //-------------------------- Filter ----------------------------------------//
  const [isModalVisible, setModalVisible] = useState(false);
  const [filterlevel, setFilterlevel] = useState([]);
  const [checkboxfilter, setcheckboxfilter] = useState([]);
  const [color, setcolor] = useState([]);
  let array = [...color];
  const [TrainingSource, setTrainingSource] = useState([]);
  const [TrainingSourceFiltter, setTrainingSourceFiltter] = useState([]);
  const [TrainingSourceFilttercheck, setTraingSourceFilttercheck] = useState(
    []
  );
  const [list1, setlist1] = useState([]);
  const [sh, setsh] = useState(false); //just for show the loading indecator or the list of recipes

  var minn;
  var maxx;
  const [min, setmin] = useState();
  const [max, setmax] = useState();
  const [minDB, setminDB] = useState();
  const [maxDB, setmaxDB] = useState();

  const toggleModal = () => {
    setminDB(min);
    setmaxDB(max);
    setModalVisible(!isModalVisible);
  };

  const minfunction = (minCa) => {
    setminDB(minCa);
  };

  const maxfunction = (maxCa) => {
    setmaxDB(maxCa);
  };

  const handleChange = (box, key) => {
    let index = checkboxfilter.indexOf(box);

    if (index == -1) {
      checkboxfilter.push(box);
      array[key] = "goldenrod";
      setcolor(array);
    } else {
      checkboxfilter.splice(index, 1);
      array[key] = "white";
      setcolor(array);
    }
  };

  async function filterpres() {
    if (checkboxfilter.length == 0) {
      Alert.alert("Please select at least one type of meal", "", [
        { text: "OK" },
      ]);
    } else {
      setsh(false);
      setModalVisible(false);

      let a = checkboxfilter.join("','");
      const myresponse = await fetch(
        "http://192.168.1.110:4008/filterlevelCalorie?level=" +
          a +
          "&minDB=" +
          minDB +
          "&maxDB=" +
          maxDB
      );

      const works = await myresponse.json();

      setData(works);
      setsh(true);
    }
  }

  //-----------------------------------------------------------------------------//

  async function fetchData(part) {
    minn = 10000;
    maxx = -10000;

    const response = await fetch(
      "http://192.168.1.110:4008/exercises?part=" + part
    );
    const info = await response.json();
    setData(info);

    setTrainingSourceFiltter(info);
    setTraingSourceFilttercheck(info);

    if (info.length) {
      setsh(true);
      info.forEach((element1) => {
        if (element1.calories > maxx) maxx = element1.calories;
        if (element1.calories < minn) minn = element1.calories;
      });
    } //show recipes view insted of loading icon

    setmin(minn);
    setmax(maxx);

    const response2 = await fetch("http://192.168.1.110:4008/filterlevel");
    const levels = await response2.json();
    setFilterlevel(levels);
  }
  useEffect(() => {
    fetchData("%Total%");
  }, []);

  const total = () => {
    setflag1(true);
    setflag2(false);
    setflag3(false);
    setflag4(false);
    fetchData("%Total%");
  };
  const upper = () => {
    setflag1(false);
    setflag2(true);
    setflag3(false);
    setflag4(false);
    fetchData("%Upper%");
  };
  const lower = () => {
    setflag1(false);
    setflag2(false);
    setflag3(true);
    setflag4(false);
    fetchData("%Lower%");
  };
  const core = () => {
    setflag1(false);
    setflag2(false);
    setflag3(false);
    setflag4(true);
    fetchData("%Core%");
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <ModernHeader
        backgroundColor="white"
        height={70}
        titleStyle={{
          fontSize: 18,
          fontWeight: "bold",
          fontFamily: "balsam-f",
        }}
        title="Exercises"
        leftIconName="map"
        rightDisable="true"
        leftIconSize={30}
        leftIconColor="black"
        leftIconOnPress={() => navigation.navigate("Map")}
      />
      <View style={styles.header}>
        {flag1 ? (
          <TouchableOpacity onPress={() => total()}>
            <View
              style={{
                marginLeft: 10,
                backgroundColor: "white",
                borderRadius: 70,
                opacity: "0.7",
              }}
            >
              <Text
                style={{
                  margin: 7,
                  color: "black",
                  fontSize: 15,
                  fontWeight: "bold",
                  fontFamily: "balsam-f",
                }}
              >
                {"\t"} <Ionicons name="body" size={25} color="black"></Ionicons>
                {"\n"} Total Body{" "}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => total()}>
            <Text
              style={{
                margin: 7,
                color: "white",
                fontSize: 15,
                fontWeight: "bold",
                fontFamily: "balsam-f",
              }}
            >
              {" "}
              {"\t"} <Ionicons name="body" size={25} color="white"></Ionicons>
              {"\n"} Total Body{" "}
            </Text>
          </TouchableOpacity>
        )}
        {flag2 ? (
          <TouchableOpacity onPress={() => upper()}>
            <View
              style={{
                marginLeft: 10,
                backgroundColor: "white",
                borderRadius: 70,
                opacity: "0.7",
              }}
            >
              <Text
                style={{
                  margin: 7,
                  color: "black",
                  fontSize: 15,
                  fontWeight: "bold",
                  fontFamily: "balsam-f",
                }}
              >
                {"\t"}{" "}
                <Ionicons name="ios-man" size={25} color="black"></Ionicons>
                {"\n"} Upper Body{" "}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => upper()}>
            <Text
              style={{
                margin: 7,
                marginLeft: 10,
                color: "white",
                fontSize: 15,
                fontWeight: "bold",
                fontFamily: "balsam-f",
              }}
            >
              {" "}
              {"\t"}{" "}
              <Ionicons name="ios-man" size={25} color="white"></Ionicons>
              {"\n"} Upper Body{" "}
            </Text>
          </TouchableOpacity>
        )}
        {flag3 ? (
          <TouchableOpacity onPress={() => lower()}>
            <View
              style={{
                marginLeft: 10,
                backgroundColor: "white",
                borderRadius: 70,
                opacity: "0.7",
              }}
            >
              <Text
                style={{
                  margin: 7,
                  color: "black",
                  fontSize: 15,
                  fontWeight: "bold",
                  fontFamily: "balsam-f",
                }}
              >
                {"\t"} <Ionicons name="walk" size={25} color="black"></Ionicons>
                {"\n"} Lower Body{" "}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => lower()}>
            <Text
              style={{
                margin: 7,
                marginLeft: 10,
                color: "white",
                fontSize: 15,
                fontWeight: "bold",
                fontFamily: "balsam-f",
              }}
            >
              {" "}
              {"\t"} <Ionicons name="walk" size={25} color="white"></Ionicons>
              {"\n"} Lower Body{" "}
            </Text>
          </TouchableOpacity>
        )}
        {flag4 ? (
          <TouchableOpacity onPress={() => core()}>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 70,
                opacity: "0.7",
                marginLeft: 15,
              }}
            >
              <Text
                style={{
                  margin: 7,
                  marginLeft: 10,
                  color: "black",
                  fontSize: 15,
                  fontWeight: "bold",
                  fontFamily: "balsam-f",
                }}
              >
                {"  "}
                <Ionicons name="ios-bicycle" size={25} color="black"></Ionicons>
                {"\n"} Core{" "}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => core()}>
            <Text
              style={{
                margin: 7,
                marginLeft: 25,
                color: "white",
                fontSize: 15,
                fontWeight: "bold",
                fontFamily: "balsam-f",
              }}
            >
              {"  "}
              <Ionicons name="ios-bicycle" size={25} color="white"></Ionicons>
              {"\n"} Core{" "}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={{ marginLeft: width / 3.8 }}
        onPress={toggleModal}
      >
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Text style={[styles.text, { marginRight: -100, marginTop: 8 }]}>
            {" "}
            Filter Results:
          </Text>
          <MaterialIcons name="filter-menu-outline" size={25}></MaterialIcons>
        </View>
      </TouchableOpacity>

      {sh ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                //marginHorizontal: "13%",
                backgroundColor: "white",
                width: width,
                borderRadius: 6,
                height: width / 4,
                // borderBottomWidth: 1,
                // borderBottomColor: "lightgrey",
                flexDirection: "row",
                shadowOpacity: 0.1,
                marginTop: width / 20,
              }}
            >
              <TouchableOpacity
                style={{
                  width: width / 1.2,
                  // backgroundColor: "yellow",
                  marginRight: width / 25,
                }}
                onPress={() =>
                  navigation.navigate("Details", {
                    name: item.name,
                    user: user,
                  })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexShrink: 1,
                  }}
                >
                  <Image
                    source={{
                      uri: item.img,
                    }}
                    style={{
                      width: width / 4,
                      height: width / 4,
                      borderRadius: 15,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "column",
                    }}
                  >
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingTop: 10,
                        fontFamily: "balsam-f",
                        width: width / 2,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Details", {
                    name: item.name,
                    user: user,
                  })
                }
                style={{
                  paddingTop: width / 13,
                  //backgroundColor: "red",
                  width: width / 5,
                }}
              >
                <SimpleLineIcons
                  name="arrow-right"
                  size={25}
                  color="black"
                ></SimpleLineIcons>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={{ backgroundColor: "white" }}>
          <ActivityIndicator
            size={"large"}
            color={"goldenrod"}
            animating={true}
            style={{ marginTop: height / 4 }}
          />
          <View>
            <Text style={{ marginBottom: height / 3 }}></Text>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Modal isVisible={isModalVisible}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                position: "absolute",
                top: width / 8,
                left: 0,
                right: 0,
                bottom: 0,
                height: width / 1.3,
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
                    color: "#2E9298",
                  }}
                >
                  Exercise Level
                </Text>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    alignContent: "center",
                    marginBottom: width / 20,
                    marginLeft: width / 2.1,
                  }}
                  onPress={toggleModal}
                >
                  <AntDesign name="close" size={30}></AntDesign>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: width / 8,
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
                {filterlevel.map((item, key) => {
                  return (
                    <View
                      style={{
                        backgroundColor: "white",
                        width: width / 2.3,
                        height: width / 10,
                      }}
                    >
                      <TouchableOpacity
                        key={key}
                        onPress={() => handleChange(item.level, key)}
                        style={{
                          backgroundColor: color[key],
                          borderColor: "goldenrod",
                          width: width / 5,
                          height: width / 12,
                          borderRadius: 10,
                          borderWidth: 2,
                          marginLeft: width / 25,
                          justifyContent: "center",
                          alignItems: "canter",
                        }}
                      >
                        <Text
                          style={
                            checkboxfilter.indexOf(item.level) == -1
                              ? {
                                  color: "black",
                                  fontFamily: "balsam-f",
                                  paddingLeft: width / 26,
                                }
                              : {
                                  color: "white",
                                  fontFamily: "balsam-f",
                                  paddingLeft: width / 26,
                                }
                          }
                        >
                          {"Level " + item.level}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
              <Text
                style={{
                  fontFamily: "balsam-f",
                  marginTop: width / 3,
                  fontSize: width / 20,
                  paddingLeft: 8,
                  borderTopWidth: 1,
                  borderTopColor: "lightgrey",
                  color: "#2E9298",
                }}
              >
                Calories
              </Text>
              <View
                style={{
                  position: "absolute",
                  top: width / 2,
                  left: 0,
                  right: 0,
                  bottom: 0,

                  backgroundColor: "white",
                  flexDirection: "coulmn",
                  flexShrink: 1,
                  flexWrap: 1,
                  justifyContent: "center",
                  alignItems: "canter",
                  alignContent: "center",
                  marginTop: width / 25,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "black",
                      fontFamily: "balsam-f",
                      //paddingLeft: width / 25,
                      marginRight: width / 18,
                      marginTop: width / 30,
                    }}
                  >
                    Min
                  </Text>
                  <Counter
                    onChange={minfunction.bind()}
                    start={min}
                    max={max}
                    min={min}
                    buttonStyle={{ borderColor: "goldenrod" }}
                    buttonTextStyle={{ color: "goldenrod" }}
                    countTextStyle={{ color: "#1a798a" }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",

                    paddingTop: width / 27,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontFamily: "balsam-f",
                      // paddingLeft: width / 25,
                      marginRight: width / 20,
                      marginTop: width / 30,
                    }}
                  >
                    Max
                  </Text>
                  <Counter
                    onChange={maxfunction.bind()}
                    start={max - 200}
                    min={min}
                    max={max}
                    buttonStyle={{ borderColor: "goldenrod" }}
                    buttonTextStyle={{ color: "goldenrod" }}
                    countTextStyle={{ color: "#1a798a" }}
                  />
                </View>
              </View>
              <View
                style={{
                  marginTop: width / 3.3,

                  marginLeft: width / 4.6,
                }}
              >
                <TouchableOpacity
                  // underlayColor={"transparent"}

                  onPress={() => filterpres()}
                  style={{
                    backgroundColor: "goldenrod",
                    borderColor: "goldenrod",
                    width: width / 2,
                    height: width / 12,
                    borderRadius: 10,
                    borderWidth: 2,
                    //marginLeft: width / 25,
                    justifyContent: "center",
                    alignItems: "canter",
                    alignContent: "center",
                    // opacity: 0.1,
                  }}
                >
                  <Text
                    style={{
                      color: "white",

                      fontFamily: "balsam-f",
                      fontSize: width / 20,
                      paddingLeft: width / 5.5,
                    }}
                  >
                    Filter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const Details = ({ navigation, route }) => {
  const name = route.params.name;
  const user = route.params.user;
  const [data, setData] = useState([]);
  const [flag0, setflag0] = useState(true);
  const [tool, settool] = useState();
  const [fav, setfav] = useState([]);
  const [fv, setfv] = useState(false);

  async function fetchData() {
    const response = await fetch(
      "http://192.168.1.110:4008/training?name=" + name
    );
    const info = await response.json();
    setData(info);
  }

  async function fetchshoppinglist() {
    const response = await fetch(
      "http://192.168.1.110:4008/ifIngredientInshoppingList?user=" +
        user +
        "&type=sport"
    );
    var Tools = await response.json();
    settool(Tools);
  }
  async function fetchfavourite() {
    const response = await fetch(
      "http://192.168.1.110:4008/existsInFav?user=" + user + "&type=sport"
    );
    var Tools = await response.json();

    setfav(Tools);
  }

  useEffect(() => {
    fetchData();
    fetchshoppinglist();
    fetchfavourite();
  }, []);

  const checko = (i) => {
    const list3 = tool.filter((item) => {
      if (item.name.toLowerCase().match(i.toLowerCase())) {
        alert("This Item Exist already in your shopping List");
        return item;
      }
    });
    if (list3.length == 0) {
      fetch("http://192.168.1.110:4008/shoppinglist", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          name: i,
          type: "sport",
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            alert("Added Successfully");
            fetchshoppinglist();
          } else {
            alert(res.message);
          }
        })
        .done();
    }
  };
  const checko2 = (i) => {
    const list3 = fav.filter((item) => {
      if (item.name.toLowerCase().match(i.name.toLowerCase())) {
        alert("This Item Exist already in your favourites");
        return item;
      }
    });
    if (list3.length == 0) {
      fetch("http://192.168.1.110:4008/favourites", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          name: i.name,
          type: "sport",
          image: i.img,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            alert("Added Successfully");
            fetchfavourite();
          } else {
            alert(res.message);
          }
        })
        .done();
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <View style={{ backgroundColor: "black" }}>
              <WebView
                allowsFullscreenVideo
                useWebKit
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction
                javaScriptEnabled
                scrollEnabled={false}
                source={{
                  uri: "https://www.youtube.com/watch?v=" + item.video,
                }}
                style={[styles.video]}
              />
            </View>
            <View style={styles.infoRecipeContainer}>
              <Text style={styles.infoRecipeName}>{item.name}</Text>
              {fav.length
                ? fav.map((itemm) => {
                    //alert(i.toLowerCase());
                    if (itemm.name.match(item.name)) {
                      setfv(true);
                    }
                  })
                : setfv(false)}

              {fv ? (
                <View>
                  <TouchableOpacity
                    hitSlop={{
                      left: 20,
                      right: 20,
                      top: 20,
                      bottom: 20,
                    }}
                    onPress={() => checko2(item)}
                  >
                    <Material name="favorite" size={25} color="red"></Material>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    hitSlop={{
                      left: 20,
                      right: 20,
                      top: 20,
                      bottom: 20,
                    }}
                    onPress={() => checko2(item)}
                  >
                    <Material
                      name="favorite-outline"
                      size={25}
                      color="black"
                    ></Material>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.infoContainer}>
                <Text style={styles.category}>{item.body_part} Exercise</Text>
              </View>

              <View style={styles.infoContainer}>
                <Ionicons name="timer-outline" size={20}></Ionicons>
                <Text style={styles.infoRecipe}> {item.time} Minutes</Text>
              </View>
              <View style={styles.infoContainer}>
                <Material
                  name="local-fire-department"
                  size={20}
                  color="orange"
                ></Material>
                <Text style={styles.infoRecipe}> {item.calories} </Text>
              </View>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  margin: 20,
                  fontFamily: "balsam-f",
                }}
              >
                {" "}
                Tools you need for this exercise:
              </Text>
              {item.tools.split(", ").map((step, key) => (
                <View key={key}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "bold",
                      fontFamily: "balsam-f",
                      color: "#0f5f6e",
                    }}
                  >
                    {step}
                    {"\t\t\t"}

                    {step == "No Equipment" ? null : (
                      <TouchableOpacity
                        hitSlop={{
                          left: 20,
                          right: 20,
                          top: 20,
                          bottom: 20,
                        }}
                        onPress={() => checko(step)}
                      >
                        <Material
                          name="add-shopping-cart"
                          size={22}
                          color="black"
                        ></Material>
                      </TouchableOpacity>
                    )}

                    {"\n\n"}

                    {step == "Mat" ? (
                      <Image
                        source={{
                          uri: "https://images-na.ssl-images-amazon.com/images/I/71Wj6KAFNvL._AC_SX425_.jpg",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 15,
                          borderWidth: 0.2,
                        }}
                      />
                    ) : null}
                    {step == "Dumbbell" ? (
                      <Image
                        source={{
                          uri: "https://www.rebelsport.com.au/dw/image/v2/BBRV_PRD/on/demandware.static/-/Sites-srg-internal-master-catalog/default/dw2aba8bf0/images/423989/Rebel_423989_hi-res.jpg?sw=558&sh=558&sm=fit",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 15,
                          borderWidth: 0.2,
                        }}
                      />
                    ) : null}
                    {step == "Bench" ? (
                      <Image
                        source={{
                          uri: "http://cdn.shopify.com/s/files/1/2202/0569/products/1rm-cfb-update_1200x1200.jpg?v=1563003658",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 15,
                          borderWidth: 0.2,
                        }}
                      />
                    ) : null}
                    {step == "Jump Rope" ? (
                      <Image
                        source={{
                          uri: "https://target.scene7.com/is/image/Target/GUEST_260b218f-e0ec-498d-a460-256a11da5a48?wid=488&hei=488&fmt=pjpeg",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 15,
                          borderWidth: 0.2,
                        }}
                      />
                    ) : null}
                    {step == "Kettlebell" ? (
                      <Image
                        source={{
                          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwN4mEAXUotWuQ87B24j8XbkiWGc-XNDD_DYoqy1kBvPW7WVyagdAMrXQ7aRsT1joii1g&usqp=CAU",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 15,
                          borderWidth: 0.2,
                        }}
                      />
                    ) : null}
                    {step == "Exercise Band" ? (
                      <Image
                        source={{
                          uri: "https://us.123rf.com/450wm/venusangel/venusangel1212/venusangel121200300/16742025-banda-el%C3%A1stica-de-fitness-la-herramienta-de-ejercicio-para-su-uso-en-casa-o-en-gimnasio.jpg?ver=6",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 15,
                          borderWidth: 0.2,
                        }}
                      />
                    ) : null}
                    {step == "Medicine Ball" ? (
                      <Image
                        source={{
                          uri: "https://cdn.shopify.com/s/files/1/0088/7576/9952/products/Medizinball-7kg_600x.jpg?v=1568265132",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 15,
                          borderWidth: 0.2,
                        }}
                      />
                    ) : null}
                    {step == "Aerobics Step" ? (
                      <Image
                        source={{
                          uri: "https://www.physicalcompany.co.uk/media/catalog/product/cache/3d6dc8d3c92c278e206927eb017b928e/p/s/pstepm_a.jpg",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 15,
                          borderWidth: 0.2,
                        }}
                      />
                    ) : null}
                    {step == "Standbag" ? (
                      <Image
                        source={{
                          uri: "https://i.pinimg.com/originals/66/ce/07/66ce07f0ff7e407ed15867124e4e35b6.jpg",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 15,
                          borderWidth: 0.2,
                        }}
                      />
                    ) : null}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const Map = ({ navigation, route }) => {
  const GOOGLE_MAPS_APIKEY = "AIzaSyA2C2AKkL0MD1Zlxr1g4iMnS4NwzX1VgoM";
  const [latitude, setLat] = useState(null);
  const [longitude, setLong] = useState(null);
  const [data, setData] = useState([]);
  const [img, setimg] = useState(null);
  const [title, setTit] = useState();
  const [address, setAdd] = useState();
  const [distance, setDest] = useState();
  const [time, setTime] = useState(null);
  const [lat2, setlat2] = useState([]);
  const [long2, setlong2] = useState([]);
  const [flag, setflag] = useState(false);

  async function getPermit() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      const response = await Permissions.askAsync(Permissions.LOCATION);
    }
  }

  function pressing(i) {
    setimg(data[i].image);
    setTit(data[i].name);
    setAdd(data[i].address);

    // distance and time
    var desLatitude = data[i].latitude;
    var desLongitude = data[i].longitude;
    setlat2(desLatitude);
    setlong2(desLongitude);

    var dis = geolib.getDistance(
      { latitude: latitude, longitude: longitude },
      { latitude: desLatitude, longitude: desLongitude }
    );

    var dist = geolib.convertDistance(dis, "km");
    setDest(dist);

    var time = geolib.getSpeed(
      { latitude: latitude, longitude: longitude, time: 1360231200880 },
      { latitude: desLatitude, longitude: desLongitude, time: 1360245600880 }
    );
    var time2 = geolib.convertSpeed(time, "kmh");
    setTime(parseInt(time2 * 60));

    setflag(true);
  }

  useEffect(() => {
    getPermit();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      (error) => alert("Error:" + error)
    );

    fetchData();
  }, [latitude, longitude]);

  async function fetchData() {
    const response = await fetch("http://192.168.1.110:4008/map");
    var results = await response.json();
    setData(results);
  }

  return (
    <View style={styles.container}>
      {latitude != null && longitude != null ? (
        <View>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0922 * (width / height),
            }}
          >
            {data.map((item, key) => (
              <MapView.Marker
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.name}
                description={item.type}
                pinColor="goldenrod"
                onPress={() => pressing(key)}
              />
            ))}
            {flag ? (
              <View style={styles.card}>
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>
                    {title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.cardDescription, { fontWeight: "bold" }]}
                  >
                    {address}
                  </Text>
                  <Text style={styles.cardDescription}>
                    Approximated Time needed by walk:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {time}
                      {" min"}
                    </Text>
                  </Text>
                  <Text style={styles.cardDescription}>
                    Approximated Distance:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {" "}
                      {distance}
                      {" km"}{" "}
                    </Text>
                  </Text>
                </View>
                <Image
                  source={{ uri: img }}
                  style={styles.cardImage}
                  resizeMode="content"
                />
              </View>
            ) : null}
            {flag ? (
              <MapViewDirections
                origin={{ latitude: latitude, longitude: longitude }}
                destination={{ latitude: lat2, longitude: long2 }}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor="hotpink"
              />
            ) : null}
          </MapView>
        </View>
      ) : (
        <Text style={styles.category}> We need your permission!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingTop: 6,
    borderRadius: 8,
    height: 70,
    backgroundColor: "goldenrod",
    flexDirection: "row",
  },
  view: {
    marginTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    borderBottomWidth: 0.2,
  },

  text: {
    marginTop: 20,
    marginLeft: 10,
    paddingRight: 130,
    fontFamily: "balsam-f",
    fontSize: 17,
  },
  video: {
    marginTop: -48,
    alignSelf: "center",
    width: width - 100,
    height: 230,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  category: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#289486",
    textAlign: "center",
    margin: 10,
    fontFamily: "balsam-f",
  },
  infoRecipe: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
    fontFamily: "balsam-f",
  },
  infoRecipeContainer: {
    flex: 1,
    margin: 25,
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  infoRecipeName: {
    fontSize: 28,
    margin: 10,
    marginTop: 30,
    fontWeight: "bold",
    fontFamily: "balsam-f",
    color: "black",
    textAlign: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  card: {
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.7,
    shadowOffset: { x: 2, y: -2 },
    height: height * 0.33,
    width: width * 0.9,
    overflow: "hidden",
    flex: 1,
    alignSelf: "center",
    position: "absolute",
    bottom: height * 0.07,
  },
  category: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#289486",
    margin: 3,
    fontFamily: "balsam-f",
  },
  cardImage: {
    width: "98%",
    height: "58%",
    marginBottom: 3,
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 15,
    // marginTop: 5,
    fontWeight: "bold",
    color: "goldenrod",
  },
  cardDescription: {
    fontSize: 13,
    margin: 1,
    color: "#444",
  },
});
