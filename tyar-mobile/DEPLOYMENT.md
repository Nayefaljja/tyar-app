# TYAR Mobile App — Deployment Guide

## Prerequisites
- Expo account at expo.dev
- EAS CLI: `npm install -g eas-cli`

## Setup
```bash
npx eas login
npx eas build:configure
```

## Builds

### Preview APK (Android, shareable link, no store needed)
```bash
npx eas build -p android --profile preview
```

### Production (App Store / Play Store)
```bash
npx eas build -p all --profile production
```

## Submit to stores
```bash
npx eas submit -p android
npx eas submit -p ios
```
