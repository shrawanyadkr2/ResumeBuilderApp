# 💻 Local Development Guide — Resume Genie

**Creator/Organization:** `sky.devX`  
**Application:** `Resume Genie`

This guide walks you through setting up and running the Resume Genie Spring Boot backend locally, connecting it with Expo web browsers, Android emulators, and physical Android test devices.

---

## 1. Prerequisites

- **Java JDK 21+** (or Java 17 LTS / OpenJDK)
  Verify installation:
  ```bash
  java -version
  ```
- **MongoDB** (Local instance or free MongoDB Atlas cluster)
- **Node.js & npm / yarn** (for React Native Expo client development)

---

## 2. Setting Up Local Environment Variables

1. Navigate to the backend directory:
   ```bash
   cd ResumeBuilderApp-Backend
   ```
2. Copy the template to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` values for your local environment:
   ```dotenv
   SPRING_PROFILES_ACTIVE=dev
   PORT=8080

   # Database - Must be 'resumegenie'
   MONGODB_URI=mongodb://localhost:27017/resumegenie
   MONGODB_DATABASE=resumegenie

   # JWT secret (dev default provided, or generate your own)
   JWT_SECRET=devDefaultSecretKeyForResumeGenieMustBeAtLeast32BytesLongLocalDevOnly!
   JWT_EXPIRATION_MS=86400000

   # Application Base URLs
   APP_BASE_URL=http://localhost:8081
   BACKEND_BASE_URL=http://localhost:8080
   CORS_ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006,http://localhost:3000,http://localhost:5173

   # Brevo SMTP (For test emails)
   SPRING_MAIL_HOST=smtp-relay.brevo.com
   SPRING_MAIL_PORT=587
   SPRING_MAIL_USERNAME=your_brevo_username
   SPRING_MAIL_PASSWORD=your_brevo_smtp_password
   SPRING_MAIL_FROM=support@skydevx.com

   # Cloudinary (Test or Sandbox)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay (Use test keys starting with rzp_test_)
   RAZORPAY_KEY_ID=rzp_test_yourKeyId
   RAZORPAY_KEY_SECRET=yourRazorpayKeySecret
   RAZORPAY_WEBHOOK_SECRET=yourWebhookSecret

   # Feature Flags
   # Set to 'false' in local dev to automatically verify email on registration!
   EMAIL_VERIFICATION_REQUIRED=false
   ```

> [!TIP]
> Setting `EMAIL_VERIFICATION_REQUIRED=false` during early local prototyping allows test accounts to immediately create and save resumes without waiting for email delivery.

---

## 3. Starting the Backend in Development Mode

Run via the included Maven wrapper:

**On Linux / macOS:**
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**On Windows (PowerShell / Command Prompt):**
```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

Once started, verify:
- Backend Health Check: [http://localhost:8080/api/health](http://localhost:8080/api/health)
- Swagger / OpenAPI UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- OpenAPI JSON Spec: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 4. Connecting Clients to the Backend

### A. Expo Web / Browser Testing
When running Expo web (`npx expo start --web`), Expo typically serves the frontend on `http://localhost:8081` or `http://localhost:19006`.
- The backend's `dev` profile has CORS pre-configured to accept requests from `http://localhost:8081` and `http://localhost:19006`.
- Frontend API base URL should be configured as:
  ```dotenv
  EXPO_PUBLIC_API_URL=http://localhost:8080
  ```

### B. Android Emulator Testing
The Android Emulator runs in an isolated virtual network:
- `localhost` inside the Android emulator refers to the emulator itself, **NOT** your development PC!
- Android Emulator alias for your host PC: `10.0.2.2`
- Set your frontend API base URL in `.env.development` or Expo configuration to:
  ```dotenv
  EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
  ```

### C. Physical Android Device Testing
When testing on a physical Android phone over Wi-Fi:
1. Make sure your computer and phone are connected to the **same Wi-Fi network**.
2. Find your computer's local network IP:
   - Windows: Run `ipconfig` (look for `IPv4 Address`, e.g., `192.168.1.45`)
   - Mac/Linux: Run `ifconfig` or `ip a` (e.g., `192.168.1.45`)
3. Set your Expo frontend API base URL to your LAN IP:
   ```dotenv
   EXPO_PUBLIC_API_URL=http://192.168.1.45:8080
   ```
4. Add your LAN address to `CORS_ALLOWED_ORIGINS` in `ResumeBuilderApp-Backend/.env`:
   ```dotenv
   CORS_ALLOWED_ORIGINS=http://localhost:8081,http://192.168.1.45:8081
   ```
5. Ensure your Windows Firewall allows inbound connections to TCP Port 8080 for private networks.

---

## 5. Running Tests

Run the full automated test suite (32 unit & integration tests):

```bash
# In ResumeBuilderApp-Backend directory
.\mvnw.cmd test
```

Build the production JAR:
```bash
.\mvnw.cmd package
```
Output artifact: `target/resume-genie-backend.jar`
