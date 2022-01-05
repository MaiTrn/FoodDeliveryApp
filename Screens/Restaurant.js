import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { icons, images, SIZES, FONTS, COLORS } from "../constants";
import { isIphoneX } from "react-native-iphone-x-helper";

const Restaurant = ({ navigation, route }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const scrollX = new Animated.Value(0);

  useEffect(() => {
    let { item, currentLocation } = route.params;

    setRestaurant(item);
    setCurrentLocation(currentLocation);
  });

  function editOrder(action, menuId, price) {
    let orderList = orderItems.slice();
    // item is a new var containing a menu order
    // attribute: *qty
    //            *total

    let item = orderList.filter((a) => a.menuId == menuId);

    if (action == "+") {
      if (item.length > 0) {
        item[0].qty = item[0].qty + 1;
        item[0].total = item[0].qty * price;
      } else {
        const newItem = {
          menuId: menuId,
          qty: 1,
          price: price,
          total: price,
        };
        orderList.push(newItem);
      }
    } else {
      if (item.length > 0) {
        if (item[0].qty > 0) {
          item[0].qty = item[0].qty - 1;
          item[0].total = item[0].qty * price;
        }
      }
    }

    setOrderItems(orderList);
  }

  function getOrderQty(menuId) {
    let orderItem = orderItems.filter((a) => a.menuId == menuId);

    if (orderItem.length > 0) {
      return orderItem[0].qty;
    } else return 0;
  }

  function getBasketItemCount() {
    return orderItems.reduce((a, b) => a + (b.qty || 0), 0);
  }

  function sumOrder() {
    return orderItems.reduce((a, b) => a + (b.total || 0), 0);
  }

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 50,
          marginTop: 25,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 2,
            justifyContent: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{
              height: 30,
              width: 30,
            }}
          />
        </TouchableOpacity>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              height: 50,
              backgroundColor: COLORS.lightGray3,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: SIZES.padding * 3,
              borderRadius: SIZES.radius,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>{restaurant?.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: "center",
          }}
        >
          <Image
            source={icons.list}
            resizeMode="contain"
            style={{
              height: 30,
              width: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
  function renderFoodInfo() {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        {restaurant?.menu.map((item, index) => (
          <View key={`menu-${index}`} style={{ alignItems: "center" }}>
            <View style={{ height: SIZES.height * 0.35 }}>
              {/* Food Image*/}
              <Image
                source={item.photo}
                resizeMode="cover"
                style={{
                  width: SIZES.width,
                  height: "100%",
                  borderRadius: SIZES.radius,
                }}
              />

              {/* Quantity */}
              <View
                style={{
                  position: "absolute",
                  bottom: -20,
                  width: SIZES.width,
                  height: 50,
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: 50,
                    backgroundColor: COLORS.white,
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    ...styles.shadow,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 50,
                      height: 50,
                      borderTopLeftRadius: 25,
                      borderBottomLeftRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => editOrder("-", item.menuId, item.price)}
                  >
                    <Text style={{ ...FONTS.body1 }}>—</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: 50,
                    backgroundColor: COLORS.white,
                    alignItems: "center",
                    justifyContent: "center",
                    ...styles.shadow,
                  }}
                >
                  <Text style={{ ...FONTS.h2 }}>
                    {getOrderQty(item.menuId)}
                  </Text>
                </View>

                <View
                  style={{
                    width: 50,
                    backgroundColor: COLORS.white,
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    ...styles.shadow,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 50,
                      height: 50,
                      borderTopRightRadius: 25,
                      borderBottomRightRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => editOrder("+", item.menuId, item.price)}
                  >
                    <Text style={{ ...FONTS.body1 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Name & Description */}
              <View
                style={{
                  width: SIZES.width,
                  alignItems: "center",
                  marginTop: 15,
                  paddingHorizontal: SIZES.padding * 2,
                }}
              >
                <Text
                  style={{
                    marginVertical: 10,
                    textAlign: "center",
                    ...FONTS.h2,
                  }}
                >
                  {item.name} — {item.price.toFixed(2)}
                </Text>
                <Text style={{ textAlign: "center", ...FONTS.body3 }}>
                  {item.description}
                </Text>
              </View>

              {/* Calories */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={icons.fire}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: COLORS.darkgray, ...FONTS.body3 }}>
                  {item.calories.toFixed(2)} cal
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    );
  }

  function renderDots() {
    const dotPosition = Animated.divide(scrollX, SIZES.width);

    return (
      <View style={{ height: 30 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: SIZES.padding,
          }}
        >
          {restaurant?.menu.map((item, index) => {
            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
              extrapolate: "clamp",
            });

            const dotColor = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={`dot-${index}`}
                opacity={opacity}
                style={{
                  borderRadius: SIZES.radius,
                  marginHorizontal: 6,
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: dotColor,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  function renderOrder() {
    return (
      <View>
        {renderDots()}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
              borderBottomColor: COLORS.lightGray2,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>
              {getBasketItemCount()} items in Cart
            </Text>
            <Text style={{ ...FONTS.h3 }}>${sumOrder().toFixed(2)}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={icons.pin}
                resizeMode="contain"
                style={{ width: 20, height: 20, tintColor: COLORS.darkgray }}
              />
              <Text style={{ marginLeft: SIZES.padding, ...FONTS.h4 }}>
                {currentLocation?.streetName}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Image
                source={icons.master_card}
                resizeMode="contain"
                style={{ width: 20, height: 20, tintColor: COLORS.darkgray }}
              />
              <Text style={{ marginLeft: SIZES.padding, ...FONTS.h4 }}>
                888
              </Text>
            </View>
          </View>
          {/* Order Button */}
          <View
            style={{
              padding: SIZES.padding * 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                padding: SIZES.padding,
                alignItems: "center",
                borderRadius: SIZES.radius,
                width: SIZES.width * 0.9,
                ...styles.shadow,
              }}
              onPress={() =>
                navigation.navigate("OrderDelivery", {
                  restaurant: restaurant,
                  currentLocation: currentLocation,
                })
              }
            >
              <Text style={{ color: COLORS.white, ...FONTS.h2 }}>ORDER</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isIphoneX() && (
          <View
            style={{
              position: "absolute",
              bottom: -34,
              left: 0,
              right: 0,
              height: 34,
              backgroundColor: COLORS.white,
            }}
          ></View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderFoodInfo()}
      {renderOrder()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 7,
  },
});

export default Restaurant;
