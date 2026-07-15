# Download latest QA artifacts from LEO-QA (_qa-transfer) and extract for local review.
$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$transferDir = Join-Path $projectRoot "_qa-transfer"
$manifestPath = Join-Path $transferDir "latest\latest-manifest.json"
$summaryPath = Join-Path $transferDir "latest\latest-summary.md"
$reviewRoot = Join-Path $projectRoot "_qa-transfer_review\latest"

Write-Host "Project root: $projectRoot"
Write-Host ""

if (-not (Test-Path $transferDir)) {
    Write-Error "_qa-transfer folder not found. Clone LEO-QA into _qa-transfer first."
    exit 1
}

Push-Location $transferDir
try {
    Write-Host "Running git pull in _qa-transfer..."
    git pull
    if ($LASTEXITCODE -ne 0) {
        throw "git pull failed with exit code $LASTEXITCODE"
    }
    Write-Host ""
}
finally {
    Pop-Location
}

if (-not (Test-Path $manifestPath)) {
    Write-Host "No uploaded QA result yet (missing: latest\latest-manifest.json)."
    exit 0
}

$manifest = Get-Content -Raw -Path $manifestPath | ConvertFrom-Json
$runPath = $manifest.runPath
if ([string]::IsNullOrWhiteSpace($runPath)) {
    Write-Error "latest-manifest.json has no runPath."
    exit 1
}

$runDir = Join-Path $transferDir ($runPath -replace '/', '\')
if (-not (Test-Path $runDir)) {
    Write-Error "Run folder not found: $runDir"
    exit 1
}

Write-Host "Latest manifest:"
Write-Host "  date:         $($manifest.date)"
Write-Host "  runTimestamp: $($manifest.runTimestamp)"
Write-Host "  runPath:      $runPath"
Write-Host ""

$virtualZip = Join-Path $runDir "virtual-student-daily.zip"
$launchZip = Join-Path $runDir "launch-readiness.zip"

foreach ($zip in @($virtualZip, $launchZip)) {
    if (-not (Test-Path $zip)) {
        Write-Error "Missing archive: $zip"
        exit 1
    }
}

if (Test-Path $reviewRoot) {
    Write-Host "Cleaning review folder: $reviewRoot"
    Remove-Item -LiteralPath $reviewRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $reviewRoot -Force | Out-Null

$virtualOut = Join-Path $reviewRoot "virtual-student-daily"
$launchOut = Join-Path $reviewRoot "launch-readiness"

Write-Host "Extracting virtual-student-daily.zip..."
Expand-Archive -LiteralPath $virtualZip -DestinationPath $virtualOut -Force

Write-Host "Extracting launch-readiness.zip..."
Expand-Archive -LiteralPath $launchZip -DestinationPath $launchOut -Force

Write-Host ""
Write-Host "Review folder: $reviewRoot"
Write-Host ""

if (Test-Path $summaryPath) {
    Write-Host "Latest summary: $summaryPath"
    Write-Host ""
    Get-Content -Path $summaryPath | Write-Host
} else {
    Write-Host "Latest summary not found: $summaryPath"
}

Write-Host ""
Write-Host "Key files for inspection:"
$keyFiles = @(
    (Join-Path $launchOut "LAUNCH_READINESS_DAILY.md"),
    (Join-Path $launchOut "LAUNCH_READINESS_DAILY.json"),
    (Join-Path $virtualOut "run-summary.json")
)
foreach ($file in $keyFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file"
    } else {
        Write-Host "  [MISSING] $file"
    }
}

Write-Host ""
Write-Host "Done."
