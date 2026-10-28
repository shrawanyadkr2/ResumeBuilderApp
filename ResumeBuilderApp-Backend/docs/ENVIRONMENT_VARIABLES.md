# 🔐 Environment Variables Specification — Resume Genie

**Creator/Organization:** `sky.devX`  
**Application:** `Resume Genie`

This document details every environment variable consumed by the application, whether it is mandatory, its default value in `dev`, and its production requirement.

---

| Variable Name | Required in Dev? | Required in Prod? | Default (Dev) | Description |
| :--- | :---: | :---: | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | No | **Yes** | `dev` | Active Spring profile (`dev` or `prod`). Controls security strictness, logging, and validation. |
| `PORT` | No | No | `8080` | Port for the HTTP server. On Render, set automatically by hosting runtime. |
| `MONGODB_URI` | No | **Yes** | `mongodb://localhost:27017/resumegenie` | MongoDB connection URI. In `prod`, cannot be localhost. |
| `MONGODB_DATABASE` | No | No | `resumegenie` | Explicit MongoDB database name. Ensures the database is always `resumegenie`. |
| `JWT_SECRET` | No | **Yes** | `devDefaultSecretKey...` | HMAC-SHA256 signing secret. In `prod`, must be at least 32 characters and cryptographically strong. |
| `JWT_EXPIRATION_MS` | No | No | `86400000` (24h) | JWT lifespan in milliseconds. |
| `APP_BASE_URL` | No | **Yes** | `http://localhost:8081` | Public origin of the frontend web application or mobile link used in emails. |
| `BACKEND_BASE_URL` | No | No | `http://localhost:8080` | Publicly accessible URL of the backend service. |
| `CORS_ALLOWED_ORIGINS` | No | **Yes** | Local dev origins | Comma-separated list of allowed origins. Wildcards (`*`) are prohibited in `prod`. |
| `SPRING_MAIL_HOST` | No | No | `smtp-relay.brevo.com` | Brevo SMTP server host. |
| `SPRING_MAIL_PORT` | No | No | `587` | Brevo SMTP TLS port. |
| `SPRING_MAIL_USERNAME` | No | **Yes** | Empty | Brevo account email or SMTP username. |
| `SPRING_MAIL_PASSWORD` | No | **Yes** | Empty | Brevo SMTP Master Key / password. |
| `SPRING_MAIL_FROM` | No | No | `noreply@skydevx.com` | Default sender email address. |
| `CLOUDINARY_CLOUD_NAME` | No | **Yes** | Empty | Cloudinary cloud account name. |
| `CLOUDINARY_API_KEY` | No | **Yes** | Empty | Cloudinary API Key. |
| `CLOUDINARY_API_SECRET` | No | **Yes** | Empty | Cloudinary API Secret. |
| `RAZORPAY_KEY_ID` | No | **Yes** | Empty | Razorpay Key ID (`rzp_test_...` for dev, `rzp_live_...` for prod). |
| `RAZORPAY_KEY_SECRET` | No | **Yes** | Empty | Razorpay Key Secret. Used for order creation and HMAC signature verification. |
| `RAZORPAY_WEBHOOK_SECRET`| No | **Yes** | Empty | Secret configured in the Razorpay Webhook dashboard for HMAC verification. |
| `EMAIL_VERIFICATION_REQUIRED` | No | No | `false` (dev) / `true` (prod) | Toggle whether new registrations require email confirmation before logging in. |
