# S.V.V. Clinic — React Frontend

This project is a React application for S.V.V. Clinic (Madhapur, Hyderabad).

## Project Structure
* `index.html` — The main HTML template with `<div id="root"></div>`.
* `src/main.tsx` — Application entry point rendering `<App />` with `ReactDOM.createRoot`.
* `src/App.tsx` — Main React component handling routing (`/` for Landing Page, `/admin` for Admin Portal).
* `src/pages/LandingPage.tsx` — Main clinic website (Hero, About, Doctors, Services, Appointment booking, etc.).
* `src/pages/AdminPage.tsx` — Admin dashboard for clinic content and appointment management.
* `src/components/clinic/` — Modular React UI components.

## How to Run

1. Open terminal inside `svv-landing-page`:
```sh
npm install
```

2. Start the React app:
```sh
npm start
```
*(You can also use `npm run dev`)*

3. Open in your browser:
* **Landing Page**: [http://localhost:5173](http://localhost:5173)
* **Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)
