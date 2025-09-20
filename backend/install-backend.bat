@echo off
echo Instalando dependencias do backend...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao esta instalado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: npm nao esta instalado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js e npm encontrados!
echo.

REM Copiar package.json do backend
copy backend-package.json package-backend.json

REM Instalar dependências
echo Instalando dependencias...
npm install --prefix . express sqlite3 cors body-parser nodemon

if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo Inicializando banco de dados...
node database/init.js

if %errorlevel% neq 0 (
    echo ERRO: Falha ao inicializar banco de dados!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Backend configurado com sucesso!
echo ========================================
echo.
echo Para iniciar o servidor:
echo   node server.js
echo.
echo O servidor estara disponivel em:
echo   http://localhost:3001
echo.
pause