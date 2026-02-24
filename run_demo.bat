@echo off
REM One-command run for FitPulse prototype demo.
cd /d "%~dp0"

where flutter >nul 2>nul
if errorlevel 1 (
  echo Flutter not found. Install Flutter and add it to PATH.
  exit /b 1
)

if not exist "android" if not exist "ios" (
  echo Generating platform folders...
  flutter create . --platforms=android,ios
)

flutter pub get
echo Launching FitPulse...
flutter run
