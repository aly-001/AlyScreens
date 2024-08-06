import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../config/colors';

const generate = false;

const PracticeAudio = () => {
  // Generate 20 random bar heights
  //const barHeights = Array.from({ length: 10 }, () => Math.random() * 35 + 15);
  const barHeights = [32.64414712349911, 31.64426336556644, 44.73662359596196, 17.12968321957025, 48.993792754543705, 21.063340535930813, 15.944747169707457, 45.52553001891543, 48.33462192698157, 21.519901337914952];
  const barHeights2 = [40.60346119082189, 41.96377785453874, 35.451727166268, 37.4718141347239, 28.27866852270717, 34.83927255356795, 41.15931575763014, 49.51308748512693, 25.9101724164011, 36.346989790743926];
  const barHeights3 = [35.490823959332644, 29.90262384054251, 31.861007975337536, 38.79735268444604, 37.02858019718251, 33.89622563626912, 15.53888083805442, 44.159147994908054, 16.159362636663822, 46.002758977417415];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton}>
        <MaterialCommunityIcons name="play" size={34} color={colors.utilityGrey} />
      </TouchableOpacity>
    </View>
  );
};

{/* <Svg height="60" width="200">
        {barHeights3.map((height, index) => (
          <Rect
            key={index}
            x={index * 10}
            y={60 - height}
            width="8"
            height={height}
            rx="4" 
            ry="4"
            fill={colors.utilityGreyLight}
          />
        ))}
      </Svg> */}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  playButton: {
    marginRight: 10,
    marginBottom: 5,
  },
});

export default PracticeAudio;