import React from "react";
import { View, Text, Button, StyleSheet, StatusBar,Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Home";
import Notif from "./notifi";
import Activity from "./activity";
import Profile from "./profile";
import Add from "../components/AddButton";
import Train from "./training";
import recipes from "./recipes";
import social from "./social";
import store from "./store";
import trainDetails from "./trainDetails";
import recipeDetails from "./recipeDetails";

const { width, height } = Dimensions.get('window');

import {
  AnimatedTabBarNavigator,
  DotSize,
} from "react-native-animated-nav-tab-bar";

const Tab = AnimatedTabBarNavigator();

function footer({ route, navigation }) {
  alert("hi");
const { name, w, period, calories, valueactivity,start, end } = route.params;
  return (
    <Tab.Navigator
        tabBarOptions={{
          activeTintColor: "#1a798a",
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
        initialParams={{ user: name, week: period, level: valueactivity, cal: calories,start: start, end: end }}
        options={{
          tabBarLabel: "Home",
          tabBarColor: "goldenrod",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home"
              color={focused ? "#1a798a" : "silver"}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="social"
        component={social}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
        }}
      />
      <Tab.Screen
        name="Activity"
        component={Activity}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "Activity",
          tabBarColor: "goldenrod",
          tabBarIcon: ({ focused }) => (
            <Feather
              name="activity"
              size={28}
              style={{ paddingLeft: 10 }}
              color={focused ? "#1a798a" : "silver"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Train"
        component={Train}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
        }}
      />
      <Tab.Screen
        name="store"
        component={store}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
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
        }}
      />
      <Tab.Screen
        name="recipes"
        component={recipes}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
        }}
      />
      <Tab.Screen
        name="notification"
        component={Notif}
        options={{
          tabBarLabel: "Notification",
          tabBarColor: "goldenrod",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="bell"
              color={focused ? "#1a798a" : "silver"}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="recipeDetails"
        component={recipeDetails}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "  ",
        }}
      />

      <Tab.Screen
        name="profile"
        component={Profile}
        initialParams={{ user: name }}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account"
              color={focused ? "#1a798a" : "silver"}
              size={28}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default footer;

/*const AddScreen =() => (

  <Stack.Navigator headerMode="none">
         <Stack.Screen name="Train" component={Train}/>
         <Stack.Screen name="recipes" component={recipes}/>
         <Stack.Screen name="store" component={store}/>
         <Stack.Screen name="social" component={social}/>
  </Stack.Navigator>
);
const HomeScreen =() => (
<HomeStack.Navigator headerMode="Home">
       <HomeStack.Screen name="Home" component={Home}/>
       <HomeStack.Screen name="recipeDetails" component={recipeDetails}/>
       <HomeStack.Screen name="trainDetails" component={trainDetails}/>
</HomeStack.Navigator>
);


const notifiScreen =({route, navigation}) => (
<notifiStack.Navigator screenOptions={{
         headerStyle : {
           backgroundColor : 'goldenrod',
           height: 80
         },
         headerTintColor: '#ffff',
         headerTitleStyle : {
         fontWeight : 'bold',
         fontSize:20
         }
         }}>
    <notifiStack.Screen name="Notifications" component={Notif}/>
    </notifiStack.Navigator>
);
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
