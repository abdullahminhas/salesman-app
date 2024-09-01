import { Text } from "@/components/ui/text";
import React, { useEffect, useState } from "react";
import BottomNav from "@/components/bottomNavbar";
import { Pressable, SafeAreaView, View } from "react-native";
import { Search } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ButtonLink } from "@/components/ui/buttonLink";
import { Link, useRouter } from "expo-router";

const customers = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.1.12:5000/customers/get`, {
          method: "GET", // Default is 'GET', but you can specify it explicitly
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setCustomers(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <SafeAreaView className="relative flex-1 bg-muted/40">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <View className="relative">
              <Search
                style={{ position: "absolute", left: 13, top: 13, zIndex: 1 }}
                color={colorScheme === "dark" ? "#fff" : "#000"}
                size={16}
              />
              <Input
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-10"
              />
            </View>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="gap-6 pt-6">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-semibold">All customers</Text>
              <Link href="#" className="text-blue-400">
                More
              </Link>
            </View>
            <View className="flex">
              {customers.map((customer, index) => (
                <Button
                  className={
                    customers.length !== index + 1
                      ? "flex items-start border-b-[0.5px] border-gray-300 gap-2 pt-4 pb-4"
                      : "flex items-start gap-2 pt-4"
                  }
                  variant="ghost"
                  size="auto"
                  onPress={() => router.push(`/customerDetails/${customer.id}`)}
                  key={index}
                >
                  <Text className="text-lg font-medium">
                    {customer.firstName} {customer.lastName}
                  </Text>
                  <View className="flex flex-row flex-wrap items-center gap-1.5">
                    <Text className="text-base leading-4 text-muted-foreground">
                      {customer.email}
                    </Text>
                    <Text className="text-base leading-4 text-muted-foreground">
                      •
                    </Text>
                    <Text className="text-base leading-4 text-muted-foreground">
                      {customer.address?.shipping.city},{" "}
                      {customer.address?.shipping.country}
                    </Text>
                    <Text className="text-base leading-4 text-muted-foreground">
                      •
                    </Text>
                    <Text className="text-base leading-4 text-muted-foreground">
                      0 Orders
                    </Text>
                  </View>
                </Button>
              ))}
            </View>
          </CardContent>
        </Card>
      </SafeAreaView>
      <BottomNav />
    </>
  );
};

export default customers;
