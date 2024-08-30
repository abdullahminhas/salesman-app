import { Text } from "@/components/ui/text";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { H3, Large, Muted, Small } from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Search,
  CirclePlus,
  ChevronLeft,
  Trash2,
  Copy,
} from "lucide-react-native";
import {
  Image,
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { ButtonLink } from "@/components/ui/buttonLink";

const orderDetails = () => {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    console.log(id);
  }, [id]);
  return (
    <>
      <SafeAreaView className="relative flex-1 bg-muted/40">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              {/* <Link href="/">Back</Link> */}
              <ButtonLink
                href="/orders"
                size="icon"
                className="flex justify-center items-center"
              >
                <ChevronLeft
                  size={26}
                  color={colorScheme === "dark" ? "#000" : "#fff"}
                />
              </ButtonLink>
              <H3>Create Order</H3>
              <View className="w-[24px]"></View>
            </CardHeader>
          </Card>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default orderDetails;
