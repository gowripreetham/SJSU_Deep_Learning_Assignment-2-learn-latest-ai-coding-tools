#!/usr/bin/env bash
# Run FitPulse in Chrome (no simulator needed). Use this on macOS when you're not using an emulator.

set -e
cd "$(dirname "$0")"

if ! command -v flutter &>/dev/null; then
  echo "Flutter not found. Install Flutter and add it to PATH: https://docs.flutter.dev/get-started/install"
  exit 1
fi

# Ensure web platform exists (Flutter create adds it if missing)
if [ ! -f "web/index.html" ]; then
  echo "Adding web platform..."
  flutter create . --platforms=web
fi

flutter pub get
echo "Launching FitPulse in Chrome..."
flutter run -d chrome
