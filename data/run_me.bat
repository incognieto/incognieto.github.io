@echo off
rem Langkah 1: Akses cmd, buka cmd
start cmd /k

rem Langkah 2: cd ke direktori C:\xampp\htdocs\incognieto.github.io\data
cd /d C:\xampp\htdocs\incognieto.github.io\data

rem Langkah 3: Jalankan program generate_me.py dengan python
python generate_me.py

rem Langkah 4: Delay 5 detik
timeout /t 5 /nobreak > nul

rem Langkah 5: Close cmd
taskkill /f /im cmd.exe




