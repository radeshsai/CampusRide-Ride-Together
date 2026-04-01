@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script (Windows)
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set MAVEN_OPTS=-Xmx256m

where mvn >nul 2>&1
if %errorlevel% == 0 (
    mvn %*
) else (
    echo Maven not found in PATH. Please install Maven or add it to PATH.
    echo Download from: https://maven.apache.org/download.cgi
    exit /b 1
)

endlocal
