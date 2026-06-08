import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Modal } from 'react-native';

/**
 * A reusable loading overlay with optional progress bar support.
 * 
 * @param {boolean} visible - Whether the overlay is shown.
 */
const LoadingOverlay = ({ visible }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#34A232" />
      </View>
    </Modal>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 32, 15, 0.45)', // Semi-transparent dark green tint
    justifyContent: 'center',
    alignItems: 'center',
  },
});