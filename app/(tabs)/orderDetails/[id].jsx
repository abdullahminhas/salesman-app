import { Text } from "@/components/ui/text";
import React, { useEffect, useState } from "react";
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
  X,
  PackageOpen,
  ChevronLeft,
  Phone,
  Mail,
  ChevronRight,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const orderDetails = () => {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  const [imgWidth, setImgWidth] = useState(null);
  const [orderDetail, setOrderDetail] = useState({});
  const [customerData, setCustomerData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.12:5000/order/get/${id}`,
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
        }
        const result = await response.json();
        setOrderDetail(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const customerID = orderDetail.customerID;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.12:5000/customers/get/${customerID}`,
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
        }
        const result = await response.json();
        setCustomerData(result);
      } catch (error) {
        console.error(error);
      }
    };

    if (customerID !== undefined) {
      fetchData();
    }
  }, [orderDetail]);

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

  return (
    <>
      <SafeAreaView className="relative flex-1 bg-muted/40">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView>
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
            <Card className="mb-4">
              <CardContent className="gap-1 pt-6">
                <View className="flex-row gap-3">
                  <CardTitle>{id}</CardTitle>
                  <Badge variant="caution">
                    <Text>{orderDetail.status}</Text>
                  </Badge>
                  <Badge variant="outline">
                    <Text>{orderDetail.payment?.paymentStatus}</Text>
                  </Badge>
                </View>
                <View>
                  <Muted>{calculateTimeAt(orderDetail.orderDate)}</Muted>
                </View>
              </CardContent>
            </Card>
            <Card className="mb-4">
              <CardContent className="flex gap-6 pt-6">
                <View className="flex gap-2">
                  <CardTitle className="text-xl font-semibold">
                    Customer
                  </CardTitle>
                  <Pressable className="flex-row justify-between items-center">
                    <View className="flex gap-1">
                      <Text className="text-lg font-medium">
                        {customerData.firstName} {customerData.lastName}
                      </Text>
                      <View className="flex-row gap-1.5">
                        <Muted>2 orders</Muted>
                        <Muted>•</Muted>
                        <Muted>{customerData.email}</Muted>
                      </View>
                    </View>
                    <Button size="icon">
                      <ChevronRight
                        color={colorScheme === "dark" ? "#000" : "#fff"}
                        size={22}
                      />
                    </Button>
                  </Pressable>
                </View>
                <View className="flex gap-2">
                  <Text className="text-xl font-semibold">
                    Shipping and Billing Address
                  </Text>
                  <View className="flex gap-1.5">
                    <Text className="text-md capitalize">
                      {customerData.address?.shipping.street},{" "}
                      {customerData.address?.shipping.city}
                    </Text>
                    <Text className="text-md capitalize">
                      {customerData.address?.shipping.city}{" "}
                      {customerData.address?.shipping.postalCode}
                    </Text>
                    <Text className="text-md capitalize">
                      {customerData.address?.shipping.country}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-4">
                  <Button
                    className="flex-1 flex-row justify-center gap-4"
                    variant="outline"
                  >
                    <Mail
                      color={colorScheme === "dark" ? "#fff" : "#000"}
                      size={18}
                    />
                    <Text>Email</Text>
                  </Button>
                  <Button className="flex-1 flex-row justify-center gap-4">
                    <Phone
                      color={colorScheme === "dark" ? "#000" : "#fff"}
                      size={16}
                    />
                    <Text>Call</Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
            <Card className="mb-4">
              <CardContent className="flex gap-6 pt-6">
                <View className="flex-row justify-start">
                  <Badge
                    className="flex-row gap-2 w-fit p-2 rounded-lg items-center"
                    variant="caution"
                  >
                    <PackageOpen
                      color={
                        colorScheme === "dark"
                          ? "hsl(0 0% 98%)"
                          : "hsl(240 10% 3.9%)"
                      }
                      size={19}
                    />
                    <Text className="text-lg">
                      {orderDetail.status} (
                      {orderDetail.items?.reduce(
                        (sum, item) => sum + (item.quantity || 0),
                        0
                      )}
                      )
                    </Text>
                  </Badge>
                </View>
                <View className="gap-4">
                  {Object.keys(orderDetail).length !== 0 &&
                    orderDetail.items?.map((item, index) => (
                      <View
                        className={
                          orderDetail.items.length !== index + 1
                            ? "flex-row flex-wrap gap-4 pb-4 border-b-[0.5px] border-border"
                            : "flex-row flex-wrap gap-4"
                        }
                      >
                        <View
                          className="flex w-[25%]"
                          onLayout={(event) => {
                            const { width } = event.nativeEvent.layout;
                            setImgWidth(width);
                          }}
                        >
                          <Image
                            source={require("@/assets/images/icon.png")}
                            className="rounded-lg"
                            style={{
                              width: imgWidth || "100%",
                              height: "auto",
                              aspectRatio: 1,
                            }}
                          />
                        </View>
                        <View className="flex-1 justify-between w-75%">
                          <Text className="text-xl font-semibold">
                            {item.name}
                          </Text>
                          <View className="flex-row justify-between items-center">
                            <Text className="uppercase">
                              {item.selectedVariant.size}
                            </Text>
                            <View className="flex-row items-center gap-1">
                              <X
                                color={colorScheme === "dark" ? "#fff" : "#000"}
                              />
                              <Text className="text-2xl font-semibold">
                                {item.quantity}
                              </Text>
                            </View>
                          </View>
                          <Muted className="text-lg">
                            $ {item.selectedVariant.price.toLocaleString()}
                          </Muted>
                        </View>
                      </View>
                    ))}
                </View>
                <Button>
                  <Text className="text-xl">Fullfill Item</Text>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex gap-6 pt-6">
                <View className="flex-row justify-start">
                  <Badge
                    className="w-fit px-6 py-2 rounded-lg"
                    variant="outline"
                  >
                    <Text className="text-lg">
                      {orderDetail.payment?.paymentStatus}
                    </Text>
                  </Badge>
                </View>
                <View className="gap-4">
                  <View className="flex-row justify-between items-end">
                    <View>
                      <Small className="text-muted-foreground">
                        {orderDetail.items?.reduce(
                          (sum, item) => sum + (item.quantity || 0),
                          0
                        )}{" "}
                        {orderDetail.items?.reduce(
                          (sum, item) => sum + (item.quantity || 0),
                          0
                        ) > 1
                          ? "items"
                          : "item"}
                      </Small>
                      <Text className="text-lg">Subtotal</Text>
                    </View>
                    <Text className="text-lg">
                      $ {orderDetail.subtotal?.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-end">
                    <View>
                      <Small className="text-muted-foreground">Discount</Small>
                      <Text className="text-lg">0GU6VHV65CF</Text>
                    </View>
                    <Text className="text-lg">
                      $ {orderDetail.discount?.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-end">
                    <View>
                      <Small className="text-muted-foreground">Shipping</Small>
                      <Text className="text-lg">
                        free (0.0kg: Items 0.0 kg, Package 0.0 kg)
                      </Text>
                    </View>
                    <Text className="text-lg">
                      $ {orderDetail.shipping?.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-medium">Total</Text>
                    <Text className="text-lg font-medium">
                      $ {orderDetail.total?.toLocaleString()}
                    </Text>
                  </View>
                  <Separator />
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg">Paid</Text>
                    <Text className="text-lg">
                      $ {orderDetail.total?.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default orderDetails;
