# LocalSaathi 🤝

LocalSaathi is a comprehensive, multilingual platform designed to connect **Customers**, local **Servicemen**, and material **Shopkeepers** in a unified, accessible ecosystem. Built with React and tailored for the diverse Indian demographic, it features a modern glassmorphic UI, 12-language regional localization, and specialized accessibility features including a custom multi-lingual Text-to-Speech (TTS) engine for users with literacy challenges.

---

## 🚀 Core Value Proposition

In many regions, skilled professionals (like Masons, Carpenters, or Plumbers) face barriers to digital adoption due to literacy levels or language barriers. LocalSaathi bridges this gap by offering a fully localized interface and voice-assisted reading, enabling blue-collar workers to easily verify their skills, receive jobs, and request construction materials directly from local suppliers.

---

## ✨ Key Features

### 👥 Tri-Role Ecosystem
- **Customers**: Browse 18 categories of verified local professionals. Book for single-day tasks (Morning/Afternoon/Evening slots) or request long-term multi-day contracts. Request necessary project materials.
- **Servicemen (Professionals)**: Register across 18 distinct skill categories (Electrician, Plumber, Mason, Welder, AC Technician, RO Technician, etc.). Receive direct job requests and forward material requirements to local shops.
- **Shopkeepers (Suppliers)**: Receive and fulfilling material procurement requests from both Customers and Servicemen, ensuring seamless supply chain for local projects.

### 🌍 Deep Localization (12 Languages)
The platform is fully translated into English and **11 distinct regional Indian languages**:
`Hindi` • `Telugu` • `Bengali` • `Marathi` • `Tamil` • `Gujarati` • `Kannada` • `Malayalam` • `Urdu` • `Punjabi` • `Odia`
- Real-time zero-reload language toggling via the navigation bar.
- Every single UI element, notification, and quiz question is deeply translated, allowing professionals to interact entirely in their mother tongue.

### 🔊 Accessibility: Multilingual Text-to-Speech (TTS)
Designed specifically for users who may struggle with reading text on a screen:
- **One-Tap Voice Reading**: A dedicated "Listen" button on the Skill Verification quiz reads the question and all four options aloud.
- **Intelligent Voice Selection**: The custom TTS engine scores and selects the highest quality voice available on the user's device, prioritizing natural, premium, and Indian-accented female voices.
- **Chained Utterances**: Speech is delivered in natural segments (Question → Bridge phrase → Option A → Option B...) rather than a single robotic block.
- **Fallback Resilience**: If a device lacks a native TTS engine for a rare regional language (e.g., Odia or Punjabi), the system gracefully hides the voice UI rather than failing silently, or uses a high-quality Indian-English phonetic fallback where appropriate.

### 🛡️ Comprehensive Skill Verification System
To ensure platform quality and trust, Servicemen must pass a rigorous, localized verification quiz to earn their "Verified" badge.
- **Massive Question Bank**: 18 distinct service profiles × 20-30 profession-specific questions × 12 languages = **Over 4,300 unique localized questions**.
- **Dynamic Quizzing**: Users are presented a random subset of 5 questions specific to their chosen profession. They must score 4/5 (80%) to pass.
- **Auto-Reset**: Changing service categories automatically revokes verification, requiring the user to pass the quiz for their newly claimed skill.

### 🎨 Premium UI & Interactive UX
- **Stunning Animated Login**: The landing/login page features an ambient, slow-panning, continuous scrolling 3x3 photo collage showcasing real professionals at work.
- **Modern Aesthetics**: Built on an "Electric Indigo on Midnight Slate" design system featuring glassmorphism, subtle gradients, and deep shadows.
- **Micro-interactions**: Hover lifts, pulse animations on active voice reading, and intuitive stepper UIs for multi-day contract bookings.

---

## 🛠️ Technical Stack & Architecture

- **Frontend Core**: React 18, Vite
- **Routing**: `react-router-dom` v6
- **Global State**: React Context API (`AuthContext` for user sessions, `DataContext` for global language state)
- **Styling**: Vanilla CSS with comprehensive CSS Variables (Custom Properties) for extreme flexibility. No heavy CSS frameworks used.
- **Icons**: `lucide-react`
- **APIs Used**: Web Speech API (`window.speechSynthesis`) for the accessibility features.

### 📂 Directory Structure

```text
src/
├── assets/         # Images, animated collages, and static assets
├── components/     # Reusable UI (Navbar, NotificationDropdown, Loading Spinner)
├── context/        # Global state providers (Auth, Theme, Data)
├── data/           # Statically generated localized datasets
│   ├── profileQuestions/   # 18 JSON files containing 20+ questions in 12 languages
│   ├── translations.js     # Master UI translation dictionary
│   └── serviceThemes.js    # Color mappings for different service profiles
├── pages/          # Full Page Views
│   ├── Login.jsx             # Animated unified login portal
│   ├── SkillQuiz.jsx         # The Voice-enabled localized verification engine
│   ├── Dashboard.jsx         # Core routing hub determining which dashboard to show
│   ├── CustomerDashboard.jsx # Booking & status tracking
│   ├── ServicemanDashboard.jsx # Job acceptance & material requesting
│   ├── RequestMaterial.jsx   # Procurement UI
│   └── BookService.jsx       # Contract / Single-day booking UI
├── styles/         # Scoped module stylesheets
├── utils/          # Standalone helper functions
├── App.jsx         # App routing and layout skeleton
└── index.css       # Core design system tokens and utility classes
```

---

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

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
We are particularly interested in contributions involving:
- Adding support for additional regional languages.
- Expanding the Skill Verification question banks.
- Enhancing the Web Speech API integrations for better voice quality on older Android devices.

Feel free to check the issues page or submit a pull request.
