import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "./screens/OnboardingScreen";
import Start from "./screens/Start";
import Passreset from "./screens/Passreset";
import AsyncStorage from "@react-native-community/async-storage";
import TargetScreen from "./screens/TargetScreen";
import DrawerScreen from "./screens/DrawerScreen";
//import AsyncStorage from "@react-native-async-storage/async-storage";

const AppStack = createStackNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch == null) {
    return null;
  } else if (isFirstLaunch == true) {
    return (
      <NavigationContainer>
        <AppStack.Navigator headerMode="none">
          <AppStack.Screen name="Onboarding" component={OnboardingScreen} />
          <AppStack.Screen name="Start" component={Start} />
          <AppStack.Screen name="Target" component={TargetScreen} />
          <AppStack.Screen name="Passreset" component={Passreset} />
          <AppStack.Screen name="DrawerScreen" component={DrawerScreen} />
        </AppStack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <AppStack.Navigator headerMode="none">
          <AppStack.Screen name="Onboarding" component={OnboardingScreen} />
          <AppStack.Screen name="Start" component={Start} />
          <AppStack.Screen name="Target" component={TargetScreen} />
          <AppStack.Screen name="Passreset" component={Passreset} />
          <AppStack.Screen name="DrawerScreen" component={DrawerScreen} />
        </AppStack.Navigator>
      </NavigationContainer>
    );
    //return <Start />;
  }
};

export default App;
