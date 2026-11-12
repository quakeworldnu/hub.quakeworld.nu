#Requires -RunAsAdministrator
<#
    Switch Windows 11 from Polish to English.

    Run in an elevated PowerShell (Run as administrator):
        powershell -ExecutionPolicy Bypass -File .\Set-WindowsEnglish.ps1

    Needs an internet connection. Restart when it finishes.
#>

# ------------------------- Settings -------------------------
$Language           = 'en-US'   # Display language. Use 'en-GB' for British English.
$RegionalFormat     = 'en-US'   # Date/number/currency format. 'en-GB' = dd/MM/yyyy, 'pl-PL' = keep Polish formats.
$SystemLocale       = 'en-US'   # Language for non-Unicode (older) programs.
$KeepPolishKeyboard = $true     # Keep Polish (Programmers) keyboard so you can still type ą ę ł ó ś ź ż ć ń.
$HomeGeoId          = $null     # Country/region: $null = leave unchanged, 191 = Poland, 244 = United States, 242 = United Kingdom.
# ------------------------------------------------------------

$ErrorActionPreference = 'Stop'

# Windows 11 Home "Single Language" cannot change display language.
$edition = (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion').EditionID
if ($edition -eq 'CoreSingleLanguage') {
    Write-Warning "This is Windows 11 Home Single Language. Microsoft does not allow changing the display language on this edition."
    Write-Warning "You would need to upgrade to regular Windows 11 Home/Pro, or reinstall Windows in English."
    exit 1
}

if (-not (Get-Command Install-Language -ErrorAction SilentlyContinue)) {
    Write-Warning "Install-Language is not available (LanguagePackManagement module missing). Make sure Windows 11 is fully updated."
    exit 1
}

# 1. Install the language pack (display language, speech, handwriting, etc.)
Write-Host "Installing $Language language pack - this can take 10-30 minutes..." -ForegroundColor Cyan
Install-Language -Language $Language -CopyToSettings

# 2. Display language (system-wide and for the current user)
Write-Host "Setting display language to $Language..." -ForegroundColor Cyan
Set-SystemPreferredUILanguage -Language $Language
Set-WinUILanguageOverride -Language $Language

# 3. Language list / keyboards (English first, Polish removed as a language)
Write-Host "Setting language list..." -ForegroundColor Cyan
$list = New-WinUserLanguageList $Language
if ($KeepPolishKeyboard) {
    # 0415:00000415 = Polish (Programmers) keyboard layout
    $list[0].InputMethodTips.Add('0415:00000415')
}
Set-WinUserLanguageList $list -Force

# 4. Regional format (dates, numbers, currency)
Write-Host "Setting regional format to $RegionalFormat..." -ForegroundColor Cyan
Set-Culture -CultureInfo $RegionalFormat

# 5. System locale (language for non-Unicode programs)
Write-Host "Setting system locale to $SystemLocale..." -ForegroundColor Cyan
Set-WinSystemLocale -SystemLocale $SystemLocale

# 6. Country / region (optional)
if ($null -ne $HomeGeoId) {
    Write-Host "Setting home location to GeoId $HomeGeoId..." -ForegroundColor Cyan
    Set-WinHomeLocation -GeoId $HomeGeoId
}

# 7. Apply to the welcome/login screen and new user accounts (Windows 11 22H2+)
if (Get-Command Copy-UserInternationalSettingsToSystem -ErrorAction SilentlyContinue) {
    Write-Host "Copying settings to welcome screen and new users..." -ForegroundColor Cyan
    Copy-UserInternationalSettingsToSystem -WelcomeScreen $true -NewUser $true
}

Write-Host ""
Write-Host "Done. Restart is required for all changes to take effect." -ForegroundColor Green
$answer = Read-Host "Restart now? (y/n)"
if ($answer -match '^[yYtT]') { Restart-Computer }
