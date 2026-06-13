import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DatePicker

import Colors from "../../constants/theme/colors";
import CustomizeTextInput from "../../components/common/CustomizeTextInput";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import GenderOptionCard from "../../components/profile/GenderOptionCard";
import { getToken } from "../../storage/TokenStorage";
import { useProfileContext } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import CustomBackButton from "../../components/common/CustomBackButton";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
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

  // Date Picker State
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setEmail(profile.email || "");
    setFirstName(profile.profile?.first_name || "");
    setLastName(profile.profile?.last_name || "");
    const dob = profile.profile?.date_of_birth;
    setDateOfBirth(formatDate(dob));
    if (dob) setDate(new Date(dob));
    setGender(profile.profile?.gender || null);
  }, [profile]);

  const toggleDatepicker = () => setShowPicker(!showPicker);

  const onDateChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatepicker();
        setDateOfBirth(formatDate(currentDate));
      }
    } else {
      toggleDatepicker();
    }
  };

  const confirmIosDate = () => {
    setDateOfBirth(formatDate(date));
    toggleDatepicker();
  };

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
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { flexDirection: "row" }]}>
          <CustomBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>{t('editProfile.title')}</Text>
          <View style={{ width: 56 }} /> 
        </View>

        <View style={styles.card}>
          <CustomizeTextInput label={t('editProfile.email')} value={email} editable={false} />

          <CustomizeTextInput
            label={t('editProfile.firstName')}
            value={firstName}
            onChangeText={setFirstName}
            rightIcon={<Ionicons name="pencil-outline" size={18} color="#6B7280" />}
          />

          <CustomizeTextInput
            label={t('editProfile.lastName')}
            value={lastName}
            onChangeText={setLastName}
            rightIcon={<Ionicons name="pencil-outline" size={18} color="#6B7280" />}
          />

          {/* Date of Birth Trigger */}
          <TouchableOpacity onPress={toggleDatepicker} activeOpacity={1}>
            <View pointerEvents="none">
              <CustomizeTextInput
                label={t('editProfile.dateOfBirth')}
                value={dateOfBirth}
                placeholder={t('editProfile.datePlaceholder')}
                editable={false}
                rightIcon={<Ionicons name="calendar-outline" size={18} color="#6B7280" />}
              />
            </View>
          </TouchableOpacity>

          {/* Date Picker Component */}
          {showPicker && (
            <DateTimePicker
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              value={date}
              onChange={onDateChange}
              maximumDate={new Date()} // Can't be born in the future
            />
          )}

          {/* iOS needs a confirm button for the spinner display mode */}
          {showPicker && Platform.OS === "ios" && (
            <View style={[styles.iosDateButtons, { flexDirection: "row" }]}>
              <TouchableOpacity onPress={toggleDatepicker} style={styles.dateBtn}>
                <Text style={{ color: Colors.error }}>{t("editProfile.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmIosDate} style={styles.dateBtn}>
                <Text style={{ color: Colors.primary }}>{t("editProfile.confirm")}</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.genderLabel}>{t('editProfile.gender')}</Text>
          <View style={[styles.genderRow, { flexDirection: "row" }]}>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 70,
    paddingBottom: 40,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 24,
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
    color: "#121826",
    fontFamily: "Roboto_500Medium",
    marginBottom: 12,
  },
  genderRow: {
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 5,
  },
  iosDateButtons: {
    justifyContent: 'space-around',
    marginBottom: 20
  },
  dateBtn: {
    padding: 10,
  }
});

export default EditProfileScreen;