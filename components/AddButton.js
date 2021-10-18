import React, { Component } from "react";
import {
  TouchableOpacity,
  Animated,
  Easing,
  View,
  StyleSheet,
  Alert,
  Text,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
// constants
import {
  center,
  topCenter,
  topLeft,
  topRight,
  bigBubbleSize,
  smallBubbleSize,
  bubbleColor,
  animateTime,
  easingType,
  delay,
  topCenter2,
} from "./constants";

class AddButton extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.topLeftValue = new Animated.Value(0);
    this.topCenterValue = new Animated.Value(0);
    this.topRightValue = new Animated.Value(0);
    this.state = {
      pressed: false,
    };
  }

  handleAddButtonPress = () => {
    let { pressed } = this.state;
    if (pressed) {
      this.animateReverse(0);
    } else {
      this.animate(1);
    }
    this.setState({ pressed: !pressed });
  };

  animate = (toValue) => {
    Animated.stagger(delay, [
      Animated.parallel([
        Animated.timing(this.animatedValue, {
          toValue,
          duration: animateTime,
          easing: Easing.exp,
        }),
        Animated.timing(this.topLeftValue, {
          toValue,
          duration: animateTime,
          easing: easingType,
        }),
      ]),
      Animated.timing(this.topCenterValue, {
        toValue,
        duration: animateTime,
        easing: easingType,
      }),
      Animated.timing(this.topRightValue, {
        toValue,
        duration: animateTime,
        easing: easingType,
      }),
    ]).start();
  };

  animateReverse = (toValue) => {
    Animated.stagger(delay, [
      Animated.timing(this.topRightValue, {
        toValue,
        duration: animateTime,
        easing: easingType,
      }),
      Animated.timing(this.topCenterValue, {
        toValue,
        duration: animateTime,
        easing: easingType,
      }),
      Animated.parallel([
        Animated.timing(this.animatedValue, {
          toValue,
          duration: animateTime,
          easing: easingType,
        }),
        Animated.timing(this.topLeftValue, {
          toValue,
          duration: animateTime,
          easing: easingType,
        }),
      ]),
    ]).start();
  };

  render() {
    let springValue = Animated.add(
      Animated.add(this.topLeftValue, this.topRightValue),
      this.topCenterValue
    );

    return (
      <View>
        <Animated.View
          style={[
            style.bigBubble,
            {
              transform: [
                {
                  rotateZ: springValue.interpolate({
                    inputRange: [0, 1, 2, 3],
                    outputRange: ["-45deg", "-45deg", "0deg", "45deg"],
                  }),
                },
                {
                  scaleY: springValue.interpolate({
                    inputRange: [0, 0.65, 1, 1.65, 2, 2.65, 3],
                    outputRange: [1, 1.1, 1, 1.1, 1, 1.1, 1],
                  }),
                },
              ],

              shadowOpacity: 0.05,
            },
          ]}
        >
          <TouchableOpacity
            hitSlop={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
            onPress={this.handleAddButtonPress}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    rotateZ: springValue.interpolate({
                      inputRange: [0, 1, 2, 3],
                      outputRange: ["45deg", "45deg", "45deg", "0deg"],
                    }),
                  },
                ],
              }}
            >
              <FontAwesome5 name="plus" size={25} color="#FFF" />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            style.smallBubble,
            {
              position: "absolute",
              transform: [
                {
                  translateX: this.topLeftValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [center.left, topLeft.left],
                  }),
                },
                {
                  translateY: this.topLeftValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [center.top, topLeft.top],
                  }),
                },
                {
                  rotateZ: this.topLeftValue.interpolate({
                    inputRange: [0, 0.6, 1],
                    outputRange: ["-90deg", "-45deg", "0deg"],
                  }),
                },
                {
                  scaleY: this.topLeftValue.interpolate({
                    inputRange: [0, 0.8, 0.9, 1],
                    outputRange: [1, 1.5, 1.5, 1],
                  }),
                },
              ],
              opacity: this.topLeftValue,
              zIndex: -1,
            },
          ]}
        >
          <TouchableOpacity
            hitSlop={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
            onPress={() => this.props.navigation.navigate("Train")}
          >
            <FontAwesome5 name="dumbbell" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 10, fontWeight: "500" }}>
            Train
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            style.smallBubble,
            {
              position: "absolute",
              transform: [
                {
                  translateX: this.topCenterValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [center.left, topCenter.left],
                  }),
                },
                {
                  translateY: this.topCenterValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [center.top, topCenter.top],
                  }),
                },
                {
                  scaleY: this.topCenterValue.interpolate({
                    inputRange: [0, 0.8, 0.9, 1],
                    outputRange: [1, 1.5, 1.5, 1],
                  }),
                },
              ],
              opacity: this.topCenterValue,
              zIndex: -1,
            },
          ]}
        >
          <TouchableOpacity
            hitSlop={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
            onPress={() => this.props.navigation.navigate("FavScreen")}
          >
            <MaterialIcons name="favorite-border" size={25} color="#FFF" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 10, fontWeight: "500" }}>
            Favorite
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            style.smallBubble,
            {
              position: "absolute",
              transform: [
                {
                  translateX: this.topCenterValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [center.top, topCenter2.left],
                  }),
                },
                {
                  translateY: this.topCenterValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [center.left, topCenter2.top],
                  }),
                },

                {
                  scaleY: this.topCenterValue.interpolate({
                    inputRange: [0, 0.8, 0.9, 1],
                    outputRange: [1, 1.5, 1.5, 1],
                  }),
                },
              ],
              opacity: this.topCenterValue,
              zIndex: -1,
            },
          ]}
        >
          <TouchableOpacity
            hitSlop={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
            onPress={() => this.props.navigation.navigate("store")}
          >
            <AntDesign name="shoppingcart" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 10, fontWeight: "500" }}>
            Cart
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            style.smallBubble,
            {
              position: "absolute",
              transform: [
                {
                  translateX: this.topRightValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [center.left, topRight.left],
                  }),
                },
                {
                  translateY: this.topRightValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [center.top, topRight.top],
                  }),
                },
                {
                  rotateZ: this.topRightValue.interpolate({
                    inputRange: [0, 0.6, 1],
                    outputRange: ["90deg", "45deg", "0deg"],
                  }),
                },
                {
                  scaleY: this.topRightValue.interpolate({
                    inputRange: [0, 0.8, 0.9, 1],
                    outputRange: [1, 1.5, 1.5, 1],
                  }),
                },
              ],
              opacity: this.topRightValue,
              zIndex: -1,
            },
          ]}
        >
          <TouchableOpacity
            hitSlop={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
            onPress={() => this.props.navigation.navigate("recipes")}
          >
            <Ionicons name="restaurant-outline" size={25} color="#FFF" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 10, fontWeight: "500" }}>
            Recipe
          </Text>
        </Animated.View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  bigBubble: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bubbleColor,
    height: bigBubbleSize,
    width: bigBubbleSize,
    borderRadius: bigBubbleSize / 2,
  },
  smallBubble: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bubbleColor,
    height: smallBubbleSize,
    width: smallBubbleSize,
    borderRadius: smallBubbleSize / 1.5,
  },
});

export default AddButton;
