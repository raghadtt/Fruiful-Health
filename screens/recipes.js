import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  FlatList,
  Button,
  TouchableHighlight,
  Alert,
} from "react-native";
//import { Checkbox } from "react-native-paper";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import CheckBox from "react-native-check-box";
//import { CheckBox, colors } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
//---------------------------------------for stack recipes details
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Material from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import BottomSheet from "reanimated-bottom-sheet";
import Animated, { onChange } from "react-native-reanimated";

import Counter from "react-native-counters";
//------------------------------------------------------------------
import Modal from "react-native-modal";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const SearchIngredients = ({ navigation }) => {
  const [dataSource, setDataSource] = useState([]);
  const [filtered, setFiltered] = useState(dataSource);
  const [searching, setSearching] = useState(false);
  /*dataSource : is to hold main data.
    filtered array : is to hold searched data.
    searching flag : is to define if user is searching or not(need it to show dropdown)*/
  const [View1, setView1] = useState(false);
  const [View2, setView2] = useState(false);
  const [View3, setView3] = useState(false);
  const [View4, setView4] = useState(false);
  const [View5, setView5] = useState(false);
  const [View6, setView6] = useState(false);
  const [foodType1, setfoodType1] = useState([]);
  const [foodType2, setfoodType2] = useState([]);
  const [foodType3, setfoodType3] = useState([]);
  const [foodType4, setfoodType4] = useState([]);
  const [foodType5, setfoodType5] = useState([]);
  const [foodType6, setfoodType6] = useState([]);
  // const [checked, setChecked] = React.useState(false);
  const [flagCheck, setflagChecked] = React.useState([]);
  const [imageCheck, setimageChecked] = React.useState([]);
  const [foodType1Length, setfoodType1Length] = React.useState(0);
  const [foodType2Length, setfoodType2Length] = React.useState(0);
  const [foodType3Length, setfoodType3Length] = React.useState(0);
  const [foodType4Length, setfoodType4Length] = React.useState(0);
  const [foodType5Length, setfoodType5Length] = React.useState(0);
  const [foodType6Length, setfoodType6Length] = React.useState(0);
  const [food, setfood] = React.useState(0);

  const [col, setcol] = React.useState("white");
  const [colt, setcolt] = React.useState("black");
  let speed = [...flagCheck];

  async function fetchData() {
    const response = await fetch("http://192.168.1.110:4008/searchIngredients");
    const Ingredients = await response.json();
    setDataSource(Ingredients);
  }
  useEffect(() => {
    fetchData();
  }, []);
  //----------------------------------
  const onSearch = (text) => {
    if (text) {
      setSearching(true);
      const temp = text.toLowerCase();
      const tempList = dataSource.filter((item) => {
        if (item.name.toLowerCase().match(temp)) {
          return item;
        }
      });
      setFiltered(tempList);
    } else {
      setSearching(false);
      setFiltered(dataSource);
    }
  };
  //-----------------------------------
  const Viewview = (key) => {
    if (key == 1) {
      setView1(!View1);
      if (foodType1.length == 0) {
        const list1 = dataSource.filter((item) => {
          if (item.type.toLowerCase().match("milk & diary produce")) {
            return item;
          }
        });
        setfoodType1(list1);
      }
    } else if (key == 2) {
      setView2(!View2);
      if (foodType2.length == 0) {
        const list2 = dataSource.filter((item) => {
          if (item.type.toLowerCase().match("breads and cereals")) {
            return item;
          }
        });
        setfoodType2(list2);
      }
    } else if (key == 3) {
      setView3(!View3);
      if (foodType3.length == 0) {
        const list3 = dataSource.filter((item) => {
          if (item.type.toLowerCase().match("meats & fish")) {
            return item;
          }
        });
        setfoodType3(list3);
      }
    } else if (key == 4) {
      setView4(!View4);
      if (foodType4.length == 0) {
        const list4 = dataSource.filter((item) => {
          if (item.type.toLowerCase().match("vegetables")) {
            return item;
          }
        });

        setfoodType4(list4);
      }
    } else if (key == 5) {
      setView5(!View5);
      if (foodType5.length == 0) {
        const list5 = dataSource.filter((item) => {
          if (item.type.toLowerCase().match("fruits")) {
            return item;
          }
        });
        setfoodType5(list5);
      }
    } else if (key == 6) {
      setView6(!View6);
      if (foodType6.length == 0) {
        const list6 = dataSource.filter((item) => {
          if (item.type.toLowerCase().match("fats & sugars")) {
            return item;
          }
        });

        setfoodType6(list6);
      }
    }
  };
  //--------------------------------------------
  const handleChange = (box, t, img) => {
    let index = flagCheck.indexOf(box);
    let myflag = 0;
    if (index == -1) {
      //not selected
      speed.push(box);
      setflagChecked(speed);
      imageCheck.push(img);
      setcol("goldenrod");
      setcolt("white");

      //----------------------These if stetment to increment the counter of each type
      setfood(food + 1);
      if (t.match("Milk & Diary Produce"))
        setfoodType1Length(foodType1Length + 1);
      else if (t.match("Breads and Cereals"))
        setfoodType2Length(foodType2Length + 1);
      else if (t.match("Meats & Fish")) setfoodType3Length(foodType3Length + 1);
      else if (t.match("Vegetables")) setfoodType4Length(foodType4Length + 1);
      else if (t.match("Fruits")) setfoodType5Length(foodType5Length + 1);
      else if (t.match("Fats & Sugars"))
        setfoodType6Length(foodType6Length + 1);
    }
    //----------------------------------------------------
    else {
      flagCheck.splice(index, 1);
      if (flagCheck.length == 0) {
        setcol("white");
        setcolt("black");
      }

      imageCheck.splice(index, 1);
      setfood(food - 1);
      if (t.match("Milk & Diary Produce"))
        setfoodType1Length(foodType1Length - 1);
      else if (t.match("Breads and Cereals"))
        setfoodType2Length(foodType2Length - 1);
      else if (t.match("Meats & Fish")) setfoodType3Length(foodType3Length - 1);
      else if (t.match("Vegetables")) setfoodType4Length(foodType4Length - 1);
      else if (t.match("Fruits")) setfoodType5Length(foodType5Length - 1);
      else if (t.match("Fats & Sugars"))
        setfoodType6Length(foodType6Length - 1);
    }
    //console.log(flagCheck);
  };
  const check = () => {
    if (flagCheck.length != 0) {
      navigation.navigate("showIngredients", {
        flagCheck: flagCheck,
        food: food,
        imageCheck: imageCheck,
      });
    } else {
      alert("No Ingredient selected");
    }
  };

  const goToPecipes = () => {
    if (flagCheck.length == 0) {
      alert("No Ingredients Selected");
    } else {
      navigation.navigate("showRecipes", {
        flagCheck: flagCheck,
      });
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ backgroundColor: "white" }}>
          <ImageBackground
            style={{ width: "100%", height: width / 2.14 }}
            source={require("../assets/ingredient1.jpg")}
            imageStyle={{
              opacity: 0.5,
              resizeMode: "contain",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "right",
                paddingLeft: width / 1.45,
                paddingTop: width / 18,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("SearchRecipes")}
              >
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    fontSize: 15,
                  }}
                >
                  Find Recipes
                </Text>
              </TouchableOpacity>
              <AntDesign
                name="right"
                size={20}
                color="black"
                style={{ paddingRight: width / 16 }}
              />
            </View>
            <Text style={styles.text1}>My Ingredients</Text>

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                alignItems: "center",
                alignContent: "center",
                width: width / 1.3,
                height: width / 8,
                borderRadius: 15,
                marginTop: width / 25,
                paddingLeft: 10,
                marginLeft: width / 8,
              }}
            >
              <AntDesign style={{}} name="search1" size={24} color="black" />

              <TextInput
                style={styles.textInput}
                placeholder={(text = "Search for your Ingredients ...")}
                placeholderTextColor="lightgrey"
                onChangeText={(text) => onSearch(text)}
              ></TextInput>
            </View>
          </ImageBackground>
          <View
            style={{
              backgroundColor: "white",
              width: width,
              marginTop: 7,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: width / 15,
                backgroundColor: "white",
                width: width / 2.5,
                height: width / 7.5,
                borderRadius: 10,
                shadowColor: "goldenrod",

                shadowOpacity: 0.8,
              }}
              onPress={check}
            >
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    paddingTop: width / 35,
                    //paddingLeft: width / 35,
                  }}
                >
                  Selected Ingredients
                </Text>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    //marginLeft: 5,
                    color: "goldenrod",
                  }}
                >
                  {food}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: width / 15,
                backgroundColor: col,
                width: width / 2.5,
                height: width / 7.5,
                borderRadius: 10,
                shadowColor: "goldenrod",

                shadowOpacity: 0.8,
              }}
              onPress={goToPecipes}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    paddingTop: width / 35,
                    color: colt,
                  }}
                >
                  See Recipes
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: width / 45 }}>
            <View style={styles.viewbutton}>
              <TouchableOpacity
                style={styles.buttonType}
                delayPressIn={0}
                onPress={() => Viewview(1)}
              >
                <Image
                  source={{
                    uri: "https://www.donaldson.com/content/dam/donaldson/shared-assets/stock-imagery/industries-markets/food-beverage/Dairy-Products-Milk-Cheese-Cream-Eggs-Yogurt-Butter.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
                  }}
                  style={{
                    width: width / 8,
                    height: width / 8,
                    borderRadius: 30,
                    marginLeft: width / 35,
                    marginTop: width / 40,
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textType}>
                    {"Milk" + " & " + "Diary Produce"}
                  </Text>
                  {foodType1.length == 0 ? (
                    <Text></Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        marginLeft: 5,
                        color: "goldenrod",
                      }}
                    >
                      {foodType1Length + "/" + foodType1.length}
                    </Text>
                  )}
                </View>
                {View1 ? (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 4.6 }}
                    name="up"
                    size={24}
                    color="black"
                  />
                ) : (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 4.6 }}
                    name="down"
                    size={24}
                    color="black"
                  />
                )}
              </TouchableOpacity>
            </View>
            {View1 && (
              <View style={styles.viewType}>
                <ScrollView>
                  {foodType1.map((item) => {
                    return (
                      <View style={{ flexDirection: "row", marginBottom: 20 }}>
                        <Image
                          source={{
                            uri: item.image,
                          }}
                          style={{
                            width: width / 8,
                            height: width / 8,
                            borderRadius: 15,
                            marginLeft: width / 35,
                          }}
                        />
                        <CheckBox
                          style={{ flex: 1, padding: 12, paddingLeft: 8 }}
                          delayPressIn={0}
                          leftText={item.name}
                          //onClick={() => setChecked(!checked)}
                          onClick={() =>
                            handleChange(item.name, item.type, item.image)
                          }
                          isChecked={
                            speed.indexOf(item.name) == -1 ? false : true
                          }
                          checkBoxColor="goldenrod"
                          leftTextStyle={{
                            fontFamily: "balsam-f",
                            paddingRight: 12,
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
            <View style={styles.viewbutton}>
              <TouchableOpacity
                delayPressIn={0}
                style={styles.buttonType}
                onPress={() => Viewview(2)}
              >
                <Image
                  source={{
                    uri: "https://www.whgoodness.com/uploads/9/2/4/6/9246236/4986156_orig.jpg",
                  }}
                  style={{
                    width: width / 8,
                    height: width / 8,
                    borderRadius: 30,
                    marginLeft: width / 35,
                    marginTop: width / 40,
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textType}>
                    {"Breads" + " & " + "Cereals"}
                  </Text>
                  {foodType2.length == 0 ? (
                    <Text></Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        marginLeft: 5,
                        color: "goldenrod",
                      }}
                    >
                      {foodType2Length + "/" + foodType2.length}
                    </Text>
                  )}
                </View>
                {View2 ? (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 3.5 }}
                    name="up"
                    size={24}
                    color="black"
                  />
                ) : (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 3.5 }}
                    name="down"
                    size={24}
                    color="black"
                  />
                )}
              </TouchableOpacity>
            </View>
            {View2 && (
              <View style={styles.viewType}>
                <ScrollView>
                  {foodType2.map((item) => {
                    return (
                      <View style={{ flexDirection: "row", marginBottom: 20 }}>
                        <Image
                          source={{
                            uri: item.image,
                          }}
                          style={{
                            width: width / 8,
                            height: width / 8,
                            borderRadius: 15,
                            marginLeft: width / 35,
                          }}
                        />
                        <CheckBox
                          style={{ flex: 1, padding: 12, paddingLeft: 8 }}
                          delayPressIn={0}
                          leftText={item.name}
                          onClick={() =>
                            handleChange(item.name, item.type, item.image)
                          }
                          isChecked={
                            speed.indexOf(item.name) == -1 ? false : true
                          }
                          checkBoxColor="goldenrod"
                          leftTextStyle={{
                            fontFamily: "balsam-f",
                            paddingRight: 12,
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <View style={styles.viewbutton}>
              <TouchableOpacity
                delayPressIn={0}
                style={styles.buttonType}
                onPress={() => Viewview(3)}
              >
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/photos/sausages-fish-and-meat-cooking-picture-id618422226?k=6&m=618422226&s=170667a&w=0&h=Bs3P_lkzXoOcSPif0BWWBAA8eMO_Qv_ECllyIPeLJVE=",
                  }}
                  style={{
                    width: width / 8,
                    height: width / 8,
                    borderRadius: 30,
                    marginLeft: width / 35,
                    marginTop: width / 40,
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textType}>
                    {"Meats" + " & " + "Fish"}
                  </Text>
                  {foodType3.length == 0 ? (
                    <Text></Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        marginLeft: 5,
                        color: "goldenrod",
                      }}
                    >
                      {foodType3Length + "/" + foodType3.length}
                    </Text>
                  )}
                </View>
                {View3 ? (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 2.7 }}
                    name="up"
                    size={24}
                    color="black"
                  />
                ) : (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 2.7 }}
                    name="down"
                    size={24}
                    color="black"
                  />
                )}
              </TouchableOpacity>
            </View>
            {View3 && (
              <View style={styles.viewType}>
                <ScrollView>
                  {foodType3.map((item) => {
                    return (
                      <View style={{ flexDirection: "row", marginBottom: 20 }}>
                        <Image
                          source={{
                            uri: item.image,
                          }}
                          style={{
                            width: width / 8,
                            height: width / 8,
                            borderRadius: 15,
                            marginLeft: width / 35,
                          }}
                        />
                        <CheckBox
                          style={{ flex: 1, padding: 12, paddingLeft: 8 }}
                          delayPressIn={0}
                          leftText={item.name}
                          onClick={() =>
                            handleChange(item.name, item.type, item.image)
                          }
                          isChecked={
                            flagCheck.indexOf(item.name) == -1 ? false : true
                          }
                          checkBoxColor="goldenrod"
                          leftTextStyle={{
                            fontFamily: "balsam-f",
                            paddingRight: 12,
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <View style={styles.viewbutton}>
              <TouchableOpacity
                delayPressIn={0}
                style={styles.buttonType}
                onPress={() => Viewview(4)}
              >
                <Image
                  source={{
                    uri: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/shopping-bag-full-of-fresh-vegetables-and-fruits-royalty-free-image-1128687123-1564523576.jpg",
                  }}
                  style={{
                    width: width / 8,
                    height: width / 8,
                    borderRadius: 30,
                    marginLeft: width / 35,
                    marginTop: width / 40,
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textType}>{"Vegetables"}</Text>
                  {foodType4.length == 0 ? (
                    <Text></Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        marginLeft: 5,
                        color: "goldenrod",
                      }}
                    >
                      {foodType4Length + "/" + foodType4.length}
                    </Text>
                  )}
                </View>
                {View4 ? (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 2.45 }}
                    name="up"
                    size={24}
                    color="black"
                  />
                ) : (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 2.45 }}
                    name="down"
                    size={24}
                    color="black"
                  />
                )}
              </TouchableOpacity>
            </View>
            {View4 && (
              <View style={styles.viewType}>
                <ScrollView>
                  {foodType4.map((item) => {
                    return (
                      <View style={{ flexDirection: "row", marginBottom: 20 }}>
                        <Image
                          source={{
                            uri: item.image,
                          }}
                          style={{
                            width: width / 8,
                            height: width / 8,
                            borderRadius: 15,
                            marginLeft: width / 35,
                          }}
                        />
                        <CheckBox
                          style={{ flex: 1, padding: 12, paddingLeft: 8 }}
                          delayPressIn={0}
                          leftText={item.name}
                          onClick={() =>
                            handleChange(item.name, item.type, item.image)
                          }
                          isChecked={
                            flagCheck.indexOf(item.name) == -1 ? false : true
                          }
                          checkBoxColor="goldenrod"
                          leftTextStyle={{
                            fontFamily: "balsam-f",
                            paddingRight: 12,
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <View style={styles.viewbutton}>
              <TouchableOpacity
                delayPressIn={0}
                style={styles.buttonType}
                onPress={() => Viewview(5)}
              >
                <Image
                  source={{
                    uri: "https://resources.ediblearrangements.com/resources/en-us/i/a/t_o_Fruit_Favorites_Box_angled_410x410.jpg?v1",
                  }}
                  style={{
                    width: width / 8,
                    height: width / 8,
                    borderRadius: 30,
                    marginLeft: width / 35,
                    marginTop: width / 40,
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textType}>{"Fruits"}</Text>
                  {foodType5.length == 0 ? (
                    <Text></Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        marginLeft: 5,
                        color: "goldenrod",
                      }}
                    >
                      {foodType5Length + "/" + foodType5.length}
                    </Text>
                  )}
                </View>
                {View5 ? (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 1.9 }}
                    name="up"
                    size={24}
                    color="black"
                  />
                ) : (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 1.9 }}
                    name="down"
                    size={24}
                    color="black"
                  />
                )}
              </TouchableOpacity>
            </View>
            {View5 && (
              <View style={styles.viewType}>
                <ScrollView>
                  {foodType5.map((item) => {
                    return (
                      <View style={{ flexDirection: "row", marginBottom: 20 }}>
                        <Image
                          source={{
                            uri: item.image,
                          }}
                          style={{
                            width: width / 8,
                            height: width / 8,
                            borderRadius: 15,
                            marginLeft: width / 35,
                          }}
                        />
                        <CheckBox
                          style={{ flex: 1, padding: 12, paddingLeft: 8 }}
                          delayPressIn={0}
                          leftText={item.name}
                          onClick={() =>
                            handleChange(item.name, item.type, item.image)
                          }
                          isChecked={
                            flagCheck.indexOf(item.name) == -1 ? false : true
                          }
                          checkBoxColor="goldenrod"
                          leftTextStyle={{
                            fontFamily: "balsam-f",
                            paddingRight: 12,
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <View style={styles.viewbutton}>
              <TouchableOpacity
                delayPressIn={0}
                style={styles.buttonType}
                onPress={() => Viewview(6)}
              >
                <Image
                  source={{
                    uri: "data:image/jpeg;base64,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",
                  }}
                  style={{
                    width: width / 8,
                    height: width / 8,
                    borderRadius: 30,
                    marginLeft: width / 35,
                    marginTop: width / 40,
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textType}>
                    {"Fats" + " & " + "Sugars"}
                  </Text>
                  {foodType6.length == 0 ? (
                    <Text></Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        marginLeft: 5,
                        color: "goldenrod",
                      }}
                    >
                      {foodType6Length + "/" + foodType6.length}
                    </Text>
                  )}
                </View>
                {View6 ? (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 2.85 }}
                    name="up"
                    size={24}
                    color="black"
                  />
                ) : (
                  <AntDesign
                    style={{ marginTop: 20, marginLeft: width / 2.85 }}
                    name="down"
                    size={24}
                    color="black"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          {View6 && (
            <View style={styles.viewType}>
              <ScrollView>
                {foodType6.map((item) => {
                  return (
                    <View style={{ flexDirection: "row", marginBottom: 20 }}>
                      <Image
                        source={{
                          uri: item.image,
                        }}
                        style={{
                          width: width / 8,
                          height: width / 8,
                          borderRadius: 15,
                          marginLeft: width / 35,
                        }}
                      />
                      <CheckBox
                        style={{ flex: 1, padding: 12, paddingLeft: 8 }}
                        delayPressIn={0}
                        leftText={item.name}
                        onClick={() =>
                          handleChange(item.name, item.type, item.image)
                        }
                        isChecked={
                          flagCheck.indexOf(item.name) == -1 ? false : true
                        }
                        checkBoxColor="goldenrod"
                        leftTextStyle={{
                          fontFamily: "balsam-f",
                          paddingRight: 12,
                        }}
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
          {/* your components can stay here like anything */}
          {/* and at the end of view */}
          {searching && (
            <View style={styles.container}>
              <ScrollView>
                {filtered.length ? (
                  filtered.map((item) => {
                    return (
                      <View style={styles.itemView}>
                        <Image
                          source={{
                            uri: item.image,
                          }}
                          style={{
                            width: width / 8,
                            height: width / 8,
                            borderRadius: 15,
                          }}
                        />
                        <CheckBox
                          style={{ flex: 1, padding: 12, paddingLeft: 8 }}
                          delayPressIn={0}
                          leftText={item.name}
                          onClick={() =>
                            handleChange(item.name, item.type, item.image)
                          }
                          isChecked={
                            flagCheck.indexOf(item.name) == -1 ? false : true
                          }
                          checkBoxColor="goldenrod"
                          leftTextStyle={{
                            fontFamily: "balsam-f",
                            paddingRight: 12,
                          }}
                        />
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.noResultView}>
                    <Text style={styles.noResultText}>
                      No search ingredients matched
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SearchRecipes = ({ navigation, route }) => {
  const [RecipesSource, setRecipesSource] = useState([]);
  const [RecipesSourceFiltter, setRecipesSourceFiltter] = useState([]);
  const [RecipesSourceFilttercheck, setRecipesSourceFilttercheck] = useState(
    []
  );
  //------------------------------------ above arrays is all for recipes

  const [list1, setlist1] = useState([]);
  const [filtermeal, setFiltermeal] = useState([]);
  const [checkboxfilter, setcheckboxfilter] = useState([]);
  const [color, setcolor] = useState([]);
  let array = [...color];
  const [sh, setsh] = useState(false); //just for show the loading indecator or the list of recipes
  var flagarray = [];
  //------------------------------------------------------------
  var minn;
  var maxx;
  const [min, setmin] = useState();
  const [max, setmax] = useState();
  const [minDB, setminDB] = useState();
  const [maxDB, setmaxDB] = useState();
  //-------------------------------------------------------------------------
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setminDB(min);
    setmaxDB(max);
    setModalVisible(!isModalVisible);
  };
  //---------------------------------
  var b = "noun";

  //-----------------------------------------------------
  async function fetchRecipes() {
    minn = 10000;
    maxx = -10000;
    const response = await fetch("http://192.168.1.110:4008/searchRecipes");
    const Recipes = await response.json();

    setRecipesSource(Recipes); // this sen. does not set it immediatly so i use Recipes
    setRecipesSourceFiltter(Recipes);
    setRecipesSourceFilttercheck(Recipes);

    if (Recipes.length) {
      setsh(true);
      Recipes.forEach((element1) => {
        if (element1.calories > maxx) maxx = element1.calories;
        if (element1.calories < minn) minn = element1.calories;
      });
    } //show recipes view insted of loading icon

    setmin(minn);
    setmax(maxx);

    const response2 = await fetch("http://192.168.1.110:4008/filtermeal");
    const meal = await response2.json();
    setFiltermeal(meal);
    console.log(max);
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  const onSearch = (text) => {
    if (text) {
      const temp = text.toLowerCase();
      const tempList = RecipesSource.filter((item) => {
        if (item.name.toLowerCase().match(temp)) {
          return item;
        }
      });
     
      if (tempList.length != 0) setRecipesSource(tempList);
    } /*else {
      if (checkboxfilter.length == 0) {
        setRecipesSource(RecipesSourceFiltter);
      } else setRecipesSource(list1);
    }*/
  };

  const handleChange = (box, key) => {
    let index = checkboxfilter.indexOf(box);

    if (index == -1) {
      //not selected
      checkboxfilter.push(box);
      array[key] = "goldenrod";
      setcolor(array);
      console.log(checkboxfilter);

      //----------------------These if stetment to increment the counter of each type
      /*  RecipesSourceFilttercheck.forEach((element2) => {
        checkboxfilter.forEach((element1) => {
          if (element2.meal.toLowerCase().match(element1.toLowerCase())) {
            list1.push(element2);
          }
        });
      });*/
      /*const list1 = RecipesSourceFilttercheck.filter((item) => {
        if (item.meal.toLowerCase().match(box.toLowerCase())) {
          return item;
        }
      });*/
      /* setRecipesSource(list1);*/
      //setRecipesSourceFilttercheck(list1);
    }
    //----------------------------------------------------
    else {
      checkboxfilter.splice(index, 1);
      array[key] = "white";
      setcolor(array);
      console.log(checkboxfilter);
    }
  };
  const minfunction = (minCa) => {
    setminDB(minCa);
    console.log(minDB);
  };
  const maxfunction = (maxCa) => {
    setmaxDB(maxCa);
    console.log(maxDB);
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
      //a = JSON.stringify(a);
      console.log(a);
      const myresponse = await fetch(
        "http://192.168.1.110:4008/filterMealCalorieseE?checkboxfilter=" +
          a +
          "&minDB=" +
          minDB +
          "&maxDB=" +
          maxDB
      );

      const myRecipesmy = await myresponse.json();

      setRecipesSource(myRecipesmy);
      console.log(myRecipesmy);
      setsh(true);
    }
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ backgroundColor: "white" }}>
          <ImageBackground
            style={{ width: "100%", height: width / 2.14 }}
            source={require("../assets/ingredient1.jpg")}
            imageStyle={{
              opacity: 0.5,
              resizeMode: "contain",
            }}
          >
            <View
              style={{
                flexDirection: "row",

                paddingTop: width / 18,
              }}
            >
              <View
                style={{
                  alignContent: "right",
                  paddingRight: width / 5,
                  flexDirection: "row",
                }}
              >
                <AntDesign
                  name="left"
                  size={18}
                  color="black"
                  style={{ paddingLeft: width / 45 }}
                />
                <TouchableOpacity onPress={() => navigation.goBack(null)}>
                  <Text
                    style={{
                      fontFamily: "balsam-f",
                      fontSize: 15,
                    }}
                  >
                    Go Back
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={{ marginLeft: width / 2.2 }}
                  onPress={toggleModal}
                >
                  <MaterialIcons
                    name="filter-menu-outline"
                    size={25}
                  ></MaterialIcons>
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                color: `#000000`,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: width / 20,
                fontFamily: "balsam-f",
                paddingTop: width / 100,
              }}
            >
              My Recipes
            </Text>
            {sh ? (
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  alignItems: "center",
                  alignContent: "center",
                  width: width / 1.3,
                  height: width / 8,
                  borderRadius: 15,
                  marginTop: width / 25,
                  paddingLeft: 10,
                  marginLeft: width / 8,
                }}
              >
                <AntDesign style={{}} name="search1" size={24} color="black" />
                <TextInput
                  style={styles.textInput}
                  placeholder={(text = "Search for any Recipes ...")}
                  placeholderTextColor="lightgrey"
                  onChangeText={onSearch}
                ></TextInput>
              </View>
            ) : (
              <Text></Text>
            )}
          </ImageBackground>
          <View style={{ backgroundColor: "white" }}>
            {sh ? (
              RecipesSource.map((item) => {
                return (
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
                      shadowOpacity: 0.2,
                      marginTop: width / 20,
                    }}
                  >
                    <TouchableOpacity
                      style={{ width: width / 1.1 }}
                      onPress={() =>
                        navigation.navigate(
                          "RecipesDetails",
                          {
                            RecipesSourceFiltter: item,
                          },
                          [item]
                        )
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
                            uri: item.image,
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
                            }}
                          >
                            {item.name}
                          </Text>

                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                paddingHorizontal: 10,
                                paddingTop: 5,
                                fontFamily: "balsam-f",
                                color: "lightgrey",
                              }}
                            >
                              {item.meal}
                              <Ionicons
                                name="restaurant-outline"
                                size={18}
                                color="black"
                              ></Ionicons>
                            </Text>
                            <Text
                              style={{
                                paddingHorizontal: 10,
                                paddingTop: 5,
                                fontFamily: "balsam-f",
                                color: "lightgrey",
                              }}
                            >
                              {item.calories}
                              <MaterialIcons
                                name="fire"
                                size={20}
                                color="orange"
                              ></MaterialIcons>
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: width / 13 }}>
                      <SimpleLineIcons
                        name="arrow-right"
                        size={25}
                        color="black"
                      ></SimpleLineIcons>
                    </TouchableOpacity>
                  </View>
                );
              })
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
          </View>

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
                        color: "#1a798a",
                      }}
                    >
                      Meal Type
                    </Text>
                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        alignContent: "center",
                        marginBottom: width / 20,
                        //marginTop: width / 4,
                        marginLeft: width / 1.75,
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
                    {filtermeal.map((item, key) => {
                      return (
                        <View
                          style={{
                            // marginHorizontal: "5%",
                            backgroundColor: "white",

                            width: width / 2.3,
                            //borderRadius: 6,
                            height: width / 10,
                            // borderBottomWidth: 1,
                            // borderBottomColor: "lightgrey",
                          }}
                        >
                          <TouchableOpacity
                            key={key}
                            // underlayColor={"transparent"}
                            onPress={() => handleChange(item.meal, key)}
                            style={{
                              backgroundColor: color[key],
                              borderColor: "goldenrod",
                              width: width / 3,
                              height: width / 12,
                              borderRadius: 10,
                              borderWidth: 2,
                              marginLeft: width / 25,
                              justifyContent: "center",
                              alignItems: "canter",
                              // opacity: 0.1,
                            }}
                          >
                            <Text
                              style={
                                checkboxfilter.indexOf(item.meal) == -1
                                  ? {
                                      color: "black",

                                      fontFamily: "balsam-f",
                                      paddingLeft: width / 25,
                                    }
                                  : {
                                      color: "white",
                                      fontFamily: "balsam-f",
                                      paddingLeft: width / 25,
                                    }
                              }
                            >
                              {item.meal}
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
                      color: "#1a798a",
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const showIngredients = ({ navigation, route }) => {
  let flagCheck = route.params.flagCheck; //this array contain the selected ingredients
  let food = route.params.food; // this array contain the number of selected ingredient
  let imagecheck = route.params.imageCheck; //this array contain the image of selected ingredient
  let user = route.params.user; //this contain the user name which come from footer
  const [ingre, setingre] = useState();
  var Ingredients = []; // this array will hold the result of get all data from shoppinglist table
  const [loadingflag, setloadingflag] = useState(false); //this flag is appear when the fetch st. of all data from shoppinglist table does not finish

  //--------- AT first of loading the screen we get all data from shopping list table of this user
  async function fetchshoppinglist() {
    const response = await fetch(
      "http://192.168.1.110:4008/ifIngredientInshoppingList?user=" + user
    );
    Ingredients = await response.json();

    setingre(Ingredients);
    setloadingflag(true);
  }
  useEffect(() => {
    fetchshoppinglist();
  }, []);
  //----------we call this function when we press to shopping cart----------
  //-----WHAT DOES THIS FUNCTION DO?
  //When we press shopping cart it search if the name is already in shopping list table so we do not want
  //to add it again so we alert "Item Exist already in your shopping List"

  //if the length of return result=0 so this item is not in shopping list table and we should do insert
  const checko = (i) => {
    setloadingflag(false);
    const list3 = ingre.filter((item) => {
      if (item.name.toLowerCase().match(i.toLowerCase())) {
        setloadingflag(true);
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
          type: "ingredient",
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          //---------------------THIS IS VARY IMPORTANT ! when it insert succussfully we push the obj

          //in Ingredient array so when we press it again it alert "Item Exist already in your shopping List"
          //if we do not do it ,it will added it another time because the select st. does not refresh
          //Ingredient will contain only the first result of select st. also when you do insert it will not see it
          if (res.success === true) {
            /* var obj = { name: i, type: "ingredient", username: user };
            Ingredients.push(obj);
            setingre(Ingredients);*/
            alert("Added Successfully");
            fetchshoppinglist();
          } else {
            alert(res.message);
          }
        })
        .done();
    }
  };
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: "white" }}>
          <ImageBackground
            style={{ width: "100%", height: width / 2.14 }}
            source={require("../assets/ingredient1.jpg")}
            imageStyle={{
              opacity: 0.6,
              resizeMode: "contain",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "right",
                paddingRight: width / 5,
                paddingTop: width / 18,
              }}
            >
              <AntDesign
                name="left"
                size={18}
                color="black"
                style={{ paddingLeft: width / 45 }}
              />
              <TouchableOpacity onPress={() => navigation.goBack(null)}>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    fontSize: 15,
                  }}
                >
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.text1}>My Selected Ingredients</Text>
              {loadingflag ? (
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    textAlign: "center",
                    fontSize: 25,
                    paddingTop: 10,
                  }}
                >
                  {food}
                </Text>
              ) : (
                <Text></Text>
              )}
            </View>
          </ImageBackground>

          <View style={styles.viewshowIngredients}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View style={{ flexDirection: "coulmn" }}>
                  {loadingflag ? (
                    imagecheck.map((img) => {
                      return (
                        <Image
                          source={{
                            uri: img,
                          }}
                          style={{
                            width: width / 6,
                            height: width / 6,
                            borderRadius: 15,
                            marginTop: width / 40,
                          }}
                        />
                      );
                    })
                  ) : (
                    <Text></Text>
                  )}
                </View>
                <View style={{ flexDirection: "coulmn" }}>
                  {loadingflag ? (
                    flagCheck.map((item) => {
                      return (
                        <View
                          style={{
                            //marginHorizontal: "13%",
                            backgroundColor: "white",
                            width: width / 1.35,
                            borderRadius: 6,
                            height: width / 6,
                            borderBottomWidth: 1,
                            borderBottomColor: "lightgrey",
                            flexDirection: "row",
                            flexShrink: 1,
                            //shadowOpacity: 0.3,
                            shadowColor: "black",
                            marginTop: width / 40,
                          }}
                        >
                          <View
                            style={{
                              width: width / 1.75,
                              paddingRight: width / 12,
                            }}
                          >
                            <Text
                              style={{
                                paddingHorizontal: 10,
                                paddingTop: 10,
                                fontFamily: "balsam-f",
                              }}
                            >
                              {item}
                            </Text>
                          </View>
                          <View
                            style={
                              {
                                //   marginRight: width / 5,
                              }
                            }
                          >
                            <TouchableOpacity
                              style={{
                                paddingLeft: width / 15,
                                paddingRight: width / 15,
                                paddingTop: 10,
                                paddingBottom: 10,
                                //backgroundColor: "green",
                              }}
                              onPress={() => checko(item)}
                            >
                              <AntDesign
                                name="shoppingcart"
                                size={28}
                                color="black"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <ActivityIndicator
                      size={"large"}
                      color={"goldenrod"}
                      animating={true}
                      style={{ marginTop: height / 4, marginLeft: width / 2.5 }}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const showRecipes = ({ navigation, route }) => {
  const [RecipesSource, setRecipesSource] = useState([]);
  const [RecipesSourceFiltter, setRecipesSourceFiltter] = useState([]);
  const [counter, setcounter] = useState([]);
  const [f, setf] = useState([]);
  let flagCheck = route.params.flagCheck; //this array contain the selected ingredients
  let c = 0;
  //let textt = "";
  const [textt, settextt] = useState();
  const [sh, setsh] = useState(false); //just for show the loading indecator or the list of recipes

  async function fetchRecipes() {
    const response = await fetch("http://192.168.1.110:4008/searchRecipes");
    const Recipes = await response.json();

    setRecipesSource(Recipes); // this sen. does not set it immediatly so i use Recipes

    Recipes.forEach((element2) => {
      flagCheck.forEach((element1) => {
        if (element2.ingredients.toLowerCase().match(element1.toLowerCase())) {
          if (!RecipesSourceFiltter.some((o) => o.name === element2.name))
            //test if it duplicated so do not push it
            RecipesSourceFiltter.push(element2);
        }
      });
    });

    if (RecipesSourceFiltter.length) setsh(true);
    //show recipes view insted of loading icon
    else {
      settextt("No Recipes found");
      setsh(true);
    }
    // alert(RecipesSourceFiltter.length);
    console.log(counter);
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ backgroundColor: "white" }}>
          <ImageBackground
            style={{ width: "100%", height: width / 2.14 }}
            source={require("../assets/ingredient1.jpg")}
            imageStyle={{
              opacity: 0.5,
              resizeMode: "contain",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "right",
                paddingRight: width / 5,
                paddingTop: width / 18,
              }}
            >
              <AntDesign
                name="left"
                size={18}
                color="black"
                style={{ paddingLeft: width / 45 }}
              />
              <TouchableOpacity onPress={() => navigation.goBack(null)}>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    fontSize: 15,
                  }}
                >
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.text1}>
                {sh
                  ? "You Can Make " +
                    "\n" +
                    "(" +
                    RecipesSourceFiltter.length +
                    ")" +
                    " Recipes"
                  : "Recipes"}
              </Text>
              <Text
                style={{
                  fontFamily: "balsam-f",
                  textAlign: "center",
                  fontSize: 25,
                  paddingTop: 10,
                }}
              ></Text>
            </View>
          </ImageBackground>

          <View style={{ backgroundColor: "white" }}>
            {sh ? (
              RecipesSourceFiltter.map((item) => {
                return (
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
                      shadowOpacity: 0.2,
                      marginTop: width / 20,
                    }}
                  >
                    <Text>{textt}</Text>
                    <TouchableOpacity
                      style={{ width: width / 1.1 }}
                      onPress={() =>
                        navigation.navigate(
                          "RecipesDetails",
                          {
                            RecipesSourceFiltter: item,
                          },
                          [item]
                        )
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
                            uri: item.image,
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
                            }}
                          >
                            {item.name}
                          </Text>

                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                paddingHorizontal: 10,
                                paddingTop: 5,
                                fontFamily: "balsam-f",
                                color: "lightgrey",
                                //marginRight: 5,
                              }}
                            >
                              {item.meal}
                              <Ionicons
                                name="restaurant-outline"
                                size={18}
                                color="black"
                              ></Ionicons>
                            </Text>

                            <Text
                              style={{
                                paddingHorizontal: 10,
                                paddingTop: 5,
                                fontFamily: "balsam-f",
                                color: "lightgrey",
                              }}
                            >
                              {item.calories}
                              <MaterialIcons
                                name="fire"
                                size={20}
                                color="orange"
                              ></MaterialIcons>
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: width / 13 }}>
                      <SimpleLineIcons
                        name="arrow-right"
                        size={25}
                        color="black"
                      ></SimpleLineIcons>
                    </TouchableOpacity>
                  </View>
                );
              })
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const RecipesDetails = ({ navigation, route }) => {
  const { width, height } = Dimensions.get("window");
  let user = route.params.user;
  var bs = React.createRef();
  var fall = new Animated.Value(1);
  var bs2 = React.createRef();
  var fall2 = new Animated.Value(1);
  const RecipesSourceFiltter = route.params.RecipesSourceFiltter;
  console.log(RecipesSourceFiltter);
  const [data, setdata] = useState([]);
  const [fav, setfav] = useState([]);
  const [fv, setfv] = useState(false);
  //data.push(RecipesSourceFiltter);
  console.log(data);
  async function fetchfavourite() {
    const response2 = await fetch(
      "http://192.168.1.110:4008/allRecipes?name=" + RecipesSourceFiltter.name
    );
    const info2 = await response2.json();
    setdata(info2);

    const response = await fetch(
      "http://192.168.1.110:4008/existsInFav?user=" + user + "&type=recipe"
    );
    var Tools = await response.json();

    setfav(Tools);
  }

  useEffect(() => {
    fetchfavourite();
  }, []);

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
          type: "recipe",
          image: i.image,
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

  const renderInner = () => (
    <View style={styles.panel}>
      <FlatList
        data={data}
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={3}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
  const renderInner2 = () => (
    <View style={styles.panel}>
      <FlatList
        data={data}
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={3}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem2}
      />
    </View>
  );
  const renderItem2 = ({ item }) => {
    return <Item2 item={item} />;
  };
  const Item2 = ({ item, style }) => (
    <Text
      style={[
        styles.infoDescriptionRecipe,
        { paddingBottom: 5, fontFamily: "balsam-f" },
      ]}
    >
      {item.instructions}
    </Text>
  );
  const renderItem = ({ item }) => {
    return <Item item={item} />;
  };

  const Item = ({ item, style }) => (
    <Text style={{ margin: 18 }}>
      {item.ingredients.split(",").map((step) => (
        <Text
          style={{
            fontSize: 17,
            fontWeight: "bold",
            color: "black",
            fontFamily: "balsam-f",
          }}
        >
          <FontAwesome
            name="circle-o"
            size={15}
            color="goldenrod"
          ></FontAwesome>
          {" " + step}
          {"\n\n"}
        </Text>
      ))}
    </Text>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <View>
      <View>
        <BottomSheet
          ref={bs}
          snapPoints={[400, 0]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
        />
        <BottomSheet
          ref={bs2}
          snapPoints={[400, 0]}
          renderContent={renderInner2}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall2}
          enabledGestureInteraction={true}
        />
        <SafeAreaView style={{ backgroundColor: "white" }}>
          <FlatList
            data={data}
            keyExtractor={(index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{ backgroundColor: "white" }} key={index}>
                <StatusBar animated={true} barStyle="dark-content" />

                <Animated.View
                  style={{
                    margin: 20,
                    opacity: Animated.add(
                      0.1,
                      Animated.multiply(fall, fall2, 1.0)
                    ),
                  }}
                >
                  <View style={{ marginTop: -30 }}>
                    <ImageBackground
                      style={{ marginLeft: -20, width: width, height: 300 }}
                      source={{ uri: item.image !== "" ? item.image : null }}
                    ></ImageBackground>
                  </View>

                  <View style={styles.infoRecipeContainer}>
                    <Text style={[styles.infoRecipeName, { marginTop: 50 }]}>
                      {item.name}
                    </Text>
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
                          <Material
                            name="favorite"
                            size={25}
                            color="red"
                          ></Material>
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
                      <Text style={styles.category}>{item.meal}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                      <MaterialIcons
                        name="fire"
                        size={20}
                        color="orange"
                      ></MaterialIcons>
                      <Text style={styles.infoRecipe}>{item.calories} </Text>
                    </View>
                    <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                      <View style={styles.ingredients}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: "balsam-f",
                            color: "goldenrod",
                            margin: 10,
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          View Ingrediants{" "}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => bs2.current.snapTo(0)}>
                      <View style={styles.ingredients}>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "goldenrod",
                            fontFamily: "balsam-f",
                            margin: 10,
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          Instructions{" "}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            )}
          />
        </SafeAreaView>
      </View>
    </View>
  );
};
const Stack = createStackNavigator();

export default function recipes({ route }) {
  const name = route.params.user;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SearchIngredients"
        component={SearchIngredients}
        initialParams={{
          user: name,
        }}
      />
      <Stack.Screen
        name="SearchRecipes"
        component={SearchRecipes}
        initialParams={{
          user: name,
        }}
      />
      <Stack.Screen
        name="showIngredients"
        component={showIngredients}
        initialParams={{
          user: name,
        }}
      />
      <Stack.Screen
        name="showRecipes"
        component={showRecipes}
        initialParams={{
          user: name,
        }}
      />
      <Stack.Screen
        name="RecipesDetails"
        component={RecipesDetails}
        initialParams={{
          user: name,
        }}
      />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "white",
    width: width / 1.56,
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "balsam-f",
    marginHorizontal: width / 28,
  },
  text1: {
    color: `#000000`,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: width / 20,
    fontFamily: "balsam-f",
    paddingTop: width / 15,
  },
  container: {
    position: "absolute",
    top: width / 2.8,
    left: 0,
    right: 0,
    bottom: 0,
    height: width / 2,
  },
  subContainer: {
    backgroundColor: "#84DCC6",
    paddingTop: 10,
    marginHorizontal: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  itemView: {
    marginHorizontal: "13%",
    backgroundColor: "white",
    height: 30,
    width: width / 1.3,
    borderRadius: 6,
    height: width / 8,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
  },
  itemText: {
    color: "black",
    paddingHorizontal: 10,
    fontFamily: "balsam-f",
    justifyContent: "center",
    paddingTop: 10,
  },
  noResultView: {
    height: 100,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    height: 30,
    width: width / 1.3,
    borderRadius: 6,
    marginHorizontal: "13%",
  },
  noResultText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "grey",
    paddingHorizontal: 10,
    fontFamily: "balsam-f",
    justifyContent: "center",
  },
  viewAI: {
    backgroundColor: "white",
    width: width / 1.1,
    height: width / 3,
    marginLeft: width / 23,
    marginTop: width / 50,
    marginBottom: width / 20,
    shadowColor: "black",
    shadowOpacity: 0.3,
    borderRadius: 8,
    shadowRadius: 5,
  },
  viewType: {
    backgroundColor: "white",
    width: width / 1.1,
    height: width / 1.5,
    marginLeft: width / 23,
    marginTop: width / 200,
    //shadowColor: "black",
    shadowOpacity: 0.1,
    borderRadius: 8,
  },
  viewbutton: {
    backgroundColor: "white",
    width: width / 1.1,
    height: width / 5,
    marginLeft: width / 23,
    //marginTop: width / 45,
    shadowColor: "black",
    shadowOpacity: 0.3,
    borderRadius: 8,
    shadowRadius: 5,
  },
  buttonType: {
    width: width / 1.1,
    height: width / 5.5,

    flexDirection: "row",
  },
  textType: {
    color: "black",
    textAlign: "left",
    fontSize: width / 22,
    fontFamily: "balsam-f",
    marginTop: 20,
    marginLeft: 5,
  },
  viewshowIngredients: {
    backgroundColor: "white",
    width: width / 1.1,
    height: height,
    marginLeft: width / 23,
    marginTop: width / 50,
    marginBottom: width / 20,
    shadowColor: "black",
    //shadowOpacity: 0.3,
    borderRadius: 8,
    shadowRadius: 5,
  },
  containerR: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    backgroundColor: "black",
    position: "absolute",
    bottom: 315,
    right: 0,
    width: 35,
    height: 35,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRecipeContainer: {
    flex: 1,
    margin: 25,
    marginTop: -35,
    justifyContent: "center",
    alignItems: "center",
  },
  infoRecipeName: {
    fontSize: 28,

    fontWeight: "bold",
    color: "black",
    textAlign: "center",
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
    margin: 10,
  },
  infoRecipe: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  infoDescriptionRecipe: {
    textAlign: "left",
    fontSize: 16,
    marginTop: 20,
    margin: 15,
  },
  ingredients: {
    height: 50,
    width: 270,
    marginTop: 20,
    borderRadius: 100,
    borderColor: "goldenrod",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
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
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    height: 400,
    opacity: 0.8,
    alignItems: "center",
  },
  btnNormal: {
    borderColor: "blue",
    borderWidth: 1,
    borderRadius: 10,
    height: 30,
    width: 100,
  },
  btnPress: {
    borderColor: "blue",
    borderWidth: 1,
    height: 30,
    width: 100,
  },
});
/*this view was for microphone < after viewbutton
   <View style={styles.viewAI}>
            <Text
              style={{
                color: "goldenrod",
                textAlign: "center",
                fontSize: width / 22,
                fontFamily: "balsam-f",
                paddingTop: 10,
              }}
            >
              Use Your Voice
            </Text>
            <Text
              style={{
                color: "lightgrey",
                textAlign: "center",
                fontSize: width / 30,
                fontFamily: "balsam-f",
                paddingTop: 5,
              }}
            >
              Dicate Your Ingredients
            </Text>
          </View>


*/
