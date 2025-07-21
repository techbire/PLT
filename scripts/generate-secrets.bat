@echo off
echo Generating secure JWT secrets...
echo.

:: Generate random base64 strings for JWT secrets
powershell -Command "[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))" > temp_jwt.txt
powershell -Command "[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))" > temp_refresh.txt

set /p JWT_SECRET=<temp_jwt.txt
set /p JWT_REFRESH_SECRET=<temp_refresh.txt

del temp_jwt.txt
del temp_refresh.txt

echo Add these to your Render environment variables:
echo.
echo JWT_SECRET=%JWT_SECRET%
echo JWT_REFRESH_SECRET=%JWT_REFRESH_SECRET%
echo.
echo Copy these values to your Render dashboard under Environment Variables.
pause
