<div align="center">
<img width="1200" height="475" alt="GHBanner" src="logo.jpeg" />
</div>

# 🧭 Smart Schedule Assistant

>A smart scheduling application designed to simplify task management and help you keep up with your daily commitments.



## 📌 Overview

>It’s easy to forget tasks—messages from your boss, parents, or partner might ask you to do something at a specific time or place. This application solves that problem by automatically creating reminders and schedules from message screenshots.


## 🤖 How It Works

Our platform uses AI to analyse screenshots of messages, identify tasks, and extract details such as:

- Dates & times

- Locations

- Deadlines

- Action items

>It then creates conflict-free reminders and schedules, notifying you when needed.


## 🛠 Initial Vision

Originally, the system was designed to:

- Read notifications directly through Android notification channels

- Use AI models to classify and understand the content

- Automatically set time-based and location-based reminders

- Infer missing information from message context

- Use geofencing to trigger location-specific reminders

>This would create a dynamic, intelligent scheduling assistant that works seamlessly in the background.


## 🚧 Current Implementation

Due to event constraints, we built a streamlined spin-off version:

- ✅ A Web App that Converts Screenshots into Schedules

- Users can upload screenshots, and the system:

    - Performs AI-based text extraction and interpretation

    - Identifies dates, times, and tasks

    - Generates a clean schedule entry—no manual input needed

>This demonstrates the core idea of automated, AI-powered schedule management.

<img src="Screenshot 2025-12-16 135353.png" />
## 🎯 Goal

To evolve into a fully automated scheduling assistant that integrates deeply with mobile devices, streamlines reminders, and removes the burden of manual planning

## Try it:
>**[Snap2Schedule](https://snap2schedule.onrender.com)**

---

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 👥 Team - FutureForge

Crafted by two collaborators, from idea to execution:

 >[Thomson Leo Thomas](https://github.com/thomson-leo-thomas)<br>
 >[Jose James](https://github.com/Jomezh)
