import React, { useState, useEffect, useRef } from "react";
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
  ImageBackground,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import ModernHeader from "react-native-modern-header";
import Ionicons from "react-native-vector-icons/Ionicons";
import Material from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useIsFocused } from "@react-navigation/native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import WebView from "react-native-webview";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";

const Stack = createStackNavigator();

const FavScreen = ({ navigation, route }) => {
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
      <Stack.Screen
        name="Details2"
        component={Details2}
        options={({ navigation }) => ({})}
      />
    </Stack.Navigator>
  );
};
export default FavScreen;

const Main = ({ navigation, route }) => {
  const isFocused = useIsFocused();

  const [flag1, setflag1] = useState(true);
  const [flag2, setflag2] = useState(false);

  const [data, setData] = useState([]);
  const user = route.params.user;

  const checko = (item) => {
    fetch("http://192.168.1.110:4008/deleteFav", {
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
          if (item.type == "recipe") fetchData("%recipe%");
          else fetchData("%sport%");
        } else {
          alert(res.message);
        }
      })
      .done();
  };

  async function fetchData(part) {
    const response = await fetch(
      "http://192.168.1.110:4008/Fav?username=" + user + "&type=" + part
    );
    const info = await response.json();
    setData(info);
    console.log(info);
  }
  useEffect(() => {
    fetchData("%recipe%");
  }, [isFocused]);

  const recipe = () => {
    setflag1(true);
    setflag2(false);
    fetchData("%recipe%");
  };
  const sport = () => {
    setflag1(false);
    setflag2(true);
    fetchData("%sport%");
  };

  const detrmine = (item) => {
    if (flag1) {
      navigation.navigate("Details", {
        item: item,
      });
    } else if (flag2) {
      navigation.navigate("Details2", {
        item: item,
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <ModernHeader
          backgroundColor="white"
          height={50}
          titleStyle={{
            fontSize: 18,
            fontWeight: "bold",
            fontFamily: "balsam-f",
          }}
          title="Favourite"
          rightDisable={true}
          leftDisable={true}
        />

        <View style={styles.header}>
          {flag1 ? (
            <TouchableOpacity onPress={() => recipe()}>
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
                  Recipes{" "}
                  <Ionicons name="restaurant-sharp" size={25} color="black" />
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => recipe()}>
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
                  Recipes{" "}
                  <Ionicons name="restaurant-outline" size={25} color="white" />
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {flag2 ? (
            <TouchableOpacity onPress={() => sport()}>
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
                  Training{" "}
                  <MaterialIcons
                    name="sports-handball"
                    size={25}
                    color="black"
                  ></MaterialIcons>
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => sport()}>
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
                  Training{" "}
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

        <View style={{ backgroundColor: "white" }}>
          {data.map((item) => {
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
                  onPress={() => detrmine(item)}
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
                          width: width / 2,
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => checko(item)}
                  style={{
                    paddingTop: width / 13,
                    //backgroundColor: "red",
                    width: width / 5,
                  }}
                >
                  <Material name="favorite" size={31} color="red"></Material>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const Details2 = ({ navigation, route }) => {
  const item = route.params.item;

  const [data, setData] = useState([]);
  var tempList = [];

  async function fetchData() {
    const response = await fetch(
      "http://192.168.1.110:4008/training?name=" + item.name
    );
    const info = await response.json();
    setData(info);
  }
  useEffect(() => {
    fetchData();
  }, []);

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

              <View style={styles.infoContainer}>
                <Text style={styles.category}>{item.body_part} Exercise</Text>
              </View>

              <View style={styles.infoContainer}>
                <Ionicons name="timer-outline" size={20}></Ionicons>
                <Text style={styles.infoRecipe}> {item.time} Minutes</Text>
              </View>
              <View style={styles.infoContainer}>
                <Material name="local-fire-department" size={20}></Material>
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

const Details = ({ navigation, route }) => {
  const item = route.params.item;
  var bs = React.createRef();
  var fall = new Animated.Value(1);
  var bs2 = React.createRef();
  var fall2 = new Animated.Value(1);
  const [data, setData] = useState([]);
  var tempList = [];

  async function fetchData() {
    const response = await fetch(
      "http://192.168.1.110:4008/allRecipes?name=" + item.name
    );
    const info = await response.json();
    setData(info);
  }
  useEffect(() => {
    fetchData();
  }, []);

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
    <Text style={[styles.infoDescriptionRecipe, { paddingBottom: 5 }]}>
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
    <View style={styles.header2}>
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
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: "white" }}>
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
                    <View style={styles.infoContainer}>
                      <Text style={styles.category}>{item.meal}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                      <MaterialIcons
                        name="local-fire-department"
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
  infoDescriptionRecipe: {
    textAlign: "left",
    fontFamily: "balsam-f",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 20,
    margin: 15,
  },
  ingredients: {
    height: 50,
    width: 220,
    marginTop: 20,
    borderRadius: 100,
    fontFamily: "balsam-f",
    borderColor: "goldenrod",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  header2: {
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
});
