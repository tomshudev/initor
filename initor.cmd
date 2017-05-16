@ECHO OFF

SETLOCAL

SET "NODE_EXE=%~dp0\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

SET "INITOR=%~dp0./initor.js"
FOR /F "delims=" %%F IN ('CALL "%NODE_EXE%" "%INITOR%" prefix -g') DO (
  SET "INITOR=%%F./initor.js"
)
IF EXIST "%NPM_PREFIX_NPM_CLI_JS%" (
  SET "INITOR=%NPM_PREFIX_NPM_CLI_JS%"
)

"%NODE_EXE%" "%INITOR%" %*