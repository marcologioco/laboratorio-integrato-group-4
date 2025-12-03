@echo off
echo ========================================
echo  Avvio Server Spring Boot Backend
echo ========================================
echo.
echo Avvio in corso...
echo.

cd /d "%~dp0.."
call mvnw.cmd spring-boot:run

pause
