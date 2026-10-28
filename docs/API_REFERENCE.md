# 📡 API Reference — Resume Genie REST API

**Creator/Organization:** `sky.devX`  
**Application:** `Resume Genie`  
**Version:** `1.0.0`  
**Base URL:** `http://localhost:8080` (Dev) / `https://<deployed-domain>` (Prod)

All protected endpoints require the HTTP header:
```http
Authorization: Bearer <JWT_TOKEN>
```

Interactive OpenAPI / Swagger UI is available at:
`GET /swagger-ui.html`

---

## 1. Authentication Endpoints

### 1.1 Register New User
- **URL:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@skydevx.com",
    "password": "StrongPassword123!",
    "profileImageUrl": "https://res.cloudinary.com/..."
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful.",
    "data": {
      "id": "673f1234567890abcdef1234",
      "name": "Jane Doe",
      "email": "jane@skydevx.com",
      "profileImageUrl": "https://...",
      "subscriptionPlan": "FREE",
      "emailVerified": false,
      "emailVarified": false,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "createdAt": "2026-10-28T19:30:00",
      "updatedAt": "2026-10-28T19:30:00"
    }
  }
  ```

### 1.2 User Login
- **URL:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "jane@skydevx.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "id": "673f1234567890abcdef1234",
      "name": "Jane Doe",
      "email": "jane@skydevx.com",
      "subscriptionPlan": "FREE",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 1.3 Verify Email
- **URL:** `GET /api/auth/verify-email?token=<token>`
- **Access:** Public
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Email verified successfully! You may now sign in."
  }
  ```

### 1.4 Resend Verification Email
- **URL:** `POST /api/auth/resend-verification`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "jane@skydevx.com"
  }
  ```

### 1.5 Forgot Password
- **URL:** `POST /api/auth/forgot-password`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "jane@skydevx.com"
  }
  ```

### 1.6 Reset Password
- **URL:** `POST /api/auth/reset-password`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "token": "token_uuid",
    "newPassword": "NewStrongPassword123!"
  }
  ```

### 1.7 Get User Profile
- **URL:** `GET /api/auth/profile`
- **Access:** Protected (Bearer token)
- **Response (200 OK):** User account details.

### 1.8 Upload Profile Picture
- **URL:** `POST /api/auth/upload-image`
- **Access:** Protected (Bearer token)
- **Content-Type:** `multipart/form-data`
- **Part:** `file` (JPEG, PNG, WebP <= 5MB)
- **Response (200 OK):**
  ```json
  {
    "imageUrl": "https://res.cloudinary.com/skydevx/image/upload/v1234/resumegenie/users/avatar.jpg",
    "message": "User profile photo updated successfully."
  }
  ```

---

## 2. Resume Management Endpoints

### 2.1 Create Resume (Step 1 Initializer)
- **URL:** `POST /api/resumes`
- **Access:** Protected (Bearer token)
- **Request Body:**
  ```json
  {
    "title": "Senior Android Architect"
  }
  ```
- **Response (201 Created):** Full Resume object initialized with 7 sections.

### 2.2 List User Resumes
- **URL:** `GET /api/resumes`
- **Access:** Protected (Bearer token)
- **Response (200 OK):** Array of resumes owned by authenticated user.

### 2.3 Get Resume by ID
- **URL:** `GET /api/resumes/{id}`
- **Access:** Protected (Bearer token - ownership enforced)
- **Response (200 OK):** Full Resume object.

### 2.4 Update Entire Resume
- **URL:** `PUT /api/resumes/{id}`
- **Access:** Protected (Bearer token - ownership enforced)
- **Request Body:** Full updated resume document.

### 2.5 Update Resume Section (Stepper-friendly)
- **URL:** `PATCH /api/resumes/{id}/section`
- **Access:** Protected (Bearer token - ownership enforced)
- **Request Body:**
  ```json
  {
    "section": "workExperience",
    "data": [
      {
        "company": "Google DeepMind",
        "role": "Staff Engineer",
        "startDate": "2022-01",
        "endDate": "Present",
        "description": "Architected agentic coding platforms",
        "isCurrent": true
      }
    ]
  }
  ```

### 2.6 Upload Resume Images (Thumbnail / Avatar)
- **URL:** `POST /api/resumes/{id}/upload-images`
- **Access:** Protected (Bearer token - ownership enforced)
- **Content-Type:** `multipart/form-data`
- **Parts:** `thumbnail` (optional), `profileImage` (optional)

### 2.7 Delete Resume
- **URL:** `DELETE /api/resumes/{id}`
- **Access:** Protected (Bearer token - ownership enforced)

---

## 3. Templates & Entitlements Endpoints

### 3.1 Get All Templates
- **URL:** `GET /api/templates`
- **Access:** Public
- **Response (200 OK):** Full template catalog including IDs, categories, descriptions, thumbnail previews, and premium flags.

### 3.2 Get Current User Entitlements
- **URL:** `GET /api/templates/entitlements`
- **Access:** Protected (Bearer token)
- **Response (200 OK):**
  ```json
  {
    "subscriptionPlan": "FREE",
    "isPlus": false,
    "maxResumes": 3,
    "watermarkEnabled": true,
    "accessibleTemplates": ["modern-01", "minimal-02"],
    "priorityExport": false
  }
  ```

---

## 4. Payment Endpoints (Razorpay)

### 4.1 Create Order
- **URL:** `POST /api/payment/create-order`
- **Access:** Protected (Bearer token)
- **Request Body:**
  ```json
  {
    "planType": "PLUS"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "orderId": "order_PLuS987654321",
    "amount": 49900,
    "currency": "INR",
    "receipt": "RG_a1b2c3d4e5f6",
    "planType": "PLUS"
  }
  ```

### 4.2 Verify Client Payment Signature
- **URL:** `POST /api/payment/verify`
- **Access:** Protected (Bearer token)
- **Request Body:**
  ```json
  {
    "razorpay_order_id": "order_PLuS987654321",
    "razorpay_payment_id": "pay_PLuS123456789",
    "razorpay_signature": "c87a10248...6a"
  }
  ```

### 4.3 Razorpay Webhook Handler
- **URL:** `POST /api/payment/webhook`
- **Access:** Public (cryptographically verified using `X-Razorpay-Signature`)
- **Headers:** `X-Razorpay-Signature: <hex_hmac_sha256>`
- **Response (200 OK):** `{"status": "received"}`

### 4.4 Payment History
- **URL:** `GET /api/payment/history`
- **Access:** Protected (Bearer token)

---

## 5. Recruiter Email Dispatch

### 5.1 Send Resume PDF to Recruiter
- **URL:** `POST /api/email/send-resume`
- **Access:** Protected (Bearer token)
- **Content-Type:** `multipart/form-data`
- **Parts:**
  - `recipientEmail`: Recruiter email address
  - `subject`: Email subject
  - `message`: Cover message
  - `pdfFile`: PDF attachment binary (<= 10MB)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Resume has been successfully submitted to Brevo for delivery to recruiter@example.com",
    "data": {
      "recipient": "recruiter@example.com",
      "filename": "Senior_Android_Architect.pdf",
      "submissionStatus": "SUBMITTED_TO_GATEWAY"
    }
  }
  ```

---

## 6. System Health

### 6.1 Service Health Check
- **URL:** `GET /api/health`
- **Access:** Public
- **Response (200 OK):**
  ```json
  {
    "status": "UP",
    "application": "Resume Genie",
    "organization": "sky.devX",
    "profile": "prod",
    "version": "1.0.0",
    "database": "resumegenie",
    "databaseStatus": "CONNECTED"
  }
  ```
