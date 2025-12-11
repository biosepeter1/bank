# 🔧 Fix Login Issue - Clear Cached User Data

## Problem
You're logged in as Biose (biosejohn@gmail.com) but the sidebar shows "bank@support.com". This is because old user data is cached in the browser's localStorage.

---

## ✅ Solution: Clear Browser Cache

### Method 1: Complete Clear (Recommended)
1. Open your browser's Developer Console:
   - **Windows:** Press `F12` or `Ctrl + Shift + J`
   - **Mac:** Press `Cmd + Option + J`

2. Go to the **Console** tab

3. Paste this command and press Enter:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

4. The page will refresh automatically

5. **Login again** with:
   - Email: `biosejohn@gmail.com`
   - Password: your password

---

### Method 2: Clear Only Auth Tokens
If you want to keep other data, use this instead:

```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
location.reload();
```

---

### Method 3: Manual Clear (via Browser Settings)

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files" and "Cookies and other site data"
3. Time range: "All time"
4. Click "Clear data"
5. Reload the page and login again

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Check "Cookies" and "Cache"
3. Time range: "Everything"
4. Click "Clear Now"
5. Reload and login again

---

## Why This Happens

When you login, the frontend stores:
- `accessToken` - Your authentication token
- `refreshToken` - Token to get new access tokens
- User profile data

If you login as a different user without clearing the old data, the old information stays cached.

---

## Verify It's Fixed

After clearing and logging in again, check the sidebar should show:
- ✅ Name: "Biose Peter"
- ✅ Email: "biosejohn@gmail.com"
- ✅ Role: "USER"

---

## Alternative: Hard Refresh

If clearing cache doesn't work:

1. **Hard Refresh the page:**
   - Windows: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. Then clear localStorage with the command above

3. Login again

---

## What If It Still Doesn't Work?

If you still see "bank@support.com" after clearing cache:

### Check Backend Token:
Open Console and run:
```javascript
console.log('Token:', localStorage.getItem('accessToken'));
```

Copy the token and decode it at https://jwt.io to see which user it belongs to.

### Force Logout:
```javascript
// Force complete logout
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
window.location.href = '/login';
```

---

## Prevent This in Future

The frontend should automatically handle this, but you can always:
1. Use "Logout" button instead of just closing the tab
2. Clear cache when switching between users
3. Use browser's "Incognito/Private" mode for testing different users

---

**Status:** This is a browser caching issue, not a code bug.  
**Solution:** Clear localStorage and login again.  
**Time to fix:** 30 seconds
