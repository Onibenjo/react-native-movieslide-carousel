import MaskedView from "@react-native-community/masked-view";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  Animated,
  //   Platform,
} from "react-native";
// import Svg, { Rect } from "react-native-svg";
// import LinearGradient from "react-native-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";
import { BACKDROP_HEIGHT, ITEM_SIZE } from "../constants";

const { width, height } = Dimensions.get("window");

const BackDrop = ({ scrollX, movies }) => {
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: "absolute" }}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.key + "-backdrop"}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [0, width],
            // extrapolate:'clamp'
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: "absolute",
                width: translateX,
                height,
                overflow: "hidden",
              }}>
              <Image
                source={{ uri: item.backdrop }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: "absolute",
                }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "white"]}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
};

export default BackDrop;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // ...StyleSheet.absoluteFill,
    // flex: 1,
    width,
    height: BACKDROP_HEIGHT,
  },
  backdropImage: {
    width,
    height: BACKDROP_HEIGHT,
    resizeMode: "cover",
  },
  absolute: { position: "absolute" },
  gradient: {
    width: width,
    height: BACKDROP_HEIGHT,
    position: "absolute",
    bottom: 0,
  },
});
