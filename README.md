# AI-Based Movie Recommendation System

This is a **full-stack AI-powered movie recommendation system** that provides personalized movie suggestions based on user preferences. Users can enter genres, actors, themes, or moods, and the system generates curated movie recommendations using **Google Generative AI (text-bison-001 model)**.

## Features

- **Dynamic AI Recommendations:** Generate movie lists based on user input in real-time.
- **Persistent Storage:** User queries and recommendations are saved in SQLite for tracking and analytics.
- **Frontend Interface:** Built with React for responsive and interactive user experience.
- **Robust Backend:** Node.js with Fastify handles API requests efficiently.
- **Error Handling & Fallbacks:** Provides default recommendations if the AI service fails.
- **CORS Enabled:** Seamless communication between frontend (port 5173) and backend (port 3001).

## Tech Stack

- **Frontend:** React.js (Vite)
- **Backend:** Node.js, Fastify
- **AI:** Google Generative AI (text-bison-001)
- **Database:** SQLite
- **Other:** CORS, dotenv

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/ashmita-upadhyay/movie-recommendation-app.git

Navigate to the project directory:cd movie-recommendation-app
