// import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  // FlatList,
  // Dimensions,
  Image,
  Animated,
  Platform,
} from "react-native";
import Loading from "./src/components/Loading";
import Rating from "./src/components/Rating";
import Genres from "./src/components/Genres";
import { getMovies } from "./src/service/api";
import BackDrop from "./src/components/BackDrop";
import { ITEM_SIZE, SPACER_ITEM_SIZE, SPACING } from "./src/constants";
import BackDropIOS from "./src/components/BackDropIOS";

// const { width, height } = Dimensions.get("window");

// const SPACING = 10;
// export const ITEM_SIZE = width * 0.72;
// const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

export default function App() {
  const [movies, setMovies] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const fetchData = async () => {
      const moviesData = await getMovies({
        // "popularity.desc"
        primary_release_year: "2019",
        sort_by: "popularity.desc",
        // sort_by: "vote_average.desc",
      });
      setMovies([
        { key: "left-spacer" },
        ...moviesData,
        { key: "right-spacer" },
      ]);
    };

    if (movies.length === 0) fetchData();
    // console.log(movies);
  }, [movies]);

  if (movies.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Not really necessary but 
      the Maskview Image animation doesnt work doesnt work 
      on android so you could go with only Backdrop */}
      {Platform.OS === "android" ? (
        <BackDrop movies={movies} scrollX={scrollX} />
      ) : (
        <BackDropIOS movies={movies} scrollX={scrollX} />
      )}
      <StatusBar style="auto" />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => item.key}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
        }}
        snapToInterval={ITEM_SIZE} // maes the slide snap to one per scroll
        decelerationRate={Platform.OS === "ios" ? 0 : 0.6} // makes the snap efective
        renderToHardwareTextureAndroid
        snapToAlignment="start"
        bounces={false} // removes bounce on first slide
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: Platform.OS === "ios" }
        )} // making active bigger on scroll
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return <View style={styles.spacer} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];
          const outputRange = [100, 30, 100];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange,
            extrapolate: "clamp",
          });
          // return <Text>huuu </Text>;
          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={[
                  styles.imageContainer,
                  { transform: [{ translateY }] },
                ]}>
                <Image
                  source={{ uri: item.poster }}
                  style={styles.posterImage}
                />
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Rating rating={item.rating} />
                <Genres genres={item.genres} />
                <Text style={styles.description} numberOfLines={3}>
                  {item.description}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 1.2,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  imageContainer: {
    marginHorizontal: SPACING,
    padding: SPACING * 0.91,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 34,
  },
  title: {
    fontSize: 24,
  },
  description: {
    fontSize: 16,
  },
  spacer: {
    width: SPACER_ITEM_SIZE,
  },
});
