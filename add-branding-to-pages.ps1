# PowerShell script to add useBranding import to all dashboard pages

$pages = @(
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\user\deposit\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\user\international\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\user\kyc\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\user\loans\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\user\profile\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\user\settings\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\user\support\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\user\transfer\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\user\wallet\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\analytics\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\card-requests\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\cards\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\dashboard\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\deposits\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\kyc\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\loans\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\support\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\transactions\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\transfer-codes\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\transfers\page.tsx",
    "C:\Users\user\rdn-banking-platform\frontend\app\(dashboard)\admin\users\page.tsx"
)

foreach ($page in $pages) {
    if (Test-Path $page) {
        $content = Get-Content $page -Raw
        
        # Check if already has useBranding
        if ($content -notmatch "useBranding") {
            Write-Host "Adding useBranding to: $page" -ForegroundColor Green
            
            # Add import if not already there
            if ($content -notmatch "useBranding") {
                $content = $content -replace "(import.*from.*@/contexts/SettingsContext.*;)", "`$1`nimport { useBranding } from '@/contexts/BrandingContext';"
            }
            
            # Find the component function and add the hook
            if ($content -match "export default function (\w+)\(\) \{") {
                $content = $content -replace "(export default function \w+\(\) \{\s*)", "`$1`n  const { branding } = useBranding();`n"
            }
            
            Set-Content -Path $page -Value $content -NoNewline
            Write-Host "✓ Updated: $page" -ForegroundColor Cyan
        } else {
            Write-Host "✓ Already has branding: $page" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ Not found: $page" -ForegroundColor Red
    }
}

Write-Host "`n✅ Branding context added to all pages!" -ForegroundColor Green
Write-Host "Note: You will need to manually update bg-blue and text-blue classes" -ForegroundColor Yellow
