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
export default function HeroBanner({ onPress }) {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    return (
        <View style={[styles.banner, { flexDirection: "row" }]}>
            <View style={[styles.bannerContent, { paddingRight: 10, paddingLeft: 0 }]}>
                <Text style={[styles.bannerTitle, { textAlign: "left" }]}>
                    {t('home.hero.title')}
                </Text>

                <Text style={[styles.bannerSubTitle, { textAlign: "left" }]}>
                    {t('home.hero.subtitle')}
                </Text>

                <TouchableOpacity style={[styles.generateButton, { flexDirection: "row", alignSelf: "flex-start" }]} onPress={onPress}>
                    <Ionicons name="sparkles" size={24} color="white" />
                    <Text style={[styles.generateButtonText, { marginLeft: 6, marginRight: 0 }]}>
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

const styles = StyleSheet.create({
    banner: {
        backgroundColor: Colors.white,
        borderRadius: 25,
        padding: 20,
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",

        borderWidth: 1,
        borderColor: "#f0f0f0",

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

    highlight: {
        color: Colors.error,
    },

    bannerSubTitle: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginVertical: 12,
        lineHeight: 18,
    },

    generateButton: {
        backgroundColor: Colors.primarybrand,
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 9,
        borderRadius: 12,
    },

    generateButtonText: {
        color: Colors.white,
        fontWeight: "600",
    },

    bannerImage: {
        marginHorizontal: 5,
    },
});