import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, useWindowDimensions, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import api from '../../APIServices/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../../context/LanguageContext';
import { useFocusEffect } from '@react-navigation/native';

// const SBESubmit = () => {
//     const [q1, setQ1] = useState([]);
//     const [q2, setQ2] = useState([]);
//     const [q2Yes, setQ2Yes] = useState(false);
//     const [q3, setQ3] = useState([]);
//     const [q3Yes, setQ3Yes] = useState(false);
//     const [q4, setQ4] = useState('');
//     const [q5, setQ5] = useState('');
//     const [q6, setQ6] = useState('');
//     const [loading, setLoading] = useState(false);
//     const { width, height } = useWindowDimensions();
//     const [q0, setQ0] = useState([]); // Breast type (Left, Right);
//     const [poid, setPoid] = useState('');

//     useEffect(() => {

//         const getUser = async () => {
//             try {
//                 const user = await AsyncStorage.getItem("user");
//                 if (user) {
//                     const parsedUser = JSON.parse(user);
//                     setPoid(parsedUser.po_id);
//                     console.log("User POID:", parsedUser.po_id);
//                 }

//             } catch (error) {
//                 console.error("Error retrieving user data:", error);
//             }
//         }
//         getUser();
//     }, []);

//     const toggleSelection = (array, setter, value) => {
//         if (array.includes(value)) {
//             setter(array.filter(item => item !== value));
//         } else {
//             setter([...array, value]);
//         }
//     };

//     const handleSingleSelect = (value, state, setter) => {
//         if (state === value) {
//             setter('No');
//         } else {
//             setter(value);
//         }
//     };

//     const validateForm = () => {
//         if (q0.length === 0) {
//             Alert.alert('Error', 'Please select at least one breast type.');
//             return false;
//         }
//         if (q1.length === 0 || q4 === '' || q5 === '') {
//             Alert.alert('Error', 'Please answer all required questions.');
//             return false;
//         }
//         if (q2Yes && q2.length === 0) {
//             Alert.alert('Error', 'Please select at least one skin change option.');
//             return false;
//         }
//         if (q3Yes && q3.length === 0) {
//             Alert.alert('Error', 'Please select at least one nipple change option.');
//             return false;
//         }
//         return true;
//     };

//     const resetForm = () => {
//         setQ0([]);
//         setQ1([]);
//         setQ2([]);
//         setQ2Yes(false);
//         setQ3([]);
//         setQ3Yes(false);
//         setQ4('');
//         setQ5('');
//         setQ6('');
//         Alert.alert('Success', 'Form reset successfully!');
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) return;

//         setLoading(true);
//         const payload = {

//             // po_id: poid,
//             // breast_type: q0,
//             // pain_in_breast: q1,
//             // any_obvious_skin_changes: q2Yes ? q2 : ['No'], // Use ['No'] instead of []
//             // any_nipple_change: q3Yes ? q3 : ['No'],
//             // lump: q4,
//             // axilla: q5,
//             // any_other_specify: q6 || 'None',
//             po_id: poid,
//             breast_type: Array.isArray(q0) ? q0 : [q0],  // This can stay array if API expects it
//             pain_in_breast: Array.isArray(q1) ? q1[0] : q1,
//             any_obvious_skin_changes: q2Yes ? (Array.isArray(q2) ? q2[0] : q2) : 'No',
//             any_nipple_change: q3Yes ? (Array.isArray(q3) ? q3[0] : q3) : 'No',
//             lump: q4 || 'No',
//             axilla: q5 || 'No',
//             any_other_specify: q6 || '',



//         };
//         console.log('Payload being sent:', JSON.stringify(payload, null, 2));


//         try {
//             const response = await api.post('/self-breast-examination', payload);
//             const result = response.data;

//             if (result.success) {
//                 console.log('Submitted Successfully:', result);
//                 Alert.alert('Success', 'SBE Submitted successfully!');
//                 resetForm();
//             } else if (result.errors_msg) {
//                 console.log('Validation Errors:', result.errors_msg);
//                 Alert.alert('Validation Error', 'Please check your answers and try again.');
//                 // Alert.alert('Validation Messaage', 'Success.');
//             } else {
//                 Alert.alert('Error', 'Submission failed. Please try again.');
//             }
//         } catch (error) {
//             console.error('Submit Error:', error);
//             Alert.alert('Error', 'Something went wrong while submitting.');
//             // Alert.alert('Success', 'Uploaded.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <SafeAreaView style={[styles.mainView, { height, width }]}>
//             <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
//             <Header title={'SBE Submit'} textColor={'black'} />
//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
//                 <View style={styles.questionBlock}>
//                     <Text style={styles.questionText}>0. Breast type?</Text>
//                     {['Left', 'Right'].map(option => {
//                         const isSelected = q0.includes(option);
//                         return (
//                             <TouchableOpacity
//                                 key={option}
//                                 style={[styles.optionButton, isSelected && styles.selectedOption]}
//                                 onPress={() => toggleSelection(q0, setQ0, option)}
//                             >
//                                 <Text style={isSelected ? styles.selectedOptionText : styles.optionText}>{option}</Text>
//                             </TouchableOpacity>
//                         );
//                     })}
//                 </View>
//                 <View style={styles.questionBlock}>
//                     <Text style={styles.questionText}>1. Pain in breast?</Text>
//                     {['Cyclical', 'Non cyclical', 'On touch'].map(option => (
//                         <TouchableOpacity
//                             key={option}
//                             style={[styles.optionButton, q1.includes(option) && styles.selectedOption]}
//                             onPress={() => toggleSelection(q1, setQ1, option)}
//                         >
//                             <Text style={q1.includes(option) ? styles.selectedOptionText : styles.optionText}>
//                                 {option}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 <View style={styles.questionBlock}>
//                     <Text style={styles.questionText}>2. Any obvious skin change?</Text>
//                     <TouchableOpacity
//                         style={[styles.optionButton, q2Yes && styles.selectedOption]}
//                         onPress={() => setQ2Yes(true)}
//                     >
//                         <Text style={q2Yes ? styles.selectedOptionText : styles.optionText}>Yes</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={[styles.optionButton, !q2Yes && q2.length === 0 && styles.selectedOption]}
//                         onPress={() => {
//                             setQ2Yes(false);
//                             setQ2([]);
//                         }}
//                     >
//                         <Text style={!q2Yes && q2.length === 0 ? styles.selectedOptionText : styles.optionText}>No</Text>
//                     </TouchableOpacity>
//                     {q2Yes && ['Dimplins', 'Redness', 'Excoriation', 'Flaky skin', 'Orange peel'].map(option => (
//                         <TouchableOpacity
//                             key={option}
//                             style={[styles.optionButton, q2.includes(option) && styles.selectedOption]}
//                             onPress={() => toggleSelection(q2, setQ2, option)}
//                         >
//                             <Text style={q2.includes(option) ? styles.selectedOptionText : styles.optionText}>
//                                 {option}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 <View style={styles.questionBlock}>
//                     <Text style={styles.questionText}>3. Any nipple change?</Text>
//                     <TouchableOpacity
//                         style={[styles.optionButton, q3Yes && styles.selectedOption]}
//                         onPress={() => setQ3Yes(true)}
//                     >
//                         <Text style={q3Yes ? styles.selectedOptionText : styles.optionText}>Yes</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={[styles.optionButton, !q3Yes && q3.length === 0 && styles.selectedOption]}
//                         onPress={() => {
//                             setQ3Yes(false);
//                             setQ3([]);
//                         }}
//                     >
//                         <Text style={!q3Yes && q3.length === 0 ? styles.selectedOptionText : styles.optionText}>No</Text>
//                     </TouchableOpacity>
//                     {q3Yes && ['Nipple invension', 'Nipple Discharge', 'Soreness of nipple'].map(option => (
//                         <TouchableOpacity
//                             key={option}
//                             style={[styles.optionButton, q3.includes(option) && styles.selectedOption]}
//                             onPress={() => toggleSelection(q3, setQ3, option)}
//                         >
//                             <Text style={q3.includes(option) ? styles.selectedOptionText : styles.optionText}>
//                                 {option}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 <View style={styles.questionBlock}>
//                     <Text style={styles.questionText}>4. Lump?</Text>
//                     {['Yes', 'No', 'Multinodularity'].map(option => (
//                         <TouchableOpacity
//                             key={option}
//                             style={[styles.optionButton, q4 === option && styles.selectedOption]}
//                             onPress={() => handleSingleSelect(option, q4, setQ4)}
//                         >
//                             <Text style={q4 === option ? styles.selectedOptionText : styles.optionText}>{option}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 <View style={styles.questionBlock}>
//                     <Text style={styles.questionText}>5. Axilla?</Text>
//                     {['No lump', 'Lump', 'Fullness'].map(option => (
//                         <TouchableOpacity
//                             key={option}
//                             style={[styles.optionButton, q5 === option && styles.selectedOption]}
//                             onPress={() => handleSingleSelect(option, q5, setQ5)}
//                         >
//                             <Text style={q5 === option ? styles.selectedOptionText : styles.optionText}>{option}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 <View style={styles.inputContainer}>
//                     <Text style={styles.inputLabel}>6. Any other finding? Specify</Text>
//                     <TextInput
//                         value={q6}
//                         onChangeText={setQ6}
//                         placeholder="Enter other findings"
//                         style={styles.inputField}
//                     />
//                 </View>

//                 <View style={styles.btnContainer}>
//                     <TouchableOpacity
//                         onPress={handleSubmit}
//                         style={[styles.submitButton, loading && styles.submitButtonDisabled]}
//                         disabled={loading}
//                     >
//                         {
//                             loading ? <ActivityIndicator color={'#fff'} size={20} /> : (<Text style={styles.submitText}>{'Submit'}</Text>)
//                         }

//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={resetForm} style={styles.resetButton}>
//                         <Text style={styles.submitText}>Reset</Text>
//                     </TouchableOpacity>
//                 </View>

//             </ScrollView>
//         </SafeAreaView>
//     );
// };



// const styles = StyleSheet.create({
//     mainView: {
//         flex: 1,
//         backgroundColor: '#fff',
//         // alignItems: 'center',
//         paddingHorizontal: 10,
//     },
//     container: {
//         padding: 16,
//         backgroundColor: '#fdfdfd',
//         flexGrow: 1,
//     },
//     questionBlock: {
//         marginBottom: 20,
//     },
//     questionText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#333',
//     },
//     optionButton: {
//         padding: 12,
//         borderRadius: 8,
//         marginBottom: 8,
//         backgroundColor: '#eee',
//     },
//     selectedOption: {
//         backgroundColor: '#2196f3',
//     },
//     optionText: {
//         color: '#000',
//     },
//     selectedOptionText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     inputContainer: {
//         marginVertical: 16,
//     },
//     inputLabel: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 8,
//         color: '#333',
//     },
//     inputField: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         padding: 10,
//         borderRadius: 8,
//         backgroundColor: '#fff',
//     },
//     submitButton: {
//         backgroundColor: '#4caf50',
//         padding: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//         marginTop: 20,
//         width: '45%',
//         // marginRight: 10,
//     },
//     submitButtonDisabled: {
//         backgroundColor: '#888',
//     },
//     submitText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     resetButton: {
//         backgroundColor: '#f44336',
//         padding: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//         marginTop: 20,
//         width: '45%',


//     },
//     btnContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         // width: '100%',
//         marginTop: 10,
//         paddingHorizontal: 20,
//         marginHorizontal: 30,

//     }
// });

// export default SBESubmit;
// import React, { useEffect, useState } from 'react';
// import { View, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../../APIServices/api';
// import Header from '../Header';
// import { SafeAreaView } from 'react-native-safe-area-context';

const SBESubmit = () => {
    const [poid, setPoid] = useState('');
    const [breastType, setBreastType] = useState('');
    const [painInBreast, setPainInBreast] = useState('');
    const [skinChange, setSkinChange] = useState('No');
    const [skinChangeType, setSkinChangeType] = useState('');
    const [nippleChange, setNippleChange] = useState('No');
    const [nippleChangeType, setNippleChangeType] = useState('');
    const [lump, setLump] = useState('');
    const [axilla, setAxilla] = useState('');
    const [other, setOther] = useState('');
    const [loading, setLoading] = useState(false);
    const { width, height } = useWindowDimensions();
    const { t } = useLanguage();

    useEffect(() => {
        const getUser = async () => {
            const user = await AsyncStorage.getItem("user");
            if (user) {
                setPoid(JSON.parse(user).po_id);
            }
        };
        getUser();
    }, []);

    const validateForm = () => {
        if (!breastType || !painInBreast || !lump || !axilla) {
            Alert.alert('Error', 'Please answer all required fields.');
            return false;
        }
        if (skinChange === 'Yes' && !skinChangeType) {
            Alert.alert('Error', 'Please select skin change type.');
            return false;
        }
        if (nippleChange === 'Yes' && !nippleChangeType) {
            Alert.alert('Error', 'Please select nipple change type.');
            return false;
        }
        return true;
    };
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);


        const formData = new FormData();
        formData.append('po_id', poid);
        formData.append('breast_type', breastType);
        formData.append('pain_in_breast', painInBreast);
        formData.append('any_obvious_skin_changes', skinChange === 'Yes' ? skinChangeType : 'No');
        formData.append('any_obvious_skin_changes_details', skinChange === 'Yes' ? skinChangeType : 'None');  //  always send something
        formData.append('any_nipple_change', nippleChange === 'Yes' ? nippleChangeType : 'No');
        formData.append('any_nipple_change_details', nippleChange === 'Yes' ? nippleChangeType : 'None');  // always send something
        formData.append('lump', lump);
        formData.append('axilla', axilla);
        formData.append('any_other_specify', other);
        try {
            const res = await api.post('/self-breast-examination', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Accept: 'application/json',
                },
            });

            if (res.data.success) {
                Alert.alert('Success', 'Self Breast Examination Report Submitted!');
                console.log('Submitted Successfully:', res.data);
                // resetForm();
                setBreastType('');
                setPainInBreast('');
                setSkinChange('No');
                setSkinChangeType('');
                setNippleChange('No');
                setNippleChangeType('');
                setLump('');
                setAxilla('');
                setOther('');
            } else {
                Alert.alert('Error', res.data.message || 'Submission failed.');
            }
        } catch (err) {
            console.error('API Error:', err);
            // console.error('API Error:', err.response?.data || err.message);
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };


    const resetForm = () => {
        setBreastType('');
        setPainInBreast('');
        setSkinChange('No');
        setSkinChangeType('');
        setNippleChange('No');
        setNippleChangeType('');
        setLump('');
        setAxilla('');
        setOther('');
        Alert.alert('Success', 'Form reset successfully!');
    };
    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, { height, width }]}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
            <Header title={t('SBE Submit')}  textColor={'#fff'} iconColor={'#fff'} />
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 10,}}
            >
                {/* Breast Type */}
                <Text style={styles.label}>{t('Breast Type')} *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        style={styles.picker}
                        selectedValue={breastType}
                        onValueChange={setBreastType}
                    >
                        <Picker.Item label={t("Select Breast Type")} value="" />
                        <Picker.Item label={t("Left")} value="Left" />
                        <Picker.Item label={t("Right")} value="Right" />
                        <Picker.Item label={t("Both")} value="Both" />

                    </Picker>
                </View>

                {/* Pain in Breast */}
                <Text style={styles.label}>{t("Pain in Breast")} *</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={painInBreast}
                        style={styles.picker}
                        onValueChange={setPainInBreast}>
                        <Picker.Item label={t("Select Pain Type")} value="" />
                        <Picker.Item label={t("Cyclical")} value="Cyclical" />
                        <Picker.Item label={t("Non cyclical")} value="Non cyclical" />
                        <Picker.Item label={t("On touch")} value="On touch" />
                        <Picker.Item label={t("No")} value="No" />
                    </Picker>
                </View>


                {/* Skin Changes */}
                <Text style={styles.label}>{t('Any Obvious Skin Changes')}?</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={skinChange}
                        style={styles.picker}
                        onValueChange={setSkinChange}>
                        <Picker.Item label={t("No")} value="No" />
                        <Picker.Item label={t("Yes")} value="Yes" />
                    </Picker>
                </View>


                {skinChange === 'Yes' && (
                    <>
                        <Text style={styles.label}>{t("Type of Skin Change")}</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={skinChangeType}
                                style={styles.picker}
                                onValueChange={setSkinChangeType}>
                                <Picker.Item label={t("Select Type")} value="" />
                                <Picker.Item label={t("Dimplins")} value="Dimplins" />
                                <Picker.Item label={t("Redness")} value="Redness" />
                                <Picker.Item label={t("Excoriation")} value="Excoriation" />
                                <Picker.Item label={t("Flaky skin")} value="Flaky skin" />
                                <Picker.Item label={t("Orange peel")} value="Orange peel" />
                            </Picker>
                        </View>

                    </>
                )}

                {/* Nipple Changes */}
                <Text style={styles.label}>{t('Any Nipple Change')}?</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={nippleChange}
                        style={styles.picker}
                        onValueChange={setNippleChange}>
                        <Picker.Item label={t("No")} value="No" />
                        <Picker.Item label={t("Yes")} value="Yes" />
                    </Picker>

                </View>

                {nippleChange === 'Yes' && (
                    <>
                        <Text style={styles.label}>{t('Type of Nipple Change')}</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={nippleChangeType}
                                style={styles.picker}
                                onValueChange={setNippleChangeType}>
                                <Picker.Item label={t("Select Type")} value="" />
                                <Picker.Item label={t("Nipple invension")} value="Nipple invension" />
                                <Picker.Item label={t("Nipple Discharge")} value="Nipple Discharge" />
                                <Picker.Item label={t("Soreness of nipple")} value="Soreness of nipple" />
                            </Picker>
                        </View>

                    </>
                )}

                {/* Lump */}
                <Text style={styles.label}>{t("Lump")} *</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={lump}
                        style={styles.picker}
                        onValueChange={setLump}>
                        <Picker.Item label={t("Select Lump")} value="" />
                        <Picker.Item label={t("Yes")} value="Yes" />
                        <Picker.Item label={t("No")} value="No" />
                        <Picker.Item label={t("Multinodularity")} value="Multinodularity" />
                    </Picker>
                </View>


                {/* Axilla */}
                <Text style={styles.label}>{t('Axilla')} *</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={axilla}
                        style={styles.picker}
                        onValueChange={setAxilla}>
                        <Picker.Item label={t("Select Axilla")} value="" />
                        <Picker.Item label={t("No lump")} value="No lump" />
                        <Picker.Item label={t("Lump")} value="Lump" />
                        <Picker.Item label={t("Fullness")} value="Fullness" />
                    </Picker>
                </View>


                {/* Other */}
                <Text style={styles.label}>{t('Any other finding? Specify')}</Text>
                <TextInput
                    value={other}
                    onChangeText={setOther}
                    placeholder={t("Enter details")}
                    style={styles.input}
                    placeholderTextColor={'#fff'}
                />

                {/* Submit */}
                <View style={styles.btnContainer}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleSubmit} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>{t('Submit')}</Text>}
                </TouchableOpacity>

                {/* Reset */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={resetForm} style={styles.button}>
                    <Text style={styles.buttonText}>{t('Reset')}</Text>
                </TouchableOpacity>
                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        // alignItems: 'center',
        paddingHorizontal: 10,
    },
    container: {
        // padding: 16,
        backgroundColor: '#6A6BBF',
        flexGrow: 1,
    },

    label: {
        marginTop: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
        color: '#fff',
    },
    button: {
        backgroundColor: '#baeef5',
        padding: 15, borderRadius: 10,
        alignItems: 'center',
        marginTop: 30
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold'
    },
    pickerContainer: {
        borderWidth: 0.5,
        borderColor: '#000',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 5,
        backgroundColor: '#fff',
    },
    picker: {
        // height: 50,
        color: '#333', // picker text color
    },
    btnContainer:{
 
        justifyContent: 'space-between',
        // marginTop: 20,
        paddingHorizontal: 20,
        marginBottom: 30,
      
       
    }
});

export default SBESubmit;

