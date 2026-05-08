# Used by verify-etherscan-http.cjs when Node HTTPS cannot reach api.etherscan.io (IPv6/DNS).
param(
  [Parameter(Mandatory)][ValidateSet('Submit', 'Poll')][string]$Mode,
  [string]$BodyPath,
  [string]$SubmitUrl,
  [string]$PollUrl
)
$ErrorActionPreference = 'Stop'
if ($Mode -eq 'Submit') {
  $data = [System.IO.File]::ReadAllText($BodyPath, [System.Text.Encoding]::UTF8)
  $r = Invoke-WebRequest -Uri $SubmitUrl -Method Post -Body $data `
    -ContentType 'application/x-www-form-urlencoded; charset=UTF-8' `
    -TimeoutSec 360 -UseBasicParsing
  $r.Content
} else {
  $r = Invoke-WebRequest -Uri $PollUrl -Method Get -TimeoutSec 120 -UseBasicParsing
  $r.Content
}
