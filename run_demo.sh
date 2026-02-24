#!/usr/bin/env bash
# One-command run for FitPulse prototype demo.
# Ensures project is ready then launches the app.

set -e
cd "$(dirname "$0")"

if ! command -v flutter &>/dev/null; then
  echo "Flutter not found. Install Flutter and add it to PATH: https://docs.flutter.dev/get-started/install"
  exit 1
fi

# Generate Android/iOS/Web folders if missing
if [ ! -d "android" ] || [ ! -d "ios" ]; then
  echo "Generating platform folders..."
  flutter create . --platforms=android,ios,web
fi
if [ ! -d "web" ]; then
  flutter create . --platforms=web
fi

flutter pub get
echo "Launching FitPulse..."
echo "Tip: No simulator? Run ./run_demo_web.sh to open in Chrome instead."
flutter run
