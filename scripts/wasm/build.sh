#!/usr/bin/env bash
# Builds the in-browser Go runtime (Yaegi → wasm) into public/wasm/.
#
# Output (gitignored):
#   public/wasm/yaegi.wasm     the interpreter, ~40 MB raw / ~8 MB over the wire
#   public/wasm/wasm_exec.js   Go's JS shim, copied from the SAME toolchain
#
# Runs as part of `pnpm build`. If no `go` is on PATH (the Vercel build image),
# a pinned toolchain is downloaded into .cache/go so builds stay reproducible.
set -euo pipefail

GO_VERSION="${GO_VERSION:-1.26.5}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/scripts/wasm"
OUT="$ROOT/public/wasm"
STAMP="$OUT/.build-stamp"

# Skip the (slow) build when nothing that feeds it has changed
fingerprint() {
  cat "$SRC/main.go" "$SRC/go.mod" "$SRC/go.sum" | shasum -a 256 | cut -c1-16
}
want="go${GO_VERSION}-$(fingerprint)"
if [[ -f "$STAMP" && "$(cat "$STAMP")" == "$want" && -f "$OUT/yaegi.wasm" && -f "$OUT/wasm_exec.js" ]]; then
  echo "wasm: up to date ($want)"
  exit 0
fi

# sha256 of the official tarballs for GO_VERSION (https://go.dev/dl/?mode=json)
declare -A GO_SHA256=(
  [linux-amd64]=5c2c3b16caefa1d968a94c1daca04a7ca301a496d9b086e17ad77bb81393f053
  [linux-arm64]=fe4789e92b1f33358680864bbe8704289e7bb5fc207d80623c308935bd696d49
  [darwin-arm64]=efb87ff28af9a188d0536ef5d42e63dd52ba8263cd7344a993cc48dd11dedb6a
  [darwin-amd64]=6231d8d3b8f5552ec6cbf6d685bdd5482e1e703214b120e89b3bf0d7bf1ef725
)

# node_modules/.cache survives between Vercel builds; .cache/ would not
CACHE_ROOT="$ROOT/node_modules/.cache/learn-go"
export GOCACHE="$CACHE_ROOT/go-build" GOMODCACHE="$CACHE_ROOT/go-mod"

GO_BIN="$(command -v go || true)"
if [[ -z "$GO_BIN" ]] || ! "$GO_BIN" version | grep -q "go${GO_VERSION}"; then
  CACHE="$CACHE_ROOT/go${GO_VERSION}"
  if [[ ! -x "$CACHE/go/bin/go" ]]; then
    os="$(uname -s | tr '[:upper:]' '[:lower:]')"
    arch="$(uname -m)"
    case "$arch" in x86_64) arch=amd64 ;; aarch64|arm64) arch=arm64 ;; esac
    key="${os}-${arch}"
    sha="${GO_SHA256[$key]:-}"
    if [[ -z "$sha" ]]; then
      echo "wasm: no pinned checksum for $key — install Go ${GO_VERSION} or add it to GO_SHA256" >&2
      exit 1
    fi
    url="https://go.dev/dl/go${GO_VERSION}.${key}.tar.gz"
    echo "wasm: downloading $url"
    mkdir -p "$CACHE"
    tgz="$CACHE/go.tar.gz"
    curl -fsSL -o "$tgz" "$url"
    echo "$sha  $tgz" | shasum -a 256 -c - >/dev/null
    tar -xzf "$tgz" -C "$CACHE"
    rm -f "$tgz"
  fi
  GO_BIN="$CACHE/go/bin/go"
fi

echo "wasm: building with $("$GO_BIN" version)"
mkdir -p "$OUT"
(
  cd "$SRC"
  GOOS=js GOARCH=wasm "$GO_BIN" build -trimpath -ldflags="-s -w" -o "$OUT/yaegi.wasm" .
)
GOROOT="$("$GO_BIN" env GOROOT)"
cp "$GOROOT/lib/wasm/wasm_exec.js" "$OUT/wasm_exec.js" 2>/dev/null || cp "$GOROOT/misc/wasm/wasm_exec.js" "$OUT/wasm_exec.js"
echo "$want" > "$STAMP"
echo "wasm: built $(du -h "$OUT/yaegi.wasm" | cut -f1) → public/wasm/yaegi.wasm"
