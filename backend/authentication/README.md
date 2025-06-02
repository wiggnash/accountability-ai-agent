## 🔑 ESSENTIAL APIs FOR YOUR FRONTEND

### 1. REGISTER USER
   📍 POST /api/v1/auth/register/
   📝 Body: {username, email, first_name, last_name, password, password_confirm}
   ✅ Returns: user data + JWT tokens

### 2. LOGIN USER
   📍 POST /api/v1/auth/login/
   📝 Body: {username_or_email, password}
   ✅ Returns: user data + JWT tokens

### 3. REFRESH TOKEN
   📍 POST /api/v1/auth/token/refresh/
   📝 Body: {refresh}
   ✅ Returns: new access token

### 4. VERIFY TOKEN
   📍 GET /api/v1/auth/token/verify/
   🔐 Header: Authorization: Bearer {access_token}
   ✅ Returns: token validity + user info

### 5. LOGOUT (Optional)
   📍 POST /api/v1/auth/logout/
   🔐 Header: Authorization: Bearer {access_token}
   📝 Body: {refresh_token}
   ✅ Returns: success message

### 6. GET PROFILE (Optional)
   📍 GET /api/v1/auth/profile/
   🔐 Header: Authorization: Bearer {access_token}
   ✅ Returns: detailed user + profile data
