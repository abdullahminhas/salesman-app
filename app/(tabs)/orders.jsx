import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Pressable } from "react-native";
import { Input } from "@/components/ui/input";
import { H3, H4, P, Large } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/buttonLink";
import BottomNav from "@/components/bottomNavbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "expo-router";

import { Search, BadgePlus } from "lucide-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";

const orders = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const salesmanID = "SL-UI-167835";
  const [salesman, setSalesman] = useState([]);

  function calculateTimeAt(dateTimeString) {
    const givenDate = new Date(dateTimeString);

    // Define month names for formatting
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Format the date and time
    const formattedDate = `${
      monthNames[givenDate.getMonth()]
    } ${givenDate.getDate()}, ${givenDate.getFullYear()}`;
    let hours = givenDate.getHours();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = givenDate.getMinutes();
    const formattedTime = `${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;

    return `${formattedDate} at ${formattedTime}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.12:5000/salesman/${salesmanID}/orders/get`,
          {
            method: "GET", // Default is 'GET', but you can specify it explicitly
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          const result = await response.json();

          // Update the state with the sorted result
          setSalesman(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [salesmanID]);

  return (
    <SafeAreaView className="relative flex-1 bg-muted/40">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <View className="w-[24px]"></View>
          <H3>Orders</H3>
          {/* <Link href="/(tabs)/newOrder" className="flex">
            New Order
          </Link> */}
          {/* <Link href="/(tabs)/newOrder" asChild>
            <TouchableOpacity className="flex items-center justify-center rounded-md p-2 bg-primary">
              <BadgePlus
                size={22}
                color={colorScheme === "dark" ? "#000" : "#fff"}
              />
            </TouchableOpacity>
          </Link> */}
          <ButtonLink href="/(tabs)/newOrder" size="icon">
            <BadgePlus
              size={22}
              color={colorScheme === "dark" ? "#000" : "#fff"}
            />
          </ButtonLink>
        </CardHeader>
        <CardContent>
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
      <View className="mb-3 flex-row">
        <Card className="flex-1 bg-primary border-primary">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-white dark:text-black">
              Amount Recovered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-lg font-medium text-white dark:text-black">
              ${" "}
              {salesman.orders
                ?.reduce((sum, order) => {
                  // Check if the order status is 'paid'
                  if (order.payment.paymentStatus.toLowerCase() === "paid") {
                    // Add the subtotal if the status is 'paid'
                    sum += order.subtotal || 0;

                    // Add the installments if the payment method is 'installments'
                  }
                  if (order.payment.method.toLowerCase() === "installments") {
                    sum += order.payment.installment.reduce(
                      (installmentSum, installment) =>
                        installmentSum + (installment.amount || 0),
                      0
                    );
                  }
                  return sum;
                }, 0)
                .toLocaleString()}
            </P>
          </CardContent>
        </Card>
        <Card className="flex-1 bg-primary border-primary">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-white text-right dark:text-black">
              Amount Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-lg font-medium text-white text-right dark:text-black">
              ${" "}
              {salesman.orders
                ?.reduce((sum, order) => {
                  // Check if the order status is 'paid'
                  if (
                    order.payment.paymentStatus.toLowerCase() === "unpaid" ||
                    order.payment.paymentStatus.toLowerCase() === "partial paid"
                  ) {
                    // Add the subtotal if the status is 'paid'
                    sum += order.subtotal || 0;

                    // Add the installments if the payment method is 'installments'
                  }
                  if (order.payment.method.toLowerCase() === "installments") {
                    sum -= order.payment.installment.reduce(
                      (installmentSum, installment) =>
                        installmentSum + (installment.amount || 0),
                      0
                    );
                  }
                  return sum;
                }, 0)
                .toLocaleString()}
            </P>
          </CardContent>
        </Card>
      </View>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Previous Orders</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent className="flex">
          {Object.keys(salesman).length !== 0 &&
            salesman.orders?.map((order, index) => (
              <Button
                className={
                  salesman.orders.length === index + 1
                    ? "items-start h-fit pt-4"
                    : "items-start border-b-[0.5px] border-gray-300 pb-4 pt-4 hover:bg-black h-fit"
                }
                variant="ghost"
                size="auto"
                onPress={() => router.push(`/orderDetails/${order.id}`)}
                key={index}
              >
                <View className="flex flex-row items-center justify-between w-full">
                  <Text className="text-lg text-foreground font-bold">
                    #{order.id}
                  </Text>
                  <Text className="text-lg text-foreground tracking-tight">
                    $ {order.total.toLocaleString()}
                  </Text>
                </View>
                <View className="flex flex-row flex-wrap items-center mt-2 gap-1.5">
                  <Text className="text-base leading-4">
                    {order.customer.firstName} {order.customer.lastName} •{" "}
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    {order.items.reduce((sum, item) => sum + item.quantity, 0) >
                    1
                      ? "items"
                      : "item"}{" "}
                    • {calculateTimeAt(order.orderDate)}
                  </Text>
                  {/* <Text className="text-lg"></Text>
              <Text className="text-lg"></Text>
              <Text className="text-lg"></Text>
              <Text className="text-lg"></Text> */}
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
            ))}
        </CardContent>
      </Card>
      <BottomNav />
    </SafeAreaView>
  );
};

export default orders;
