# StudentNest 🏠

> Find a boarding near your campus.

StudentNest is a web application that helps university students in Sri Lanka find boarding places (rented rooms) close to their campus. Students search by campus, see the distance and travel time, request a room, and get the owner's contact details after the owner approves. Boarding owners list their places with photos, and an admin approves every account and every listing.

## 🔗 Live demo

| | Link |
|---|---|
| Website (frontend) | https://student-nest-frontend-xi.vercel.app |
| API (backend) | https://student-nest-backend-three.vercel.app/health |
| Frontend repository |https://github.com/siumithathsara/StudentNest-Frontend.git |
| Backend repository | https://github.com/siumithathsara/StudentNest-Backend.git |

## 👤 About

- **Name:** Imakshi Siyumi Thathsara
- **Module / Assignment:**ITS2020 - Rapid Application Development (RAD)   

## 🛠 Tech stack

| Area | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, Redux Toolkit, React Router, Axios, Leaflet (maps) |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB Atlas with Mongoose (geospatial `2dsphere` index and `$geoNear` queries) |
| **Authentication** | JWT (access + refresh tokens), bcrypt password hashing, role-based access (Student / Owner / Admin) |
| **Validation and security** | Zod validation, Helmet, rate limiting, CORS allow-list |
| **File storage** | Supabase Storage (boarding photos, uploaded with Multer) |
| **AI** | Google Gemini API (chat assistant) |
| **Email** | Nodemailer with Gmail SMTP |
| **Maps and places** | OpenStreetMap (Nominatim place search through our own API), Leaflet |
| **Hosting** | Vercel (frontend and backend), MongoDB Atlas, Supabase |