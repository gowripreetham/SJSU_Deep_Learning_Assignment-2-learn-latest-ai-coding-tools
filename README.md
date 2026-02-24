# FitPulse – Fitness Tracker App

A cross-platform Flutter mobile app for tracking daily fitness: steps, calories, water intake, workouts, and goals. Built with **Flutter (Dart)**, **Provider**, **shared_preferences**, and **fl_chart**.

## Tech Stack

- **Framework:** Flutter (Dart)
- **State management:** Provider
- **Local storage:** shared_preferences
- **Charts:** fl_chart
- **Target platforms:** Android, iOS

## Flutter Version

- **Flutter SDK:** 3.0.0 or later (Dart SDK `>=3.0.0 <4.0.0`)
- Check your version: `flutter --version`

## Prototype demo (one command)

### Run in Chrome (no simulator needed) — best on macOS without an emulator

**macOS / Linux:**
```bash
cd /Users/gowripreetam/Desktop/Deep_learning/Task-3
./run_demo_web.sh
```

This opens FitPulse in Chrome. You only need Flutter and Chrome installed.

### Run on Android / iOS (emulator or device)

**macOS / Linux:**
```bash
cd /Users/gowripreetam/Desktop/Deep_learning/Task-3
./run_demo.sh
```

**Windows:**
```cmd
cd path\to\Task-3
run_demo.bat
```

Start an Android emulator or iOS simulator (or connect a device) before running.

- On first launch the app **seeds demo data** (today’s steps, water, workouts, last 7 days) so the dashboard and history look filled for the demo.

## Setup (manual)

1. **Clone or open the project**
   ```bash
   cd /path/to/Task-3
   ```

2. **Generate platform folders (if missing)**  
   If the `android/` and `ios/` folders are not present, run:
   ```bash
   flutter create . --platforms=android,ios
   ```

3. **Install dependencies**
   ```bash
   flutter pub get
   ```

4. **Run**
   - Start an Android emulator or iOS simulator (or connect a device), then:
     ```bash
     flutter run
     ```
   - Or pick a device: `flutter devices` then `flutter run -d <device_id>`

## Project Structure

```
lib/
├── main.dart                 # Entry point, theme, navigation
├── models/
│   ├── workout.dart          # Workout session model
│   ├── fitness_goals.dart   # Daily goals model
│   └── daily_activity.dart  # Day summary for history
├── providers/
│   └── fitness_provider.dart # State + shared_preferences
└── screens/
    ├── splash_screen.dart
    ├── home_screen.dart      # Dashboard (steps, calories, water, streak)
    ├── workout_screen.dart   # Log and list workouts
    ├── goals_screen.dart     # Set and save goals
    └── history_screen.dart   # 7-day bar chart + summary
```

## Features

- **Home:** Today’s summary with step goal (circular progress), calories burned, water glasses, and workout streak.
- **Workouts:** Add sessions (type, duration, calories), list today’s workouts, delete entries.
- **Goals:** Set daily step, calorie, and water goals; saved locally with shared_preferences.
- **History:** Last 7 days of activity as a bar chart (steps) and daily summary list.

## Screenshots

<!-- Add screenshots here, e.g.:
![Home](screenshots/home.png)
![Workouts](screenshots/workouts.png)
-->

*Placeholder: add screenshots of Home, Workouts, Goals, and History screens.*

## Video

*Placeholder: add a link to a demo video (e.g. Loom, YouTube).*

## License

This project is for educational use.
