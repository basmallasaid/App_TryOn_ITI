import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const AvatarTabs = ({ tabs, activeKey: controlledKey, onTabChange, hideContent }) => {
  const { themeVersion } = useTheme();
  const isControlled = controlledKey !== undefined && onTabChange !== undefined;
  const [internalKey, setInternalKey] = useState(tabs[0]?.key);
  const activeKey = isControlled ? controlledKey : internalKey;

  const handleTabPress = key => {
    if (isControlled) {
      onTabChange(key);
    } else {
      setInternalKey(key);
    }
  };

  const activeTab = tabs.find(t => t.key === activeKey);
  const ActiveComponent = activeTab?.component;
  const tabProps = activeTab?.props || {};

const styles = React.useMemo(() => StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 16,
    marginTop: 10,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  containerOnlyTabs: {
    flex: 0,
  },
  }), [themeVersion]);

  return (
    <View style={[styles.container, hideContent && styles.containerOnlyTabs]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeKey;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {!hideContent && (
        <View style={styles.content}>
          {ActiveComponent ? <ActiveComponent {...tabProps} /> : null}
        </View>
      )}
    </View>
  );
};


export default AvatarTabs;
