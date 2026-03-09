@echo off
title Iniciador Solucao Fitness
color 0A
echo ===================================================
echo     INICIANDO O SISTEMA SOLUCAO FITNESS...
echo ===================================================
echo.

echo [1/2] A iniciar o Back-end (FastAPI)...
:: Abre um novo terminal, entra na pasta, ativa o venv e roda o uvicorn
start "Servidor Back-end" cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload"

echo [2/2] A iniciar o Front-end (React/Vite)...
:: Abre um novo terminal, entra na pasta e roda o npm
start "Servidor Front-end" cmd /k "cd frontend && npm run dev"

echo.
echo Servidores iniciados em janelas separadas!
echo A abrir o navegador em 3 segundos...

:: Espera 3 segundos para dar tempo aos servidores de ligarem
timeout /t 3 /nobreak >nul

:: Abre o seu navegador padrão na porta do Vite
start http://localhost:5173

exit