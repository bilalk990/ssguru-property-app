# Push Notification Setup Guide

## Overview
Push notifications will be sent when:
- Agent adds a new property → All users get notification
- Property status changes → Interested users get notification
- New enquiry received → Agent gets notification

## Setup Steps

### 1. Install Firebase Cloud Messaging (FCM)

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### 2. Firebase Console Setup

#### Create Firebase Project:
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "SS Property Guru"
4. Enable Google Analytics (optional)
5. Create project

#### Add Android App:
1. Click "Add app" → Android icon
2. Android package name: `com.sspropertyguru` (from android/app/build.gradle)
3. Download `google-services.json`
4. Place file in: `android/app/google-services.json`

#### Add iOS App (if needed):
1. Click "Add app" → iOS icon
2. iOS bundle ID: `com.sspropertyguru` (from ios/SSPropertyGuru.xcodeproj)
3. Download `GoogleService-Info.plist`
4. Place file in: `ios/SSPropertyGuru/GoogleService-Info.plist`

### 3. Android Configuration

#### Update `android/build.gradle`:
```gradle
buildscript {
    dependencies {
        // Add this line
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

#### Update `android/app/build.gradle`:
```gradle
// Add at the bottom of the file
apply plugin: 'com.google.gms.google-services'
```

#### Update `android/app/src/main/AndroidManifest.xml`:
```xml
<manifest>
    <application>
        <!-- Add notification channel -->
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_channel_id"
            android:value="property_notifications" />
    </application>
</manifest>
```

### 4. iOS Configuration (if needed)

1. Open `ios/SSPropertyGuru.xcworkspace` in Xcode
2. Add `GoogleService-Info.plist` to project
3. Enable Push Notifications capability
4. Enable Background Modes → Remote notifications

### 5. Update Code

#### Uncomment Firebase code in `src/services/notificationService.js`:
- Remove all `// Uncomment after installing Firebase` comments
- Uncomment all Firebase-related code

#### The service is already initialized in `App.tsx`

### 6. Backend Setup

#### Create FCM Token API Endpoint:
```javascript
// Backend: src/routes/user.route.js
router.post('/fcm-token', authMiddleware, async (req, res) => {
    const { token } = req.body;
    const userId = req.user.id;
    
    await User.findByIdAndUpdate(userId, { fcmToken: token });
    
    res.json({ success: true, message: 'FCM token saved' });
});
```

#### Add FCM Token field to User model:
```javascript
// Backend: src/models/user.model.js
const userSchema = new Schema({
    // ... existing fields
    fcmToken: { type: String, default: null },
});
```

#### Send Notification When Property Added:
```javascript
// Backend: src/controllers/property.controller.js
const admin = require('firebase-admin');

// Initialize Firebase Admin (add to app.js)
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// In addProperty controller:
exports.addProperty = async (req, res) => {
    // ... existing property creation code
    
    // Send notification to all users
    const users = await User.find({ fcmToken: { $ne: null } });
    const tokens = users.map(u => u.fcmToken);
    
    if (tokens.length > 0) {
        await admin.messaging().sendMulticast({
            tokens,
            notification: {
                title: 'New Property Listed! 🏠',
                body: `${property.title} - ${property.price}`,
            },
            data: {
                type: 'new_property',
                propertyId: property._id.toString(),
            },
        });
    }
    
    res.json({ success: true, data: property });
};
```

#### Get Firebase Service Account Key:
1. Go to Firebase Console → Project Settings
2. Service Accounts tab
3. Click "Generate new private key"
4. Save as `serviceAccountKey.json` in backend root
5. Add to `.gitignore`

### 7. Test Notifications

#### Test from Firebase Console:
1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and text
4. Select app
5. Send test message

#### Test from Backend:
```javascript
// Test endpoint
router.post('/test-notification', async (req, res) => {
    const { token, title, body } = req.body;
    
    await admin.messaging().send({
        token,
        notification: { title, body },
    });
    
    res.json({ success: true });
});
```

### 8. Notification Types

#### New Property Notification:
```javascript
{
    notification: {
        title: 'New Property Listed! 🏠',
        body: '3 BHK Luxury Apartment - PKR 4,500,000'
    },
    data: {
        type: 'new_property',
        propertyId: '123456'
    }
}
```

#### New Enquiry Notification (for agents):
```javascript
{
    notification: {
        title: 'New Enquiry Received! 📩',
        body: 'Someone is interested in your property'
    },
    data: {
        type: 'new_enquiry',
        propertyId: '123456',
        enquiryId: '789012'
    }
}
```

#### Property Status Change:
```javascript
{
    notification: {
        title: 'Property Status Updated',
        body: 'Your property listing is now active'
    },
    data: {
        type: 'status_change',
        propertyId: '123456',
        status: 'active'
    }
}
```

## Current Status

✅ Notification service created (`src/services/notificationService.js`)
✅ Service initialized in `App.tsx`
✅ Permission handling implemented
⚠️ Firebase not installed (using dummy tokens)
⚠️ Backend FCM integration pending

## Next Steps

1. Install Firebase packages
2. Configure Firebase project
3. Add google-services.json
4. Update backend to send notifications
5. Test notifications

## Testing Without Firebase

The app currently logs notification events to console. Once Firebase is configured:
1. Uncomment Firebase code in `notificationService.js`
2. Rebuild app: `npm run android` or `npm run ios`
3. Test notifications from Firebase Console

## Troubleshooting

### Android: Notifications not received
- Check google-services.json is in correct location
- Verify package name matches Firebase console
- Check Android 13+ permissions granted
- Enable notifications in device settings

### iOS: Notifications not received
- Check GoogleService-Info.plist is added to Xcode
- Verify bundle ID matches Firebase console
- Enable Push Notifications capability
- Check APNs certificate in Firebase console

### Token not generated
- Check Firebase initialization in App.tsx
- Verify permissions granted
- Check console logs for errors
- Restart app after Firebase setup

## Production Checklist

- [ ] Firebase project created
- [ ] google-services.json added (Android)
- [ ] GoogleService-Info.plist added (iOS)
- [ ] Firebase packages installed
- [ ] Backend FCM integration complete
- [ ] Service account key configured
- [ ] Notification handlers tested
- [ ] Permission flow tested
- [ ] Background notifications tested
- [ ] Notification navigation tested
