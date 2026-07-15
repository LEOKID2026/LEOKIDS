@echo off
setlocal EnableExtensions
REM LEO-KID local dev server on port 3100.
REM Clears any existing Node listener on this port before starting.
cd /d "%~dp0"

set "PORT=3100"
set "URL=http://127.0.0.1:%PORT%"

echo Starting LEO-KID (port %PORT%)...
echo Open in browser: %URL%
echo.
echo [INFO] Stopping any existing Node process on port %PORT% so code changes are picked up.
echo.

call :FreePortNode %PORT%

call npm run dev:run-button
set "EXITCODE=%ERRORLEVEL%"
echo.
pause
exit /b %EXITCODE%

:FreePortNode
set "P=%~1"
set "FOUND=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%P%" ^| findstr LISTENING') do (
  set "FOUND=1"
  tasklist /FI "PID eq %%a" 2>nul | findstr /I "node.exe" >nul
  if errorlevel 1 (
    echo [ERROR] Port %P% is used by another program ^(PID %%a^), not Node.
    echo Close that program or change the port in run.bat / package.json.
    pause
    exit /b 1
  )
  echo [INFO] Stopping old Node process on port %P% ^(PID %%a^)...
  taskkill /PID %%a /F >nul 2>&1
)
if "%FOUND%"=="1" (
  timeout /t 2 /nobreak >nul
  echo [OK] Port %P% cleared — starting fresh dev server.
) else (
  echo [OK] Port %P% was free — starting dev server.
)
exit /b 0
