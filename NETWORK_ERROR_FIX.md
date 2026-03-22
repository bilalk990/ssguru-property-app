# 🔧 Network Error Fix - Complete Solution

## Problem
App showing "Network Error. Please check your internet connection" on signup.

## Root Cause
Android network security blocking HTTPS connections due to missing configuration.

## ✅ Fixes Applied

### 1. Android Network Security Config
**File:** `android/app/build.gradle`
```gradle
manifestPlaceholders = [usesCleartextTraffic: "true"]
```

### 2. Network Security XML
**File:** `android/app/src/main/res/xml/network_security_config.xml`
- Allows cleartext traffic for development
- Configures HTTPS for production domain
- Trusts system certificates

### 3. AndroidManifest Update
**File:** `android/app/src/main/AndroidManifest.xml`
```xml
android:networkSecurityConfig="@xml/network_security_config"
```

### 4. API Client Improvements
**File:** `src/api/apiClient.js`
- Increased timeout: 30s → 60s
- Added Accept header
- Better error logging

## 🚀 How to Test

### Step 1: Clean Build
```bash
cd android
./gradlew clean
cd ..
```

### Step 2: Rebuild App
```bash
npx react-native run-android
```

### Step 3: Test Signup
1. Open app
2. Go to Signup screen
3. Fill all fields:
   - Name: Test User
   - Phone: 1234567890
   - Email: test@example.com
   - Password: Test@123
   - Role: User
4. Click "Create Account"

### Expected Result
✅ Should connect to server successfully
✅ Should show proper error if validation fails
✅ Should create account if all data is valid

## 🐛 If Still Not Working

### Check 1: Device Internet
- Open device browser
- Visit: https://sspropertyguru-production.up.railway.app/api/v1/districts
- Should show JSON response

### Check 2: Enable USB Debugging Logs
```bash
npx react-native log-android
```

Look for:
- `=== API ERROR DEBUG ===`
- Error codes
- Request URLs

### Check 3: Test with Postman
```bash
curl -X POST https://sspropertyguru-production.up.railway.app/api/v1/auth/signup \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "phone=1234567890" \
  -F "role=user" \
  -F "password=Test@123" \
  -F "password_confirmation=Test@123"
```

### Check 4: Verify Backend
- Go to Railway dashboard
- Check if deployment is active
- Check logs for errors

## 📱 Build APK for Testing

### Debug APK
```bash
cd android
./gradlew assembleDebug
```

APK location:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK
```bash
cd android
./gradlew assembleRelease
```

APK location:
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🔐 Production Checklist

Before production:
- [ ] Remove `cleartextTrafficPermitted="true"` from network config
- [ ] Use only HTTPS in production
- [ ] Add proper SSL certificate validation
- [ ] Remove debug logs
- [ ] Test on multiple devices
- [ ] Test on different networks (WiFi, 4G, 5G)

## 🎯 Quick Commands

### Clean everything
```bash
cd android && ./gradlew clean && cd ..
rm -rf node_modules
npm install
npx react-native run-android
```

### Check app logs
```bash
npx react-native log-android
```

### Build and install
```bash
npx react-native run-android --variant=debug
```

## ✅ Verification

After rebuild, you should see:
1. ✅ App installs successfully
2. ✅ Signup screen loads
3. ✅ Network requests go through
4. ✅ Proper error messages (not generic "Network Error")
5. ✅ Backend responses received

---

**Status:** All fixes applied ✅
**Next Step:** Rebuild app with `npx react-native run-android`
**Expected:** Network error should be resolved 🎉
