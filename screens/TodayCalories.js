import React, { useState, useEffect } from "react";
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
import ModernHeader from "react-native-modern-header";
import { useIsFocused } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const { width, height } = Dimensions.get("window");

const TodayCalories = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [breakfast, setbreakfast] = React.useState(null);
  const [w1, setw1] = React.useState(null);

  const [lunch, setlunch] = React.useState(null);
  const [w2, setw2] = React.useState(null);

  const [dinner, setdinner] = React.useState(null);
  const [w3, setw3] = React.useState(null);

  const [snack, setsnack] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [data2, setData2] = React.useState([]);
  const [data3, setData3] = React.useState([]);
  var tempList1 = [];
  var tempList2 = [];
  async function fetchData() {
    const response = await fetch(
      "http://192.168.1.110:4008/todayCalories?user=" + user
    );
    const info = await response.json();
    setData(info);
    if (info.length != 0) {
      const response2 = await fetch(
        "http://192.168.1.110:4008/recipesToday?m1=" +
          info.breakfast +
          "&m2=" +
          info.lunch +
          "&m3=" +
          info.dinner +
          "&m4=" +
          info.snacks
      );
      const info2 = await response2.json();
      setData2(info2);
    }
    if (info.length != 0) {
      const response3 = await fetch(
        "http://192.168.1.110:4008/trainingToday?ex1=" +
          info.ex1 +
          "&ex2=" +
          info.ex2 +
          "&ex3=" +
          info.ex3
      );

      const info3 = await response3.json();
      setData3(info3);
    }
  }
  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const user = route.params.user;
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernHeader
          backgroundColor="#f5f5f5"
          height={50}
          titleStyle={{
            fontSize: 18,
            fontWeight: "bold",
            fontFamily: "balsam-f",
          }}
          title="Today's Calories"
          rightDisable={true}
          leftIconName="menu-outline"
          leftIconSize={30}
          leftIconColor="black"
          leftIconOnPress={() => navigation.openDrawer()}
        />

        <ImageBackground
          style={{ width: "100%", height: "105%" }}
          source={require("../assets/bg2.png")}
          imageStyle={{ opacity: 0.25 }} //so any children of it don't affected
        >
          <View
            style={
              ([styles.view2],
              { paddingTop: width / 25, paddingLeft: width / 25 })
            }
          >
            <Text style={{ fontSize: 20, fontFamily: "balsam-f" }}>
              Hi {user}, here is a summary of your calorie intake for the day :
            </Text>

            <TextInput
              editable="false"
              multiline={true}
              style={{
                color: "lightslategrey",
                fontFamily: "balsam-f",
                //borderBottomWidth: 0.5,
                //borderBottomColor: "lightslategrey",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              NOTE: you can change any recipes by press on it in the (Home
              Screen) and choose (log meal)
            </TextInput>
          </View>
          <View
            style={{
              backgroundColor: "white",
              width: width / 1.1,
              marginLeft: width / 23,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "balsam-f",
                color: "goldenrod",
                textAlign: "center",
                marginTop: width / 25,
              }}
            >
              Meals
            </Text>
            {data2.map((itemm) => {
              return itemm.meal == "Breakfast" ? (
                <View
                  style={{
                    marginLeft: width / 20,

                    marginTop: width / 60,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    Breakfast:
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "balsam-f",
                    }}
                  >
                    {itemm.name + "  "}
                  </Text>

                  <View
                    style={{
                      marginTop: width / 100,
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "balsam-f",
                      }}
                    >
                      {"cal : " + itemm.calories}
                    </Text>
                    <MaterialIcons
                      name="local-fire-department"
                      size={20}
                      color="orange"
                    ></MaterialIcons>
                  </View>

                  <TextInput
                    editable="false"
                    multiline={true}
                    style={{
                      color: "lightslategrey",
                      fontFamily: "balsam-f",
                      borderBottomWidth: 0.5,
                      borderBottomColor: "lightslategrey",
                    }}
                  ></TextInput>
                </View>
              ) : itemm.meal == "Lunch" ? (
                <View
                  style={{
                    marginLeft: width / 20,

                    marginTop: width / 24,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    Lunch:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "balsam-f",
                    }}
                  >
                    {itemm.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "balsam-f",
                    }}
                  >
                    {"cal : " + itemm.calories}
                    <MaterialIcons
                      name="local-fire-department"
                      size={20}
                      color="orange"
                    ></MaterialIcons>
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
                  ></TextInput>
                </View>
              ) : itemm.meal == "Dinner" ? (
                <View
                  style={{
                    marginLeft: width / 20,

                    marginTop: width / 24,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    Dinner:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "balsam-f",
                    }}
                  >
                    {itemm.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "balsam-f",
                    }}
                  >
                    {"cal : " + itemm.calories}{" "}
                    <MaterialIcons
                      name="local-fire-department"
                      size={20}
                      color="orange"
                    ></MaterialIcons>
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
                  ></TextInput>
                </View>
              ) : (
                <View
                  style={{
                    marginLeft: width / 20,

                    marginTop: width / 24,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    Snack:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "balsam-f",
                    }}
                  >
                    {itemm.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "balsam-f",
                    }}
                  >
                    {"cal : " + itemm.calories}
                    <MaterialIcons
                      name="local-fire-department"
                      size={20}
                      color="orange"
                    ></MaterialIcons>
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
                  ></TextInput>
                </View>
              );
            })}
          </View>
          <View
            style={{
              backgroundColor: "white",
              width: width / 1.1,
              marginLeft: width / 23,
              borderRadius: 10,
              marginTop: width / 15,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "balsam-f",
                color: "goldenrod",
                textAlign: "center",
                marginTop: width / 25,
              }}
            >
              Workout
            </Text>
            {data3.map((itemm) => (
              <View
                style={{
                  marginLeft: width / 20,

                  marginTop: width / 24,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "balsam-f",
                  }}
                >
                  {itemm.name + "."}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "balsam-f",
                  }}
                >
                  {"cal : " + itemm.calories}
                  <MaterialIcons
                    name="local-fire-department"
                    size={20}
                    color="orange"
                  ></MaterialIcons>
                </Text>
                <TextInput
                  editable={false}
                  multiline={true}
                  style={{
                    color: "lightslategrey",
                    fontFamily: "balsam-f",
                    borderBottomWidth: 0.5,
                    borderBottomColor: "lightslategrey",
                  }}
                ></TextInput>
              </View>
            ))}
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TodayCalories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view2: {},
});
