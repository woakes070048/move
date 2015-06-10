#!/usr/bin/env bash
set -e

pwd="${PWD##}"
app="lomis"
cordova="$pwd/node_modules/.bin/cordova"
cordovaIcon="$pwd/node_modules/.bin/cordova-icon"
keys="$pwd/.android"
build="$pwd/build"
apks="$build/$app/platforms/android/build/outputs/apk"

have() { command -v "$1" >/dev/null; }
info() { echo "$0: $1"; }
error() { info "$1"; exit 1; }
usage() { echo "usage: $0 snapshot|staging|release [--skip-build]"; }

[[ "$1" ]] || { usage; exit 1; }
[[ "$1" == "--help" || "$1" == "-h" ]] && { usage; exit; }
[[ "$1" != "snapshot" && "$1" != "staging" && "$1" != "release" ]] && {
  usage; exit 1
}

type="$1"

[[ "$type" == "release" ]] \
  && version="v$(git describe --abbrev=0 --tags)" \
  || version="$(date -u +"%Y%m%d%H%M%S")"

info "Building $app $version $type build for Android"
have "android" || error "Android SDK required"

if [[ "$type" != "snapshot" ]]; then
  [[ -d "$keys" ]] || error "Add android-release keys to $keys and try again"
fi

[[ -d "$build/$app" ]] && rm -rf "$build/$app"
mkdir -p "$build" && cd "$build"

[[ "$2" == "--skip-build" ]] || grunt build:"$type"
"$cordova" create "$app" --android --link-to="$pwd/dist"

cd "$build/$app"

cp "$pwd/config.xml" .
"$cordova" platform add "$pwd/node_modules/cordova-android"
"$cordova" plugin add \
  $("$pwd/scripts/cordova-plugins.js" "$pwd/node_modules/") \
  $(< "$pwd/scripts/build/cca-plugins.txt")

ln -s "www/images/icon.png" .
$cordovaIcon

cordovabuild="$cordova build android -- --gradle"
cp "$pwd/build-extras.gradle" "platforms/android"

[[ "$type" != "snapshot" ]] && {
  cordovabuild+=" --release"
  ln -s "$keys"/* "platforms/android"
}

$cordovabuild

[[ "$type" == "snapshot" ]] && releasetype="debug" || releasetype="release"

for arch in armv7 x86; do
  mv "$apks/android-$arch-$releasetype.apk" "$build/$app-$type-$version-$arch.apk"
done
