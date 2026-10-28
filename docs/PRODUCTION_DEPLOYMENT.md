# 🚀 Production Deployment Guide — Render & Cloud Platforms

**Creator/Organization:** `sky.devX`  
**Application:** `Resume Genie`

This guide explains how to deploy the Resume Genie Spring Boot backend to Render or any Docker/JVM cloud container platform.

---

## 1. Hosting on Render

Render provides native Docker and Web Service support. For a Spring Boot Java application, Render's Web Service running Java 21 or Docker is recommended.

### Step 1: Create a New Web Service on Render
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your Git repository (`ResumeBuilderApp`).
4. Select the repository root or specify the root directory as `ResumeBuilderApp-Backend`.

### Step 2: Configure Build & Start Commands

- **Root Directory:** `ResumeBuilderApp-Backend`
- **Environment:** `Java` (or `Docker`)
- **Build Command:**
  ```bash
  ./mvnw clean package -DskipTests=false
  ```
- **Start Command:**
  ```bash
  java -jar target/resume-genie-backend.jar --spring.profiles.active=prod
  ```

---

## 2. Production Environment Variables Checklist

Set these in the **Environment** tab of your Render Web Service.

| Environment Variable | Description & Requirement | Example |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Must be `prod` | `prod` |
| `PORT` | Set automatically by Render (usually `10000`). App binds to `${PORT:8080}` automatically. | `10000` |
| `MONGODB_URI` | **Mandatory.** MongoDB Atlas connection string targeting `resumegenie`. Fails startup if localhost. | `mongodb+srv://app_user:pwd@cluster0.mongodb.net/resumegenie?retryWrites=true&w=majority` |
| `MONGODB_DATABASE` | Database name. Must be `resumegenie`. | `resumegenie` |
| `JWT_SECRET` | **Mandatory.** Cryptographically random 256-bit+ secret. Must be >= 32 chars. | `d98e83f2a74c4391b48b76c8c93de821901a55f9a72439bc80efd12345678901` |
| `JWT_EXPIRATION_MS` | Expiration in ms (default 7 days: 604800000). | `604800000` |
| `APP_BASE_URL` | Public HTTPS URL of the production web/app frontend. Used in email verification links. | `https://resumegenie.skydevx.com` |
| `BACKEND_BASE_URL` | Deployed backend public URL. | `https://resume-genie-backend.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | **Mandatory.** Comma-separated list of allowed production frontend domains. No wildcards (`*`). | `https://resumegenie.skydevx.com,https://app.resumegenie.com` |
| `SPRING_MAIL_HOST` | Brevo SMTP host | `smtp-relay.brevo.com` |
| `SPRING_MAIL_PORT` | Brevo SMTP port | `587` |
| `SPRING_MAIL_USERNAME` | Brevo account email / SMTP login | `7f8a9b@smtp-brevo.com` |
| `SPRING_MAIL_PASSWORD` | Brevo SMTP Master Key | `xsmtpsib-...` |
| `SPRING_MAIL_FROM` | Verified sender domain email | `noreply@skydevx.com` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary production cloud name | `skydevx-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret | `abcde_secret123` |
| `RAZORPAY_KEY_ID` | Razorpay Live Key ID (`rzp_live_...`) | `rzp_live_abc12345678` |
| `RAZORPAY_KEY_SECRET` | Razorpay Live Secret | `liveSecretKey123` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Live Webhook secret | `liveWebhookSecret123` |
| `EMAIL_VERIFICATION_REQUIRED` | Production email verification enforcement | `true` |

---

## 3. MongoDB Atlas Configuration

1. **Database Access:** Create a dedicated user (e.g., `resumegenie_user`) with read/write access strictly to the `resumegenie` database.
2. **Network Access:** In MongoDB Atlas -> Network Access:
   - Add Render's outbound IPs, or permit access from anywhere (`0.0.0.0/0`) with strong user credentials.
3. **Database Name:** Verify connection string specifies `/resumegenie` (never `/resumebuilder` or `/test`).

---

## 4. Brevo Domain & Sender Verification

1. Log in to [brevo.com](https://app.brevo.com).
2. Go to **Senders & IP** -> **Domains**. Add your sender domain (e.g. `skydevx.com`) and configure SPF, DKIM, and DMARC DNS records.
3. Generate an SMTP key under **Transactional** -> **Settings** -> **Configuration**.
4. Set `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD`.

---

## 5. Razorpay Webhook Configuration

1. In the Razorpay Dashboard (Live mode), go to **Settings** -> **Webhooks**.
2. Click **Add New Webhook**.
3. **Webhook URL:** `https://your-backend.onrender.com/api/payment/webhook`
4. **Secret:** Generate a random string and save it as `RAZORPAY_WEBHOOK_SECRET`.
5. **Alert Email:** `alerts@skydevx.com`
6. **Active Events:**
   - `payment.captured`
   - `order.paid`
   - `payment.failed`

---

## 6. Health Checks & Zero-Downtime Deployment

- Render Health Check Path: `/api/health` (or `/actuator/health`)
- Expected HTTP status: `200 OK`
- If startup encounters missing required environment variables, `ProductionEnvironmentValidator` throws an exception, logging the exact missing configurations and aborting deployment cleanly to prevent live downtime with corrupted state.
