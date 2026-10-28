# Resume Genie — Mobile & Web Application

**Resume Genie** is a modern, responsive, 7-step guided mobile and web resume-building application engineered for ATS (Applicant Tracking System) optimization and real-time live preview.

**Creator Branding:** `sky.devX`  
**Android Application Package:** `com.skydevx.resumegenie`  
**Frontend Framework:** React Native 0.88 + Expo SDK 58 + React Native Web  
**Backend Framework:** Java 21 + Spring Boot 3.3.5 + MongoDB Atlas + JWT Auth

---

## 🎨 Visual Fidelity & Figma Alignment

Built strictly according to the Figma design specifications:
1. **Splash Screen:** Bold "RESUME GENIE" branding, royal blue circular document badge, subtitle, and instant demo entry.
2. **Step 1 — Personal Information:** Full name, title, email, phone, location, LinkedIn, portfolio.
3. **Step 2 — Professional Summary:** Multi-line summary editor with dynamic character counter and ATS guidance.
4. **Step 3 — Work Experience:** Dynamic experience cards, company, start/end dates, bullet points with removal, and `+ Add Bullet`.
5. **Step 4 — Education:** Degree, university, start/end dates, academic honors.
6. **Step 5 — Skills:** Skill input field with royal blue `+ Add` button, interactive chip tags with removal, and popular suggestions.
7. **Step 6 — Projects:** Project cards with title, repo/live link, descriptions, and highlights.
8. **Step 7 — Templates & Palettes:** Template selection (Modern Clean, Classic Serif, Executive Minimal) and color swatches (Professional Navy `#0D5BFF`, Modern Royal, Executive Slate, Emerald, Burgundy, Charcoal).
9. **Live Preview Screen:** Responsive ATS resume representation updating dynamically with edits and selected palette.
10. **Export & Share Screen:** One-click PDF download/save, link sharing, and Plus tier upgrade preview.

---

## 🚀 Running the Frontend Locally

### 1. Web Browser Mode (Fastest for testing & evaluation)
From the `ResumeBuilderApp-Frontend` directory:
```bash
npx expo start --web
```
Or export the static web bundle:
```bash
npx expo export --platform web
```

### 2. Android Emulator
Ensure your Android emulator is active (Android Studio AVD).
```bash
npx expo start --android
```
> **Backend Base URL for Android Emulator:**  
> Use `http://10.0.2.2:8080` (automatically resolved by `src/config/env.js`).

### 3. Physical Android Device (Expo Go)
1. Ensure your physical Android device and development computer are on the **same Wi-Fi network**.
2. Run `ipconfig` (Windows) to find your computer's local IP address (e.g. `192.168.1.5`).
3. Set `EXPO_PUBLIC_API_URL=http://<YOUR_LAN_IP>:8080` in `.env.development`.
4. Run:
   ```bash
   npx expo start
   ```
5. Scan the QR code using the **Expo Go** app on your Android device.

---

## 📦 Building Standalone Android APK

To generate a standalone `.apk` for installation on any physical Android device:

```bash
# 1. Install EAS CLI globally if not already installed
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Configure EAS build
eas build:configure

# 4. Trigger preview APK build (direct APK file output)
eas build -p android --profile preview
```

---

## 📁 Source Tree Architecture

```
ResumeBuilderApp-Frontend/
├── App.js                         # Root application navigator & context provider
├── app.json                       # Expo configuration & Android permissions
├── babel.config.js                # Babel setup
├── metro.config.js                # Metro bundler config
├── package.json                   # Dependencies (Expo SDK 58, React Native, SVG)
├── .env.development               # Dev environment config (http://localhost:8080)
├── .env.production                # Prod environment config
├── src/
│   ├── api/
│   │   ├── apiClient.js           # Fetch-based HTTP client with Bearer tokens
│   │   ├── authApi.js             # Authentication endpoints
│   │   ├── resumeApi.js           # Resume CRUD & section patch APIs
│   │   └── templateApi.js         # Templates & Razorpay payment APIs
│   ├── config/
│   │   └── env.js                 # Universal environment URL resolver
│   ├── context/
│   │   ├── AuthContext.js         # Authentication state, login, registration
│   │   └── ResumeContext.js       # 7-step builder state, autosave, mutations
│   ├── components/
│   │   ├── Icons.js               # Feather/Lucide styled lightweight SVG icons
│   │   ├── Header.js              # Standardized header with back & preview
│   │   ├── StepperProgress.js     # Top linear progress bar (1/7 to 7/7)
│   │   ├── InputField.js          # Figma-tinted #EFF4FA rounded input
│   │   ├── Button.js              # Primary, outline, ghost, danger buttons
│   │   ├── BottomNavButtons.js    # Bottom sticky navigation (Back / Next)
│   │   ├── ExperienceCard.js      # Card for work experience & bullets
│   │   ├── EducationCard.js       # Card for education history & bullets
│   │   ├── ProjectCard.js         # Card for portfolio projects & links
│   │   ├── SkillChip.js           # Rounded chip tag with 'x' deletion
│   │   ├── PaletteSelector.js     # Color swatch selector
│   │   └── LiveResumePreview.js   # Dynamic ATS resume view component
│   ├── screens/
│   │   ├── SplashScreen.js        # Screen 1: Welcome & brand launch
│   │   ├── AuthScreen.js          # Screen 2: Sign In / Create Account
│   │   ├── DashboardScreen.js     # Screen 3: My Resumes & Create button
│   │   ├── PreviewScreen.js       # Screen 9: Full live resume preview
│   │   ├── ExportScreen.js        # Screen 10: PDF download & share
│   │   ├── ProfileScreen.js       # Candidate profile & plan status
│   │   └── steps/
│   │       ├── ResumeBuilderFlow.js # Stepper orchestrator
│   │       ├── Step1PersonalInfo.js # Step 1: Personal Info
│   │       ├── Step2Summary.js      # Step 2: Professional Summary
│   │       ├── Step3Experience.js   # Step 3: Work Experience
│   │       ├── Step4Education.js    # Step 4: Education
│   │       ├── Step5Skills.js       # Step 5: Skills & Chips
│   │       ├── Step6Projects.js     # Step 6: Projects
│   │       └── Step7Templates.js    # Step 7: Layout & Palettes
│   ├── theme/
│   │   ├── colors.js              # Figma color tokens & 6 palette presets
│   │   ├── typography.js          # Typography hierarchy
│   │   └── index.js               # Spacing, radius & shadow constants
│   └── utils/
│       ├── pdfGenerator.js        # Universal HTML-to-PDF print generator
│       ├── storage.js             # Universal web/native storage adapter
│       └── validation.js          # Email and input validators
└── assets/                        # App icons and splash assets
```
