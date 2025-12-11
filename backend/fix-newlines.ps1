# Fix newlines in TypeScript files
$files = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $lines = (Get-Content -Path $file.FullName | Measure-Object -Line).Lines
    
    # Only process files with 1 line (likely have literal \n)
    if ($lines -eq 1 -and $content.Contains('\n')) {
        Write-Host "Fixing: $($file.FullName)"
        # Replace literal \n with actual newlines
        $fixedContent = $content -replace '\\n', "`n"
        # Write back to file with UTF8 encoding
        [System.IO.File]::WriteAllText($file.FullName, $fixedContent, [System.Text.UTF8Encoding]::new($false))
    }
}

Write-Host "Done fixing newlines!"
