export const processWord = (rawWord) => {
  const cleanWord = rawWord.replace(/^[".,\s]+|[".,\s]+$/g, "").trim();
  const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
  return capitalizedWord;
}