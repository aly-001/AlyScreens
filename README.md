# Aly – Quick-start for Development Build

*Aly is a language-learning e-reader that lets you tap words, see AI-generated translations, save them as spaced-repetition flashcards, and even generate eye-catching DALL·E artwork and TTS audio for each term.*

This project is an Expo + React-Native app that needs an OpenAI key. Follow these **four steps** to get a development build running on your device or simulator.

---

## 1  Clone & install
```bash
# clone the repo and enter the project
 git clone https://github.com/aly-001/AlyScreens.git
 cd new/AlyScreens

# install JS dependencies
 npm install           # or: yarn
```

---

## 2  Add your OpenAI key
The app looks for `API_KEY` (or `OPENAI_API_KEY`).  Keep it out of git.

```bash
# still inside AlyScreens
 echo "API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" > .env
```

---

## 3  Create a dev-build once (cloud compile)
We use EAS Build to generate a **development client** that you install on the device.

1. **One-time**: store the key as an EAS secret so the cloud build has it too:
   ```bash
   eas secret:create --name OPENAI_API_KEY --value sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
2. Start the build (iOS example):
   ```bash
   eas build --profile development -p ios   # use -p android for Android
   ```
3. Install the build via the QR/link EAS gives you.

> You only repeat this step when native code changes; most JS edits do **not** need a new build.

---

## 4  Run Metro & reload
```bash
npm start         # or: yarn start
```
* Scan the QR shown in the terminal with the dev-client you just installed, **or** press `i` / `a` to open an iOS or Android simulator.
* Hot-reload works out of the box. If you ever see "`OPENAI_API_KEY` missing", confirm that `.env` exists and you used `npm start` (not `npx expo start`).

That's it—enjoy hacking! 🎉 