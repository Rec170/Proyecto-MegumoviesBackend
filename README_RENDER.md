# Deploy rápido a Render (Backend)

Este backend está listo para desplegarse en **Render** (Node Web Service) y conectarse a **MongoDB Atlas**.

## 1) Render: crear Web Service

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

## 2) Variables de entorno (Render → Environment)

Configura estas variables:

- `MONGODB_URI` → tu connection string **NO SRV** (`mongodb://...` con 3 hosts)
- `MONGODB_DBNAME` → por ejemplo `megumovies`
- `JWT_SECRET` → un secreto largo
- `FRONTEND_URL` → tu dominio de Vercel (ej. `https://tuapp.vercel.app`)

> Render define `PORT` automáticamente; el server usa `process.env.PORT`.

## 3) Probar que quedó vivo

Cuando Render termine, abre:

- `https://TU-SERVICIO.onrender.com/`

Debe responder un JSON con `{ ok: true, ... }`.
