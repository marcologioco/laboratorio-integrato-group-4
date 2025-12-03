@echo off
echo ========================================
echo   Avvio Console H2 Database
echo ========================================
echo.
echo IMPORTANTE: Assicurati che l'applicazione Spring Boot sia FERMATA!
echo.
pause

cd /d "%~dp0..\immobiliaris-be"

echo Avvio console H2...
echo.
echo La console si aprira' automaticamente nel browser su http://localhost:8082
echo.
echo Usa questi dati per connetterti:
echo   JDBC URL: jdbc:h2:file:./data/immobiliarisDB
echo   Username: sa
echo   Password: (lascia vuoto)
echo.

java -jar "%USERPROFILE%\.m2\repository\com\h2database\h2\2.3.232\h2-2.3.232.jar"

pause
