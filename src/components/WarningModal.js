
// import React from 'react';
// import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import * as Animatable from 'react-native-animatable';
// import { COLORS } from '../constants/colors';

// const WarningModal = ({ visible, setVisible, message }) => {
//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <View style={styles.modalOverlay}>
//         <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Предупреждение</Text>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setVisible(false)}
//             >
//               <Icon name="close" size={24} color={COLORS.textSecondary} />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.modalText}>{message}</Text>
//           <TouchableOpacity
//             style={styles.confirmButton}
//             onPress={() => setVisible(false)}
//           >
//             <Text style={styles.confirmButtonText}>ОК</Text>
//           </TouchableOpacity>
//         </Animatable.View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   },
//   modalContent: {
//     width: '85%',
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: COLORS.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//   },
//   closeButton: {
//     padding: 6,
//   },
//   modalText: {
//     fontSize: 16,
//     color: COLORS.textPrimary,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   confirmButton: {
//     backgroundColor: COLORS.primary,
//     borderRadius: 12,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   confirmButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.white,
//   },
// });

// export default WarningModal;



import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const WarningModal = ({ visible, setVisible, message }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Предупреждение</Text>
          <Text>{message}</Text>
          <Button
            title="ОК"
            onPress={() => setVisible(false)}
            color={COLORS.primary}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
});

export default WarningModal;