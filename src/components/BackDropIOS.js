import MaskedView from "@react-native-community/masked-view";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  Animated,
  Platform,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
// import LinearGradient from "react-native-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";
import { BACKDROP_HEIGHT, ITEM_SIZE } from "../constants";

const { width, height } = Dimensions.get("window");

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const BackDrop = ({ scrollX, movies }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.key + "-backdrop"}
        renderItem={({ item, index }) => {
          if (!item.backdrop) return null;

          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [-width, 0],
          });

          return (
            <MaskedView
              style={styles.absolute}
              maskElement={
                <AnimatedSvg
                  width={width}
                  height={height}
                  viewBox={`0 0 ${width} ${height}`}
                  style={{ transform: [{ translateX: translateX }] }}>
                  <Rect x="0" y="0" width={width} height={height} fill="red" />
                </AnimatedSvg>
              }>
              <Image source={{ uri: item.backdrop }} style={styles.backdrop} />
            </MaskedView>
          );
        }}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0)", "white"]}
        style={styles.gradient}
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
