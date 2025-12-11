# Fix trailing quotes in TypeScript files
$files = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if file ends with a quote followed by newline/whitespace
    if ($content -match '"\s*$') {
        Write-Host "Fixing: $($file.FullName)"
        # Remove trailing quote and whitespace
        $fixedContent = $content -replace '"\s*$', ''
        # Write back to file with UTF8 encoding
        [System.IO.File]::WriteAllText($file.FullName, $fixedContent, [System.Text.UTF8Encoding]::new($false))
    }
}

Write-Host "Done fixing trailing quotes!"
