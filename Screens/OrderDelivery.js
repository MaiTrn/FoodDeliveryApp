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
import {
  icons,
  images,
  SIZES,
  FONTS,
  COLORS,
  GOOGLE_API_KEY,
} from "../constants";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const OrderDelivery = ({ route, navigation }) => {
  const mapView = React.useRef();

  const [rest, setRestaurant] = useState(null);
  const [streetName, setStreetName] = useState("");
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [region, setRegion] = React.useState(null);

  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let { restaurant, currentLocation } = route.params;

    let fromLoc = currentLocation.gps;
    let toLoc = restaurant.location;
    let street = currentLocation.streetName;

    let mapRegion = {
      latitude: (fromLoc.latitude + toLoc.latitude) / 2,
      longitude: (fromLoc.longitude + toLoc.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
    };

    setRestaurant(restaurant);
    setStreetName(street);
    setFromLocation(fromLoc);
    setToLocation(toLoc);
    setRegion(mapRegion);
  }, []);

  function calculateAngle(coordinates) {
    let startLat = coordinates[0]["latitude"];
    let startLng = coordinates[0]["longitude"];
    let endLat = coordinates[1]["latitude"];
    let endLng = coordinates[1]["longitude"];
    let dx = endLat - startLat;
    let dy = endLng - startLng;

    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  function zoomIn() {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta / 1.5,
      longitudeDelta: region.longitudeDelta / 1.5,
    };

    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  }

  function zoomOut() {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta * 1.5,
      longitudeDelta: region.longitudeDelta * 1.5,
    };

    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  }

  function renderMap() {
    const destinationMarker = () => (
      <Marker coordinate={toLocation}>
        <View
          style={{
            height: 35,
            width: 35,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.white,
          }}
        >
          <View
            style={{
              height: 25,
              width: 25,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
            }}
          >
            <Image
              source={icons.pin}
              style={{
                width: 17,
                height: 17,
                tintColor: COLORS.white,
              }}
            />
          </View>
        </View>
      </Marker>
    );

    const carIcon = () => (
      <Marker
        coordinate={fromLocation}
        anchor={{ x: 0.5, y: 0.5 }}
        flat={true}
        rotation={angle}
      >
        <Image source={icons.car} style={{ width: 30, height: 30 }} />
      </Marker>
    );

    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapView}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
        >
          <MapViewDirections
            origin={fromLocation}
            destination={toLocation}
            apikey={GOOGLE_API_KEY}
            strokeWidth={5}
            strokeColor={COLORS.primary}
            onReady={(result) => {
              setDuration(result.duration);

              if (!isReady) {
                //fit route into maps
                mapView.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: SIZES.width / 20,
                    bottom: SIZES.height / 4,
                    left: SIZES.width / 20,
                    top: SIZES.height / 8,
                  },
                });

                //reposisiton the car
                let nextLoc = {
                  latitude: result.coordinates[0]["latitude"],
                  longitude: result.coordinates[0]["longitude"],
                };

                if (result.coordinates.length >= 2) {
                  let angle = calculateAngle(result.coordinates);
                  setAngle(angle);
                }
                setFromLocation(nextLoc);
                setIsReady(true);
              }
            }}
          />
          {destinationMarker()}
          {carIcon()}
        </MapView>
      </View>
    );
  }

  function renderDestinationHeader() {
    return (
      <View
        style={{
          position: "absolute",
          top: 45,
          left: 0,
          right: 0,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
            ...styles.shadow,
          }}
        >
          <Image
            source={icons.red_pin}
            style={{ width: 30, height: 30, marginRight: SIZES.padding }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ ...FONTS.body3 }}>{streetName}</Text>
          </View>

          <Text style={{ ...FONTS.body3 }}>{Math.ceil(duration)} mins</Text>
        </View>
      </View>
    );
  }

  function renderDeliveryInfo() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 25,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: SIZES.radius,
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding * 3,
            paddingHorizontal: SIZES.padding * 2,
            ...styles.shadow,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={rest?.courier.avatar}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />

            <View
              style={{
                flex: 1,
                marginLeft: SIZES.padding,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ ...FONTS.h4 }}>{rest?.courier.name}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: COLORS.primary,
                      marginRight: SIZES.padding,
                    }}
                  />
                  <Text style={{ ...FONTS.body3 }}>{rest?.rating}</Text>
                </View>
              </View>

              <Text style={{ color: COLORS.darkgray, ...FONTS.body4 }}>
                {rest?.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: SIZES.padding * 2,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                marginRight: 10,
                //width: SIZES.width * 0.5 - SIZES.padding * 6,
                height: 50,
                backgroundColor: COLORS.primary,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("Home")}
            >
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h4,
                }}
              >
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                marginLeft: 10,
                // width: SIZES.width * 0.5 - SIZES.padding * 6,
                height: 50,
                backgroundColor: COLORS.secondary,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h4,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderButtons() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: SIZES.height * 0.35,
          right: SIZES.padding * 2,
          height: 130,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            justifyContent: "center",
            alignItems: "center",
            ...styles.shadow,
          }}
          onPress={() => zoomIn()}
        >
          <Text style={{ ...FONTS.body1 }}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            justifyContent: "center",
            alignItems: "center",
            ...styles.shadow,
          }}
          onPress={() => zoomOut()}
        >
          <Text style={{ ...FONTS.body1 }}>—</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {renderMap()}
      {renderDestinationHeader()}
      {renderDeliveryInfo()}
      {renderButtons()}
    </View>
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
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 10,
  },
});

export default OrderDelivery;
