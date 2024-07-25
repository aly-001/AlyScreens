 // For useReader hook to work, move <ReaderProvider> outside the component where you are calling the hook.

import React from "react";
import EbookReader from "../components/EbookReader";
import { ReaderProvider } from "epubjs-react-native";
import Screen from "../components/Screen";

function EbookReaderScreen({ route }) {
const book = route.params;
return (

);
}

export default EbookReaderScreen;
// Then for` where you can call the hooks:

import React, { useState, useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import { Reader, useReader } from "epubjs-react-native";

import * as FileSystem from "expo-file-system";

import ActivityIndicator from "./ActivityIndicator";
import EbookMenuBar from "./EbookMenuBar";
import defaultStyles from "../config/styles";

function EbookReader({ book }) {
const [width, setWidth] = useState(useWindowDimensions().width);
const [height, setHeight] = useState(useWindowDimensions().height);
const [data64, setData64] = useState("");
const [toc, setToc] = useState([]);
const [showToolbar, setShowToolbar] = useState(false);
const [activeLocation, setActiveLocation] = useState();
const [fontSize, setFontSize] = useState(defaultStyles.epubText.fontSize);

const { goToLocation, changeFontSize, changeFontFamily } = useReader();

const window = useWindowDimensions();

useEffect(() => {
setWidth(window.width);
setHeight(window.height);
}, [window]);

const epubLocalUri = FileSystem.documentDirectory + book.code + "_64_epub";

const loadData64 = async () => {
const result = await FileSystem.readAsStringAsync(epubLocalUri, {
encoding: FileSystem.EncodingType.Base64,
});
setData64(${result});
};

useEffect(() => {
try {
loadData64();
} catch (error) {
console.log(error);
}
}, []);

useEffect(() => {
changeFontSize(fontSize + "px");
}, [fontSize]);

return (
<>

{showToolbar && (

)}
{!!data64 && (
<>
<Reader
src={{
base64: data64,
}}
width={width}
height={height - 70}
renderLoadingComponent={() => (

)}
onNavigationLoaded={setToc}
onLocationChange={setActiveLocation}
onPress={() => {
setShowToolbar(!showToolbar);
}}
onReady={() => {
changeFontSize(fontSize + "px");
changeFontFamily(defaultStyles.epubText.fontFamily);
}}
/>
</>
)}

</>
);
}

export default EbookReader;