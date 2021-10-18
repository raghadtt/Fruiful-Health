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
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import ModernHeader from "react-native-modern-header";
//---------------------------------------for stack recipes details

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useIsFocused } from "@react-navigation/native";
//------------------------------------------------------------------
import { useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
const notifi = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const user = route.params.user;
  const [data, setdata] = React.useState([]);
  async function fetchData() {
    const response = await fetch(
      "http://192.168.1.110:4008/notifyuser?username=" + user
    );
    const info = await response.json();
    setdata(info);
  }
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    })
  );
  const dedelete = (item) => {
    fetch("http://192.168.1.110:4008/deletenotify", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        msg: item.msg,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //setModalVisibleReset(!isModalVisibleReset);
          // alert(res.message);
          fetchData();
        } else {
          alert(res.message);
        }
      })
      .done();
  };
  /*
  useEffect(() => {
    if (isFocused) fetchData();
  }, [isFocused]);
*/
  return (
    <SafeAreaView>
      <ScrollView>
        <ModernHeader
          backgroundColor="#f5f5f5"
          height={50}
          titleStyle={{
            fontSize: width / 20,
            fontWeight: "bold",
            fontFamily: "balsam-f",
          }}
          title="Notification"
          rightDisable={true}
          leftDisable={true}

          //leftIconOnPress={() => navigation.openDrawer()}
        ></ModernHeader>
        <View style={{ backgroundColor: "white" }}>
          <View style={{ backgroundColor: "white" }}>
            {data.map((item) => {
              return (
                <View
                  style={{
                    //marginHorizontal: "13%",
                    backgroundColor: "white",
                    width: width,
                    borderRadius: 6,
                    height: width / 3,
                    // borderBottomWidth: 1,
                    // borderBottomColor: "lightgrey",
                    flexDirection: "row",
                    shadowOpacity: 0.2,
                    marginTop: width / 20,
                    shadowColor: "black",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexShrink: 1,
                    }}
                  >
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
                        {item.msg}
                      </Text>

                      <View style={{ flexDirection: "row" }}></View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => dedelete(item)}
                    style={{
                      marginTop: width / 9,
                      marginLeft: width / 12,
                      marginRight: width / 10,
                      //  backgroundColor: "red",
                    }}
                  >
                    <MaterialIcons
                      name="check-circle-outline"
                      size={35}
                      color="goldenrod"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default notifi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
