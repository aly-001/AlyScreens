import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import HomeScreen from "./app/screens/HomeScreen";
import ReadScreen from "./app/screens/ReadScreen";
import MagnificentCheckmark from "./app/components/MagnificentCheckmark";
import DefinitionPopup from "./app/components/DefinitionPopup";

export default function App() {
  const [isChecked, setIsChecked] = useState(false);
  
  return (
  <ReadScreen />
  );
}