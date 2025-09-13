import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { global_style } from "../utils/stylesheets/general_style";
import Constants from 'expo-constants';
import { color_scheme } from "../utils/constants/app_constants";
import { onboarding_sheet } from "../utils/stylesheets/onboarding_sheet";
import React from "react";
import ShortButton from "../components/auth_screens/short_button";
import WideButton from "../components/auth_screens/wideButton";

export default function App() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = React.useState<number>(0)
  const { height, width } = Dimensions.get("window");


  const onboarding_details: { title: string, description: string, image: any }[] = [
    {
      title: "Your map to authentic Amala spots",
      description: "Map, share, and explore Amala spots with foodies like you,  because good Amala should never stay a secret",
      image: require("../assets/images/ob1.png")
    },
    {
      title: "Mouth watering Amala, prepared just for you",
      description: "Get a delicious taste of the Amala of your preference close to you.Right at your finger-tips.",
      image: require("../assets/images/ob2.png")
    },
    {
      title: "Let’s get Started!",
      description: "So you’ve read about it; now time to experience it. But don’t just take my word for it. Try it!",
      image: require("../assets/images/ob3.png")
    },
  ]


  const RenderDotsView = ({ currentIndex }: { currentIndex: number }) => {
    return (
      <View style={[onboarding_sheet.centered, { gap: 5, display: "flex", flexDirection: "row", }]} >
        {
          Array(onboarding_details.length).fill("")
            .map((data, index) => {
              return (
                <TouchableOpacity key={`rdv-${index}`} onPress={() => setCurrentIndex(index)}
                  style={{ width: currentIndex === index ? 44 : 10, height: 10, borderRadius: 50, backgroundColor: currentIndex === index ? color_scheme.button_color : color_scheme.grey_bg }}></TouchableOpacity>
              )
            })
        }
      </View>
    )
  }

  return (
    <SafeAreaView style={{
      flex: 1, paddingTop: Constants.statusBarHeight,
      flexDirection: "column", justifyContent: "space-between", backgroundColor: color_scheme.light
    }}>
      <View style={{
        display: "flex", flexDirection: "row", paddingRight: 20, paddingTop: 20,
        justifyContent: "flex-end"
      }}>
        {currentIndex < 2 && <TouchableOpacity onPress={() => setCurrentIndex(2)} style={[global_style.centered, { backgroundColor: color_scheme.light, paddingLeft: 10, paddingRight: 10, padding: 5, borderRadius: 50 }]}>
          <Text style={global_style.text}>Skip</Text>
        </TouchableOpacity>}
      </View>

      {
        currentIndex < 2 ? <Image source={onboarding_details[currentIndex].image} resizeMode="cover"
          style={{ height: (height / 2) + 200, width: "100%", position: "absolute" }} />
          : <Image source={require("../assets/images/ob3.png")} resizeMode="contain"
            style={{ height: 400, width: "100%" }} />
      }


      <View style={[onboarding_sheet.conatiner]}>
        <View style={[onboarding_sheet.centered, {
          width: "100%"
        }]}>
          <RenderDotsView currentIndex={currentIndex} />
        </View>

        <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Text style={onboarding_sheet.title}>{onboarding_details[currentIndex].title}</Text>
          <Text style={onboarding_sheet.subtitle}>{onboarding_details[currentIndex].description}</Text>
        </View>

        {currentIndex < 2 && <View style={[onboarding_sheet.centered, {
          width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10,
        }]}>
          {currentIndex > 0 ? <ShortButton onTap={() => setCurrentIndex(currentIndex - 1)} type="outlined" >Back</ShortButton> : <View />}
          {currentIndex < (onboarding_details.length - 1) ? <ShortButton onTap={() => setCurrentIndex(currentIndex + 1)} type="fill" >Next</ShortButton> : <View />}

        </View>}

        {currentIndex >= 2 && <View style={[onboarding_sheet.centered, {
          width: "100%", flexDirection: "column", gap: 10, alignItems: "center", justifyContent: "space-between",
        }]}>
          <WideButton onTap={() => router.push("(auth)/login")} type="outlined" >I already have an Account</WideButton>
          <WideButton onTap={() => router.push("(auth)/signup")} type="fill" fillColor={color_scheme.button_color} >Create an Account</WideButton>

        </View>}
      </View>
    </SafeAreaView>
  );
}

