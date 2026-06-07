import React from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import Colors from "../../constants/theme/colors";
import Header from "../../components/home/Header";
import HeroBanner from "../../components/home/HeroBanner";
import ActionCard from "../../components/home/ActionCard";
import OutfitCard from "../../components/home/OutfitCard";
import TryOnCard from "../../components/home/TryOnCard";
import { IMAGES } from "../../constants/images/images";
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Header />

                <HeroBanner />

                <Text style={styles.sectionTitle}>
                    What would you Like to do ?
                </Text>
                <View style={styles.grid}>
                    {/* 1. Try-on */}
                    <ActionCard
                        title="Try-on"
                        sub="see how clothes look on you"
                        mainIconName="crop-free"
                        innerIconName="tshirt-crew"
                        titleColor="#40B9FF"
                        iconBgColor="#E9F7FE"
                        iconColor="#40B9FF"
                    />

                    {/* 2. Recycle */}
                    <ActionCard
                        title="Recycle"
                        sub="Give clothes another life"
                        mainIconName="recycle"
                        titleColor="#A6E22E"
                        iconBgColor="#F1F8E9"
                        iconColor="#A6E22E"
                    />

                    {/* 3. Generate outfit */}
                    <ActionCard
                        title="Generate outfit"
                        sub="personalized style suggestions"
                        useIonicons={true}
                        mainIconName="sparkles"
                        titleColor="#FF7D9A"
                        iconBgColor="#FFF0F3"
                        iconColor="#FF6B8B"
                    />

                    {/* 4. Matching */}
                    <ActionCard
                        title="Matching"
                        sub="Find the perfect match for your clothes"
                        useIonicons={true}
                        mainIconName="checkmark-circle-outline"
                        titleColor="#FF8A3D"
                        iconBgColor="#FFF3E0"
                        iconColor="#FF8A3D"
                    />
                </View>
                <Text style={styles.sectionTitle}>
                    Today’s picks for you
                </Text>
                <OutfitCard />

                <View style={styles.header}>
                    <Text style={styles.title}>recent try-ons</Text>
                    <TouchableOpacity style={styles.viewAllBtn}>
                        <Text style={styles.viewAllText}>view all</Text>
                        <Ionicons name="arrow-forward" size={16} color="#1A1C24" />
                    </TouchableOpacity>
                </View>

                {/* try-on cards */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollPadding}
                >
                    <TryOnCard imageUri={IMAGES.TRY_ON} />
                    <TryOnCard imageUri={IMAGES.TRY_ON} />
                    <TryOnCard imageUri={IMAGES.TRY_ON} />
                </ScrollView>


            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND,
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginVertical: 25,
        color: Colors.textPrimary,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1C24',
        textTransform: 'capitalize',
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 14,
        color: '#1A1C24',
        marginRight: 5,
    },

});