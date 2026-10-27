#!/usr/bin/env bash
# Makes sure an Android emulator/device is online, wakes the screen, then runs cucumber-js.
# Usage: npm run test:android [-- feature-path...]
#   AVD_NAME=<name> picks which emulator to boot when none is running
#   (default: the first one listed by `emulator -list-avds`).
set -euo pipefail

if [ -n "${ANDROID_HOME:-}" ]; then
  ANDROID_SDK="$ANDROID_HOME"
elif [ -d "$HOME/Library/Android/sdk" ]; then
  ANDROID_SDK="$HOME/Library/Android/sdk"   # macOS default
else
  ANDROID_SDK="$HOME/Android/Sdk"           # Linux default
fi
ADB="$ANDROID_SDK/platform-tools/adb"
EMULATOR_BIN="$ANDROID_SDK/emulator/emulator"

if [ ! -x "$ADB" ]; then
  echo "adb not found at $ADB. Install Android Studio / SDK, or set ANDROID_HOME." >&2
  exit 1
fi

is_device_online() {
  "$ADB" devices | sed 1d | grep -w "device" >/dev/null 2>&1
}

if is_device_online; then
  echo "Device already online."
else
  AVD="${AVD_NAME:-$("$EMULATOR_BIN" -list-avds | head -n 1)}"
  if [ -z "$AVD" ]; then
    echo "No device online and no emulator (AVD) found. Create one in Android Studio > Device Manager." >&2
    exit 1
  fi
  echo "Booting emulator '$AVD'..."
  nohup "$EMULATOR_BIN" -avd "$AVD" >/tmp/mobilewright-emulator.log 2>&1 &
  disown
  "$ADB" wait-for-device
  echo "Waiting for boot to complete..."
  until [ "$("$ADB" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; do
    sleep 2
  done
  echo "Emulator booted."
fi

# A resumed or idle emulator can come back asleep/locked, which makes every locator fail
# against a black screen. Wake it and dismiss the keyguard on every run.
"$ADB" shell input keyevent 224 >/dev/null   # KEYCODE_WAKEUP
"$ADB" shell wm dismiss-keyguard >/dev/null

if [ "$#" -eq 0 ]; then
  npx cucumber-js --profile android "test/UI-test/E2E0/**/*.feature"
else
  npx cucumber-js --profile android "$@"
fi
