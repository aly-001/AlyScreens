import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";



export default function CheckMark({ added, finished, started, checkDelay}) {
  const [defFinished, setDefFinished] = useState(finished);
  useEffect(() => {
    let timer;
    if (added && finished) {
      timer = setTimeout(() => {
        setDefFinished(true);
      }, checkDelay);
    }
    // pretty log of all state variables
    console.log({ "added": added, "finished": finished, "defFinished": defFinished });
    return () => clearTimeout(timer);
  }, [added, finished, checkDelay]);

  return (
      
      <View style={styles.container}>
        {(added && defFinished) && (
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark" size={40} color={colors.utilityBlue} />
          </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.utilityBlueCrazyLight,
    height: 27,
    width: 27,
    borderRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    position: "absolute",
    top: -8,
    left: -1,
  },
});
