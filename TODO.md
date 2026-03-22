# Devonic Project - Complete Implementation TODO

## 🔴 PHASE 1: CRITICAL FIXES (Security & Functionality)

### 1.1 Fix Duplicate Toaster
- [ ] Remove duplicate Toaster from `src/main.jsx`
- [ ] Keep Toaster only in `src/App.jsx` with proper styling

### 1.2 Strengthen JWT Security
- [ ] Update `server/routes/auth.js` - strengthen dev secrets
- [ ] Update `server/middleware/auth.js` - strengthen dev secrets
- [ ] Add minimum length validation for JWT secrets

### 1.3 Add Auth-Specific Rate Limiting
- [ ] Add stricter rate limiting for `/login` endpoint (5 attempts per 15 min)
- [ ] Add stricter rate limiting for `/register` endpoint (3 attempts per 15 min)
- [ ] Add stricter rate limiting for `/refresh` endpoint (10 attempts per 15 min)

### 1.4 Input Sanitization
- [ ] Add name field validation (min 2 chars, max 50 chars, alphanumeric + spaces)
- [ ] Add email validation improvements
- [ ] Add password strength validation (min 8 chars, uppercase, lowercase, number)

## 🟡 PHASE 2: DEPENDENCY UPDATES

### 2.1 Frontend Dependencies
- [ ] Update `vite` to 6.x
- [ ] Update `react-router-dom` to 7.x
- [ ] Update `eslint` to latest
- [ ] Update `prettier` to latest

### 2.2 Backend Dependencies
- [ ] Update `@sentry/node` to 8.x
- [ ] Update `express-rate-limit` to 7.x
- [ ] Update `nodemon` to 3.x
- [ ] Update `helmet` to latest
- [ ] Update `bcryptjs` to latest (if newer available)

## 🟢 PHASE 3: FEATURE COMPLETION

### 3.1 Instructors Feature Integration
- [ ] Add Instructors link to Navbar
- [ ] Add Instructors route to AppRoutes
- [ ] Create Instructors listing page
- [ ] Create Instructor detail page
- [ ] Add Admin Instructors management

### 3.2 Error Handling Improvements
- [ ] Add better error messages in API service
- [ ] Add toast notifications for API errors
- [ ] Add form validation feedback

### 3.3 Loading States
- [ ] Add Skeleton component usage
- [ ] Add loading states to all pages
- [ ] Add loading states to forms

## 🔵 PHASE 4: QUALITY IMPROVEMENTS

### 4.1 Performance Optimizations
- [ ] Implement lazy loading for routes
- [ ] Add React.memo to components where appropriate
- [ ] Optimize images with lazy loading

### 4.2 UX Improvements
- [ ] Add page transitions
- [ ] Add better empty states
- [ ] Add confirmation dialogs for destructive actions

### 4.3 Code Quality
- [ ] Add PropTypes to components
- [ ] Add JSDoc comments to functions
- [ ] Clean up unused imports

## ✅ COMPLETION CHECKLIST

- [ ] All Phase 1 items complete
- [ ] All Phase 2 items complete
- [ ] All Phase 3 items complete
- [ ] All Phase 4 items complete
- [ ] Application tested and working
- [ ] No console errors
- [ ] No duplicate notifications
- [ ] Security improvements verified
