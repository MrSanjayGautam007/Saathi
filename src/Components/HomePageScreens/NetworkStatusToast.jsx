
import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

let debounceTimer = null;
const NetworkStatusToast = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [message, setMessage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('green');
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const showToast = (msg, color = 'green') => {
    setMessage(msg);
    setBackgroundColor(color);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (color === 'green') {
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 3000);
      }
    });
  };

  const handleConnectionChange = (state) => {
    const connected = state.isConnected && state.isInternetReachable;
    if (connected && !isConnected) {
      showToast('Back Online', 'green');
    }
    if (!connected && isConnected) {
      showToast('No Internet Connection', 'red');
    }
    setIsConnected(connected);
  };

  useEffect(() => {
    // Initial fetch on mount
    NetInfo.fetch().then(handleConnectionChange);

    // Listen for changes (debounced)
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        handleConnectionChange(state);
      }, 500);
    });

    return () => {
      unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [isConnected]);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
        
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 30,    
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 10,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
 
});

export default NetworkStatusToast;

