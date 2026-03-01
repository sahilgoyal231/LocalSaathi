# LocalSaathi 🤝

LocalSaathi is a comprehensive, multilingual platform designed to connect local service professionals (Servicemen), Customers, and material suppliers (Shopkeepers) in a single unified ecosystem. Built with React, it features a modern, responsive UI, robust role-based dashboards, and deep localization tailored for regional users.

## 🚀 Key Features

### 👥 Multi-Role Ecosystem
- **Customers**: Browse services, book professionals (single-day or long-term contracts), and request materials for ongoing work.
- **Servicemen**: Register specific skills (Electrician, Plumber, Painter, etc.), receive localized skill-verification quizzes, and manage job requests.
- **Shopkeepers**: Receive material requests from customers/servicemen, monitor inventory needs, and supply local projects.

### 🌍 Deep Localization (12 Languages)
The platform is fully translated into English and 11 distinct regional Indian languages (Hindi, Telugu, Bengali, Marathi, Tamil, Gujarati, Kannada, Malayalam, Urdu, Punjabi, Odia).
- Real-time language toggling via the navigation bar.
- Extensive, deeply translated question banks for skill verification so every professional can read and answer comfortably in their native language.

### 🛡️ Skill Verification & Quizzing
To ensure quality, Servicemen must pass a 5-question verification quiz specific to their chosen profession (drawn from a 20-question pool per category) before their profile is marked as verified.
- Changing a service category automatically resets verification status, prompting a new relevant quiz.

### 💼 Flexible Work Bookings
- **Single-Day Jobs**: Time-slot based booking (Morning, Afternoon, Evening).
- **Long-Term Contracts**: Dedicated UI for multi-day contract requests (with a days stepper) for extended project work.

### ✨ Premium UI & UX
- Modern "Electric Indigo on Midnight Slate" design system.
- Glassmorphism effects, smooth micro-animations, and responsive layouts.
- Eye-catching custom date pickers and intuitive interactive components.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Routing**: React Router DOM (`react-router-dom`)
- **State Management**: React Context API (`AuthContext`, `DataContext`)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Animations)
- **Icons**: Lucide React (`lucide-react`)
- **Build Tool**: Vite

## 📂 Project Structure

```
src/
├── assets/         # Images, logos, and static assets
├── components/     # Reusable UI components (Navbar, LoadingPage, NotificationDropdown)
├── context/        # Global state providers (AuthContext.jsx, DataContext.jsx)
├── data/           # Statically generated robust data (e.g., multilingual quizQuestions.js)
├── pages/          # Full page views
│   ├── BookService.jsx       # Job booking (single-day/contract)
│   ├── RequestMaterial.jsx   # Material requisition
│   ├── SkillQuiz.jsx         # Verification quiz interface
│   ├── Dashboard.jsx         # Role-routing hub
│   ├── *Dashboard.jsx        # Specific dashboards (Customer, Serviceman, Shopkeeper)
│   ├── *Profile.jsx          # Profile management pages
│   └── ...
├── styles/         # Scoped stylesheets
├── utils/          # Helper files, translations.js, serviceThemes.js
├── App.jsx         # App routing and layout skeleton
└── index.css       # Global design system variables and core utility classes
```

## 💻 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sahilgoyal231/LocalSaathi.git
   cd LocalSaathi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.
