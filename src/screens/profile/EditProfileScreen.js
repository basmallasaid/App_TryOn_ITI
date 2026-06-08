import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/theme/colors";
import Typography from "../../constants/theme/typography";

import CustomizeTextInput from "../../components/common/CustomizeTextInput";

import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";

import GenderOptionCard from "../../components/profile/GenderOptionCard";
import { getToken } from "../../storage/TokenStorage";
import { useProfileContext } from "../../context/ProfileContext";

import { useAuth } from "../../context/AuthContext";

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

const EditProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { profile, loading, setProfile } = useProfileContext();

  const { updateProfile } = useAuth();

  const [email, setEmail] = useState("");

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState("");

  const [gender, setGender] = useState(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setEmail(profile.email || "");

    setFirstName(profile.profile?.first_name || "");

    setLastName(profile.profile?.last_name || "");

    setDateOfBirth(formatDate(profile.profile?.date_of_birth));

    setGender(profile.profile?.gender || null);
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = await getToken();

      await updateProfile(token, firstName, lastName, dateOfBirth, gender);

      setProfile((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          gender,
        },
      }));

      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#6B7280" />
        </TouchableOpacity>

        <Text style={styles.title}>{t('editProfile.title')}</Text>

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <CustomizeTextInput label={t('editProfile.email')} value={email} editable={false} />

        <CustomizeTextInput
          label={t('editProfile.firstName')}
          value={firstName}
          onChangeText={setFirstName}
          rightIcon={
            <Ionicons name="pencil-outline" size={18} color="#6B7280" />
          }
        />

        <CustomizeTextInput
          label={t('editProfile.lastName')}
          value={lastName}
          onChangeText={setLastName}
          rightIcon={
            <Ionicons name="pencil-outline" size={18} color="#6B7280" />
          }
        />

        <CustomizeTextInput
          label={t('editProfile.dateOfBirth')}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder={t('editProfile.datePlaceholder')}
          rightIcon={
            <Ionicons name="calendar-outline" size={18} color="#6B7280" />
          }
        />

        <Text style={styles.genderLabel}>{t('editProfile.gender')}</Text>

        <View style={styles.genderRow}>
          <GenderOptionCard
            gender="Male"
            selected={gender === "Male"}
            onPress={() => setGender("Male")}
          />

          <GenderOptionCard
            gender="Female"
            selected={gender === "Female"}
            onPress={() => setGender("Female")}
          />
        </View>
      </View>

      <CustomizeAppButtonFilled
        label={t('editProfile.save')}
        onPress={handleSave}
        loading={saving}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingTop: 70,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 24,
  },

  title: {
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    fontSize: 24,
    fontWeight: "700",
    color: "#121826",
  },

  card: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E9EBEE",

    borderRadius: 16,

    paddingHorizontal: 24,
    paddingVertical: 35,
    marginTop: 15,
    marginBottom: 44,
  },

  genderLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#121826",
    fontFamily: "Roboto_500Medium",
    marginBottom: 12,
  },

  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 5,
  },
});

export default EditProfileScreen;
