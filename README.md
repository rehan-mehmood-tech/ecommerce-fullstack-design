# Quikart - Production eCommerce Platform

## Tech Stack
- **Frontend**: Vite, React, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Security**: Firebase Admin SDK, Helmet, CORS.

## Environment Variables
Create a `.env` in `/server`:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
FIREBASE_SERVICE_ACCOUNT_JSON=path_to_json
```

## Setup & Local Run
```bash
# In one terminal:
cd server && npm install && npm run dev

# In another terminal:
cd client && npm install && npm run dev
```

## Deployment
### Vercel (Frontend)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Install `vercel.json` for SPA routing.

### Render (Backend)
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- Connect MongoDB Atlas.

### Critical Implementation Details:
1. **Responsive Navbar**: The `Navbar.jsx` includes a mobile hamburger menu that matches the mobile screenshot exactly.
2. **Design Fidelity**: Spacing uses standard Tailwind spacing scales (`p-4`, `m-6`) to ensure a clean, breathable UI.
3. **Figma Colors**: Used `#E5F1FF` for the hero banner and `#0D6EFD` for the primary blue to match the reference image.
4. **Data Security**: Express server is hardened with `helmet` and `cors` to prevent common vulnerabilities.
5. **PDF Compliance**: The Product model includes all requested fields (`id`, `name`, `price`, `image`, `description`, `category`, `stock`).
