import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { IMAGES } from "../../constants/images/images";
import { Ionicons } from '@expo/vector-icons';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
export default function HeroBanner({ onPress }) {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const { themeVersion } = useTheme();
    const { isRTL } = useLanguage();

const styles = React.useMemo(() => StyleSheet.create({
    banner: {
        backgroundColor: Colors.white,
        borderRadius: 25,
        padding: 20,
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",

        borderWidth: 1,
        borderColor: Colors.borderDefault,

        elevation: 4,
        shadowColor: Colors.textDark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },

    bannerContent: {
        flex: 1,
        flexShrink: 1,
    },
    bannerTitle: {
        fontSize: 20,
        fontWeight: "800",
        lineHeight: 32,
        color: Colors.textPrimary,
    },

    bannerSubTitle: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginVertical: 12,
        lineHeight: 18,
        textAlign: 'left',
    },

    generateButton: {
        backgroundColor: Colors.primarybrand,
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 12,
    },

    generateButtonText: {
        fontFamily:"Roboto_500Medium",
        color: Colors.textInverse,
        fontWeight: "500",
    },

    bannerImage: {
        marginHorizontal: 5,
    },
}), [themeVersion]);

    return (
        <View style={[styles.banner, { flexDirection: "row" }]}>
            <View style={[styles.bannerContent, { paddingEnd: 10 }]}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.bannerTitle}>{t('home.hero.title1')}</Text>
                    </View>
                    <MaskedView
                        maskElement={
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.bannerTitle}>
                                    {t('home.hero.titleHighlight')}
                                </Text>
                            </View>
                        }
                    >
                        <LinearGradient
                            start={isRTL ? { x: 1, y: 0 } : { x: 0, y: 0 }}
                            end={isRTL ? { x: 0, y: 0 } : { x: 1, y: 0 }}
                            colors={[Colors.primary, Colors.error, Colors.success]}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.bannerTitle, { opacity: 0 }]}>
                                    {t('home.hero.titleHighlight')}
                                </Text>
                            </View>
                        </LinearGradient>
                    </MaskedView>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.bannerTitle}>{t('home.hero.title2')}</Text>
                    </View>
                </View>

                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <Text style={styles.bannerSubTitle}>
                        {t('home.hero.subtitle')}
                    </Text>
                </View>

                <TouchableOpacity style={[styles.generateButton, { flexDirection: 'row', alignSelf: 'flex-start' }]} onPress={onPress}>
                    <Ionicons name="sparkles" size={16} color="white" />
                    <Text style={styles.generateButtonText}>
                        {t('home.actions.generateOutfit')}
                    </Text>

                </TouchableOpacity>
            </View>

            <Image
                source={IMAGES.HOME_HERO}
                style={[
                    styles.bannerImage,
                    {
                        width: width * 0.40,
                        height: width * 0.48,
                    },
                ]}
                resizeMode="contain"
            />
        </View>
    );
}
