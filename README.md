# Expo-App

# ♻ EcoScrap Pickup Platform

A dual React Native application designed for *smart scrap pickup management, including a **Customer App* and a *Partner App*. The platform streamlines the process of scheduling, tracking, and completing scrap pickups with a clean UI/UX and mock backend integration.

---

## 🚀 Project Overview

This project simulates a real-world eco-platform where:

- *Customers* can log in, schedule scrap pickups, track order status, and approve itemized scrap details.
- *Partners (Eco Warriors)* can log in, view assigned pickups, update status, and submit scrap details for approval.

Built using *React Native (Expo), this project showcases clean UI, component reusability, proper navigation, local data handling via **AsyncStorage*, and lifecycle stage tracking.

---

## 🧩 Features

### ✅ Customer App
- Phone number + OTP login (mocked)
- Schedule pickup with date, time, address, location link
- View pickup status timeline
- Approve final scrap details
- View pickup history

### ✅ Partner App
- Phone number + OTP login (mocked)
- View assigned pickups with customer info
- Accept & start pickups using pickup code
- Add scrap item details and pricing
- Submit to customer for approval

---

## 🔁 Pickup Lifecycle Flow

1. Pending – Customer schedules pickup  
2. Accepted – Partner accepts the task  
3. In-Process – Partner enters pickup code  
4. Pending for Approval – Partner submits item details  
5. Completed – Customer approves the summary  

---

## 🎨 UI/UX Inspiration

> Inspired by modern logistics apps like *Uber, **Rapido, and **Zomato*:
- Clean card-based design
- Progress timeline indicator
- Toast notifications
- Optional dark/light theme toggle

### Recommended Color Palette:
| Element         | Color         |
|-----------------|---------------|
| Primary         | #4CAF50     |
| Secondary       | #FFC107     |
| Accent / Links  | #2196F3     |
| Background      | #F5F5F5     |
| Text (light)    | #212121     |
| Text (dark)     | #FFFFFF     |

---

## 🛠 Technologies Used

- *React Native (Expo)*
- *React Navigation*
- *AsyncStorage*
- *Context API / Redux (Optional)*
- *Axios / Fetch API*
- *json-server / MockAPI.io*
- *react-native-paper / react-native-elements*
- *Toast Notifications*
- *Date Picker + Modal Components*

---

## 📁 Folder Structure

EcoScrap-Pickup-Platform/ ├── customer-app/ │   ├── screens/ │   ├── components/ │   ├── navigation/ │   ├── assets/ │   └── App.js ├── partner-app/ │   ├── screens/ │   ├── components/ │   ├── navigation/ │   ├── assets/ │   └── App.js ├── README.md └── mock-api/ (optional json-server or MockAPI setup)

---

## 📦 Installation & Setup

> For both apps (customer-app and partner-app), follow the same steps:

`bash
# Install dependencies
npm install

# Start the app
npm start

# Or using Expo CLI
expo start

Mock API (Optional)

Use MockAPI.io or json-server:

npm install -g json-server
json-server --watch db.json --port 3001


---

🧪 Demo Screenshots (Optional)




📱 Login Page

📅 Schedule Pickup Page

📦 Pickup Tracker

✅ Approval Page



---

📚 Credits

Created as part of a React Native UI/UX Assignment
Maintained by L jagan naidu


---

📌 License

This project is open source and free to use under the MIT License.](https://stackblitz.com/~/github.com/Jagan-Lenka-70/Expo-App)
