# Copy English writing + coloring assets from LEO-KIDS-WEB-TRY (reference only, not cherry-pick)
$ErrorActionPreference = "Stop"
$Src = "c:\Users\ERAN YOSEF\Desktop\final projects\FINAL-WEB\LEO-KIDS-FINAL\LEO-KIDS-WEB-TRY"
$Dst = "c:\Users\ERAN YOSEF\Desktop\final projects\FINAL-WEB\LEO-KIDS-FINAL\LEO-KIDS-GLOBAL"

function Copy-Tree($rel) {
  $s = Join-Path $Src $rel
  $d = Join-Path $Dst $rel
  if (-not (Test-Path $s)) { Write-Warning "Missing source: $rel"; return }
  New-Item -ItemType Directory -Force -Path $d | Out-Null
  Copy-Item -Path (Join-Path $s "*") -Destination $d -Recurse -Force
}

# Components
Copy-Tree "components/writing"
Copy-Tree "components/coloring"
Copy-Tree "components/coloring-upload"

# Lib (exclude Hebrew-only)
Copy-Tree "lib/coloring"
Copy-Tree "lib/coloring-upload"
New-Item -ItemType Directory -Force -Path (Join-Path $Dst "lib/writing") | Out-Null
Get-ChildItem (Join-Path $Src "lib/writing") -File | Where-Object {
  $_.Name -notmatch 'hebrew|\.he\.'
} | ForEach-Object { Copy-Item $_.FullName (Join-Path (Join-Path $Dst "lib/writing") $_.Name) -Force }

# Data
Copy-Tree "data/coloring"
New-Item -ItemType Directory -Force -Path (Join-Path $Dst "data/writing/catalog-builders") | Out-Null
Get-ChildItem (Join-Path $Src "data/writing") -File | Where-Object { $_.Name -notmatch '\.he\.' } | ForEach-Object {
  Copy-Item $_.FullName (Join-Path (Join-Path $Dst "data/writing") $_.Name) -Force
}
Get-ChildItem (Join-Path $Src "data/writing/catalog-builders") -File | Where-Object {
  $_.Name -notmatch 'hebrew'
} | ForEach-Object { Copy-Item $_.FullName (Join-Path (Join-Path $Dst "data/writing/catalog-builders") $_.Name) -Force }

# Lib worksheets helpers
@(
  "lib/worksheets/worksheet-type-registry.js",
  "lib/worksheets/worksheet-payload-kind.client.js",
  "lib/worksheets/worksheet-preview-session-ttl.client.js"
) | ForEach-Object {
  $s = Join-Path $Src $_
  $d = Join-Path $Dst $_
  New-Item -ItemType Directory -Force -Path (Split-Path $d) | Out-Null
  Copy-Item $s $d -Force
}

# Styles
@(
  "styles/worksheet-writing-print.css",
  "styles/worksheet-writing-print-portrait.css",
  "styles/worksheet-writing-print-landscape.css",
  "styles/worksheet-coloring-print.css",
  "styles/worksheet-coloring-upload.css",
  "styles/worksheet-coloring-upload-print.css"
) | ForEach-Object { Copy-Item (Join-Path $Src $_) (Join-Path $Dst $_) -Force }

# API routes
Copy-Tree "pages/api/coloring-upload"
@(
  "pages/api/parent/worksheets/coloring-catalog.js",
  "pages/api/public/worksheets/coloring-catalog.js"
) | ForEach-Object {
  $d = Join-Path $Dst $_
  New-Item -ItemType Directory -Force -Path (Split-Path $d) | Out-Null
  Copy-Item (Join-Path $Src $_) $d -Force
}

# Tests & scripts
Copy-Tree "tests/coloring-upload"
Copy-Tree "scripts/coloring-upload"

# English writing assets only
$assetRoots = @("full-trace", "outline", "stroke-order", "stroke-path")
$enSubs = @("en-upper", "en-lower", "digits")
foreach ($root in $assetRoots) {
  foreach ($sub in $enSubs) {
    $rel = "public/assets/writing/$root/$sub"
    Copy-Tree $rel
  }
}
Copy-Tree "public/assets/writing/prewriting"
Copy-Tree "public/assets/writing/illustrations"

# Coloring page assets
Copy-Tree "public/assets/coloring-pages"

# OpenCV wasm (large)
Copy-Tree "public/wasm/opencv"

Write-Host "Copy complete."
