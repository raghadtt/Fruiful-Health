import React, { useState, useEffect, useRef } from "react";
import {
  View,
  AppState,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Keyboard,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import ProfileHeader from "react-native-profile-header";
import { LinearGradient } from "expo-linear-gradient";
import { SliderBox } from "react-native-image-slider-box";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import Feather from "react-native-vector-icons/Feather";
import WebView from "react-native-webview";
import useFocusEffect from "react-navigation-app-state-aware-focus-effect";
import moment from "moment";
import ModernHeader from "react-native-modern-header";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import CheckBox from "react-native-check-box";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import Material from "react-native-vector-icons/MaterialIcons";
import CountDown from "react-native-countdown-component";
import { Audio } from "expo-av";
import * as Notification from "expo-notifications";
import * as Permission from "expo-permissions";
import { Pedometer } from "expo-sensors";

import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";

const { width, height } = Dimensions.get("window");

const fetchFont = () => {
  return Font.loadAsync({
    "pac-f": require("../assets/fonts/Pacifico.ttf"),
    "balsam-f": require("../assets/fonts/BalsamiqSans-Regular.ttf"),
    Kaushan: require("../assets/fonts/KaushanScript-Regular.ttf"),
  });
};

Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

const Stack = createStackNavigator();

const Home = ({ navigation, route }) => {
  const user = route.params.user;
  const level = route.params.level;
  var cal = route.params.cal;
  var start = route.params.start;
  var end = route.params.end;
  var week = route.params.week;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Main"
        component={Main}
        initialParams={{
          user: user,
          level: level,
          cal: cal,
          start: start,
          end: end,
          week: week,
        }}
      />
      <Stack.Screen
        name="recipeDetails"
        component={recipeDetails}
        options={({ navigation }) => ({})}
      />
      <Stack.Screen
        name="ChangeSize"
        component={ChangeSize}
        options={({ navigation }) => ({})}
      />
      <Stack.Screen
        name="SearchbyBarCode"
        component={SearchbyBarCode}
        options={({ navigation }) => ({})}
      />
      <Stack.Screen
        name="trainDetails"
        component={trainDetails}
        initialParams={{ user: user }}
        options={({ navigation }) => ({})}
      />
      <Stack.Screen
        name="Timer"
        component={Timer}
        initialParams={{ user: user }}
        options={({ navigation }) => ({})}
      />
    </Stack.Navigator>
  );
};
export default Home;

const Main = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  //-------------------------notification------------------//
  const [Notifications, setNotifications] = React.useState([]);
  const [tips, setTips] = React.useState([]);
  const [meals, setMeals] = React.useState([]);
  const [pastStepCount, setpastStepCount] = React.useState(0); //steps
  var _subscription; //steps

  async function fetchNotif() {
    const response = await fetch("http://192.168.1.110:4008/notifi");
    const data = await response.json();
    setNotifications(data);

    data.map((item) => {
      if (item.title == "Tips and advise") {
        tips.push(item);
      } else {
        meals.push(item);
      }
    });
    _subscribe();
  }

  const _subscribe = () => {
    _subscription = Pedometer.watchStepCount();

    Pedometer.isAvailableAsync();

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      (result) => {
        _unsubscribe();
        if (days == 0) handleNotif(meals, tips, result.steps);
        else handleNotif2(tips, result.steps);
      },
      (error) => {
        setpastStepCount("Could not get stepCount: " + error);
      }
    );
  };

  const _unsubscribe = () => {
    _subscription && _subscription.remove();
    _subscription = null;
  };

  function Notifperm() {
    Permission.getAsync(Permission.NOTIFICATIONS)
      .then((response) => {
        if (response.status !== "granted") {
          return Permission.askAsync(Permission.NOTIFICATIONS);
        }
        return response;
      })
      .then((response) => {
        if (response.status !== "granted") {
          return;
        }
      });
    fetchNotif();
  }

  const handleNotif = (mealss, tipss, steps) => {
    var i = Math.floor(Math.random() * 9) + 1;
    mealss.map((item) => {
      Notification.scheduleNotificationAsync({
        content: {
          title: item.title,
          body: item.body,
        },
        trigger: {
          hour: item.hour,
          minute: item.minute,
          repeats: true,
        },
      });
    });

    //Tips and advise
    Notification.scheduleNotificationAsync({
      content: {
        title: tipss[i].title,
        body: tipss[i].body,
      },
      trigger: {
        hour: tipss[i].hour,
        minute: tipss[i].minute,
      },
    });

    // water
    Notification.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: "Time to hydrate, Drink water!",
      },
      trigger: {
        seconds: 60 * 60,
        repeats: true,
      },
    });

    //Steps
    Notification.scheduleNotificationAsync({
      content: {
        title: "Step Count",
        body: "Steps taken in the last 24 hours: " + steps + " step",
      },
      trigger: {
        hour: 7,
        minute: 0,
      },
    });
  };

  // without repeat
  const handleNotif2 = (tipss, steps) => {
    var i = Math.floor(Math.random() * 9) + 1;
    //Tips and advise
    Notification.scheduleNotificationAsync({
      content: {
        title: tipss[i].title,
        body: tipss[i].body,
      },
      trigger: {
        hour: tipss[i].hour,
        minute: tipss[i].minute,
      },
    });
    //Steps
    Notification.scheduleNotificationAsync({
      content: {
        title: "Step Count",
        body: "Steps taken in the last 24 hours: " + steps + " step",
      },
      trigger: {
        hour: 9,
        minute: 30,
      },
    });
  };

  //---------- App state / fetching when open the app ----------
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  //------------------------------------------------------------
  const [status, setStatus] = React.useState({});
  const [fontLoaded, setfontLoaded] = React.useState(false);
  var finished = 0;
  const user = route.params.user;
  const week = route.params.week;
  const level = route.params.level;
  var cal = route.params.cal;
  var todayCal = cal;
  //-------------------- In General ---------------------------------------//
  var start = route.params.start;
  var end = route.params.end;
  var today = moment(new Date()).format("YYYY-MM-DD");
  var diff = new Date(today).getTime() - new Date(start).getTime();
  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  var PrevCal = 0;
  var ExerCal = 0;
  var day1;
  var day2;
  var b1 = "none";
  var l1 = "none";
  var d1 = "none";
  var s1 = "none";
  var b2 = "none";
  var l2 = "none";
  var d2 = "none";
  var s2 = "none";
  var Extra = 0;
  var prevDay;
  var prevDay2;
  const [C, setC] = useState([]);

  async function fetchPrev() {
    const response = await fetch(
      "http://192.168.1.110:4008/tracking?user=" + user
    );
    const info = await response.json();

    PrevCal = info[info.length - 1].additional;
    Extra = info[info.length - 1].extra;
    prevDay = info[info.length - 1].day;

    if (days > 1 && info.length > 1) prevDay2 = info[info.length - 2].day;
    else prevDay2 = 0;

    if (PrevCal > 0) {
      //Prev day calories more than it should be
      cal = cal - PrevCal + Extra;
    } else if (PrevCal < 0) {
      //Prev day calories less than it should be
      cal = cal + PrevCal + Extra;
    } else if (PrevCal == 0) {
      cal = cal + Extra;
    }

    fetchTraining(prevDay, prevDay2);
  }
  //---------------------  Workout  ----------------------------------------//

  const [img0, setimg0] = useState([]);
  const [name0, setname0] = useState([]);
  const [img1, setimg1] = useState([]);
  const [name1, setname1] = useState([]);
  const [img2, setimg2] = useState([]);
  const [name2, setname2] = useState([]);
  var ex1;
  var ex2;
  var ex3;

  async function fetchTraining(previous, previous2) {
    const response = await fetch(
      "http://192.168.1.110:4008/workout?level=" + level
    );
    const works = await response.json();

    setname0(works[0].name);
    setname1(works[1].name);
    setname2(works[2].name);
    setimg0(works[0].img);
    setimg1(works[1].img);
    setimg2(works[2].img);

    ex1 = works[0].name;
    ex2 = works[1].name;
    ex3 = works[2].name;
    cal = works[0].calories + works[1].calories + works[2].calories + cal;

    if (days == 0) {
      // today is the first day
      breakfast();
    } else if (days == 1) {
      // just one day before today
      day1 = days;
      day2 = 0;
      prevent(day1, day2);
    } else if (days > 1) {
      day1 = previous;
      day2 = previous2;
      prevent(day1, day2);
    }
  }

  function prevent(dy1, dy2) {
    fetch("http://192.168.1.110:4008/remove", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        day1: dy1,
        day2: dy2,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        b1 = res.breakfast1;
        l1 = res.lunch1;
        d1 = res.dinner1;
        s1 = res.snacks1;
        b2 = res.breakfast2;
        l2 = res.lunch2;
        d2 = res.dinner2;
        s2 = res.snacks2;
        breakfast();
      })
      .done();
  }

  //--------------------------Calories calculations-------------------------//

  const [bimg, setbimg] = useState([]);
  const [bname, setbname] = useState([]);
  const [bc, setbc] = useState([]);
  const [bflag, setbflag] = useState([]);
  const [limg, setlimg] = useState([]);
  const [lname, setlname] = useState([]);
  const [lc, setlc] = useState([]);
  const [lflag, setlflag] = useState([]);
  const [dimg, setdimg] = useState([]);
  const [dname, setdname] = useState([]);
  const [dc, setdc] = useState([]);
  const [dflag, setdflag] = useState([]);
  const [simg, setsimg] = useState([]);
  const [sname, setsname] = useState([]);
  const [sc, setsc] = useState([]);
  const [sflag, setsflag] = useState([]);
  var b, l, d, s;

  const calculate = (meal) => {
    if (meal === "Breakfast")
      navigation.navigate("recipeDetails", {
        total: cal,
        C: C,
        user: user,
        meal: meal,
        title: bname,
        calorie: bc,
        min: C * 0.25,
        max: C * 0.3,
        today: days + 1,
      });
    else if (meal === "Lunch")
      navigation.navigate("recipeDetails", {
        total: cal,
        C: C,
        user: user,
        meal: meal,
        title: lname,
        calorie: lc,
        min: C * 0.35,
        max: C * 0.4,
        today: days + 1,
      });
    else if (meal === "Dinner")
      navigation.navigate("recipeDetails", {
        total: cal,
        C: C,
        user: user,
        meal: meal,
        title: dname,
        calorie: dc,
        min: C * 0.25,
        max: C * 0.3,
        today: days + 1,
      });
    else if (meal === "Snacks")
      navigation.navigate("recipeDetails", {
        total: cal,
        C: C,
        user: user,
        meal: meal,
        title: sname,
        calorie: sc,
        min: C * 0.05,
        max: C * 0.1,
        today: days + 1,
      });
  };
  var min;
  var max;

  async function breakfast() {
    min = cal * 0.25;
    max = cal * 0.3;

    const response = await fetch(
      "http://192.168.1.110:4008/recipes?meal=Breakfast&cal1=" +
        min +
        "&cal2=" +
        max +
        "&name1=" +
        b1 +
        "&name2=" +
        b2
    );
    // breakfast 30% - 35%
    const meal = await response.json();
    const newPercent = meal[0].calories / cal;
    const extra = 0.3 - newPercent;
    // 40-45% min =count*0.35; max= count*(0.4+extra);
    min = cal * 0.35;
    max = cal * (0.4 + extra);
    b = meal[0].name;
    setbname(meal[0].name);
    setbc(meal[0].calories);
    setbimg(meal[0].image);
    setbflag(meal[0].flag);
    lunch(meal[0].calories);
  }
  async function lunch(bb) {
    const response = await fetch(
      "http://192.168.1.110:4008/recipes?meal=Lunch&cal1=" +
        min +
        "&cal2=" +
        max +
        "&name1=" +
        l1 +
        "&name2=" +
        l2
    );
    const meal = await response.json();
    const newPercent = meal[0].calories / cal;
    const extra = 0.4 - newPercent;
    // 30-35% min =count*0.25; max= count*(0.3+extra);
    setlname(meal[0].name);
    setlc(meal[0].calories);
    setlimg(meal[0].image);
    setlflag(meal[0].flag);
    l = meal[0].name;
    min = cal * 0.2;
    max = cal * (0.3 + extra);
    dinner(bb + meal[0].calories);
  }

  async function dinner(ll) {
    const response = await fetch(
      "http://192.168.1.110:4008/recipes?meal=Dinner&cal1=" +
        min +
        "&cal2=" +
        max +
        "&name1=" +
        d1 +
        "&name2=" +
        d2
    );
    const meal = await response.json();
    const newPercent = meal[0].calories / cal;
    const extra = 0.35 - newPercent;
    d = meal[0].name;
    setdname(meal[0].name);
    setdc(meal[0].calories);
    setdimg(meal[0].image);
    setdflag(meal[0].flag);
    min = cal * 0.05;
    max = cal * (0.1 + extra);
    snacks(ll + meal[0].calories);
  }
  async function snacks(dd) {
    //5% - 10%
    const response = await fetch(
      "http://192.168.1.110:4008/recipes?meal=Snacks&cal1=" +
        min +
        "&cal2=" +
        max +
        "&name1=" +
        s1 +
        "&name2=" +
        s2
    );
    const meal = await response.json();
    s = meal[0].name;
    setsname(meal[0].name);
    setsc(meal[0].calories);
    setsimg(meal[0].image);
    setsflag(meal[0].flag);
    setC(cal);
    inserting(cal, meal[0].calories + dd);
  }
  function inserting(calr, mc) {
    var extra = calr - mc;
    fetch("http://192.168.1.110:4008/insert", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        day: days + 1,
        total: todayCal,
        extra: extra,
        flag: "yes",
        breakfast: b,
        cal: calr,
        lunch: l,
        dinner: d,
        snacks: s,
        ex1: ex1,
        ex2: ex2,
        ex3: ex3,
      }),
    }).done();
  }

  const [lastSeen, setlastSeen] = useState([]);

  function extendCycle(extended, extraDays) {
    var endDate = moment(new Date(extended)).format("YYYY-MM-DD");

    // update end Date
    fetch("http://192.168.1.110:4008/extendCycle", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        end: endDate,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.msg) alert("Cycle extended " + extraDays + " days");
      });

    fetchPrev();
    Notifperm();
  }

  function stop() {
    // insert into finished table
    fetch("http://192.168.1.110:4008/finished", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
      }),
    }).done();

    finished = 1;
  }

  async function activity(time, date) {
    var endOfCycle = new Date(end).getTime() - new Date(today).getTime();
    var dayDiff = Math.floor(endOfCycle / (1000 * 60 * 60 * 24));
    var br, ln, dn, sn;
    var e1, e2, e3;
    const response = await fetch(
      "http://192.168.1.110:4008/last?date=" + date + "&user=" + user
    );
    var last = await response.json();

    const fet = await fetch("http://192.168.1.110:4008/records?&user=" + user);
    var records = await fet.json();

    //if user enters the application after launch time or user doesn't enter in the first day => update start time and end time
    if (records.length == 0 && days > 0 && week != 0) {
      var exStart = moment(new Date(start));
      exStart.add(days, "days");
      exStart = exStart.format("YYYY-MM-DD");

      var exEnd = moment(new Date(end));
      exEnd.add(days, "days");
      exEnd = exEnd.format("YYYY-MM-DD");

      // extend end Date
      fetch("http://192.168.1.110:4008/notFirstDay", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          end: exEnd,
          start: exStart,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.msg)
            alert("Cycle extended one day and Today is your first day");
        });
      days = 0;
    }

    //if user doesn't enter daily and today is not first day and user enters in the first day (always but if enters after launch)
    if (days > 0 && week != 0) {
      var lastDay =
        new Date(today).getTime() -
        new Date(records[records.length - 1].date).getTime();
      var sub = Math.floor(lastDay / (1000 * 60 * 60 * 24));

      if (sub > 1) {
        var more = moment(new Date(end));
        more.add(sub, "days");
        more = more.format("YYYY-MM-DD");

        // extend end Date
        fetch("http://192.168.1.110:4008/extendCycle", {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user,
            end: more,
          }),
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.msg) alert("Cycle extended " + sub + " days");
          });
      }
    }
    //if user finished set flag
    const res = await fetch(
      "http://192.168.1.110:4008/IFfinished?user=" + user
    );
    var resl = await res.json();
    if (resl.length > 0) finished = 1;

    var hours = new Date().getHours(); //To get the Current Hours
    // if user starts the app after launch time

    if (hours > 16 && days == 0 && records.length == 0 && week != 0) {
      var exStart = moment(new Date(start));
      exStart.add(1, "days");
      exStart = exStart.format("YYYY-MM-DD");

      var exEnd = moment(new Date(end));
      exEnd.add(1, "days");
      exEnd = exEnd.format("YYYY-MM-DD");

      // extend end Date
      fetch("http://192.168.1.110:4008/notFirstDay", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          end: exEnd,
          start: exStart,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.msg)
            Alert.alert(
              "Take your time in scrolling Fruitful App \n Your diet cycle will start Tomorrow, Be sure to come tomorrow morning!"
            );
        });
    } else {
      fetch("http://192.168.1.110:4008/activity", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          time: time,
          date: date,
        }),
      }).done(); 

      if (last.length == 0 && days == 0) {
        fetchTraining();
        Notifperm();
      } //first time enters and first day
      else if (dayDiff < 0 && finished == 0 && week != 0) {
        //day after last day && user doesn't finished

        var cd = days + dayDiff; //last day
      
        const response = await fetch(
          "http://192.168.1.110:4008/track?user=" + user + "&day=1" 
        );
        const info = await response.json();

        // calculate extra calories and number of extra days needed
        var extraCal;
        var extraDays;
        var extended = moment(new Date(end));

        if (info[0].additional != 0) {
          extraCal = info[0].additional;
          extraDays = Math.trunc(extraCal / cal);
        }

        extended.add(extraDays, "days");

        if (
          (info[0].done == "yes" && info[0].additional == 0) ||
          extraDays < 1
        ) {
          // last day done and no prev calories or extra calories doesn't reach day
          // if done
          Alert.alert(
            "Cycle ends",
            "Congratulations! You complete the whole period, thanks for choosing us you can come again any time you want just press on restart again.",
            [
              {
                text: "OK",
                //onPress: () => stop(),
                style: "cancel",
              },
            ]
          );
        } else {
          Alert.alert(
            "Cycle ends",
            "You reach the end of the cycle but you don't committed with us. would you like to extend your cycle to reach your goal?",
            [
              {
                text: "Yes, Extend it.",
                onPress: () => extendCycle(extended, extraDays),
                style: "cancel",
              },
              {
                text: "No.",
                onPress: () => stop(),
                style: "cancel",
              },
            ]
          );
        }
      } else if (days != 0 && finished == 0 && last.length == 0) {
        //fisrt time enters and not first day
        fetchPrev();
        Notifperm();
      } else if (last.length != 0 && dayDiff > 0 && finished == 0) {
        //not first time enters and period doesn't end
        const response = await fetch(
          "http://192.168.1.110:4008/today?user=" + user + "&day=" + (days + 1)
        );
        const last = await response.json();
        br = last[0].breakfast;
        ln = last[0].lunch;
        dn = last[0].dinner;
        sn = last[0].snacks;
        e1 = last[0].ex1;
        e2 = last[0].ex2;
        e3 = last[0].ex3;
        setC(last[0].actualCal);

        // meals
        const res = await fetch(
          "http://192.168.1.110:4008/meals?name=" + br + "&meal=Breakfast"
        );
        const info = await res.json();
        setbname(info[0].name);
        setbc(info[0].calories);
        setbimg(info[0].image);
        setbflag(info[0].flag);

        const ress = await fetch(
          "http://192.168.1.110:4008/meals?name=" + ln + "&meal=Lunch"
        );
        const infoo = await ress.json();
        setlname(infoo[0].name);
        setlc(infoo[0].calories);
        setlimg(infoo[0].image);
        setlflag(info[0].flag);

        const resss = await fetch(
          "http://192.168.1.110:4008/meals?name=" + dn + "&meal=Dinner"
        );
        const infooo = await resss.json();
        setdname(infooo[0].name);
        setdc(infooo[0].calories);
        setdimg(infooo[0].image);
        setdflag(info[0].flag);

        const ressss = await fetch(
          "http://192.168.1.110:4008/meals?name=" + sn + "&meal=Snacks"
        );
        const infoooo = await ressss.json();
        setsname(infoooo[0].name);
        setsc(infoooo[0].calories);
        setsimg(infoooo[0].image);
        setsflag(info[0].flag);

        // trainings
        const r = await fetch("http://192.168.1.110:4008/training?name=" + e1);
        const works = await r.json();
        setname0(works[0].name);
        setimg0(works[0].img);
        const rr = await fetch("http://192.168.1.110:4008/training?name=" + e2);
        const workss = await rr.json();
        setname1(workss[0].name);
        setimg1(workss[0].img);
        const rrr = await fetch(
          "http://192.168.1.110:4008/training?name=" + e3
        );
        const worksss = await rrr.json();
        setname2(worksss[0].name);
        setimg2(worksss[0].img);
      }

      if (finished) {
        // get data of last day
        const response = await fetch(
          "http://192.168.1.110:4008/today?user=" +
            user +
            "&day=" +
            (days + dayDiff)
        );
        const last = await response.json();
        br = last[0].breakfast;
        ln = last[0].lunch;
        dn = last[0].dinner;
        sn = last[0].snacks;
        e1 = last[0].ex1;
        e2 = last[0].ex2;
        e3 = last[0].ex3;
        setC(last[0].actualCal);

        // meals
        const res = await fetch(
          "http://192.168.1.110:4008/meals?name=" + br + "&meal=Breakfast"
        );
        const info = await res.json();
        setbname(info[0].name);
        setbc(info[0].calories);
        setbimg(info[0].image);
        const ress = await fetch(
          "http://192.168.1.110:4008/meals?name=" + ln + "&meal=Lunch"
        );
        const infoo = await ress.json();
        setlname(infoo[0].name);
        setlc(infoo[0].calories);
        setlimg(infoo[0].image);
        const resss = await fetch(
          "http://192.168.1.110:4008/meals?name=" + dn + "&meal=Dinner"
        );
        const infooo = await resss.json();
        setdname(infooo[0].name);
        setdc(infooo[0].calories);
        setdimg(infooo[0].image);
        const ressss = await fetch(
          "http://192.168.1.110:4008/meals?name=" + sn + "&meal=Snacks"
        );
        const infoooo = await ressss.json();
        setsname(infoooo[0].name);
        setsc(infoooo[0].calories);
        setsimg(infoooo[0].image);

        // trainings
        const r = await fetch("http://192.168.1.110:4008/training?name=" + e1);
        const works = await r.json();
        setname0(works[0].name);
        setimg0(works[0].img);
        const rr = await fetch("http://192.168.1.110:4008/training?name=" + e2);
        const workss = await rr.json();
        setname1(workss[0].name);
        setimg1(workss[0].img);
        const rrr = await fetch(
          "http://192.168.1.110:4008/training?name=" + e3
        );
        const worksss = await rrr.json();
        setname2(worksss[0].name);
        setimg2(worksss[0].img);
      }
    }
  }
  //-------------------------------------------------------//
  useEffect(() => {

    AppState.addEventListener("change", _handleAppStateChange);
    if (appStateVisible == "active") {
      var time = moment(new Date()).format("HH:mm:SS");
      var date = moment(new Date()).format("YYYY-MM-DD");
      activity(time, date);
    }

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);
  //--------------------------------------------------//
  const DATA = [
    {
      id: "1",
      photo: img0 + "",
      title: "Exercise 1",
      num: "1",
      text: name0,
    },
    {
      id: "2",
      photo: img1 + "",
      title: "Exercise 2",
      num: "2",
      text: name1,
    },
    {
      id: "3",
      photo: img2 + "",
      title: "Exercise 3",
      num: "3",
      text: name2,
    },
  ];
  const DATA1 = [
    {
      id: "1",
      photo: bimg + "",
      title: "Breakfast",
      flag: bflag + "",
    },
    {
      id: "2",
      photo: limg + "",
      title: "Lunch",
      flag: lflag + "",
    },
    {
      id: "3",
      photo: dimg + "",
      title: "Dinner",
      flag: dflag + "",
    },
    {
      id: "4",
      photo: simg + "",
      title: "Snacks",
      flag: sflag + "",
    },
  ];

  const [data] = React.useState({
    images: [
      require("../assets/slideshow/3.jpg"),
      require("../assets/slideshow/1.jpg"),
      require("../assets/slideshow/4.jpg"),
      require("../assets/slideshow/5.jpg"),
      require("../assets/slideshow/2.jpg"),
    ],
  });

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity
      onPress={
        (onPress = () =>
          navigation.navigate("trainDetails", {
            user: user,
            Exname: item.text,
            exernum: item.num,
            appState: appStateVisible,
            lastSeen: lastSeen,
            today: days + 1,
          }))
      }
    >
      <View
        style={{ paddingLeft: 15, width: 280, height: 380, marginRight: 15 }}
      >
        <Image
          source={{ uri: "" + item.photo }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 15,
            borderWidth: 0.2,
            opacity: 0.9,
          }}
        />

        <Text style={styles.train}>{item.title}</Text>
        <Text style={styles.train}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    return <Item item={item} />;
  };

  const renderItem2 = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => calculate(item.title)}>
        <View style={styles.view}>
          <ImageBackground
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            source={{ uri: "" + item.photo }}
            imageStyle={{ opacity: 0.45 }}
          >
            <Text style={styles.recipe}>{item.title}</Text>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  };
  if (fontLoaded) {
    return (
      <SafeAreaView>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "white" }}
        >
          <StatusBar barStyle="dark-content" />
          <ModernHeader
            height={width / 6}
            backgroundColor="#f5f5f5"
            titleStyle={{
              fontSize: width / 12,
              fontWeight: "bold",
              fontFamily: "pac-f",
              marginLeft: width / 15,
            }}
            title="Fruitfull"
            rightDisable={true}
            rightIconType="Ionicons"
            rightIconName="notifications-outline"
            rightIconColor="#2E9298"
            leftIconName="menu-outline"
            leftIconSize={width / 10}
            leftIconColor="black"
            leftIconOnPress={() => navigation.openDrawer()}
          ></ModernHeader>
          <View
            style={{
              borderTopLeftRadius: 80,
              borderBottomRightRadius: 80,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#fffacd", "#e0ffff"]}
              style={{
                height: 280,
                width: "100%",
              }}
            >
              <View style={styles.container}>
                <SliderBox
                  autoplay={true}
                  circleLoop={true}
                  images={data.images}
                  sliderBoxHeight={280}
                />
              </View>
            </LinearGradient>
          </View>

          <View style={{ marginTop: width / 35 }}>
            <Text style={styles.title}>Today's Meals</Text>
            <FlatList
              horizontal
              data={DATA1}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem2}
              keyExtractor={(item2) => item2.id}
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <Text style={styles.title}>Today's Exercises</Text>

            <FlatList
              horizontal
              data={DATA}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>

          <View style={{ marginBottom: 100 }}></View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFont}
        onError={() => console.log("ERROR")}
        onFinish={() => {
          setfontLoaded(true);
        }}
      />
    );
  }
};
//********************************************************************************************************************************************************
const recipeDetails = ({ route, navigation }) => {
  var bs = React.createRef();
  var fall = new Animated.Value(1);
  var bs2 = React.createRef();
  var fall2 = new Animated.Value(1);
  const [data, setData] = useState([]);
  var today = route.params.today;
  var user = route.params.user;
  const [fav, setfav] = useState([]);
  const [fv, setfv] = useState(false);

  //-------------------------- calories calculations----------------------//
  const meal = route.params.meal;
  const title = route.params.title;
  const calorie = route.params.calorie;
  const sizecal = route.params.cal;
  const size = route.params.size;
  const tot = route.params.total;

  const [flag, setflag] = useState(false);
  const [flag2, setflag2] = useState(false);
  const [flag3, setflag3] = useState(false);
  const [flag4, setflag4] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [filtered, setFiltered] = useState(dataSource);
  const [searching, setSearching] = useState(false);
  const [checkboxfilter, setcheckboxfilter] = useState([]);
  const [flagCheck, setflagChecked] = useState([]);
  const [calCheck, setcalChecked] = useState([]);
  const [sizeCheck, setsizeChecked] = useState([]);
  const [ingreds, setingreds] = useState([]);
  const [f, setf] = useState(true);

  async function fetchData(name) {
    const resp = await fetch(
      "http://192.168.1.110:4008/myrecipe?user=" +
        user +
        "&day=" +
        today +
        "&type=" +
        meal
    );
    const ingred = await resp.json();
    setingreds(ingred);
    if (ingred.length != 0) setf(false);
    else {
      const response = await fetch(
        "http://192.168.1.110:4008/meals?name=" + name + "&meal=" + meal
      );
      const info = await response.json();
      setData(info);

      const res = await fetch("http://192.168.1.110:4008/searchIngredients");
      const Ingredients = await res.json();
      setDataSource(Ingredients);
    }
  }

  //***************fav*****************
  async function fetchfavourite() {
    const response = await fetch(
      "http://192.168.1.110:4008/existsInFav?user=" + user + "&type=recipe"
    );
    var Tools = await response.json();

    setfav(Tools);
  }

  useEffect(() => {
    fetchData(title);
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
  //-----------------------------------------------------------------------------//
  const log = (meal) => {
    if (meal == "Breakfast") {
      setflag(true);
    } else if (meal == "Lunch") setflag2(true);
    else if (meal == "Dinner") setflag3(true);
    else if (meal == "Snacks") setflag4(true);
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
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  //---------------------------- seacrh ------------------
  const [imageCheck, setimageChecked] = useState([]);
  const [unitCheck, setunitChecked] = useState([]);
  const [f2, setf2] = useState(true);
  const [add, setadd] = useState(0);

  const handleChange = (box, t, img, cal, size, unit) => {
    let index = flagCheck.indexOf(box);
    let myflag = 0;
    if (index == -1) {
      //not selected
      calCheck.push(cal);
      flagCheck.push(box);
      imageCheck.push(img);
      sizeCheck.push(size);
      unitCheck.push(unit);
      Alert.alert("Ingredient added");
    } else {
      flagCheck.splice(index, 1);
      imageCheck.splice(index, 1);
      calCheck.splice(index, 1);
      sizeCheck.splice(index, 1);
      unitCheck.splice(index, 1);
      Alert.alert("Ingredient removed");
    }
  };

  const onSearch = (text) => {
    Keyboard.dismiss();
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

  async function logmeal(flag) {
    setf2(false);
    fetch("http://192.168.1.110:4008/ownRecipe", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        day: today,
        type: meal,
        ing: flagCheck.join(),
        pic: imageCheck.join(),
        cal: calCheck.join(),
        amount: sizeCheck.join(),
        unit: unitCheck.join(),
      }),
    });
    //add last row inserted
    const res = await fetch(
      "http://192.168.1.110:4008/track?user=" + user + "&day=" + (today - 1)
    );
    const track = await res.json();

    if (track.length > 0) {
      setadd(track[0].additional);
    }

    // update
    fetch("http://192.168.1.110:4008/Uptrack", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        day: today,
        done: flag,
        cal: tot - calorie + calCheck.reduce((a, b) => a + b, 0),
        additional: calCheck.reduce((a, b) => a + b, 0) - calorie + add,
      }),
    });
  }

  function showmess(cal) {
    if (calCheck.reduce((a, b) => a + b, 0) > calorie) {
      Alert.alert(
        "Total Calories",
        "You exceeded the number of calories for today's " +
          meal +
          " do you want to remove some ingredients?",
        [
          {
            text: "No, log my meal",
            onPress: () => logmeal("no"),
            style: "cancel",
          },
          {
            text: "Yes",
            style: "cancel",
          },
        ]
      );
    } else {
      logmeal("yes");
    }
  }
  //------------------------------------------------------
  const [another, setanother] = useState(false);
  const [my, setmy] = useState(false);
  const [recipes, setrecipes] = useState([]);
  var min = route.params.min;
  var max = route.params.max;
  const C = route.params.C;

  async function meals() {
    setanother(true);
    setmy(false);

    const response = await fetch(
      "http://192.168.1.110:4008/recipes?meal=" +
        meal +
        "&cal1=" +
        min +
        "&cal2=" +
        max +
        "&name1=" +
        title +
        "&name2=none"
    );
    const meals = await response.json();

    setrecipes(meals);
  }

  function ownRecipe() {
    setmy(true);
    setanother(false);
  }
  function show(name, calories) {
    Alert.alert(
      "Choosen Recipe",
      "You choose to eat for " +
        meal +
        " (" +
        name +
        ") " +
        "\n\nAre you sure you want this meal ?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes log meal",
          onPress: () => update(name, meal, calories),
          style: "cancel",
        },
      ]
    );
  }
  function update(name, title, c1) {
    var newc = C - calorie + c1;
    fetch("http://192.168.1.110:4008/update2", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        day: today,
        name: name,
        type: title,
        newc: newc,
      }),
    }).catch((error) => {
      alert(error);
    });
    Alert.alert("meal logged");
    fetchData(name);
  }
  //-----------------------------------------------------
  return (
    <View>
      {f ? (
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
                        source={{ uri: item.image }}
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

                      <View style={{ flexDirection: "row", marginTop: 30 }}>
                        <TouchableOpacity onPress={() => meals()}>
                          <Text style={styles.button}>
                            {" "}
                            Choose another meal{" "}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => ownRecipe()}>
                          <Text style={[styles.button]}>
                            {" "}
                            Enter your own recipe{" "}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {f2 && another ? (
                        <ScrollView
                          style={[
                            styles.shadowContainerStyle,
                            { width: 400, margin: 20 },
                          ]}
                        >
                          <FlatList
                            data={recipes}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                              <View style={styles.viewbutton}>
                                <Image
                                  source={{ uri: item.image }}
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
                                    {item.name}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() =>
                                      show(item.name, item.calories)
                                    }
                                  >
                                    <View
                                      style={{
                                        height: 100,
                                        marginLeft: 340,
                                        marginTop: -20,
                                      }}
                                    >
                                      <Ionicons
                                        name="add"
                                        size={24}
                                        color="goldenrod"
                                      >
                                        {" "}
                                      </Ionicons>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          />
                        </ScrollView>
                      ) : null}

                      {my ? (
                        <View
                          style={[
                            styles.shadowContainerStyle,
                            { width: 400, margin: 20 },
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              backgroundColor: "white",
                              alignItems: "center",
                              alignContent: "center",
                              width: width / 1.3,
                              height: width / 5,
                              borderRadius: 15,
                              marginTop: width / 25,
                              paddingLeft: 10,
                              marginLeft: width / 8,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("SearchbyBarCode", {
                                  dataSource: dataSource,
                                  size: sizeCheck,
                                  name: flagCheck,
                                  img: imageCheck,
                                  cal: calCheck,
                                  unit: unitCheck,
                                })
                              }
                            >
                              <MaterialIcons name="barcode-scan" size={25}>
                                {" "}
                              </MaterialIcons>
                            </TouchableOpacity>
                            <AntDesign
                              style={{}}
                              name="search1"
                              size={24}
                              color="black"
                            />
                            <TextInput
                              style={styles.textInput}
                              placeholder={"Search for your Ingredients..."}
                              placeholderTextColor="lightgrey"
                              onChangeText={onSearch}
                            ></TextInput>
                          </View>

                          {searching && (
                            <View style={styles.container}>
                              <ScrollView style={{ height: 300 }}>
                                {filtered.length && f2 ? (
                                  filtered.map((item) => {
                                    return (
                                      <View style={styles.itemView}>
                                        <Image
                                          source={{ uri: item.image }}
                                          style={{
                                            width: width / 8,
                                            height: width / 8,
                                            borderRadius: 15,
                                          }}
                                        />
                                        <CheckBox
                                          style={{
                                            flex: 1,
                                            padding: 12,
                                            paddingLeft: 8,
                                          }}
                                          delayPressIn={0}
                                          leftText={item.name}
                                          onClick={() =>
                                            handleChange(
                                              item.name,
                                              item.type,
                                              item.image,
                                              item.calories,
                                              item.size,
                                              item.unit
                                            )
                                          }
                                          isChecked={
                                            flagCheck.indexOf(item.name) == -1
                                              ? false
                                              : true
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

                          <View style={{ flexDirection: "row" }}>
                            <View>
                              {imageCheck && imageCheck.length > 0
                                ? imageCheck.map((item, key) => (
                                    <View>
                                      <Image
                                        source={{ uri: item }}
                                        style={{
                                          width: 50,
                                          height: 50,
                                          borderRadius: 15,
                                          borderWidth: 0.2,
                                        }}
                                      />
                                      <Text> </Text>
                                    </View>
                                  ))
                                : null}
                            </View>
                            <View style={styles.verticleLine}></View>
                            <View>
                              {flagCheck && flagCheck.length > 0
                                ? flagCheck.map((item, key) => (
                                    <Text key={key} style={styles.category2}>
                                      {" "}
                                      {item}
                                      {"\n"}
                                    </Text>
                                  ))
                                : null}
                            </View>
                            <View style={styles.verticleLine}></View>
                            <View>
                              {calCheck && calCheck.length > 0
                                ? calCheck.map((item, key) => (
                                    <Text key={key} style={styles.category2}>
                                      {" "}
                                      {item}
                                      <MaterialIcons
                                        name="fire"
                                        size="15"
                                        color="orange"
                                      >
                                        {" "}
                                      </MaterialIcons>
                                      {"\n"}{" "}
                                    </Text>
                                  ))
                                : null}
                            </View>
                            <View style={styles.verticleLine}></View>
                            <View>
                              {sizeCheck && sizeCheck.length > 0
                                ? sizeCheck.map((item, key) => (
                                    <View>
                                      <Text key={key} style={styles.category2}>
                                        {" "}
                                        per {item} {"\n"}
                                        <TouchableOpacity
                                          onPress={() =>
                                            navigation.navigate("ChangeSize", {
                                              index: key,
                                              size: sizeCheck,
                                              name: flagCheck,
                                              img: imageCheck,
                                              cal: calCheck,
                                              unit: unitCheck,
                                            })
                                          }
                                        >
                                          <Text style={{ color: "goldenrod" }}>
                                            {" "}
                                            Change Size
                                          </Text>
                                        </TouchableOpacity>
                                      </Text>
                                    </View>
                                  ))
                                : null}
                            </View>
                            <View>
                              {unitCheck && unitCheck.length > 0
                                ? unitCheck.map((item, key) => (
                                    <View>
                                      <Text key={key} style={styles.category2}>
                                        {" "}
                                        {item} {"\n"}
                                      </Text>
                                    </View>
                                  ))
                                : null}
                            </View>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.category2,
                                { textAlign: "center" },
                              ]}
                            >
                              {" "}
                              Total Calories:{" "}
                              {calCheck.reduce((a, b) => a + b, 0)} {"\n\t"}
                              {f2 ? (
                                <TouchableOpacity onPress={() => showmess()}>
                                  <Text
                                    style={[
                                      styles.button2,
                                      { backgroundColor: "goldenrod" },
                                    ]}
                                  >
                                    {" "}
                                    Log my meal
                                  </Text>
                                </TouchableOpacity>
                              ) : null}
                            </Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </Animated.View>
                </View>
              )}
            />
          </SafeAreaView>
        </View>
      ) : (
        <View style={{ backgroundColor: "white" }}>
          <Text
            style={[
              styles.infoRecipeName,
              { marginTop: 100, marginBottom: 50, color: "goldenrod" },
            ]}
          >
            {" "}
            Your today's {meal} {"\n"}
          </Text>
          <FlatList
            data={ingreds}
            keyExtractor={(item, index) => index.toString()}
            ScrollEnabled={false}
            renderItem={({ item }) => (
              <View>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    {item.pic.split(",").map((item, key) => (
                      <View style={{ marginLeft: 10 }}>
                        <Image
                          source={{ uri: item }}
                          style={{
                            width: 55,
                            height: 55,
                            borderRadius: 15,
                            borderWidth: 0.2,
                          }}
                        />
                        <Text> </Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.verticleLine}></View>
                  <View>
                    {item.ingredients.split(",").map((item, key) => (
                      <Text key={key} style={styles.category2}>
                        {" "}
                        {item}
                        {"\n"}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.verticleLine}></View>
                  <View>
                    {item.cal.split(",").map((item, key) => (
                      <Text key={key} style={styles.category2}>
                        {" "}
                        {item}
                        <MaterialIcons name="fire" size="15" color="orange">
                          {" "}
                        </MaterialIcons>
                        {"\n"}{" "}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.verticleLine}></View>
                  <View>
                    {item.amount.split(",").map((item, key) => (
                      <Text key={key} style={styles.category2}>
                        {" "}
                        per {item} {"\n"}
                      </Text>
                    ))}
                  </View>
                  <View>
                    {item.unit.split(",").map((item, key) => (
                      <Text key={key} style={styles.category2}>
                        {" "}
                        {item} {"\n"}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};
//***********************************************************************************************
const ChangeSize = ({ navigation, route }) => {
  const i = route.params.index;
  var size = route.params.size;
  const name = route.params.name;
  const cal = route.params.cal;
  const img = route.params.img;
  const unit = route.params.unit;

  const [amount, setamount] = useState(size[i]);
  const [calorie, setcalorie] = useState(cal[i]);

  function increment() {
    setamount(amount + 1);

    setcalorie(Math.trunc((cal[i] * (amount + 1)) / size[i]));
  }
  function newValue(val) {
    setcalorie(Math.trunc((cal[i] * val) / size[i]));
    setamount(val);
  }

  function decrement() {
    if (amount != 1) {
      setamount(amount - 1);
      setcalorie(Math.trunc((cal[i] * (amount - 1)) / size[i]));
    }
  }

  function back() {
    size[i] = amount;
    cal[i] = calorie;
    navigation.navigate("recipeDetails", { newSize: size, newCal: cal });
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View style={{ backgroundColor: "white" }}>
        <ImageBackground
          style={{ width: width, height: 250 }}
          source={{ uri: img[i] !== "" ? img[i] : null }}
        ></ImageBackground>
        <Text style={[styles.infoRecipeName, { marginTop: 30 }]}>
          {name[i]}{" "}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 40 }}>
          <TouchableOpacity onPress={() => increment()}>
            <View
              style={{
                backgroundColor: "goldenrod",
                width: 40,
                height: 40,
                marginLeft: 110,
              }}
            >
              <Ionicons name="add" size="40" color="white">
                {" "}
              </Ionicons>
            </View>
          </TouchableOpacity>
          <TextInput
            style={[styles.infoRecipeName, { marginLeft: 20 }]}
            onChangeText={(value) => newValue(value)}
          >
            {amount}
          </TextInput>

          <TouchableOpacity onPress={() => decrement()}>
            <View
              style={{
                backgroundColor: "goldenrod",
                width: 40,
                height: 40,
                marginLeft: 20,
              }}
            >
              <Ionicons name="remove" size="40" color="white">
                {" "}
              </Ionicons>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={[
              styles.infoRecipeName,
              { alignText: "center", marginTop: 40 },
            ]}
          >
            {calorie}
            <MaterialIcons name="fire" size="30" color="orange">
              {" "}
            </MaterialIcons>
            /{amount} {unit[i]}
          </Text>
          <TouchableOpacity onPress={() => back()}>
            <Text style={[styles.category, { marginTop: 95 }]}>
              {" "}
              <Ionicons name="chevron-back" size="25"></Ionicons> back to search
              screen
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
//**********************************************************************************************

const SearchbyBarCode = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [datas, setdatas] = useState([]);
  const [barcode, setbarcode] = useState([]);
  const i = route.params.index;
  const size = route.params.size;
  const name = route.params.name;
  const cal = route.params.cal;
  const img = route.params.img;
  const unit = route.params.unit;
  const dataSource = route.params.dataSource;

  async function fetchData() {
    const response = await fetch("http://192.168.1.110:4008/barcode");
    const data = await response.json();
    setbarcode(data);
  }

  useEffect(() => {
    fetchData();
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
    if (tempList.length == 0) alert(`this item does not found`);
    else {
      name.push(tempList[0].name);
      cal.push(tempList[0].calorie);
      size.push(100);
      img.push(tempList[0].img);
      unit.push("g");
      dataSource.push(tempList[0]);

      navigation.navigate("recipeDetails", {
        name: name,
        cal: cal,
        size: size,
        img: img,
        unit: unit,
        flag: 1,
        dataSource: dataSource,
      });
    }
  };

  if (hasPermission === null) {
    return (
      <Text style={{ marginTop: 30 }}>Requesting for camera permission</Text>
    );
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
        style={[StyleSheet.absoluteFillObject, styles.container2]}
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
            onPress={() => navigation.navigate("recipeDetails")}
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
//******************************************************************
const trainDetails = ({ navigation, route }) => {
  const video = React.useRef(null);

  //-------------backend----------------//
  const Exname = route.params.Exname;
  const exernum = route.params.exernum;
  const lastSeen = route.params.lastSeen;
  const user = route.params.user;
  const appState = route.params.appState;
  const [img, setimg] = useState([]);
  const today = route.params.today;

  const [data, setData] = useState([]);
  const [flag0, setflag0] = useState([]);
  const [calor, setcalor] = useState([]);
  const [cal, setcal] = useState([""]);
  const [add, setadd] = useState(0);
  const [tool, settool] = useState();
  const [fav, setfav] = useState([]);
  const [fv, setfv] = useState(false);

  const [flag, setflag] = useState(false);
  const [flag2, setflag2] = useState(false);
  const [flag3, setflag3] = useState(false);
  const [flag4, setflag4] = useState(false);

  const [flag11, setflag11] = useState(false);
  const [flag22, setflag22] = useState(false);
  const [flag33, setflag33] = useState(false);
  const [flag44, setflag44] = useState(false);

  async function fetchData() {
    const response = await fetch(
      "http://192.168.1.110:4008/training?name=" + Exname
    );
    const info = await response.json();
    setData(info);
    setcalor(info[0].calories);

    const res = await fetch(
      "http://192.168.1.110:4008/track?user=" + user + "&day=" + today
    );
    const track = await res.json();

    if (track[0].ex1 != 0) {
      setflag(true);
      setflag11(true);
    }
    if (track[0].ex2 != 0) {
      setflag2(true);
      setflag22(true);
    }
    if (track[0].ex3 != 0) {
      setflag3(true);
      setflag33(true);
    }
  }

  async function fetchshoppinglist() {
    const response = await fetch(
      "http://192.168.1.110:4008/ifIngredientInshoppingList?user=" +
        user +
        "&type=sport"
    );
    var Tools = await response.json();

    settool(Tools);
  }
  async function fetchfavourite() {
    const response = await fetch(
      "http://192.168.1.110:4008/existsInFav?user=" + user + "&type=sport"
    );
    var Tools = await response.json();

    setfav(Tools);
  }

  useEffect(() => {
    fetchData();
    fetchshoppinglist();
    fetchfavourite();
  }, []);
  //------------shopping list ---- //

  const checko = (i) => {
    const list3 = tool.filter((item) => {
      if (item.name.toLowerCase().match(i.toLowerCase())) {
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
          type: "sport",
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            alert("Added Successfully");
            fetchshoppinglist();
          } else {
            alert(res.message);
          }
        })
        .done();
    }
  };
  const checko2 = (i) => {
    const list3 = fav.filter((item) => {
      //alert(i.toLowerCase());
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
          type: "sport",
          image: i.img,
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

  //------------------------------------//

  const log = (exer) => {
    if (exer == "1") {
      setflag(true);
      if (!flag11) update(calor, 1);
    } else if (exer == "2") {
      setflag2(true);
      if (!flag22) update(calor, 2);
    } else if (exer == "3") {
      setflag3(true);
      if (!flag33) update(calor, 3);
    }
  };
  async function update(ex, num) {
    if (num == 1) setflag11(true);
    if (num == 2) setflag22(true);
    if (num == 3) setflag33(true);

    //add last row inserted
    const res = await fetch(
      "http://192.168.1.110:4008/track?user=" + user + "&day=" + (today - 1)
    );
    const track = await res.json();

    if (track.length > 0) {
      setadd(track[0].additional);
    }

    fetch("http://192.168.1.110:4008/update", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        day: today,
        ex: 1,
        additional: ex + add,
        num: num,
      }),
    }).catch((error) => {
      alert(error);
    });
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <StatusBar animated={true} barStyle="dark-content" />

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
                    <Material name="favorite" size={25} color="red"></Material>
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
                <Text style={styles.category}>{item.body_part} Exercise</Text>
              </View>

              <View style={styles.infoContainer}>
                <Ionicons name="timer-outline" size={20}></Ionicons>
                <Text style={styles.infoRecipe}> {item.time} Minutes </Text>
              </View>
              <View style={styles.infoContainer}>
                <Material
                  name="local-fire-department"
                  color="orange"
                  size={20}
                ></Material>
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
                      fontFamily: "balsam-f",
                      fontWeight: "bold",
                      color: "#0f5f6e",
                    }}
                  >
                    {step}
                    {"\t\t\t"}

                    {step == "No Equipment" ? null : (
                      <Text>
                        <TouchableOpacity
                          hitSlop={{
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                          }}
                          onPress={() => checko(step)}
                        >
                          <Material
                            name="add-shopping-cart"
                            size={22}
                            color="black"
                          ></Material>
                        </TouchableOpacity>
                      </Text>
                    )}

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
            <View>
              <TouchableOpacity
                style={styles.roundButton1}
                onPress={() =>
                  navigation.navigate("Timer", { time: item.time, video: item.video })
                }
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontFamily: "balsam-f",
                  }}
                >
                  {" "}
                  Start Playing{" "}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontFamily: "balsam-f",
                  marginTop: 10,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                {" "}
                log exercise{" "}
              </Text>
              <Text style={[styles.category, { textAlign: "center" }]}>
                *if you don't play this exercise today press here
              </Text>
              <TouchableOpacity onPress={() => log(exernum)}>
                {exernum == "1" ? (
                  flag ? (
                    <MaterialIcons
                      name="close-box"
                      size={40}
                      color="red"
                      style={{ marginBottom: 20, textAlign: "center" }}
                    ></MaterialIcons>
                  ) : (
                    <MaterialIcons
                      name="close-box"
                      size={40}
                      color="goldenrod"
                      style={{ marginBottom: 20, textAlign: "center" }}
                    ></MaterialIcons>
                  )
                ) : exernum == "2" ? (
                  flag2 ? (
                    <MaterialIcons
                      name="close-box"
                      size={40}
                      color="red"
                      style={{ marginBottom: 20, textAlign: "center" }}
                    ></MaterialIcons>
                  ) : (
                    <MaterialIcons
                      name="close-box"
                      size={40}
                      color="goldenrod"
                      style={{ marginBottom: 20, textAlign: "center" }}
                    ></MaterialIcons>
                  )
                ) : exernum == "3" ? (
                  flag3 ? (
                    <MaterialIcons
                      name="close-box"
                      size={40}
                      color="red"
                      style={{ marginBottom: 20, textAlign: "center" }}
                    ></MaterialIcons>
                  ) : (
                    <MaterialIcons
                      name="close-box"
                      size={40}
                      color="goldenrod"
                      style={{ marginBottom: 20, textAlign: "center" }}
                    ></MaterialIcons>
                  )
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFont}
        onError={() => console.log("ERROR")}
        onFinish={() => {
          setfontLoaded(true);
        }}
      />
    );
  }
};
const Timer = ({ navigation, route }) => {
  const time = route.params.time;
  const video = route.params.video;

  const [f, setf] = useState(true);
  const [sound, setSound] = useState();
  const [flag, setflag] = useState(true);
  const [text, setText] = useState("Pause Playing");

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/alarm.mp3"),
      {
        isLooping: true,
      }
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  function pause() {
    setflag(!flag);
    if (flag) setText("Continue");
    else setText("Pause Playing");
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView style={{ backgroundColor: "white", height: 700 }}>
<ScrollView>
      <View style={{ backgroundColor: "black" }}>
              <WebView
                allowsFullscreenVideo
                useWebKit
                allowsInlineMediaPlayback
                allowsInlineMediaPlayback={true}
                javaScriptEnabled
                scrollEnabled={false}
                source={{
                  uri: "https://www.youtube.com/watch?v=" + video+"",
                }}
                style={[styles.video]}
              />
       </View>
       <View>
      <ImageBackground
        style={{ width: width, height: height }}
        source={{
          uri: "https://i.pinimg.com/736x/28/ac/27/28ac2740b8aabb809494e6db3fb4a435.jpg",
        }}
        imageStyle={{ opacity: 0.4 }}
      >
            
        <View style={{ marginTop: 100 }}>
          <CountDown
            until={time * 60}
            size={30}
            onFinish={playSound}
            digitStyle={{ backgroundColor: "goldenrod" }}
            digitTxtStyle={{ color: "white" }}
            timeToShow={["M", "S"]}
            timeLabels={{ m: "MM", s: "SS" }}
            separatorStyle={{ color: "#2E9298" }}
            showSeparator
            running={flag}
          />
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[
              styles.roundButton2,
              { backgroundColor: "#2E9298", marginTop: 70 },
            ]}
            onPress={() => pause()}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "balsam-f",
                fontSize: 20,
              }}
            >
              {" "}
              {text}{" "}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roundButton2,
              { backgroundColor: "#514175", marginTop: 70 },
            ]}
            onPress={() => setSound(null)}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "balsam-f",
                fontSize: 20,
              }}
            >
              {" "}
              Stop Alarm{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 40,
    //fontFamily: "Kaushan",
    fontFamily: "balsam-f",
    fontSize: width / 12,
    opacity: 1,
    marginBottom: 20,
    marginLeft: 15,
    color: "#2E9298",
  },
  recipe: {
    marginTop: 65,
    fontFamily: "Kaushan",
    fontSize: 40,
    opacity: 1,
    textAlign: "center",
    color: "white",
  },
  train: {
    textAlign: "center",
    paddingTop: 15,
    fontFamily: "balsam-f",
    fontSize: 18,
  },

  play: {
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  view: {
    width: 250,
    height: 220,
    padding: 10,
    borderColor: "#cccccc",
    borderWidth: 0.5,
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 10,
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
    fontSize: 30,
    marginTop: 10,
    fontFamily: "balsam-f",
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#289486",
    margin: 10,
    fontFamily: "balsam-f",
  },
  category2: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 30,
    fontFamily: "balsam-f",
  },
  infoRecipe: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
    fontFamily: "balsam-f",
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
  textInput: {
    backgroundColor: "white",
    width: width / 1.85,
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "balsam-f",
    color: "black",
    marginHorizontal: width / 28,
  },
  button: {
    backgroundColor: "#2E9298",
    color: "white",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    fontFamily: "balsam-f",
    margin: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  button2: {
    backgroundColor: "#2E9298",
    color: "white",
    borderRadius: 10,
    padding: 5,

    marginTop: 30,
    fontSize: 14,
    width: 100,
    fontFamily: "balsam-f",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2.5,
    shadowOpacity: 0.5,
  },
  shadowContainerStyle: {
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    paddingTop: 20,
    elevation: 5,
  },
  viewbutton: {
    backgroundColor: "white",
    width: width / 1.1,
    height: width / 5,
    marginLeft: width / 40,
    shadowColor: "black",
    shadowOpacity: 0.3,
    borderRadius: 8,
    shadowRadius: 5,
  },
  textType: {
    color: "black",
    textAlign: "left",
    fontSize: width / 25,
    fontFamily: "balsam-f",
    marginTop: -35,
    marginLeft: 75,
  },
  itemView: {
    marginHorizontal: "13%",
    backgroundColor: "white",
    height: 50,
    width: width / 1.5,
    borderRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
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
  verticleLine: {
    height: "100%",
    width: 0.3,
    backgroundColor: "#cecece",
  },
  container2: {
    flex: 1,
    flexDirection: "column",
  },
  layerTop: {
    flex: 2,
    backgroundColor: "white",
  },
  layerCenter: {
    flex: 5,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 1,
    backgroundColor: "white",
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: "white",
  },
  layerBottom: {
    flex: 2,
    backgroundColor: "white",
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
  video: {
    marginTop: -45,
    alignSelf: "center",
    width: width - 100,
    height: 230,
  },
  roundButton1: {
    marginLeft: 160,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "goldenrod",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  roundButton2: {
    marginLeft: 50,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    width: 130,
    height: 130,
    borderRadius: 100,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
  },
});
