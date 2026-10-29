# CareTrack Server — MongoDB Atlas Backend

Express + Mongoose REST API backend for the CareTrack post-operative discharge management app.

## Setup

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env`
   - Set your MongoDB Atlas connection string in `MONGODB_URI`
   - Set a strong `JWT_SECRET`

3. **Seed the database**
   ```bash
   npm run seed
   ```

4. **Start the server**
   ```bash
   npm run dev      # Development (with --watch)
   npm start        # Production
   ```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/signup` | Register |
| GET | `/api/patients` | List all patients |
| GET | `/api/patients/:id` | Get patient by id or _ref |
| GET | `/api/medications?patientRef=p1` | Get medications |
| PATCH | `/api/medications/:id` | Update medication status |
| GET | `/api/discharge-plans` | List all plans |
| GET | `/api/discharge-plans/:patientRef` | Get plan by patient ref |
| POST | `/api/discharge-plans` | Create plan |
| GET | `/api/recovery-entries?patientRef=p1` | Get recovery entries |
| POST | `/api/recovery-entries` | Submit recovery entry |
| GET | `/api/symptom-reports` | Get symptom reports |
| POST | `/api/symptom-reports` | Submit symptom report |
| GET | `/api/appointments?patientRef=p1` | Get appointments |
| GET | `/api/notifications?role=doctor` | Get notifications |
| GET | `/api/risk-alerts?status=active` | Get risk alerts |

## Frontend Connection

Set in `d:\PostOperativeDischarge\post\.env`:
```
VITE_API_URL=http://localhost:5000/api
```

The frontend API service is at `src/lib/api.ts`. It automatically falls back to mock data when the server is unavailable.
