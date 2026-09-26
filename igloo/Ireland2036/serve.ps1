# Ireland 2036 - local show server for Igloo Core Engine.
# Serves this folder at http://localhost:8036/ with byte-range support, which video seeking needs.
# Run it with "Start Ireland 2036.bat". Close the window to stop the server.
param([int]$Port = 8036)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$types = @{
  '.html'='text/html; charset=utf-8'; '.js'='text/javascript'; '.css'='text/css'; '.json'='application/json';
  '.mp4'='video/mp4'; '.webm'='video/webm'; '.mp3'='audio/mpeg'; '.m4a'='audio/mp4'; '.ogg'='audio/ogg'; '.wav'='audio/wav';
  '.woff2'='font/woff2'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.webp'='image/webp'; '.svg'='image/svg+xml'
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host ""
Write-Host "  Ireland 2036 is being served at  http://localhost:$Port/" -ForegroundColor Yellow
Write-Host "  In Igloo Core Engine add a Web layer with that address (360 / equirectangular)."
Write-Host "  Keep this window open during the show. Close it to stop."
Write-Host ""
$CHUNK = 8MB
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request; $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
    if ($rel -eq '') { $rel = 'index.html' }
    $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
    if (-not $path.StartsWith($root) -or -not (Test-Path -LiteralPath $path -PathType Leaf)) {
      $res.StatusCode = 404; $res.Close(); continue
    }
    $ext = [IO.Path]::GetExtension($path).ToLower()
    $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
    $res.AddHeader('Accept-Ranges', 'bytes')
    $res.AddHeader('Cache-Control', 'no-cache')
    $fs = [IO.File]::Open($path, 'Open', 'Read', 'ReadWrite')
    try {
      $len = $fs.Length; $start = 0; $end = $len - 1
      $range = $req.Headers['Range']
      if ($range -and $range -match 'bytes=(\d*)-(\d*)') {
        if ($matches[1] -ne '') { $start = [int64]$matches[1] }
        if ($matches[2] -ne '') { $end = [int64]$matches[2] } elseif ($matches[1] -eq '') { $end = $len - 1 }
        if ($matches[1] -eq '' -and $matches[2] -ne '') { $start = [Math]::Max(0, $len - [int64]$matches[2]); $end = $len - 1 }
        if ($end -ge $len) { $end = $len - 1 }
        if ($end - $start + 1 -gt $CHUNK) { $end = $start + $CHUNK - 1 }
        if ($start -ge $len) { $res.StatusCode = 416; $res.AddHeader('Content-Range', "bytes */$len"); $res.Close(); continue }
        $res.StatusCode = 206
        $res.AddHeader('Content-Range', "bytes $start-$end/$len")
      }
      $count = $end - $start + 1
      $res.ContentLength64 = $count
      if ($req.HttpMethod -ne 'HEAD') {
        $fs.Seek($start, 'Begin') | Out-Null
        $buf = New-Object byte[] 262144
        $left = $count
        while ($left -gt 0) {
          $n = $fs.Read($buf, 0, [int][Math]::Min($buf.Length, $left))
          if ($n -le 0) { break }
          $res.OutputStream.Write($buf, 0, $n); $left -= $n
        }
      }
    } finally { $fs.Close() }
    $res.Close()
  } catch {
    try { $res.Abort() } catch {}
  }
}
