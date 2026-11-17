$ErrorActionPreference = 'Stop'
# Copy to scripts/local-env.ps1 (Git-ignored) and replace the three paths for this machine.
# The pinned CLI is HyperFrames 0.9.54. Do not switch versions without re-running QA.
$env:DO_NOT_TRACK = '1'
$env:HF_NO_UPDATE_CHECK = '1'
$nodeDirectory = 'C:\path\to\nodejs'
$ffmpegDirectory = 'C:\path\to\ffmpeg\bin'
$env:PATH = "$nodeDirectory;$ffmpegDirectory;" + $env:PATH
$env:HYPERFRAMES_EXTRACT_CACHE_DIR = Join-Path $PSScriptRoot '../output/render-cache'
$script:HyperframesCLI = 'C:\path\to\npx-cache\node_modules\hyperframes\bin\hyperframes.mjs'
function hf { & node $script:HyperframesCLI @args }
