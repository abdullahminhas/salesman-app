import React, { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Card, CardContent } from "./card";

const { height: screenHeight } = Dimensions.get("window");

const Toast = ({ message }) => {
  return (
    <Animated.View
      className="absolute bottom-0 w-full"
      entering={FadeIn.duration(500)}
    >
      <Card>
        <CardContent className="pt-6">
          <Text className="text-xl font-bold">{message || "Success"}</Text>
        </CardContent>
      </Card>
    </Animated.View>
  );
};

export default Toast;
