# Requirements Document

## Introduction

This document specifies the requirements for Phase 2 improvements to the SS Property Guru React Native mobile application. The application is a property marketplace with OTP-based authentication. These improvements focus on removing unused features, adding essential pages, fixing UI issues, and enhancing search functionality. The backend is shared with a website frontend, so all backend changes must maintain backward compatibility.

## Glossary

- **Mobile_App**: The SS Property Guru React Native mobile application for iOS and Android
- **Backend_API**: The Node.js/Express backend service deployed on Railway that serves both mobile app and website
- **Live_Tour_Feature**: The existing live streaming functionality that allows users to view property tours via YouTube URLs
- **Navigation_System**: The React Navigation-based routing system including bottom tabs and stack navigators
- **Privacy_Policy_Screen**: A new screen displaying the application's privacy policy and data handling practices
- **Location_Search**: The hierarchical location filtering system using State, District, and Tehsil levels
- **Enquiry_Tab**: A new bottom navigation tab for submitting property requirements
- **Franchise_Form**: The form on FranchiseScreen for franchise applications
- **Auth_Screens**: LoginScreen and SignupScreen used for user authentication
- **App_Logo**: The logo image file at src/assets/logo.png displayed throughout the application
- **District_API**: The existing backend API endpoint for fetching district data
- **Area_API**: The existing backend API endpoint for fetching area/tehsil data
- **Bottom_Tab_Navigator**: The tab bar navigation component at the bottom of the app with Home, Buy, Sell, and Profile tabs

## Requirements

### Requirement 1: Remove Live Tour Feature

**User Story:** As a product owner, I want to remove the live tour feature, so that the app focuses on core property listing functionality and reduces maintenance overhead.

#### Acceptance Criteria

1. THE Mobile_App SHALL NOT display any navigation links to LiveTourScreen
2. THE Mobile_App SHALL NOT include LiveTourScreen in any navigation stack
3. THE Mobile_App SHALL NOT import or reference stream manager functionality
4. THE Mobile_App SHALL NOT make API calls to stream endpoints
5. WHEN the app is built, THE Mobile_App SHALL NOT include LiveTourScreen.js in the bundle
6. THE Navigation_System SHALL maintain all other existing navigation routes without errors

### Requirement 2: Create Privacy Policy Page

**User Story:** As a user, I want to view the privacy policy, so that I understand how my data is collected and used.

#### Acceptance Criteria

1. THE Mobile_App SHALL include a PrivacyPolicyScreen component
2. THE PrivacyPolicyScreen SHALL display privacy policy content in a scrollable view
3. THE PrivacyPolicyScreen SHALL include a back button to return to the previous screen
4. WHEN a user taps the privacy policy link in AboutContactScreen, THE Navigation_System SHALL navigate to PrivacyPolicyScreen
5. WHEN a user taps the privacy policy link in LoginScreen, THE Navigation_System SHALL navigate to PrivacyPolicyScreen
6. WHEN a user taps the privacy policy link in SignupScreen, THE Navigation_System SHALL navigate to PrivacyPolicyScreen
7. THE PrivacyPolicyScreen SHALL follow the existing app design patterns for colors, typography, and spacing
8. THE PrivacyPolicyScreen SHALL support the app's multi-language system using i18n translations

### Requirement 3: Fix App Logo Display

**User Story:** As a user, I want to see a high-quality app logo, so that the app appears professional and polished.

#### Acceptance Criteria

1. THE App_Logo SHALL be a PNG image with minimum resolution of 512x512 pixels
2. THE App_Logo SHALL have a transparent background
3. WHEN the App_Logo is displayed on any screen, THE Mobile_App SHALL render it without pixelation or blurriness
4. THE App_Logo SHALL maintain consistent visual quality across different screen densities
5. THE Mobile_App SHALL use the updated logo file from src/assets/logo.png in all locations where the logo appears

### Requirement 4: Implement Hierarchical Location Search

**User Story:** As a user, I want to search properties by state, district, and tehsil, so that I can find properties in specific locations more easily.

#### Acceptance Criteria

1. THE BuyPropertyScreen SHALL display a state selector dropdown
2. WHEN a user selects a state, THE Mobile_App SHALL fetch and display districts for that state
3. WHEN a user selects a district, THE Mobile_App SHALL fetch and display tehsils for that district
4. WHEN a user selects a tehsil, THE Mobile_App SHALL filter properties to show only those in the selected tehsil
5. THE Location_Search SHALL use existing District_API and Area_API endpoints without requiring backend changes
6. WHEN no state is selected, THE Mobile_App SHALL display all properties
7. WHEN a state is selected but no district is selected, THE Mobile_App SHALL display all properties in that state
8. THE Location_Search SHALL maintain the existing search bar functionality
9. THE Location_Search dropdowns SHALL follow the existing chip-based UI pattern used for district/area selection

### Requirement 5: Add Enquiry Tab to Bottom Navigation

**User Story:** As a user, I want quick access to submit property requirements, so that I can easily communicate my needs to agents.

#### Acceptance Criteria

1. THE Bottom_Tab_Navigator SHALL include an Enquiry tab
2. THE Enquiry tab SHALL be positioned as the 4th tab in the bottom navigation
3. WHEN a user taps the Enquiry tab, THE Navigation_System SHALL navigate to PostRequirementScreen
4. THE Enquiry tab SHALL display an appropriate icon representing enquiries or requirements
5. THE Enquiry tab SHALL follow the existing TabIcon component styling and animation patterns
6. THE Bottom_Tab_Navigator SHALL maintain the existing floating tab bar design with 5 tabs total
7. THE Enquiry tab SHALL display a translated label using the i18n system

### Requirement 6: Simplify Franchise Form

**User Story:** As a potential franchisee, I want a simple franchise application form, so that I can quickly express interest without filling lengthy forms.

#### Acceptance Criteria

1. THE Franchise_Form SHALL contain exactly 2 input fields
2. THE Franchise_Form SHALL include a name input field
3. THE Franchise_Form SHALL include a phone number input field
4. THE Franchise_Form SHALL NOT include email, city, or message input fields
5. WHEN a user submits the form with empty fields, THE Mobile_App SHALL display a validation error
6. WHEN a user submits the form with valid data, THE Mobile_App SHALL call the franchise API endpoint
7. THE Franchise_Form SHALL maintain the existing terms and conditions checkbox
8. THE Franchise_Form SHALL maintain the existing visual design and styling

### Requirement 7: Maintain Backend Compatibility

**User Story:** As a system administrator, I want all mobile app changes to be compatible with the existing backend, so that the website frontend continues to function without issues.

#### Acceptance Criteria

1. THE Mobile_App SHALL NOT modify any Backend_API response formats
2. THE Mobile_App SHALL NOT add new required fields to any Backend_API request payloads
3. THE Mobile_App SHALL use existing Backend_API endpoints without creating new endpoints
4. WHEN the Mobile_App makes API requests, THE Backend_API SHALL respond with the same data structures used by the website
5. THE Mobile_App SHALL handle optional fields in API requests to maintain backward compatibility

### Requirement 8: Preserve Existing Functionality

**User Story:** As a user, I want all existing app features to continue working, so that my experience is not disrupted by the improvements.

#### Acceptance Criteria

1. THE Mobile_App SHALL maintain all existing authentication flows
2. THE Mobile_App SHALL maintain all existing property listing and detail screens
3. THE Mobile_App SHALL maintain all existing profile and dashboard functionality
4. THE Mobile_App SHALL maintain all existing agent and franchise features
5. WHEN a user navigates through the app, THE Navigation_System SHALL function without crashes or errors
6. THE Mobile_App SHALL maintain support for all existing languages (English, Hindi, Gujarati, Marathi, Punjabi)
7. THE Mobile_App SHALL maintain all existing API integrations for properties, users, agents, and notifications
