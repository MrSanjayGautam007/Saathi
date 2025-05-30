import { ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Header';
import { useFocusEffect } from '@react-navigation/native';

const CoreProformaDetails = ({ route }) => {
  const { date, records } = route.params;
  const { width, height } = useWindowDimensions();

  const renderDetail = (label, value) => {
    if (value !== null && value !== '') {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionTitle}>{label}</Text>
          <Text style={styles.sectionValue}>{value}</Text>
        </View>
      );
    }
    return null;
  };
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('#6A6BBF'); 
      StatusBar.setBarStyle('light-content');
    }, [])
  );
  return (
    <SafeAreaView style={[styles.mainView, { width, height }]}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
      <Header title={`Details for ${date}`} textColor={'#fff'} iconColor={'#fff'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.containerView}>
        {records.map((item, index) => (
          <View key={index} style={styles.recordCard}>
            {renderDetail('Reason for Visit', item.reason_for_visit)}
            {renderDetail('Specify Reason for Visit', item.reason_for_visit_specify)}
            {renderDetail('History of Present Illness', item.history_present_illness)}
            {renderDetail('Past History', item.past_history)}
            {renderDetail('Past History Other', item.past_history_other)}
            {renderDetail('Past History Details', item.past_history_details)}
            {renderDetail('Substance Abuse', item.substance_abuse)}
            {renderDetail('Vaccination History', item.vaccination_history)}
            {renderDetail('Self Examination for Breast', item.self_examination_for_breast)}
            {renderDetail('Family History', item.family_history)}
            {renderDetail('Oral Cancers', item.oral_cancers)}
            {renderDetail('Genitourinary (Male/Prostate)', item.genitourinary_male_prostate)}
            {renderDetail('Larynx', item.larynx)}
            {renderDetail('Lungs', item.lungs)}
            {renderDetail('Hematological', item.hematological)}
            {renderDetail('Skin', item.skin)}
            {renderDetail('Colorectal', item.colorectal)}
            {renderDetail('Gall Bladder / Hepatobiliary', item.gall_bladder_hepatobiliary)}
            {renderDetail('Stomach', item.stomach)}

            <View style={styles.inlineBox}>
              <View style={styles.inlineItem}>
                <Text style={styles.inlineLabel}>Height (cm)</Text>
                <Text style={styles.inlineValue}>{item.height}</Text>
              </View>
              <View style={styles.inlineItem}>
                <Text style={styles.inlineLabel}>Weight (kg)</Text>
                <Text style={styles.inlineValue}>{item.weight}</Text>
              </View>
            </View>

            <View style={styles.inlineBox}>
              <View style={styles.inlineItem}>
                <Text style={styles.inlineLabel}>Waist (cm)</Text>
                <Text style={styles.inlineValue}>{item.waist_circumference}</Text>
              </View>
              <View style={styles.inlineItem}>
                <Text style={styles.inlineLabel}>Hip (cm)</Text>
                <Text style={styles.inlineValue}>{item.hip_circumference}</Text>
              </View>
            </View>

            <View style={styles.inlineBox}>
              <View style={styles.inlineItem}>
                <Text style={styles.inlineLabel}>BMI</Text>
                <Text style={styles.inlineValue}>{item.bmi}</Text>
              </View>
              <View style={styles.inlineItem}>
                <Text style={styles.inlineLabel}>Waist-Hip Ratio</Text>
                <Text style={styles.inlineValue}>{item.waist_hip_ratio}</Text>
              </View>
            </View>

            <View style={styles.inlineBox}>
              <View style={styles.inlineItem}>
                <Text style={styles.inlineLabel}>BP</Text>
                <Text style={styles.inlineValue}>{item.bp}</Text>
              </View>
              <View style={styles.inlineItem}>
                <Text style={styles.inlineLabel}>Random Blood Sugar</Text>
                <Text style={styles.inlineValue}>{item.random_blood_sugar}</Text>
              </View>
            </View>

            <Text style={styles.subHeader}>Physical Activities</Text>
            {item.physicalActivity.map((activity, idx) => (
              <View key={idx} style={styles.activityCard}>
                {renderDetail('Type', activity.ph_type)}
                {renderDetail('Frequency', activity.ph_freq)}
                {renderDetail('Time', activity.ph_times)}
                {renderDetail('Level', activity.ph_level)}
              </View>
            ))}

          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default CoreProformaDetails;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#6A6BBF',
    paddingHorizontal: 10,
  },
  containerView: {
    padding: 15,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionValue: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 18,
    marginBottom: 8,
  },
  inlineBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  inlineItem: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  inlineLabel: {
    fontSize: 13,
    color: '#888',
  },
  inlineValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 4,
  },
  activityCard: {
    backgroundColor: '#F7F7F9',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
});

