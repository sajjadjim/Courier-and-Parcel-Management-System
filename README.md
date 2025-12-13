# 📦 PickOn - Smart Courier & Parcel Management System

![Project Banner](https://github.com/sajjadjim/Courier-and-Parcel-Management-System/blob/main/Banner_image_pickon.png?raw=true)

**PickOn** is a modern, full-stack logistics platform designed to streamline parcel booking, delivery tracking, and rider management. It connects Merchants, Customers, and Delivery Riders in a seamless ecosystem with real-time updates and interactive maps.

## 🚀 Live Demo
- **Client (Netlify):** [Click Here to View](https://pickon-bd.netlify.app/)
- **Server (Vercel):** [API Endpoint](https://server-courier-and-parcel-managemen.vercel.app/)

---

## ✨ Key Features

### 👤 User / Merchant Portal
* **Easy Booking:** Intuitive form to book parcels with automatic cost calculation.
* **Real-time Tracking:** Track parcel status (`Pending`, `In Transit`, `Delivered`) using a unique Tracking ID.
* **Interactive Coverage Map:** View service areas across 64 districts using **Leaflet Maps**.
* **Dashboard:** View booking history, spent analysis, and profile management.

### 🛵 Rider Portal
* **Job Board:** View available deliveries in specific regions.
* **Delivery Management:** Status updates (`Taken`, `Delivered`) with a single click.
* **My Tasks:** Filtered view of assigned parcels and earnings history.

### 🛡️ Admin Dashboard
* **Statistics:** Visual charts for Total Parcels, Revenue, and User growth.
* **User Management:** Promote users to Riders/Admins or block accounts.
* **Parcel Assignment:** Assign specific riders to parcels manually.
* **Rider Verification:** Approve or reject rider application requests.

---

## 🛠️ Tech Stack

**Frontend:**
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS, DaisyUI
* **Animations:** Framer Motion, React Fast Marquee
* **Maps:** React Leaflet
* **State Management:** TanStack Query (React Query)
* **Authentication:** Firebase Auth
* **Forms:** React Hook Form

**Backend (Separate Repo):**
* **Runtime:** Node.js, Express.js
* **Database:** MongoDB
* **Payments:** Stripe Integration

---

## 📸 Screenshots

| User Dashboard | Rider Panel | Coverage Map |
|:---:|:---:|:---:|
| ![User](https://via.placeholder.com/300x200?text=User+Dash) | ![Rider](https://via.placeholder.com/300x200?text=Rider+View) | ![Map](https://via.placeholder.com/300x200?text=Interactive+Map) |

---

## 💻 Installation & Run Locally

Follow these steps to run the frontend locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/pickon-client.git](https://github.com/your-username/pickon-client.git)
cd pickon-client


2. Install Dependencies
Bash

npm install
3. Setup Environment Variables
Create a .env.local file in the root directory and add your Firebase and ImgBB keys:

Code snippet

VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_sender_id
VITE_appId=your_firebase_app_id
VITE_IMAGE_UPLOAD_API_KEY=your_imgbb_api_key
VITE_API_URL=http://localhost:3000 (or your live server URL)


4. Run Development Server
Bash

npm run dev
Open http://localhost:5173 in your browser.

```
---

🏗️ Project Structure
```bash
src/
├── Components/       # Reusable UI components (Loading, Navbar, Footer)
├── Context/          # AuthProvider & Global Context
├── Hooks/            # Custom Hooks (useAuth, useAxiosSecure)
├── Layout/           # Main & Dashboard Layouts
├── Pages/            
│   ├── Home/         # Landing Page, Banner, FAQ, Coverage
│   ├── Dashboard/    # User, Rider, and Admin Dashboard Views
│   ├── Auth/         # Login & Register Pages
├── Router/           # React Router Configuration
└── main.jsx          # Entry Point
```
--- 

🤝 Contribution
Contributions are welcome!

1. Fork the project.

2. Create your Feature Branch (git checkout -b feature/AmazingFeature).

3. Commit your changes (git commit -m 'Add some AmazingFeature').

4. Push to the Branch (git push origin feature/AmazingFeature).

5. Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information.

Developed by Sajjad Hossain Jim
