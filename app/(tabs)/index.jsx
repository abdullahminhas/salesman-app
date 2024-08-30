import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity } from "react-native";
import BottomNav from "@/components/bottomNavbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomeScreen() {
  return (
    <SafeAreaView className="relative flex-1 bg-muted/40">
      <Card>
        <CardHeader>
          <CardTitle>Pakistan</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <BottomNav />
    </SafeAreaView>
  );
}
