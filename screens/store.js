import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Dimensions,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import ModernHeader from "react-native-modern-header";
import Ionicons from "react-native-vector-icons/Ionicons";
import Material from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useIsFocused } from "@react-navigation/native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import WebView from "react-native-webview";
const { width, height } = Dimensions.get("window");
import { AntDesign, Fontisto } from "@expo/vector-icons";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";

const store = ({ navigation, route }) => {
  const isFocused = useIsFocused();

  //-------------------------------------------------------Array for photo of sport
  var ArraytoolPhoto = [
    {
      name: "Mat",
      uri: "https://images-na.ssl-images-amazon.com/images/I/71Wj6KAFNvL._AC_SX425_.jpg",
    },
    {
      name: "Dumbbell",
      uri: "https://www.rebelsport.com.au/dw/image/v2/BBRV_PRD/on/demandware.static/-/Sites-srg-internal-master-catalog/default/dw2aba8bf0/images/423989/Rebel_423989_hi-res.jpg?sw=558&sh=558&sm=fit",
    },
    {
      name: "Bench",
      uri: "http://cdn.shopify.com/s/files/1/2202/0569/products/1rm-cfb-update_1200x1200.jpg?v=1563003658",
    },
    {
      name: "Jump Rope",
      uri: "https://target.scene7.com/is/image/Target/GUEST_260b218f-e0ec-498d-a460-256a11da5a48?wid=488&hei=488&fmt=pjpeg",
    },
    {
      name: "Kettlebell",
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwN4mEAXUotWuQ87B24j8XbkiWGc-XNDD_DYoqy1kBvPW7WVyagdAMrXQ7aRsT1joii1g&usqp=CAU",
    },
    {
      name: "Exercise Band",
      uri: "https://us.123rf.com/450wm/venusangel/venusangel1212/venusangel121200300/16742025-banda-el%C3%A1stica-de-fitness-la-herramienta-de-ejercicio-para-su-uso-en-casa-o-en-gimnasio.jpg?ver=6",
    },
    {
      name: "Medicine Ball",
      uri: "https://cdn.shopify.com/s/files/1/0088/7576/9952/products/Medizinball-7kg_600x.jpg?v=1568265132",
    },
    {
      name: "Aerobics Step",
      uri: "https://www.physicalcompany.co.uk/media/catalog/product/cache/3d6dc8d3c92c278e206927eb017b928e/p/s/pstepm_a.jpg",
    },
    {
      name: "Standbag",
      uri: "https://i.pinimg.com/originals/66/ce/07/66ce07f0ff7e407ed15867124e4e35b6.jpg",
    },
  ];
  //-----------------------------------------------------

  const user = route.params.user;
  const [flag1, setflag1] = useState(true);
  const [flag2, setflag2] = useState(false);
  const [data, setData] = useState([]);
  const [img, setimg] = useState([]);
  var tempList = [];
  var tempListsport = [];
  async function fetchData(part) {
    console.log(part);
    const response = await fetch(
      "http://192.168.1.110:4008/shoppinglistScreen?username=" +
        user +
        "&type=" +
        part
    );
    const info = await response.json();
    setData(info);

    if (part == "%ingredient%") {
      const response2 = await fetch(
        "http://192.168.1.110:4008/searchIngredients"
      );
      const info2 = await response2.json();

      info.forEach((element1) => {
        info2.forEach((element2) => {
          if (element2.name == element1.name) {
            tempList.push(element2.image);
          }
        });
      });

      setimg(tempList);
    } else {
      info.forEach((element1) => {
        ArraytoolPhoto.forEach((element2) => {
          if (element1.name == element2.name) {
            tempListsport.push(element2.uri);
          }
        });
      });
      setimg(tempListsport);
    }
    console.log(tempListsport);
  }
  useEffect(() => {
    fetchData("%ingredient%");
  }, [isFocused]);

  const shoppingIng = () => {
    setflag1(true);
    setflag2(false);

    fetchData("%ingredient%");
  };
  const shoppingTrain = () => {
    setflag1(false);
    setflag2(true);

    fetchData("%sport%");
  };

  const checko = (item) => {
    fetch("http://192.168.1.110:4008/deleteshoppinglist", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        type: item.type,
        name: item.name,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //setModalVisibleReset(!isModalVisibleReset);
          alert(res.message);
          if (item.type == "ingredient") fetchData("%ingredient%");
          else fetchData("%sport%");
        } else {
          alert(res.message);
        }
      })
      .done();
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <ModernHeader
          backgroundColor="#f5f5f5"
          height={50}
          titleStyle={{
            fontSize: 18,
            fontWeight: "bold",
            fontFamily: "balsam-f",
          }}
          title="Shopping List"
          rightDisable={true}
          leftDisable={true}
        />

        <View style={styles.header}>
          {flag1 ? (
            <TouchableOpacity onPress={() => shoppingIng()}>
              <View
                style={{
                  backgroundColor: "white",
                  width: width / 2,
                  height: height / 12,
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
                    textAlign: "center",
                    marginTop: width / 35,
                  }}
                >
                  Ingredients{" "}
                  <MaterialCommunityIcons
                    name="food-variant"
                    size={25}
                    color="black"
                  ></MaterialCommunityIcons>
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => shoppingIng()}>
              <View
                style={{
                  width: width / 2,
                  height: height / 12,
                  borderRadius: 70,
                  opacity: "0.7",
                }}
              >
                <Text
                  style={{
                    margin: 7,
                    color: "white",
                    fontSize: 15,
                    fontWeight: "bold",
                    fontFamily: "balsam-f",
                    textAlign: "center",
                    marginTop: width / 35,
                    opacity: "0.7",
                    borderRadius: 70,
                  }}
                >
                  Ingredients{" "}
                  <MaterialCommunityIcons
                    name="food-variant"
                    size={25}
                    color="white"
                  ></MaterialCommunityIcons>
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {flag2 ? (
            <TouchableOpacity onPress={() => shoppingTrain()}>
              <View
                style={{
                  marginLeft: width / 1000,
                  backgroundColor: "white",
                  width: width / 2,
                  height: height / 12,
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
                    textAlign: "center",
                    marginTop: width / 35,
                  }}
                >
                  Sport Tools{" "}
                  <MaterialIcons
                    name="sports-handball"
                    size={25}
                    color="black"
                  ></MaterialIcons>
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => shoppingTrain()}>
              <View
                style={{
                  marginLeft: width / 1000,

                  width: width / 2,
                  height: height / 12,
                  borderRadius: 70,
                  opacity: "0.7",
                }}
              >
                <Text
                  style={{
                    margin: 7,
                    color: "white",
                    fontSize: 15,
                    fontWeight: "bold",
                    fontFamily: "balsam-f",
                    textAlign: "center",
                    marginTop: width / 35,
                  }}
                >
                  Sport Tools{" "}
                  <MaterialIcons
                    name="sports-handball"
                    size={25}
                    color="white"
                  ></MaterialIcons>
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.viewshowIngredients}>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={{ flexDirection: "coulmn" }}>
                {img.map((imgg) => {
                  return (
                    <Image
                      source={{
                        uri: imgg,
                      }}
                      style={{
                        width: width / 6,
                        height: width / 6,
                        borderRadius: 15,
                        marginTop: width / 40,
                      }}
                    />
                  );
                })}
              </View>
              <View style={{ flexDirection: "coulmn" }}>
                {data.map((item) => {
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
                          {item.name}
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
                          <EvilIcons name="trash" size={32}></EvilIcons>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
export default store;
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
    // paddingBottom: 20,
    flexDirection: "row",
    // borderBottomWidth: 0.3,
  },
  vieww: {
    marginTop: 30,
    // paddingBottom: 20,
    flexDirection: "row",
    borderBottomWidth: 0.2,
  },
  text: {
    marginTop: 48,
    marginLeft: 10,
    paddingRight: 130,
    fontFamily: "balsam-f",
    fontSize: 17,
    fontWeight: "100",
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
  viewshowIngredients: {
    backgroundColor: "white",

    //width: width / 1.1,
    // height: height,
    marginLeft: width / 23,
    // marginTop: width / 50,
    marginBottom: width / 20,
    //shadowColor: "black",
    //shadowOpacity: 0.3,
    //borderRadius: 8,
    // shadowRadius: 5,
  },
});
/*<View style={styles.viewshowIngredients}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "coulmn",
              }}
            >
              {img.map((imgg) => {
                return (
                  <Image
                    source={{
                      uri: imgg,
                    }}
                    style={{
                      resizeMode: "center",
                      width: width / 7,
                      height: width / 7,
                      borderRadius: 35,
                      marginTop: width / 40,
                    }}
                  />
                );
              })}
            </View>
            <View style={{ flexDirection: "coulmn" }}>
              {data.map((item) => {
                return (
                  <View
                    style={{
                      //marginHorizontal: "13%",
                      backgroundColor: "white",
                      width: width,
                      borderRadius: 6,
                      height: width / 7,
                      borderBottomWidth: 1,
                      borderBottomColor: "lightgrey",
                      flexDirection: "row",
                      flexShrink: 1,
                      // shadowOpacity: 0.3,
                      // shadowColor: "black",
                      marginTop: width / 40,
                    }}
                  >
                    <View
                      style={{
                        width: width / 1.6,
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
                        {item.name}
                      </Text>
                    </View>
                    <View
                      style={
                        {
                          // marginRight: width / 5,
                        }
                      }
                    >
                      <TouchableOpacity
                        style={{
                          paddingLeft: width / 15,
                          paddingRight: width / 15,
                          paddingTop: 10,
                          paddingBottom: 10,
                          // backgroundColor: "green",
                        }}
                        onPress={() => checko(item)}
                      >
                        <EvilIcons name="trash" size={32}></EvilIcons>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View> */
