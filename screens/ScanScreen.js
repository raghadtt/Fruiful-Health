import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  Image,
  ImageBackground,
  Alert,
  FlatList,
} from "react-native";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { BarCodeScanner } from "expo-barcode-scanner";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScrollView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
var bs = React.createRef();
var bs2 = React.createRef();
var fall = new Animated.Value(1);
var fall2 = new Animated.Value(1);

const { width, height } = Dimensions.get("window");

const Decide = ({ navigation, route }) => {
  const [barcode, setbarcode] = useState([]);
  const [filteredbarcode, setfilteredbarcode] = useState([]);
  const [searching, setSearching] = useState(false);

  //const kiloperweek = route.params.value;

  const onSearch = (text) => {
    if (text) {
      setSearching(true);
      const temp = text.toLowerCase();
      const tempList = barcode.filter((item) => {
        if (item.barcode.toLowerCase().match(temp)) {
          return item;
        }
      });
      setfilteredbarcode(tempList);

      console.log(filteredbarcode);
    } else {
      setSearching(false);
    }
  };

  async function fetchbarcode() {
    const response = await fetch("http://192.168.1.110:4008/barCode");
    const code = await response.json();

    setbarcode(code);
    //if (code.length) setsh(true); //show recipes view insted of loading icon

    // alert(RecipesSourceFiltter.length);
  }

  useEffect(() => {
    fetchbarcode();
  }, []);
  return (
    <SafeAreaView>
      <View>
        <View
          style={{
            backgroundColor: "white",
            height: width / 8,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              borderRadius: 6,
              backgroundColor: "gainsboro",
              flexDirection: "row",
              height: width / 10,
              marginTop: width / 60,
              marginLeft: width / 45,
            }}
          >
            <View
              style={{
                marginLeft: width / 35,
                backgroundColor: "gainsboro",
                borderRadius: 6,
                width: width / 15,
                height: width / 10,
              }}
            >
              <AntDesign
                name="search1"
                size={24}
                color="grey"
                style={{ marginTop: width / 60 }}
              />
            </View>

            <TextInput
              style={styles.textInput}
              placeholder={(text = "Enter Bar-code number ..")}
              placeholderTextColor="grey"
              onChangeText={onSearch}
            ></TextInput>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SearchbyBarCode", {
                barcode: barcode,
              })
            }
            style={{
              backgroundColor: "white",
              paddingRight: width / 30,
              marginLeft: width / 40,
            }}
          >
            <MaterialCommunityIcons
              name="barcode-scan"
              size={28}
              style={{
                marginTop: width / 37,
                marginLeft: width / 15,
              }}
            />
          </TouchableOpacity>
        </View>
        {searching == false ? (
          <View>
            <ImageBackground
              style={{ width: "100%", height: "105%" }}
              source={{
                uri: "https://frappe.io/files/upcbarcode.jpg",
              }}
              imageStyle={{
                opacity: 0.1,
                resizeMode: "contain",
              }}
            >
              <View style={styles.viewscreen4}>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    fontSize: 20,
                    marginTop: width / 10,
                    marginBottom: width / 10,
                    marginLeft: width / 60,
                    color: "goldenrod",
                  }}
                >
                  You can search for any product you want by one of the
                  following methods :
                </Text>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    fontSize: 16,

                    marginBottom: width / 13,
                    marginLeft: width / 60,
                    color: "grey",
                  }}
                >
                  1. Type the BarCode number of your product food on the search
                  box above.
                </Text>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    fontSize: 16,

                    marginBottom: width / 13,
                    marginLeft: width / 60,
                    color: "grey",
                  }}
                >
                  2. Or by scanning the food's barcode(if the food carries the
                  barcode) after clicking on the barcode icon above{"  "}
                  <MaterialCommunityIcons name="barcode-scan" size={21} />
                </Text>
              </View>
            </ImageBackground>
          </View>
        ) : (
          <View style={{ backgroundColor: "white" }}>
            <ScrollView>
              {filteredbarcode.length != 0 ? (
                filteredbarcode.map((item) => {
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
                            "Details",
                            {
                              data: [item],
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
                                {item.barcode}
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
                              </Text>
                              <MaterialIcons
                                name="local-fire-department"
                                size={20}
                                color="orange"
                              ></MaterialIcons>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginTop: width / 13 }}>
                        <MaterialIcons
                          name="chevron-right"
                          size={37}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <View>
                  <ImageBackground
                    style={{ width: "100%", height: "90%" }}
                    source={{
                      uri: "https://i.pinimg.com/originals/11/c4/b6/11c4b6bc7c512033687f9efcb399fd6c.jpg",
                    }}
                    imageStyle={{
                      opacity: 0.1,
                      resizeMode: "contain",
                    }}
                  >
                    <Text
                      style={{
                        paddingTop: width / 2,
                        paddingBottom: height,
                        fontSize: width / 20,
                        fontFamily: "balsam-f",
                        paddingLeft: width / 3,
                      }}
                    >
                      No item Found
                    </Text>
                  </ImageBackground>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const SearchbyBarCode = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [datas, setdatas] = useState([]);
  const barcode = route.params.barcode;
  let user = route.params.user; //this contain the user name which come from footer
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const tmp = data;
    const tempList = barcode.filter((item) => {
      if (item.barcode.match(tmp)) {
        return item;
      }
    });
    setdatas(tempList);
    if (tempList.length == 0)
      Alert.alert("Item does not found", "Do you want to add it ?", [
        {
          text: "Yes",
          onPress: () =>
            navigation.navigate("Add", {
              data: data,
              user: user,
            }),
          style: "cancel",
        },
        { text: "No" },
      ]);
    else {
      navigation.navigate("Details", {
        data: tempList,
      });
    }

    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}
      >
        <View style={styles.layerTop}>
          <Text style={styles.description}>Scan your Barcode</Text>
        </View>
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom}>
          <Text
            onPress={() => navigation.navigate("Decide")}
            style={styles.cancel}
          >
            Cancel
          </Text>
        </View>
      </BarCodeScanner>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};
const Add = ({ navigation, route }) => {
  const data = route.params.data;
  let user = route.params.user; //this contain the user name which come from footer
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  var randomString = require("random-string");
  const toggleModal1 = () => {
    setModalVisible1(!isModalVisible1);
  };
  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };

  var x1 = randomString({
    length: 8,
    numeric: true,
    letters: true,
    special: false,
  });
  var x2 = randomString({
    length: 8,
    numeric: true,
    letters: true,
    special: false,
  });

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const pickImage = async (flag) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    // alert(result.base64);

    if (!result.cancelled) {
      if (flag == 1) setImage1(result);
      else setImage2(result);
    }
    // console(image1);
  };

  const pickImageCamera = async (flag) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    //console.log(result.base64);

    if (!result.cancelled) {
      if (flag == 1) setImage1(result);
      else setImage2(result);
    }
  };

  const renderInner1 = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => pickImageCamera(1)}
      >
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={() => pickImage(1)}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
    </View>
  );
  const renderInner2 = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => pickImageCamera(2)}
      >
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={() => pickImage(2)}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
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

  const connect = () => {
    console.log(image1);
    fetch("http://192.168.1.110:4008/sendreqBarcode", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        img1: image1.base64,
        username: user,
        name1: x1,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          fetch("http://192.168.1.110:4008/sendreqBarcode2", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              barcode: data,
              img2: image2.base64,
              username: user,
              name1: x1,
              name2: x2,
            }),
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.success === true) {
                alert(res.message);
                // alert("Thank you. We will answer your request as soon as possible");
                navigation.navigate("Decide");
              } else {
                alert("sth wrong");
              }
            })
            .done();
          /*  alert(res.message);
          // alert("Thank you. We will answer your request as soon as possible");
          navigation.navigate("Decide");*/
        } else {
          alert("sth wrong");
        }
      })
      .done();
  };

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        ref={bs}
        snapPoints={[231, 0]}
        renderContent={renderInner1}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}
      ></Animated.View>
      <BottomSheet
        ref={bs2}
        snapPoints={[231, 0]}
        renderContent={renderInner2}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall2}
        enabledGestureInteraction={true}
      />
      <SafeAreaView>
        <View
          style={{
            backgroundColor: "white",
            height: width / 8,
            flexDirection: "row",
          }}
        >
          <View style={{}}>
            <TouchableOpacity
              style={{
                // backgroundColor: "yellow",
                width: width / 8,
              }}
              onPress={() => navigation.navigate("Decide")}
            >
              <AntDesign
                name="left"
                size={22}
                color="black"
                style={{
                  paddingLeft: width / 45,
                  flexDirection: "row",
                  alignContent: "right",
                  paddingRight: width / 2,
                  paddingTop: width / 30,
                }}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: width / 25,
              marginTop: width / 25,
              justifyContent: "center",
              fontFamily: "balsam-f",
              marginLeft: width / 6,
              // backgroundColor: "red",
            }}
          >
            Adding food suggestion
          </Text>
          <TouchableOpacity
            disabled={image1 == null || image2 == null ? true : false}
            onPress={() => connect()}
          >
            <Text
              style={[
                styles.buttonSend,
                image1 == null || image2 == null
                  ? styles.disable
                  : styles.enable,
              ]}
            >
              Send
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewscreen6}>
          <Text
            style={{
              fontFamily: "balsam-f",
              fontSize: width / 20,
              color: "goldenrod",
              marginLeft: width / 28,
              marginTop: width / 20,
            }}
          >
            Please send your food details to be added by us
          </Text>
          <View style={{ flexDirection: "row", marginTop: width / 15 }}>
            <Text
              style={{
                fontFamily: "balsam-f",
                fontSize: width / 25,
                color: "goldenrod",
                marginLeft: width / 28,
              }}
            >
              BarCode :{" "}
            </Text>
            <Text style={{ fontFamily: "balsam-f", fontSize: width / 25 }}>
              {data}
            </Text>
          </View>
          <View style={styles.viewscreen66}>
            <Text
              style={{
                fontFamily: "balsam-f",
                fontSize: width / 23,
                marginLeft: width / 20,
                marginTop: width / 20,
                color: "#2E9298",
              }}
            >
              if the food is a ready-made product please confirm the following
              data:
            </Text>
            <Text style={{ color: "lightgrey", marginTop: width / 25 }}>
              ________________________________________________________
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: width / 70,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    fontSize: width / 25,
                    marginLeft: width / 10,
                    marginTop: width / 20,
                  }}
                >
                  Product image from the front{" "}
                </Text>
                <TouchableOpacity onPress={toggleModal1}>
                  <Text
                    style={{
                      fontFamily: "balsam-f",
                      fontSize: width / 25,
                      marginLeft: width / 10,
                      marginTop: width / 23,
                    }}
                  >
                    Show example
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                  style={{
                    marginLeft: width / 8.5,
                    backgroundColor: "goldenrod",
                    width: width / 7,
                    height: width / 12,
                    borderRadius: 10,
                    marginTop: width / 27,
                  }}
                  onPress={() => bs.current.snapTo(0)}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        paddingTop: width / 50,
                        color: "white",
                      }}
                    >
                      Enter
                    </Text>
                  </View>
                </TouchableOpacity>
                <View>
                  {image1 != null ? (
                    <Image
                      source={{ uri: `data:image/gif;base64,${image1.base64}` }}
                      style={{
                        width: width / 8,
                        height: width / 8,
                        borderRadius: 15,
                        marginLeft: width / 8.5,
                        marginTop: width / 45,
                      }}
                      //style={styles.image}
                      //resizeMode="contain"
                    ></Image>
                  ) : (
                    <Image
                      source={require("../assets/product-default.jpg")}
                      // style={styles.image}
                      style={{
                        width: width / 8,
                        height: width / 8,
                        borderRadius: 15,
                        marginLeft: width / 8.5,
                        marginTop: width / 45,
                      }}
                      // resizeMode="contain"
                    ></Image>
                  )}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Modal isVisible={isModalVisible2}>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      alignContent: "center",
                      marginBottom: width / 20,
                    }}
                    onPress={toggleModal2}
                  >
                    <AntDesign name="closecircleo" size={35}></AntDesign>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: height / 1.5,
                      backgroundColor: "white",
                    }}
                  >
                    <Image
                      style={{ width: "100%", height: "100%" }}
                      source={require("../assets/nutellaBack.jpg")}
                    ></Image>
                  </View>
                </Modal>
              </View>
            </View>
            <Text style={{ color: "lightgrey", marginTop: width / 25 }}>
              ________________________________________________________
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: width / 25,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    fontSize: width / 25,
                    marginLeft: width / 10,
                    marginTop: width / 20,
                  }}
                >
                  Product image from back contain
                </Text>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    fontSize: width / 25,
                    marginLeft: width / 10,
                    color: "red",
                  }}
                >
                  {"Nutrition facts & ingredients"}
                </Text>
                <TouchableOpacity onPress={toggleModal2}>
                  <Text
                    style={{
                      fontFamily: "balsam-f",
                      fontSize: width / 25,
                      marginLeft: width / 10,
                      marginTop: width / 15,
                    }}
                  >
                    Show example
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                  style={{
                    marginLeft: width / 20,
                    backgroundColor: "goldenrod",
                    width: width / 7,
                    height: width / 12,
                    borderRadius: 10,
                    marginTop: width / 27,
                  }}
                  onPress={() => bs2.current.snapTo(0)}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "balsam-f",
                        paddingTop: width / 50,
                        color: "white",
                      }}
                    >
                      Enter
                    </Text>
                  </View>
                </TouchableOpacity>
                <View>
                  {image2 != null ? (
                    <Image
                      source={{ uri: `data:image/gif;base64,${image2.base64}` }}
                      //style={styles.image}
                      //resizeMode="contain"
                      style={{
                        width: width / 8,
                        height: width / 8,
                        borderRadius: 15,
                        marginLeft: width / 20,
                        marginTop: width / 45,
                      }}
                    ></Image>
                  ) : (
                    <Image
                      source={require("../assets/product-default.jpg")}
                      // style={styles.image}
                      style={{
                        width: width / 8,
                        height: width / 8,
                        borderRadius: 15,
                        marginLeft: width / 20,
                        marginTop: width / 45,
                      }}
                      // resizeMode="contain"
                    ></Image>
                  )}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Modal isVisible={isModalVisible1}>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      alignContent: "center",
                      marginBottom: width / 20,
                    }}
                    onPress={toggleModal1}
                  >
                    <AntDesign name="closecircleo" size={35}></AntDesign>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: height / 1.5,
                      backgroundColor: "white",
                    }}
                  >
                    <Image
                      style={{ width: "100%", height: "100%" }}
                      source={require("../assets/nutella.jpg")}
                    ></Image>
                  </View>
                </Modal>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
const Details = ({ navigation, route }) => {
  const data = route.params.data;
  console.log(data);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: "white",
          height: width / 8,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignContent: "right",
            paddingRight: width / 5,
            paddingTop: width / 25,
          }}
        >
          <AntDesign
            name="left"
            size={18}
            color="black"
            style={{ paddingLeft: width / 45 }}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Decide")}>
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
        <Text
          style={{
            fontSize: width / 18,
            marginTop: width / 40,
            justifyContent: "center",
          }}
        >
          Details
        </Text>
      </View>
      <View style={styles.viewscreen5}>
        {data.map((item) => {
          return (
            <View>
              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingTop: width / 80,
                  fontFamily: "balsam-f",
                  marginBottom: width / 13,
                  fontSize: width / 17,
                  color: "black",
                  textAlign: "center",
                }}
              >
                {item.name}
              </Text>
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
                    width: width / 2.3,
                    height: width / 2.3,
                    borderRadius: 15,
                  }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    //borderBottomWidth: 1,
                    marginTop: width / 900,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingTop: 5,
                        fontFamily: "balsam-f",
                        color: "red",
                      }}
                    >
                      {"Brand      :"}
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingTop: 5,
                        fontFamily: "balsam-f",
                        color: "black",
                      }}
                    >
                      {item.brand}
                    </Text>
                  </View>

                  <View
                    style={{ flexDirection: "row", marginBottom: width / 13 }}
                  >
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingTop: 5,
                        fontFamily: "balsam-f",
                        color: "red",
                      }}
                    >
                      {"BarCode :"}
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingTop: 5,
                        fontFamily: "balsam-f",
                        color: "black",
                      }}
                    >
                      {item.barcode}
                    </Text>
                  </View>
                  <View style={{ width: width / 2.5 }}>
                    <TouchableOpacity
                      style={{
                        borderColor: "red",
                        borderWidth: 1,
                        borderRadius: 10,
                        textAlign: "center",
                        marginLeft: width / 18,
                      }}
                      onPress={toggleModal}
                    >
                      <Modal isVisible={isModalVisible}>
                        <View
                          style={{
                            //flex: 1,
                            backgroundColor: "white",
                            height: height / 2,
                            shadowOpacity: 0.5,
                            borderRadius: 5,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "balsam-f",
                                marginTop: width / 25,
                                fontSize: width / 20,
                                paddingLeft: 8,
                                color: "#2E9298",
                                height: width / 8,
                              }}
                            >
                              Ingredients
                            </Text>
                            <TouchableOpacity
                              style={{
                                alignItems: "center",
                                alignContent: "center",
                                marginBottom: width / 20,
                                //marginTop: width / 4,
                                marginLeft: width / 1.85,
                              }}
                              onPress={toggleModal}
                            >
                              <AntDesign name="close" size={30}></AntDesign>
                            </TouchableOpacity>
                          </View>

                          <FlatList
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            ScrollEnabled={false}
                            renderItem={({ item }) => (
                              <View>
                                {item.ingredients
                                  .split(" ,")
                                  .map((item, key) => (
                                    <View>
                                      <Text
                                        style={{
                                          fontSize: 17,
                                          fontWeight: "bold",
                                          color: "black",
                                          fontFamily: "balsam-f",
                                        }}
                                      >
                                        {" "}
                                        <FontAwesome
                                          name="circle-o"
                                          size={15}
                                          color="goldenrod"
                                        ></FontAwesome>
                                        {" " + item}
                                        {"\n"}
                                      </Text>
                                    </View>
                                  ))}
                              </View>
                            )}
                          />
                        </View>
                      </Modal>

                      <Text
                        style={{
                          marginHorizontal: 10,
                          paddingTop: 5,
                          fontFamily: "balsam-f",
                          color: "red",
                          textAlign: "center",
                        }}
                      >
                        View Ingredients
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: width / 15,
                  fontFamily: "balsam-f",
                  color: "black",
                  fontSize: width / 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "lightgrey",
                  paddingBottom: width / 23,
                }}
              >
                Nutrition facts
              </Text>
              <View style={{ flexDirection: "coulmn" }}>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    {"Calories          "}
                  </Text>

                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    {item.calories}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "black",
                    }}
                  >
                    {"Fat                   "}
                  </Text>
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "black",
                    }}
                  >
                    {item.fat}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    {"Carbohydrates"}
                  </Text>
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    {item.carbohydrate}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "black",
                    }}
                  >
                    {"Protein             "}
                  </Text>
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "black",
                    }}
                  >
                    {item.protein}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    {"Salt                  "}
                  </Text>
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "goldenrod",
                    }}
                  >
                    {item.salt}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "black",
                    }}
                  >
                    {"Fiber                "}
                  </Text>
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 5,
                      fontFamily: "balsam-f",
                      color: "black",
                    }}
                  >
                    {item.fiber}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();
function ScanScreen({ route }) {
  const name = route.params.user;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Decide"
        component={Decide}
        initialParams={{
          user: name,
        }}
      />

      <Stack.Screen
        name="SearchbyBarCode"
        component={SearchbyBarCode}
        initialParams={{
          user: name,
        }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        initialParams={{
          user: name,
        }}
      />
      <Stack.Screen
        name="Add"
        component={Add}
        initialParams={{
          user: name,
        }}
      />
    </Stack.Navigator>
  );
}

export default ScanScreen;
const opacity = "rgba(0, 0, 0, .6)";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  textInput: {
    backgroundColor: "gainsboro",
    width: width / 1.56,
    height: width / 10,
    // marginTop: width / 60,
    borderRadius: 6,
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "balsam-f",
    marginLeft: width / 35,
    //marginHorizontal: width / 28,
  },
  viewscreen4: {
    backgroundColor: "white",
    width: width / 1.08,
    height: height / 1.75,
    marginLeft: width / 25,
    marginTop: width / 30,
    shadowColor: "black",
    shadowOpacity: 0.3,
    borderRadius: 8,
    shadowRadius: 5,
  },
  viewscreen5: {
    backgroundColor: "white",
    width: width / 1.08,
    height: height,
    marginLeft: width / 25,
    marginTop: width / 30,
    shadowColor: "black",
    shadowOpacity: 0.3,
    borderRadius: 8,
    shadowRadius: 5,
  },
  viewscreen6: {
    backgroundColor: "white",
    width: width,
    height: height,
    marginTop: width / 35,
  },
  viewscreen66: {
    backgroundColor: "white",
    width: width / 1.08,
    height: height / 1.75,
    marginTop: width / 30,
    shadowColor: "black",
    shadowOpacity: 0.2,
    borderRadius: 8,
    shadowRadius: 5,
    marginLeft: width / 25,
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 5,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity,
  },
  description: {
    fontSize: width * 0.09,
    marginTop: "10%",
    textAlign: "center",
    color: "white",
    marginLeft: width / 25,
  },
  cancel: {
    fontSize: width * 0.05,
    marginLeft: width / 150,
    color: "white",
    textAlign: "center",
    marginTop: "10%",
  },
  panel: {
    fontFamily: "balsam-f",
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  header: {
    fontFamily: "balsam-f",
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    fontFamily: "balsam-f",
    alignItems: "center",
  },
  panelHandle: {
    fontFamily: "balsam-f",
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontFamily: "balsam-f",
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontFamily: "balsam-f",
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    fontFamily: "balsam-f",
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#2E9298",
    alignItems: "center",
    marginVertical: 6,
    width: width / 1.3,
    marginLeft: width / 18,
  },
  panelButtonTitle: {
    fontFamily: "balsam-f",
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  buttonSend: {
    fontSize: width / 25,
    marginTop: width / 25,
    justifyContent: "center",
    fontFamily: "balsam-f",
    marginLeft: width / 6.5,
  },
  enable: {
    color: "rgb(0, 122, 255)",
  },
  disable: {
    color: "rgba(0, 122, 255, .5)",
  },
});

/* <Stack.Screen name="ProductDetails" component={ProductDetails} /> <Stack.Screen name="searchbyTyping" component={SearchbyTyping} /> */
/*<TouchableOpacity
              style={{
                marginLeft: width / 8.5,
                backgroundColor: "goldenrod",
                width: width / 7,
                height: width / 12,
                borderRadius: 10,
                marginTop: width / 27,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "balsam-f",
                    paddingTop: width / 50,
                    color: "white",
                  }}
                >
                  Enter
                </Text>
              </View>
            </TouchableOpacity>*/
