import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../constants/theme/colors";

const AvatarTabs = ({ tabs }) => {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);

  const activeTab = tabs.find((t) => t.key === activeKey);
  const ActiveComponent = activeTab?.component;
  const tabProps = activeTab?.props || {};

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveKey(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.content}>
        {ActiveComponent ? (
          <ActiveComponent {...tabProps} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E9EBEE",
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Roboto_500Medium",
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.white,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
});

export default AvatarTabs;
