import React, { ReactNode } from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle, TextStyle, Platform, TouchableNativeFeedback } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import Reanimated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  FadeOutUp,
  FlipInXDown,
  LinearTransition,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { animPapillon } from "@/utils/ui/animations";

interface NativeListProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  inline?: boolean;
  animated?: boolean;
  entering?: boolean;
  exiting?: boolean;
}

export const NativeList: React.FC<NativeListProps> = ({ children, style, inline, animated, entering, exiting }: NativeListProps) => {
  const theme = useTheme();
  const { colors } = theme;

  // for each element of children, render it wrapped in a View
  // with a style of styles.item
  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return null;

    const newChild = child && React.cloneElement(child as React.ReactElement<any>, {
      separator: (child.props.separator !== false) && index < (React.Children.count(children) - 1),
    });

    return (
      <Reanimated.View
        style={list_styles.item}
        layout={animated && animPapillon(LinearTransition)}
        key={newChild.props.identifier || null}
      >
        {newChild}
      </Reanimated.View>
    );
  });

  return (
    <Reanimated.View
      style={[
        list_styles.list,
        {
          borderWidth: 0.5,
          borderColor: colors.border,
          backgroundColor: colors.card,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          overflow: "visible",
          elevation: 1,
        },
        inline && { marginTop: 16 },
        style,
      ]}
      layout={animated && animPapillon(LinearTransition)}
      entering={entering && entering}
      exiting={exiting && exiting}
    >
      <Reanimated.View
        style={[{
          borderRadius: 16,
          borderCurve: "continuous",
          overflow: "hidden",
        }]}
        layout={animated && animPapillon(LinearTransition)}
      >
        {childrenWithProps}
      </Reanimated.View>
    </Reanimated.View>
  );
};

interface NativeListHeaderProps {
  icon?: ReactNode;
  label: string;
  trailing?: ReactNode;
  animated?: boolean;
  entering?: boolean;
  exiting?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const NativeListHeader: React.FC<NativeListHeaderProps> = ({ icon, label, leading, trailing, animated, entering, exiting, style }) => {
  const theme = useTheme();
  const { colors } = theme;

  let newIcon = null;

  if (icon) {
    newIcon = React.cloneElement(icon as React.ReactElement<any>, {
      size: 20,
      strokeWidth: 2.2,
      color: colors.text,
    });
  }

  return (
    <Reanimated.View
      style={[list_header_styles.container, style]}
      layout={animated && animPapillon(LinearTransition)}
      entering={entering && entering}
      exiting={exiting && exiting}
    >
      {icon && (
        <View
          style={list_header_styles.icon}
        >
          {newIcon}
        </View>
      )}

      {leading && leading}

      <Text
        style={[
          { color: colors.text },
          list_header_styles.label,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {trailing}
    </Reanimated.View>
  );
};

interface NativeItemProps {
  children?: ReactNode;
  onPress?: () => void;
  separator?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  chevron?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  animated?: boolean;
  entering?: boolean;
  exiting?: boolean;
  onLongPress?: () => void;
  delayLongPress?: number;
  icon?: ReactNode;
  iconStyle?: StyleProp<ViewStyle>;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  androidStyle?: StyleProp<ViewStyle>;
  title?: string;
  subtitle?: string;
  endPadding?: number;
  disabled?: boolean;
}

export const NativePressable = (props) => {
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        {...props}
      >
        <View
          style={[{
            flexDirection: "row",
            alignItems: "center",
          }, props.style, props.androidStyle]}
        >
          {props.children}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <Pressable
      {...props}
    >
      {props.children}
    </Pressable>
  );
};

export const NativeItem: React.FC<NativeItemProps> = ({
  children,
  onPress,
  onLongPress,
  delayLongPress,
  separator,
  leading,
  trailing,
  chevron,
  style,
  contentContainerStyle,
  animated,
  entering,
  exiting,
  icon,
  iconStyle,
  onTouchStart,
  onTouchEnd,
  androidStyle,
  title,
  subtitle,
  endPadding,
  disabled,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Reanimated.View
      layout={animated && animPapillon(LinearTransition)}
      entering={entering && entering}
      exiting={exiting && exiting}
    >
      <NativePressable
        onPress={!disabled ? onPress : () => {}}
        onLongPress={!disabled ? onLongPress : () => {}}
        delayLongPress={delayLongPress}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        androidStyle={androidStyle}
        style={({ pressed }) => [
          item_styles.item,
          onPress && {
            backgroundColor: pressed && !disabled ? colors.text + "12" : "transparent",
          },
          style,
          disabled && {
            opacity: 0.5,
          },
        ]}
      >
        <View style={[item_styles.part, item_styles.leading]}>
          {leading && !icon && leading}

          {icon && (
            React.cloneElement(icon as React.ReactElement<any>, {
              size: 24,
              color: colors.text,
              style: {
                marginRight: 16,
                opacity: 0.8,
                marginLeft: 0,
              },
              ...iconStyle
            })
          )}
        </View>

        <View style={[
          {
            flex: 1,
            height: "100%",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            borderBottomWidth: separator ? 0.5 : 0,
            borderColor: colors.border,
          },
          !leading && { marginLeft: -15 },
        ]}>

          <View style={[
            item_styles.part,
            item_styles.content
          ]}>
            {title && (
              <NativeText variant="title">
                {title}
              </NativeText>
            )}

            {subtitle && (
              <NativeText variant="subtitle">
                {subtitle}
              </NativeText>
            )}

            {children}
          </View>

          <View style={[item_styles.part, item_styles.trailing, {
            paddingRight: endPadding ?? 9,
          }]}>
            {trailing}
          </View>

          {onPress && chevron !== false && (
            <ChevronRight
              size={24}
              strokeWidth={2.5}
              color={colors.text}
              style={{
                opacity: 0.6,
                marginRight: 6,
              }}
            />
          )}
        </View>
      </NativePressable>
    </Reanimated.View>
  );
};

interface NativeIconProps {
  icon: ReactNode;
  color: string;
  style: StyleProp<ViewStyle>;
}

export const NativeIcon: React.FC<NativeIconProps> = ({ icon, color, style }) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View
      style={[{
        backgroundColor: color,
        borderRadius: 9,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
      }, style]}
    >
      {React.cloneElement(icon as React.ReactElement<any>, {
        size: 22,
        strokeWidth: 2.4,
        color: "#FFFFFF",
      })}
    </View>
  );
};

interface NativeTextProps {
  children: ReactNode;
  variant?: "title" | "titleLarge" | "subtitle" | "overtitle" | "body"| "default";
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
}

export const NativeText: React.FC<NativeTextProps> = (props) => {
  const theme = useTheme();
  const { colors } = theme;

  let fontStyle: TextStyle = {};

  switch (props.variant) {
    case "title":
      fontStyle = {
        fontFamily: "semibold",
        fontSize: 17,
        lineHeight: 20,
      };
      break;
    case "titleLarge":
      fontStyle = {
        fontFamily: "semibold",
        fontSize: 19,
        lineHeight: 24,
      };
      break;
    case "subtitle":
      fontStyle = {
        fontFamily: "medium",
        fontSize: 15,
        lineHeight: 18,
        opacity: 0.6,
      };
      break;
    case "overtitle":
      fontStyle = {
        fontFamily: "semibold",
        fontSize: 16,
        lineHeight: 18,
      };
      break;
    default:
      fontStyle = {
        fontFamily: "medium",
        fontSize: 16,
        lineHeight: 19,
      };
      break;
  }

  return (
    <Text
      {...props}
      style={[{
        fontFamily: "medium",
        fontSize: 16,
        color: props.color || colors.text,
      }, fontStyle, props.style]}
    >
      {props.children}
    </Text>
  );
};

const list_styles = StyleSheet.create({
  list: {
    borderRadius: 16,
    flexDirection: "column",
    overflow: "hidden",
    marginTop: 24,
  },
  item: {}
});

const list_header_styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 24,
    marginBottom: -10,
    paddingHorizontal: 6,
  },
  icon: {
    opacity: 0.4,
  },
  label: {
    opacity: 0.4,
    fontSize: 13,
    fontFamily: "semibold",
    letterSpacing: 1,
    textTransform: "uppercase",
    flex: 1,
  }
});

const item_styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  part: {
    padding: 0,
  },
  leading: {
    padding: 9,
    marginRight: 5,
    marginLeft: 6,
  },
  trailing: {
    padding: 9
  },
  content: {
    flex: 1,
    gap: 3,
    paddingVertical: 10,
  }
});