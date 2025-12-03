@echo off
echo ========================================
echo  Avvio Server Spring Boot Backend
echo ========================================
echo.
echo Avvio in corso...
echo.

cd /d "%~dp0..\immobiliaris-be"
call mvnw.cmd spring-boot:run

pause
