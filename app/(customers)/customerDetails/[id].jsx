import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MessageCircle, Phone } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Separator } from "@/components/ui/separator";

const customerDetails = () => {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="relative flex-1 bg-muted/40">
      <ScrollView>
        <Card className="mb-4">
          <CardContent className="items-start gap-1.5 pt-6">
            <Text className="text-2xl font-semibold">Eisha Sheikh</Text>
            <View className="flex-row gap-1.5">
              <Text className="text-base text-muted-foreground">
                Since July 4, 2024
              </Text>
              <Text className="text-base text-muted-foreground">•</Text>
              <Text className="text-base text-muted-foreground">
                Brampton ON, Canda
              </Text>
            </View>
            <Badge variant="outline" className="py-1 px-4">
              <Text className="text-sm">Subscribed</Text>
            </Badge>
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardContent className="gap-6 pt-6">
            <Text className="text-xl font-semibold">Contact information</Text>
            <View className="flex-row gap-4">
              <Button variant="outline" className="flex-1">
                <Mail
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                  size={18}
                />
              </Button>
              <Button className="flex-1">
                <Phone
                  color={colorScheme === "dark" ? "#000" : "#fff"}
                  size={18}
                />
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                  size={18}
                />
              </Button>
            </View>
            <View className="flex gap-1.5">
              <Text className="text-lg">aminhas1996@gmail.com</Text>
              <Text className="text-lg">+92 300 87430 33</Text>
            </View>
            <Separator />
            <View className="flex gap-0.75">
              <Text className="text-lg">Eisha Sheikh</Text>
              <Text className="text-lg">11 Eiifle Boulevard</Text>
              <Text className="text-lg">Brampton ON, 44000</Text>
              <Text className="text-lg">Pakistan</Text>
            </View>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=" gap-6 pt-6">
            <Text className="text-xl font-semibold">Customer orders</Text>
            <View className="flex">
              <Button
                className="items-start border-b-[0.5px] border-gray-300 pb-4 pt-4 hover:bg-black h-fit"
                variant="ghost"
                size="auto"
              >
                <View className="flex flex-row items-center justify-between w-full">
                  <Text className="text-lg text-foreground font-bold">
                    #OD-XQ681917
                  </Text>
                  <Text className="text-lg text-foreground tracking-tight">
                    $ 2,000
                  </Text>
                </View>
                <View className="flex flex-row flex-wrap items-center mt-2 gap-1.5">
                  <Text className="text-base leading-4 text-muted-foreground">
                    2 items • August 23, 2024 at 7:52 pm
                  </Text>
                </View>
                <View className="flex flex-row gap-3 mt-2">
                  <Badge variant="caution">
                    <Text>Unfullfilled</Text>
                  </Badge>
                  <Badge variant="outline">
                    <Text>Paid</Text>
                  </Badge>
                </View>
              </Button>
              <Button
                className="items-start pb-4 pt-4 hover:bg-black h-fit"
                variant="ghost"
                size="auto"
              >
                <View className="flex flex-row items-center justify-between w-full">
                  <Text className="text-lg text-foreground font-bold">
                    #OD-XQ681917
                  </Text>
                  <Text className="text-lg text-foreground tracking-tight">
                    $ 2,000
                  </Text>
                </View>
                <View className="flex flex-row flex-wrap items-center mt-2 gap-1.5">
                  <Text className="text-base leading-4 text-muted-foreground">
                    2 items • August 23, 2024 at 7:52 pm
                  </Text>
                </View>
                <View className="flex flex-row gap-3 mt-2">
                  <Badge variant="caution">
                    <Text>Unfullfilled</Text>
                  </Badge>
                  <Badge variant="outline">
                    <Text>Paid</Text>
                  </Badge>
                </View>
              </Button>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default customerDetails;
