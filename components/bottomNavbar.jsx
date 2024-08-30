import React, { useEffect } from "react";
import { Text } from "./ui/text";
import { Pressable, View } from "react-native";
import { House, ShoppingCart, Package, Users } from "lucide-react-native";
import { Link } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRoute } from "@react-navigation/native";

const bottomNav = () => {
  const colorScheme = useColorScheme();
  const route = useRoute();

  // Function to determine if the link is active
  const isActive = (href) => route.name === href;

  return (
    <View
      className="flex-row gap-5 border border-border p-3 w-fit bg-white dark:bg-black rounded-2xl absolute bottom-8"
      style={{ left: "50%", transform: [{ translateX: -133 }] }}
    >
      <Link href="/" asChild>
        <Pressable
          className={`flex-row p-3 rounded-full ${
            isActive("index") ? "bg-black dark:bg-white" : "bg-accent"
          }`}
        >
          <House
            color={
              isActive("index")
                ? colorScheme === "dark"
                  ? "#000" // Route is active and colorScheme is dark
                  : "#fff" // Route is active and colorScheme is not dark
                : colorScheme === "dark"
                ? "#fff" // Route is not active and colorScheme is dark
                : "#000" // Route is not active and colorScheme is not dark
            }
          />
        </Pressable>
      </Link>
      <Link href="/(tabs)/orders" asChild>
        <Pressable
          className={`flex-row p-3 rounded-full ${
            isActive("orders") ? "bg-black dark:bg-white" : "bg-accent"
          }`}
        >
          <ShoppingCart
            color={
              isActive("orders")
                ? colorScheme === "dark"
                  ? "#000" // Route is active and colorScheme is dark
                  : "#fff" // Route is active and colorScheme is not dark
                : colorScheme === "dark"
                ? "#fff" // Route is not active and colorScheme is dark
                : "#000" // Route is not active and colorScheme is not dark
            }
          />
        </Pressable>
      </Link>
      <Link href="#" asChild>
        <Pressable
          className={`flex-row p-3 rounded-full ${
            isActive("#") ? "bg-black dark:bg-white" : "bg-accent"
          }`}
        >
          <Package
            color={
              isActive("#")
                ? colorScheme === "dark"
                  ? "#000" // Route is active and colorScheme is dark
                  : "#fff" // Route is active and colorScheme is not dark
                : colorScheme === "dark"
                ? "#fff" // Route is not active and colorScheme is dark
                : "#000" // Route is not active and colorScheme is not dark
            }
          />
        </Pressable>
      </Link>
      <Link href="#" asChild>
        <Pressable
          className={`flex-row p-3 rounded-full ${
            isActive("#") ? "bg-black dark:bg-white" : "bg-accent"
          }`}
        >
          <Users
            color={
              isActive("#")
                ? colorScheme === "dark"
                  ? "#000" // Route is active and colorScheme is dark
                  : "#fff" // Route is active and colorScheme is not dark
                : colorScheme === "dark"
                ? "#fff" // Route is not active and colorScheme is dark
                : "#000" // Route is not active and colorScheme is not dark
            }
          />
        </Pressable>
      </Link>
    </View>
  );
};

export default bottomNav;
