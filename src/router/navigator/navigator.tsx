import { BottomTabView } from "@react-navigation/bottom-tabs";
import { createNavigatorFactory, TabRouter, useNavigationBuilder } from "@react-navigation/native";
import PapillonNavigatorTabs from "./tabs";
import { memo, useEffect, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import PapillonNavigatorMenu from "./menu";

const BottomTabNavigator: React.ComponentType<any> = ({
  initialRouteName,
  backBehavior,
  children,
  screenOptions,
  ...rest
}) => {
  const [tablet, setTablet] = useState(Dimensions.get("window").width > 600);

  Dimensions.addEventListener("change", () => {
    setTablet(Dimensions.get("window").width > 600);
  });

  const {
    state,
    descriptors,
    navigation,
    NavigationContent
  } = useNavigationBuilder(TabRouter, {
    initialRouteName,
    backBehavior,
    children,
    screenOptions,
  });

  return (
    <NavigationContent>
      <View style={[
        { flex: 1 },
        tablet && { flexDirection: "row" },
      ]}>
        {tablet && (
          <PapillonNavigatorMenu
            state={state}
            descriptors={descriptors}
            navigation={navigation}
          />
        )}

        <BottomTabView
          {...rest}
          state={state}
          navigation={navigation}
          descriptors={descriptors}
        />

        {!tablet && (
          <PapillonNavigatorTabs
            state={state}
            descriptors={descriptors}
            navigation={navigation}
          />
        )}
      </View>
    </NavigationContent>
  );
};

export default createNavigatorFactory(BottomTabNavigator);