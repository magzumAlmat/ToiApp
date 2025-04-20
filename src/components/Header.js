// import React from 'react';
// import { Text, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { COLORS } from '../constants/colors';

// const Header = () => {
//   return (
//     <LinearGradient
//       colors={[COLORS.gradientStart, COLORS.gradientEnd]}
//       style={styles.headerGradient}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//     >
//       <Text style={styles.headerTitle}>Планируйте свою свадьбу</Text>
//       <Text style={styles.headerSubtitle}>Создайте идеальный день с легкостью</Text>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   headerGradient: {
//     padding: 24,
//     borderRadius: 16,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: COLORS.white,
//     textAlign: 'center',
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: COLORS.white,
//     opacity: 0.9,
//     marginTop: 8,
//   },
// });

// export default Header;



import React from 'react';
import { View, Text } from 'react-native';

const Header = () => {
  return (
    <View style={{ backgroundColor: '#4c669f', padding: 20 }}>
      <Text style={{ color: '#fff', fontSize: 20 }}>Header</Text>
    </View>
  );
};

export default Header;