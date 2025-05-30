import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity ,Modal, TouchableWithoutFeedback} from 'react-native';
// import Modal from 'react-native-modal';
import { useLanguage } from '../../context/LanguageContext';




const typeStyles = {
    success: { color: '#2ecc71', icon: '✔️', defaultTitle: 'Success' },
    error: { color: '#e74c3c', icon: '✖️', defaultTitle: 'Error' },
    warning: { color: '#f39c12', icon: '⚠️', defaultTitle: 'Warning' },
    confirm: { color: '#2ecc71', icon: '✔️', defaultTitle: 'Confirm ?' },
};

const CustomAlertModal = ({
    visible,
    onClose,
    onCancel,
    message,
    type = 'success',
    title,
    autoDismiss = false,
    dismissTime = 3000,
    showCancel = false,
    onPress,
    // onBackButtonPress
}) => {
    const { color, icon, defaultTitle } = typeStyles[type] || typeStyles.success;
    const { t } = useLanguage();
    // Auto-close timer
    useEffect(() => {
        let timer;
        if (visible && autoDismiss) {
            timer = setTimeout(() => {
                onClose?.();
            }, dismissTime);
        }
        return () => clearTimeout(timer);
    }, [visible, autoDismiss, dismissTime]);

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
            onDismiss={onClose}
            hardwareAccelerated={true}
            statusBarTranslucent={true}
            presentationStyle="overFullScreen"
            autoDismiss={autoDismiss}

         
        >
             <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalCenterView}>
            <TouchableWithoutFeedback>
                <View style={[styles.modalContainer,]}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.icon, { color }]}>{icon}</Text>
                        <Text style={[styles.title, { color }]}>{title || defaultTitle}</Text>
                    </View>

                    <Text style={[styles.message]}>{message}</Text>

                    <View style={styles.buttonRow}>
                        {/* // for if cancel btn needed */}
                        {showCancel && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={[styles.button, styles.cancelButton]}
                                onPress={onCancel || onClose}
                            >
                                <Text style={[styles.buttonText, { color: '#333' }]}>{t('Cancel')}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.button, { backgroundColor: '#ddd' }]} onPress={onPress}>
                            <Text style={styles.buttonText}>{t('OK')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback>
        </Modal >
        // <Modal
        //     isVisible={visible}
        //     onBackdropPress={onClose}
        //     // animationIn="bounceIn"
        //     animationIn='pulse'
        //     animationOut="pulse"
        //     useNativeDriver
        //     animationInTiming={250}
        //     animationOutTiming={250}
        //     onBackButtonPress={onBackButtonPress}
        // >
        //     <View style={styles.modalCenterView}>

        //         <View style={[styles.modalContainer,]}>
        //             <View style={styles.titleContainer}>
        //                 <Text style={[styles.icon, { color }]}>{icon}</Text>
        //                 <Text style={[styles.title, { color }]}>{title || defaultTitle}</Text>
        //             </View>

        //             <Text style={[styles.message]}>{message}</Text>

        //             <View style={styles.buttonRow}>
        //                 {/* // for if cancel btn needed */}
        //                 {showCancel && (
        //                     <TouchableOpacity
        //                         activeOpacity={0.7}
        //                         style={[styles.button, styles.cancelButton]}
        //                         onPress={onCancel || onClose}
        //                     >
        //                         <Text style={[styles.buttonText, { color: '#333' }]}>{t('Cancel')}</Text>
        //                     </TouchableOpacity>
        //                 )}
        //                 <TouchableOpacity
        //                     activeOpacity={0.7}
        //                     style={[styles.button, { backgroundColor: '#ddd' }]} onPress={onPress}>
        //                     <Text style={styles.buttonText}>{t('OK')}</Text>
        //                 </TouchableOpacity>
        //             </View>
        //         </View>
        //     </View>
        // </Modal >
    );
};

export default CustomAlertModal;

const styles = StyleSheet.create({
    modalCenterView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 15,
        // borderWidth: 0.5,
        width: '85%',
        justifyContent: 'center',
        minHeight: 180,
       
    },
    icon: {
        fontSize: 18,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        // marginBottom: 5,
        // textAlign: 'left' 
        marginHorizontal: 10,
    },
    message: {
        fontSize: 16,
        // textAlign: 'center',
        textAlign: 'left',
        marginHorizontal: 20,
        marginVertical: 20,
        color: 'black',
    },
    buttonRow: {
        flexDirection: 'row', // for if cancel btn needed
        justifyContent: 'space-around', // for if cancel btn needed
        gap: 10,


    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 10,
        minWidth: 60,
        // width: '40%',
        marginTop: 10,

    },
    cancelButton: {
        backgroundColor: '#ddd',
        marginRight: 10,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center' // for if cancel btn needed
        // textAlign: 'right',

    },
    titleContainer: {
        flexDirection: 'row',
        marginLeft: 15,
        // marginTop: 5

    }
});
