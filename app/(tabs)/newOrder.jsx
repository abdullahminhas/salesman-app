import React, { useState, useEffect, useRef } from "react";
import { Text } from "@/components/ui/text";
import {
  Image,
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import {
  Search,
  CirclePlus,
  ChevronLeft,
  Trash2,
  Copy,
} from "lucide-react-native";
import { H3, Large, Muted, Small } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Link, Stack } from "expo-router";
import { Input } from "@/components/ui/input";
import Animated, { FadeIn } from "react-native-reanimated";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useColorScheme } from "@/hooks/useColorScheme";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLink } from "@/components/ui/buttonLink";

const newOrder = () => {
  const salesmanID = "SL-UI-167835";
  // Manage snap points for the BottomSheet
  const snapPoints = ["90%"];
  // Create a reference to the BottomSheet
  const bottomSheetRef = useRef(null);
  const colorScheme = useColorScheme();
  const [imgWidth, setImgWidth] = useState(null);
  const [imgWidthParent, setImgWidthParent] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [checkedVariants, setCheckedVariants] = useState(new Set());
  const [quantity, setQuantity] = useState(0);
  const [paymentDueLater, setPaymentDueLater] = useState(false);
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [customersData, setCustomersData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [initialState, setInitialState] = useState([]);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  // Fetch prodcuts from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://192.168.1.12:5000/products/get"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setProducts(data); // Adjust according to the API response structure
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.1.12:5000/customers/get", {
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
        setInitialState(result);
        setCustomersData(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleVariantSelect = (product, variantIndex) => {
    const key = `${product.id}-${variantIndex}`;
    setCheckedVariants((prev) => {
      const newCheckedVariants = new Set(prev);
      if (newCheckedVariants.has(key)) {
        newCheckedVariants.delete(key);

        // Remove the product or update quantity if unchecked
        setSelectedProduct(
          (prevProducts) =>
            prevProducts
              .map((p) =>
                p.id === product.id &&
                p.selectedVariant.variant_id ===
                  product.variants[variantIndex].variant_id
                  ? { ...p, quantity: Math.max(0, p.quantity - 1) } // Decrement quantity
                  : p
              )
              .filter((p) => p.quantity > 0) // Remove product if quantity is zero
        );
      } else {
        newCheckedVariants.add(key);

        // Add the product or update quantity if checked
        setSelectedProduct((prevProducts) => {
          const existingProductIndex = prevProducts.findIndex(
            (p) =>
              p.id === product.id &&
              p.selectedVariant.variant_id ===
                product.variants[variantIndex].variant_id
          );

          if (existingProductIndex !== -1) {
            const updatedProduct = {
              ...prevProducts[existingProductIndex],
              quantity: prevProducts[existingProductIndex].quantity + 1,
            };
            return [
              ...prevProducts.slice(0, existingProductIndex),
              updatedProduct,
              ...prevProducts.slice(existingProductIndex + 1),
            ];
          } else {
            return [
              ...prevProducts,
              {
                ...product,
                selectedVariant: product.variants[variantIndex],
                quantity: 1,
              },
            ];
          }
        });
      }
      return newCheckedVariants;
    });
  };

  const isChecked = (product, variantIndex) => {
    const key = `${product.id}-${variantIndex}`;
    return checkedVariants.has(key);
  };

  const handleDeleteProduct = (selectedVariant) => {
    // Find index of the product with the selected variant
    console.log("selected:", selectedVariant);
    const index = selectedProduct.findIndex((product) => {
      console.log("product", product.selectedVariant);
      return product.selectedVariant.variant_id === selectedVariant.variant_id;
    });

    console.log(index);

    if (index !== -1) {
      // Create a new array without the product at the found index
      const updatedProducts = [
        ...selectedProduct.slice(0, index),
        ...selectedProduct.slice(index + 1),
      ];
      setSelectedProduct(updatedProducts);
    }
  };

  const handleQuantityChange = (product, newQuantity) => {
    // Ensure quantity is a valid number and not negative
    const validQuantity = Math.max(0, parseInt(newQuantity, 10) || 0);

    // Update quantity for the specific product
    const updatedProducts = selectedProduct.map((p) =>
      p.selectedVariant.variant_id === product.selectedVariant.variant_id
        ? { ...p, quantity: validQuantity }
        : p
    );

    // Update the state with the updated products array
    setSelectedProduct(updatedProducts);
  };

  useEffect(() => {
    console.log(selectedProduct);
  }, [selectedProduct]);

  const handleSearch = (event) => {
    event.preventDefault();
    // var searchProduct = products.filter((searchValue) => {
    //   searchValue.name.toLowerCase().includes(event.target.value.toLowerCase());
    // });
    if (event.nativeEvent.text.length) {
      setIsSearching(true);
    }
    const searchTerm = event.nativeEvent.text.toLowerCase();

    var searchCustomer = initialState.filter((customer) => {
      const firstName = customer.firstName?.toLowerCase() || "";
      const lastName = customer.lastName.toLowerCase() || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const email = customer.email.toLowerCase() || "";

      // Check if the search term matches either the product name or ID
      return fullName.includes(searchTerm) || email.includes(searchTerm);
    });
    console.log("Searching...", searchCustomer);
    setCustomersData(searchCustomer);
    if (event.nativeEvent.text.length === 0) {
      setCustomersData(initialState);
      setIsSearching(false);
    }
  };

  const handleAddOrder = async (status) => {
    try {
      const temData = {
        orderGenerated: salesmanID,
        items: [...selectedProduct],
        subtotal: selectedProduct.reduce(
          (sum, product) =>
            sum + product.selectedVariant.price * product.quantity,
          0
        ),
        customerID: customerData.id,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: selectedProduct.reduce(
          (sum, product) =>
            sum + product.selectedVariant.price * product.quantity,
          0
        ),
        status: "Pending", // Current status of the order (e.g., Pending, Processing, Shipped)
        orderDate: new Date(),
        payment: {
          method:
            status === "Credit Card"
              ? status
              : status === "Paid"
              ? "Cash"
              : status === "Installments"
              ? status
              : null,
          paymentStatus:
            status === "Credit Card"
              ? "Paid"
              : status === "Paid"
              ? status
              : status === "Installments"
              ? "Partial Paid"
              : "Unpaid",
          paymentDate: status === "Later" ? undefined : date,
          dueDate: status === "Later" ? date : undefined,
          ...(isInstallment
            ? {
                installment: [
                  {
                    amount: parseInt(installmentAmount),
                    date: new Date(),
                  },
                ],
              }
            : null),
        },
        notes: notes,
      };

      console.log(temData);
      // Handle success state or redirect
      if (Object.keys(customerData).length !== 0) {
        const response = await fetch("http://localhost:5000/orders/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(temData),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          const data = await response.json();
          console.log("Success:", data);
          // if (customerID !== 0) {
          //   router.push(`/pages/customers/details/${temData.customerID}`);
          // } else {
          //   router.push("/pages/orders/");
          // }
          // toast("Ordered successfully.", {
          //   description: "View details in the orders.",
          // });
        }
      } else {
        // toast("Please select a customer.", {
        //   description: "Customer can't be empty.",
        // });
      }
    } catch (error) {
      console.error("Error:", error);
      // toast("Uh oh! Something went wrong.", {
      //   description: "There was a problem with your request.",
      // });
      // Handle error state
    }
  };

  return (
    <>
      <SafeAreaView className="relative flex-1 bg-muted/40">
        <GestureHandlerRootView>
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
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Customer</CardTitle>
                  {customerData && Object.keys(customerData).length !== 0 && (
                    <Button
                      size="icon"
                      onPress={() => setCustomerData(undefined)}
                    >
                      <Trash2
                        size={18}
                        color={colorScheme === "dark" ? "black" : "white"}
                      />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="gap-6">
                  {customerData && Object.keys(customerData).length !== 0 ? (
                    <View className="flex gap-5">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-semibold tracking-tight capitalize">
                          {customerData.firstName} {customerData.lastName}
                        </Text>
                        <Text className="text-sm font-medium leading-none">
                          0 Orders
                        </Text>
                      </View>
                      <View className="flex gap-3">
                        <Text className="text-lg font-semibold">
                          Contact Information
                        </Text>
                        <View className="flex-row justify-between items-center">
                          <Text className="text-md font-medium tracking-tight">
                            {customerData.email}
                          </Text>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                          >
                            <Copy
                              size={12}
                              color={colorScheme === "dark" ? "white" : "black"}
                            />
                          </Button>
                        </View>
                        <View className="flex-row justify-between items-center">
                          <Text className="text-md font-medium tracking-tight">
                            {customerData.phone?.callingCode}
                            {customerData.phone?.number}
                          </Text>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                          >
                            <Copy
                              size={12}
                              color={colorScheme === "dark" ? "white" : "black"}
                            />
                          </Button>
                        </View>
                      </View>
                      <View className="flex gap-3">
                        <Text className="text-lg font-semibold">
                          Shipping and Billing Address
                        </Text>
                        <View className="flex gap-1">
                          <Text className="text-md capitalize">
                            {customerData.address?.shipping.firstName}{" "}
                            {customerData.address?.shipping.lastName}
                          </Text>
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
                    </View>
                  ) : (
                    <View className="gap-6">
                      <View className="relative">
                        <Search
                          style={{
                            position: "absolute",
                            left: 13,
                            top: 13,
                            zIndex: 1,
                          }}
                          color={colorScheme === "dark" ? "#fff" : "#000"}
                          size={16}
                        />
                        <Input
                          placeholder="Search..."
                          className="w-full rounded-lg bg-background pl-10"
                          onChange={handleSearch}
                        />
                        {/* (e) => {
                          if (e.nativeEvent.text.length) {
                            setIsSearching(true);
                          } else {
                            setIsSearching(false);
                          }
                        } */}
                      </View>
                      {isSearching && (
                        <ScrollView className="max-h-[200px]">
                          <View className="flex gap-4 bg-muted/40 p-4 rounded-md">
                            {customersData.length > 0 &&
                              customersData.map((customer, index) => (
                                <Pressable
                                  className={
                                    customersData.length === index + 1
                                      ? "flex gap-2"
                                      : "flex gap-2 pb-4 border-b-[0.5px] border-border"
                                  }
                                  onPress={() => {
                                    setCustomerData(customer);
                                    setIsSearching(false);
                                  }}
                                  key={index}
                                >
                                  <View className="flex-row items-center">
                                    <Text className="text-md font-semibold">
                                      {customer.firstName}{" "}
                                    </Text>
                                    <Text className="text-md font-semibold">
                                      {customer.lastName}
                                    </Text>
                                  </View>
                                  <Text className="text-base font-normal leading-none text-muted-foreground">
                                    {customer.email}
                                  </Text>
                                </Pressable>
                              ))}
                          </View>
                        </ScrollView>
                      )}
                      <Button className="flex flex-row justify-center gap-4">
                        <CirclePlus
                          size={16}
                          color={colorScheme === "dark" ? "#000" : "#fff"}
                        />
                        <Text>Add new customer</Text>
                      </Button>
                    </View>
                  )}
                </CardContent>
              </Card>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row gap-4">
                  <View className="flex-1">
                    <Button variant="outline">
                      <Text>Make Custom Item</Text>
                    </Button>
                  </View>
                  <View className="flex-1">
                    <Button onPress={() => bottomSheetRef.current?.expand()}>
                      <Text>Add Products</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
              {selectedProduct.length !== 0 && (
                <Card className="mb-4">
                  <CardContent className="gap-4 pt-6">
                    {selectedProduct.map((product, index) => (
                      <View
                        className={
                          selectedProduct.length !== index + 1
                            ? "flex-row flex-wrap gap-4 pb-4 border-b-[0.5px] border-border"
                            : "flex-row flex-wrap gap-4"
                        }
                        key={index}
                      >
                        <View
                          className="flex w-[15%]"
                          onLayout={(event) => {
                            const { width } = event.nativeEvent.layout;
                            setImgWidth(width);
                          }}
                        >
                          <Image
                            source={require("@/assets/images/icon.png")}
                            className="rounded"
                            style={{
                              width: imgWidth || "100%",
                              height: "auto",
                              aspectRatio: 1,
                            }}
                          />
                        </View>
                        <View className="w-[80%]">
                          <View className="flex flex-row justify-between">
                            <View>
                              <Text className="text-xl font-medium">
                                {product.name}
                              </Text>
                              <Muted className="text-lg uppercase">
                                {product.selectedVariant.size}
                              </Muted>
                              <Text>
                                ${" "}
                                {product.selectedVariant.price.toLocaleString()}
                              </Text>
                            </View>
                            <Button
                              variant="destructive"
                              size="icon"
                              onPress={() =>
                                handleDeleteProduct(product.selectedVariant)
                              }
                            >
                              <Trash2 size={16} color="#fff" />
                            </Button>
                          </View>
                          <View className="flex flex-row justify-between mt-3">
                            <Text className="text-xl text-muted-foreground font-medium">
                              Quantity
                            </Text>
                            <Text className="text-xl text-muted-foreground font-medium">
                              Total
                            </Text>
                          </View>
                          <View className="flex flex-row justify-between items-center mt-3">
                            <View className="flex flex-row justify-between items-center border border-slate-300 rounded-md p-1">
                              <Button
                                size="icon"
                                onPress={() =>
                                  handleQuantityChange(
                                    product,
                                    (product.quantity - 1).toString()
                                  )
                                }
                              >
                                <Text>-</Text>
                              </Button>
                              <Input
                                className="border-0 min-w-[50px]"
                                keyboardType="numeric"
                                value={product.quantity.toString()}
                                onChangeText={(text) =>
                                  handleQuantityChange(product, text)
                                }
                                aria-labelledby="inputLabel"
                                aria-errormessage="inputError"
                              />
                              <Button
                                size="icon"
                                onPress={() =>
                                  handleQuantityChange(
                                    product,
                                    (product.quantity + 1).toString()
                                  )
                                }
                              >
                                <Text>+</Text>
                              </Button>
                            </View>
                            <Text className="text-lg font-medium">
                              ${" "}
                              {(
                                product.selectedVariant.price * product.quantity
                              ).toLocaleString()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </CardContent>
                </Card>
              )}
              <Card className={selectedProduct.length ? "mb-4" : null}>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="gap-4">
                  <View className="flex-row justify-between">
                    <Text className="text-lg">Subtotal</Text>
                    <Text className="text-lg">
                      ${" "}
                      {selectedProduct
                        .reduce(
                          (sum, product) =>
                            sum +
                            product.selectedVariant.price * product.quantity,
                          0
                        )
                        .toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg text-muted-foreground">
                      Add discount
                    </Text>
                    <Text className="text-lg">$ 0</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg text-muted-foreground">
                      Add shipping or delivery
                    </Text>
                    <Text className="text-lg">$ 0</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Small>Not calculated</Small>
                      <Text className="text-lg text-muted-foreground">
                        Estimated tax
                      </Text>
                    </View>
                    <Text className="text-lg">$ 0</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg font-medium">Total</Text>
                    <Text className="text-lg font-medium">
                      ${" "}
                      {selectedProduct
                        .reduce(
                          (sum, product) =>
                            sum +
                            product.selectedVariant.price * product.quantity,
                          0
                        )
                        .toLocaleString()}
                    </Text>
                  </View>
                  {selectedProduct.length !== 0 && (
                    <>
                      <Separator />
                      <View className="flex gap-5">
                        <View className="rounded-md border border-border p-4 gap-6">
                          <View className="flex-row gap-3">
                            <Checkbox
                              checked={paymentDueLater}
                              onCheckedChange={() => {
                                setPaymentDueLater(!paymentDueLater);
                                setIsInstallment(false);
                                setInstallmentAmount(0);
                              }}
                            />
                            <Label>Payment due later</Label>
                          </View>
                          {paymentDueLater && (
                            <Select
                              defaultValue={{
                                value: "1 Week",
                                label: "1 Week",
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  className="text-foreground text-sm native:text-lg"
                                  placeholder="Select a fruit"
                                />
                              </SelectTrigger>
                              <SelectContent className="min-w-[80%]">
                                <SelectGroup>
                                  <SelectLabel>Fruits</SelectLabel>
                                  <SelectItem label="1 Week" value="1 Week">
                                    1 Week
                                  </SelectItem>
                                  <SelectItem label="Banana" value="banana">
                                    Banana
                                  </SelectItem>
                                  <SelectItem
                                    label="Blueberry"
                                    value="blueberry"
                                  >
                                    Blueberry
                                  </SelectItem>
                                  <SelectItem label="Grapes" value="grapes">
                                    Grapes
                                  </SelectItem>
                                  <SelectItem
                                    label="Pineapple"
                                    value="pineapple"
                                  >
                                    Pineapple
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        </View>
                        <View className="rounded-md border border-border p-4 gap-6">
                          <View className="flex-row gap-3">
                            <Checkbox
                              aria-labelledby="inputLabel"
                              checked={isInstallment}
                              onCheckedChange={() => {
                                setIsInstallment(!isInstallment);
                                setPaymentDueLater(false);
                              }}
                            />
                            <Label
                              nativeID="inputLabel"
                              accessibilityLabel="inputLabel"
                            >
                              Add installments
                            </Label>
                          </View>
                          {isInstallment && (
                            <View className="flex-row gap-4">
                              <View className="flex-1">
                                <Input
                                  placeholder="Amount paying"
                                  keyboardType="numeric"
                                  onChange={(e) =>
                                    setInstallmentAmount(e.nativeEvent.text)
                                  }
                                />
                              </View>
                              <View className="flex-1 self-center">
                                <Text className="font-medium">
                                  ${" "}
                                  {(
                                    selectedProduct.reduce(
                                      (sum, product) =>
                                        sum +
                                        product.selectedVariant.price *
                                          product.quantity,
                                      0
                                    ) - installmentAmount
                                  ).toLocaleString()}{" "}
                                  still remaining
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                        <View className="flex-row gap-4">
                          <View className="flex-1">
                            <Button variant="outline">
                              <Text>Send Invoice</Text>
                            </Button>
                          </View>
                          <View className="flex-1">
                            {isInstallment ? (
                              // Show only the installment button if isInstallment is true
                              <Button>
                                <Text>Set Up Installments</Text>
                              </Button>
                            ) : paymentDueLater ? (
                              // Show the Create Order button if paymentDueLater is true and isInstallment is false
                              <Button>
                                <Text>Create Order</Text>
                              </Button>
                            ) : (
                              <>
                                {/* // Show the dropdown menu if neither isInstallment
                              nor paymentDueLater is true */}
                                {/* <Button>
                              <Text>Generate Order</Text>
                            </Button> */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button>
                                      <Text>Generate Order</Text>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-64 native:w-72"
                                  >
                                    <DropdownMenuGroup>
                                      <DropdownMenuItem
                                        onPress={() => handleAddOrder("Paid")}
                                      >
                                        <Text>Mark as Paid</Text>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Text>Credit card payment</Text>
                                      </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </>
                            )}
                            {/* <Button>
                          <Text>Generate Order</Text>
                        </Button> */}
                          </View>
                        </View>
                      </View>
                    </>
                  )}
                </CardContent>
              </Card>
              {selectedProduct.length === 0 && (
                <View className="p-6">
                  <Text className="text-lg leading-5 mb-0">
                    Add a product to calculate and view payment options
                  </Text>
                </View>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write some stuff..."
                    aria-labelledby="textareaLabel"
                  />
                </CardContent>
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
          <BottomSheet
            ref={bottomSheetRef}
            index={-1} // Start with the BottomSheet closed
            snapPoints={snapPoints}
            backgroundStyle={
              colorScheme === "dark"
                ? { backgroundColor: "hsl(240 3.7% 10%)" }
                : { backgroundColor: "hsl(240 4.8% 95.9%)" }
            }
            enablePanDownToClose={true}
            onChange={(index) => console.log("Bottom Sheet Index:", index)} // Optional
          >
            <View className="flex-1 justify-end p-6">
              <ScrollView>
                <View className="flex gap-4">
                  <View className="relative">
                    <Search
                      style={{
                        position: "absolute",
                        left: 13,
                        top: 13,
                        zIndex: 1,
                      }}
                      color={colorScheme === "dark" ? "#fff" : "#000"}
                      size={16}
                    />
                    <Input
                      placeholder="Search..."
                      className="w-full rounded-lg bg-background pl-10"
                    />
                  </View>
                  {products.map((product, index) => (
                    <React.Fragment key={index}>
                      {product.variants.map((variant, vIndex) => {
                        // Determine if this is the last variant of the last product
                        const isLastVariant =
                          vIndex === product.variants.length - 1;
                        const isLastProduct = index === products.length - 1;
                        const hasBorderBottom = !(
                          isLastProduct && isLastVariant
                        );

                        return (
                          <View
                            className={`flex-row gap-3 pb-4 ${
                              hasBorderBottom
                                ? "border-b-[0.5px] border-border"
                                : ""
                            }`}
                            key={vIndex}
                          >
                            <View className="w-[10%] self-center">
                              <Checkbox
                                checked={isChecked(product, vIndex)}
                                onCheckedChange={(checked) => {
                                  if (!checked) {
                                    console.log("variant", variant.variant_id);
                                    handleDeleteProduct(variant);
                                  } else {
                                    handleVariantSelect(product, vIndex);
                                  }
                                  console.log("checked", checked);
                                }}
                              />
                            </View>
                            <View
                              className="w-[15%]"
                              onLayout={(event) => {
                                const { width } = event.nativeEvent.layout;
                                setImgWidthParent(width);
                              }}
                            >
                              <Image
                                source={require("@/assets/images/icon.png")}
                                className="rounded"
                                style={{
                                  width: imgWidthParent || "100%",
                                  height: "auto",
                                  aspectRatio: 1,
                                }}
                              />
                            </View>
                            <View className="flex-1 flex-row justify-between items-center w-[75%]">
                              <View className="flex-1 h-[50px]">
                                <Text className="text-xl font-medium">
                                  {product.name}
                                </Text>
                                <Text className="text-lg text-muted-foreground uppercase">
                                  {variant.size}
                                </Text>
                              </View>
                              <View className="items-center">
                                <Text className="text-lg font-medium">
                                  ${variant.price.toLocaleString()}
                                </Text>
                              </View>
                            </View>
                            {/* <View className="flex-1 w-85%">
                          <View className="flex-1 flex-row justify-between items-center ">
                            <View className="flex-1 justify-between">
                              <Text className="text-xl font-medium">
                                {product.name}
                              </Text>
                              <Text className="text-lg text-muted-foreground uppercase">
                                {variant.size}
                              </Text>
                            </View>
                            <Text>$ {variant.price.toLocaleString()}</Text>
                          </View>
                        </View> */}
                          </View>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </View>
              </ScrollView>
              <View className="flex flex-row gap-4">
                <View className="flex-1">
                  <Button
                    variant="outline"
                    onPress={() => {
                      setSelectedProduct([]);
                      bottomSheetRef.current?.close();
                    }}
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
                <View className="flex-1">
                  <Button onPress={() => bottomSheetRef.current?.close()}>
                    <Text>Save</Text>
                  </Button>
                </View>
              </View>
            </View>
          </BottomSheet>
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  );
};

export default newOrder;
