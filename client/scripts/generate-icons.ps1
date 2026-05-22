$dir = Join-Path $PSScriptRoot "..\public\icons"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Add-Type -AssemblyName System.Drawing
foreach ($size in @(192, 512)) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::FromArgb(139, 92, 246))
  $font = New-Object System.Drawing.Font("Arial", [int]($size / 4), [System.Drawing.FontStyle]::Bold)
  $g.DrawString("LH", $font, [System.Drawing.Brushes]::White, $size * 0.22, $size * 0.32)
  $path = Join-Path $dir "icon-$size.png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "Created $path"
}
