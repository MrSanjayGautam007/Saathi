// import React from 'react';
// import { ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from '../Header';

// const DetailItem = ({ label, value }) => (
//   <View style={styles.itemRow}>
//     <Text style={styles.label}>{label}:</Text>
//     <Text style={styles.value}>{value || 'N/A'}</Text>
//   </View>
// );

// const FemaleProformaDetails = ({ route }) => {
//   const { date, records } = route.params;
//   const { width, height } = useWindowDimensions();

//   return (
//     <SafeAreaView style={[styles.mainView, { width, height }]}>
//       <StatusBar barStyle="light-content" backgroundColor="#6A6BBF" />
//       <Header title={`Details: ${date}`} textColor="#fff" iconColor="#fff" />
//       <ScrollView

//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.container}>
//         {records.map((item, index) => (
//           <View key={index} style={styles.card}>
//             <Text style={styles.sectionTitle}>General Details</Text>
//             <DetailItem label="Menstrual Status" value={item.menstrual_status} />
//             <DetailItem label="LMP Date" value={item.lmp_date} />
//             <DetailItem label="Age at Menarche" value={item.age_menarche} />
//             <DetailItem label="Cycle" value={item.cycle} />
//             <DetailItem label="Flow Days" value={item.flow_days} />
//             <DetailItem label="Dysmenorrhea" value={item.dysmenorrhea} />

//             <Text style={styles.sectionTitle}>Breast Health</Text>
//             <DetailItem label="Pain in Breast" value={item.pain_in_breast} />
//             <DetailItem label="Nipple Discharge" value={item.nipple_dischargex} />
//             <DetailItem label="Lump in Breast" value={item.lump_in_breast} />
//             <DetailItem label="Change in Breast Shape" value={item.change_in_shape_breast} />
//             <DetailItem label="Final Interpretation" value={item.final_interpretation} />
//             <DetailItem label="Mammography" value={item.mammography} />
//             <DetailItem label="HPV Test Report" value={item.hpv_test_report} />

//             <Text style={styles.sectionTitle}>Cervical Findings</Text>
//             <DetailItem label="Excessive Vaginal Discharge" value={item.excessive_vaginal_discharge} />
//             <DetailItem label="Lower Abdominal Pain" value={item.lower_abdominal_pain} />
//             <DetailItem label="Cervicitis" value={item.cervicitis} />
//             <DetailItem label="Visual Inspection Growth" value={item.visual_inspection_growth} />

//             <Text style={styles.sectionTitle}>Advice / Referral</Text>
//             <Text style={styles.adviceText}>{item.advice_referral}</Text>

//             <Text style={styles.sectionTitle}>Comments</Text>
//             <DetailItem label="Surgeon" value={item.comments_surgeon} />
//             <DetailItem label="Genetic Counsellor" value={item.comments_genetic_counsellor} />
//             <DetailItem label="Gynaecologist" value={item.comments_gynaecologist} />
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default FemaleProformaDetails;

// const styles = StyleSheet.create({
//   mainView: {
//     flex: 1,
//     backgroundColor: '#6A6BBF',
//   },
//   container: {
//     padding: 16,
//     marginBottom: 24,
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 24,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 10,
//     marginTop: 16,
//   },
//   itemRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   label: {
//     fontSize: 14,
//     color: '#444',
//     fontWeight: '600',
//     flex: 1,
//   },
//   value: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//     textAlign: 'right',
//   },
//   adviceText: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 12,
//   },
// });
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import { useFocusEffect } from '@react-navigation/native';

const DetailItem = ({ label, value }) => (
  <View style={styles.itemRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'N/A'}</Text>
  </View>
);

const FemaleProformaDetails = ({ route }) => {
  const { date, records } = route.params;
  const { width, height } = useWindowDimensions();
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('#6A6BBF'); 
      StatusBar.setBarStyle('light-content');
    }, [])
  );
  return (
    <SafeAreaView style={[styles.mainView, { width, height }]}>
      <StatusBar barStyle="light-content" backgroundColor="#6A6BBF" />
      <Header title={`Details: ${date}`} textColor="#fff" iconColor="#fff" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {records.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.sectionTitle}>General Information</Text>
            <DetailItem label="Menstrual Status" value={item.menstrual_status} />
            <DetailItem label="LMP Date" value={item.lmp_date} />
            <DetailItem label="Age at Menarche" value={item.age_menarche} />
            <DetailItem label="Cycle" value={item.cycle} />
            <DetailItem label="Flow Days" value={item.flow_days} />
            <DetailItem label="Dysmenorrhea" value={item.dysmenorrhea} />
            <DetailItem label="Chronic Vaginal Discharge" value={item.chronic_vaginal_discharge} />
            <DetailItem label="Dyspareunia" value={item.dyspareunia} />
            <DetailItem label="No. of Pregnancies" value={item.no_spontaneous_pregnancies} />
            <DetailItem label="No. of Live Births" value={item.no_live_births} />
            <DetailItem label="Age at First Live Birth" value={item.age_first_live_birth} />
            <DetailItem label="Method for Contraception" value={item.method_for_contraception} />
            <DetailItem label="Contraception Methods Used" value={item.which_contraception_methods} />

            <Text style={styles.sectionTitle}>Breast Health</Text>
            <DetailItem label="Pain in Breast" value={item.pain_in_breast} />
            <DetailItem label="Nipple Discharge" value={item.nipple_dischargex} />
            <DetailItem label="Lump in Breast" value={item.lump_in_breast} />
            <DetailItem label="Change in Shape of Breast" value={item.change_in_shape_breast} />
            <DetailItem label="Final Interpretation" value={item.final_interpretation} />
            <DetailItem label="Mammography" value={item.mammography} />
            <DetailItem label="USG" value={item.usg} />
            <DetailItem label="HPV Test Report" value={item.hpv_test_report} />

            <Text style={styles.sectionTitle}>Cervical Findings</Text>
            <DetailItem label="Excessive Vaginal Discharge" value={item.excessive_vaginal_discharge} />
            <DetailItem label="Lower Abdominal Pain" value={item.lower_abdominal_pain} />
            <DetailItem label="Cervicitis" value={item.cervicitis} />
            <DetailItem label="Visual Inspection Growth" value={item.visual_inspection_growth} />
            <DetailItem label="Colposcopy Report" value={item.colposcopy_report} />
            <DetailItem label="Pap Smear Report" value={item.pap_smear_report} />
            <DetailItem label="Histopathology Cervical Biopsy" value={item.histopathology_cervical_biopsy_report} />

            <Text style={styles.sectionTitle}>Advice / Referral</Text>
            <DetailItem label="Advice / Referral" value={item.advice_referral} />

            <Text style={styles.sectionTitle}>Comments</Text>
            <DetailItem label="Surgeon" value={item.comments_surgeon} />
            <DetailItem label="Genetic Counsellor" value={item.comments_genetic_counsellor} />
            <DetailItem label="Gynaecologist" value={item.comments_gynaecologist} />

            {/* Add Nested Data Display */}
            {item.clinical_breast_examination && (
              <View>
                <Text style={styles.sectionTitle}>Clinical Breast Examination</Text>
                <DetailItem label="Examination Result" value={item.clinical_breast_examination.examination_result} />
                <DetailItem label="Lump Size" value={item.clinical_breast_examination.lump_size} />
                <DetailItem label="Axillary Lymphadenopathy" value={item.clinical_breast_examination.axillary_lymphadenopathy} />
              </View>
            )}

            {item.nac && (
              <View>
                <Text style={styles.sectionTitle}>NAC (Nipple Areolar Complex)</Text>
                <DetailItem label="Color" value={item.nac.color} />
                <DetailItem label="Shape" value={item.nac.shape} />
                <DetailItem label="Discharge" value={item.nac.discharge} />
              </View>
            )}

            {item.lump_new_clinical_breast && (
              <View>
                <Text style={styles.sectionTitle}>Lump New Clinical Breast</Text>
                <DetailItem label="Location" value={item.lump_new_clinical_breast.location} />
                <DetailItem label="Size" value={item.lump_new_clinical_breast.size} />
                <DetailItem label="Texture" value={item.lump_new_clinical_breast.texture} />
              </View>
            )}

            {item.skin_new && (
              <View>
                <Text style={styles.sectionTitle}>Skin Changes</Text>
                <DetailItem label="Changes" value={item.skin_new.changes} />
                <DetailItem label="Rash" value={item.skin_new.rash} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FemaleProformaDetails;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#6A6BBF',
  },
  container: {
    padding: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    marginTop: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
});

