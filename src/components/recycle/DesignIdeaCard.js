import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Svg, Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import i18n from "../../localization/i18n";

const CARD_WIDTH = 260;
const COLLAPSED_HEIGHT = 200;
const EXPANDED_HEIGHT = 340;
const BORDER_RADIUS = 16;
const BORDER_WIDTH = 2;

export default function DesignIdeaCard({ idea, index, isSelected, onSelect }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const cardNumber = String(index + 1).padStart(2, "0");

  const displayTitle = i18n.language === 'ar' && idea.title_ar
    ? idea.title_ar
    : idea.title;
  const displayDescription = i18n.language === 'ar' && idea.design_description_ar
    ? idea.design_description_ar
    : idea.design_description;

  const cardHeight = expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;

  const handleToggle = (e) => {
    e.stopPropagation?.();
    setExpanded(!expanded);
  };

  const styles = React.useMemo(() => StyleSheet.create({
    card: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.borderStrong,
      backgroundColor: Colors.white,
      padding: 14,
      width: CARD_WIDTH,
      marginEnd: 12,
      overflow: "hidden",
    },
    gradientBorderWrap: {
      width: CARD_WIDTH,
      marginEnd: 12,
    },
    inner: {
      position: "absolute",
      top: BORDER_WIDTH,
      left: BORDER_WIDTH,
      right: BORDER_WIDTH,
      borderRadius: BORDER_RADIUS - 1,
      backgroundColor: Colors.white,
      padding: 14,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    number: {
      fontFamily: "Roboto_700Bold",
      fontWeight: "700",
      fontSize: 18,
      color: Colors.primary,
    },
    checkBadge: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: Colors.success,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontFamily: "Roboto_600SemiBold",
      fontWeight: "600",
      fontSize: 14,
      color: Colors.textPrimary,
      marginBottom: 6,
    },
    selectedTitle: {
      color: Colors.primary,
    },
    description: {
      fontFamily: "Roboto_400Regular",
      fontSize: 11,
      lineHeight: 16,
      color: Colors.textMuted,
    },
    selectedDescription: {
      color: Colors.textSecondary,
    },
    descScroll: {
      flex: 1,
    },
    seeMoreBtn: {
      marginTop: 4,
      alignSelf: "flex-start",
    },
    seeMore: {
      fontFamily: "Roboto_500Medium",
      fontWeight: "500",
      fontSize: 11,
      color: Colors.primary,
    },
    selectedSeeMore: {
      color: Colors.primary,
    },
  }), [themeVersion]);

  const DashedGradientBorder = ({ children, height }) => (
    <View style={[styles.gradientBorderWrap, { height }]}>
      <Svg
        width={CARD_WIDTH}
        height={height}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#8ED321" />
            <Stop offset="0.5" stopColor="#40B9FF" />
            <Stop offset="1" stopColor="#FF8C42"   />
          </SvgGradient>
        </Defs>
        <Rect
          x={BORDER_WIDTH / 2}
          y={BORDER_WIDTH / 2}
          width={CARD_WIDTH - BORDER_WIDTH}
          height={height - BORDER_WIDTH}
          rx={BORDER_RADIUS}
          ry={BORDER_RADIUS}
          fill="none"
          stroke="url(#grad)"
          strokeWidth={BORDER_WIDTH}
          strokeDasharray="10 6"
        />
      </Svg>
      <View style={[styles.inner, { height: height - BORDER_WIDTH * 2 }]}>
        {children}
      </View>
    </View>
  );

  const cardContent = (
    <>
      <View style={styles.header}>
        <Text style={styles.number}>{cardNumber}</Text>
        {isSelected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
      <Text style={[styles.title, isSelected && styles.selectedTitle]}>
        {displayTitle}
      </Text>
      {expanded ? (
        <ScrollView style={styles.descScroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.description, isSelected && styles.selectedDescription]}>
            {displayDescription}
          </Text>
        </ScrollView>
      ) : (
        <Text
          style={[styles.description, isSelected && styles.selectedDescription]}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {displayDescription}
        </Text>
      )}
      <TouchableOpacity
        onPress={handleToggle}
        onPressIn={(e) => e.stopPropagation?.()}
        hitSlop={{ top: 8, bottom: 8 }}
        style={styles.seeMoreBtn}
      >
        <Text style={[styles.seeMore, isSelected && styles.selectedSeeMore]}>
          {expanded ? t("recycle.seeLess") : t("recycle.seeMore")}
        </Text>
      </TouchableOpacity>
    </>
  );

  if (isSelected) {
    return (
      <TouchableOpacity onPress={onSelect} activeOpacity={0.85}>
        <DashedGradientBorder height={cardHeight}>
          {cardContent}
        </DashedGradientBorder>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.85} style={[styles.card, { height: cardHeight }]}>
      {cardContent}
    </TouchableOpacity>
  );
}
