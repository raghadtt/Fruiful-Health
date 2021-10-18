import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
//--------------------------------------icon
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconBadge from "react-native-icon-badge";
//--------------------------------------
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import getFocusedRouteNameFromRoute from "@react-navigation/native";
//-----------------------------------------SCREEN
import Home from "./Home";
import Notif from "./notifi";
import profile from "./profile";
import Add from "../components/AddButton";
import Train from "./training";
import recipes from "./recipes";
import FavScreen from "./FavScreen";
import store from "./store";
import trainDetails from "./trainDetails";
import recipeDetails from "./recipeDetails";
import ScanScreen from "./ScanScreen";
import footer from "./footer";
import Reset from "./Reset";
import TodayCalories from "./TodayCalories";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
//-----------------------------------------------------
import { View, StyleSheet, Alert, StatusBar, Dimensions } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";

import {
  AnimatedTabBarNavigator,
  DotSize,
} from "react-native-animated-nav-tab-bar";

const { width, height } = Dimensions.get("window");
const AppDrawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = AnimatedTabBarNavigator();

export const TabNavigator = ({ route, navigation }) => {
  const name = route.params.name;
  const valueactivity = route.params.valueactivity;
  const calories = route.params.calories;
  const start = route.params.start;
  const end = route.params.end;
  const period = route.params.period;
  const [Data, setData] = React.useState(0);
  const [flag, setflag] = React.useState(true);
  const isFocused = useIsFocused();

  async function fetchData() {
    const response = await fetch(
      "http://192.168.1.110:4008/notifyuser?username=" + name
    );
    const info = await response.json();
    setData(info.length);
    //  alert(Data);
  }
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [flag])
  );
  /* useEffect(() => {
    fetchData();
  }, [isFocused]);*/
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: "#2E9298",
        inactiveTintColor: "#222222",
        activeBackgroundColor: "white",

        tabStyle: {
          height: width / 5.5,
          shadowColor: "black",
          shadowOpacity: 0.2,
        },
        labelStyle: {
          fontSize: 10,
          fontWeight: "bold",
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            //e.preventDefault();
            fetchData();
            setflag(!flag);

            //alert("hi");
            navigation.navigate("Home", {
              user: name,
              level: valueactivity,
              cal: calories,
              start: start,
              end: end,
              week: period,
            });
          },
        })}
        initialParams={{
          user: name,
          level: valueactivity,
          cal: calories,
          start: start,
          end: end,
          week: period,
        }}
        options={{
          tabBarLabel: "Home",
          tabBarColor: "goldenrod",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home"
              color={focused ? "#2E9298" : "silver"}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="FavScreen"
        component={FavScreen}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="ScanScreen"
        component={ScanScreen}
        initialParams={{ user: name }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            //e.preventDefault();
            setflag(!flag);
            //alert("hi");
            navigation.navigate("ScanScreen", { user: name });
          },
        })}
        options={{
          tabBarLabel: "Scan",
          tabBarColor: "goldenrod",

          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="barcode-scan"
              size={28}
              style={{ paddingLeft: 3 }}
              color={focused ? "#2E9298" : "silver"}
            />
          ),
          unmountOnBlur: true, //to go to first screen of stack always not the last one enters befor click on the tab
        }}
      />
      <Tab.Screen
        name="Train"
        component={Train}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
          unmountOnBlur: true, //to go to first screen of stack always not the last one enters befor click on the tab
        }}
      />
      <Tab.Screen
        name="store"
        component={store}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
          unmountOnBlur: true, //to go to first screen of stack always not the last one enters befor click on the tab
        }}
      />
      <Tab.Screen
        name="  "
        initialParams={{ user: name }}
        component={() => null}
        options={{
          tabBarIcon: () => <Add navigation={navigation} />,
        }}
      />
      <Tab.Screen
        name="trainDetails"
        component={trainDetails}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
          unmountOnBlur: true, //to go to first screen of stack always not the last one enters befor click on the tab
        }}
      />
      <Tab.Screen
        name="recipes"
        component={recipes}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
          unmountOnBlur: true, //to go to first screen of stack always not the last one enters befor click on the tab
        }}
      />
      <Tab.Screen
        name="notification"
        component={Notif}
        initialParams={{ user: name }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            //e.preventDefault();
            setflag(!flag);
            //alert("hi");
            navigation.navigate("notification", { user: name });
          },
        })}
        options={{
          tabBarLabel: "Notification",
          tabBarColor: "goldenrod",
          //tabBarBadge: 5,
          tabBarIcon: ({ focused }) => (
            <IconBadge
              MainElement={
                <MaterialCommunityIcons
                  name="bell"
                  color={focused ? "#2E9298" : "silver"}
                  size={28}
                />
              }
              IconBadgeStyle={{
                position: "absolute",
                top: -4,
                right: -9,

                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FF0000",
              }}
              BadgeElement={<Text style={{ color: "white" }}>{Data}</Text>}
              Hidden={Data == 0}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TodayCalories"
        component={TodayCalories}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
        }}
      />

      <Tab.Screen
        name="profile"
        component={profile}
        initialParams={{ user: name }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            //e.preventDefault();
            setflag(!flag);
            //alert("hi");
            navigation.navigate("profile", { user: name });
          },
        })}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account"
              color={focused ? "#2E9298" : "silver"}
              size={28}
            />
          ),
        }}
        initialParams={{
          user: name,
          level: valueactivity,
          cal: calories,
          start: start,
          end: end,

          period: period,
        }}
      />
    </Tab.Navigator>
  );
};
/*#B81D16 */
function CustomDrawerContent(props) {
  
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={require("../assets/"+"me"+".png")}
                size={50}
              />
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title style={styles.title}>
                  {props[0].firstname} {props[0].lastname}
                </Title>
                <Caption style={styles.caption}>@{props[0].user}</Caption>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph
                  style={[styles.paragraph, styles.caption]}
                ></Paragraph>
                <Caption style={styles.caption}></Caption>
              </View>
              <View style={styles.section}>
                <Paragraph
                  style={[styles.paragraph, styles.caption]}
                ></Paragraph>
                <Caption style={styles.caption}></Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate("Home", {
                  user: props[0].user,
                  gender: props[0].gender,
                  firstname: props[0].firstname,
                  lastname: props[0].lastname,
                  level: props[0].valueactivity,
                  cal: props[0].calories,
                  start: props[0].start,
                  end: props[0].end,
                  week: props[0].period,
                });
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate("profile");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="fire" color={color} size={size} />
              )}
              label="Today's Calories"
              onPress={() => {
                props.navigation.navigate("TodayCalories");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="restart"
                  color={color}
                  size={size}
                />
              )}
              label="Reset"
              onPress={() => {
                Alert.alert(
                  "Are you sure you want to reset your schedule? ",
                  "Resetting your schedule involves starting with a new plan from scratch based on your recent information ",
                  [
                    {
                      text: "Yes",
                      onPress: () =>
                        props.navigation.reset({
                          //Using reset avoid you to go back to login Screen
                          index: 0,
                          routes: [
                            {
                              name: "Reset",
                              params: {
                                user: props[0].user,
                                gender: props[0].gender,
                                firstname: props[0].firstname,
                                lastname: props[0].lastname,
                                level: props[0].valueactivity,
                                cal: props[0].calories,
                                start: props[0].start,
                                end: props[0].end,
                              },
                            },
                          ],
                        }),
                    },
                    { text: "No" },
                  ]
                );
              }}
            />
          </Drawer.Section>
  
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons name="exit-outline" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            Alert.alert("Are you sure you want to log out? ", "", [
              {
                text: "Yes",
                onPress: () => props.navigation.navigate("Start"),
              },
              { text: "No" },
            ]);
          }}
        />
      </Drawer.Section>
    </View>
  );
}

function getHeaderTitle(route) {
  return getFocusedRouteNameFromRoute(route) ?? "Home";
}

const StackNavigator = ({ route, navigation }) => {
  const name = route.params.name;
  const valueactivity = route.params.valueactivity;
  const calories = route.params.calories;
  const start = route.params.start;
  const end = route.params.end;
  const period = route.params.period;
  const firstname = route.params.firstname;
  const lastname = route.params.lastname;
  const gender = route.params.gender;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        initialParams={{
          name: name,
          valueactivity: valueactivity,
          calories: calories,
          start: start,
          end: end,
          period: period,
          firstname: firstname,
          lastname: lastname,
        }}
      />
      <Stack.Screen
        name="Reset"
        component={Reset}
        initialParams={{
          user: name,
          firstname: firstname,
          lastname: lastname,
          gender: gender,
        }}
      />
    </Stack.Navigator>
  );
};

function DrawerScreen({ route, navigation }) {
  const {
    name,
    period,
    calories,
    valueactivity,
    start,
    end,
    firstname,
    lastname,
    gender,
  } = route.params;

  let array = [
    {
      user: name,
      valueactivity: valueactivity,
      calories: calories,
      start: start,
      end: end,
      period: period,
      firstname: firstname,
      lastname: lastname,
      gender: gender,
    },
  ];
  console.log(firstname);
  return (
    <AppDrawer.Navigator
      initialRouteName="Home"
      initialParams={{
        name: name,
        valueactivity: valueactivity,
        calories: calories,
        start: start,
        end: end,
        period: period,
        firstname: firstname,
        lastname: lastname,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} {...array} />}
    >
      <AppDrawer.Screen
        name="Stack"
        component={StackNavigator}
        initialParams={{
          name: name,
          valueactivity: valueactivity,
          calories: calories,
          start: start,
          end: end,
          period: period,
          firstname: firstname,
          lastname: lastname,
          gender: gender,
        }}
      />
    </AppDrawer.Navigator>
  );
}

export default DrawerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
