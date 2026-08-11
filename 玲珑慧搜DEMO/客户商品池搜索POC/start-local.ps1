$ErrorActionPreference = 'Stop'
$projectRoot = Join-Path $PSScriptRoot 'prototype'
$appUrl = 'http://127.0.0.1:4173/'

if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'package.json'))) {
    Write-Host 'Prototype folder not found. Keep this launcher beside the prototype folder.'
    exit 1
}

$npm = Get-Command 'npm.cmd' -ErrorAction SilentlyContinue
if (-not $npm) {
    Write-Host 'Node.js was not found. Install Node.js LTS, then run this launcher again.'
    exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'node_modules'))) {
    & $npm.Source 'install' '--prefer-offline' '--no-audit' '--no-fund' | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Host 'Dependency installation failed. Check Node.js or network access, then run again.'
        exit 1
    }
}

Start-Process -FilePath $npm.Source -WorkingDirectory $projectRoot -WindowStyle Minimized -ArgumentList @('run', 'dev', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort')
Start-Sleep -Seconds 2
Start-Process $appUrl
