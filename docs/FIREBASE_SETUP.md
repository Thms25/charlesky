## Firebase setup (for `/admin` + content)

### 1) Create Firebase project
- Go to Firebase Console → create a project

### 2) Create a Web App (to get config)
- Firebase Console → **Project settings** (gear icon) → **Your apps** → **Add app** → Web
- Copy the config values (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)

### 3) Enable Auth (Email/Password)
- Firebase Console → **Build** → **Authentication** → **Get started**
- **Sign-in method** → enable **Email/Password**

### 4) Create Firestore
- Firebase Console → **Build** → **Firestore Database** → **Create database**
- Use **Production** mode (recommended)

### 5) Create Storage
- Firebase Console → **Build** → **Storage** → **Get started**

### 6) Add env vars to your Next.js app
Create a file named `.env.local` in the project root and add:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 7) Add security rules (recommended)
This repo includes example rules:
- `firebase/firestore.rules`
- `firebase/storage.rules`

Replace `YOUR_EMAIL@DOMAIN.COM` with your admin email, then paste into:
- Firebase Console → Firestore → **Rules**
- Firebase Console → Storage → **Rules**

### 8) Create your admin login
- Go to `/admin`
- Sign up / sign in with the same email you allowed in rules

### 9) Initial content document
`/admin` will create/update the doc at:
- Firestore: collection `site`, document `content`

