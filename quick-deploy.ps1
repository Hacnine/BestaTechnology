# Besta Apparels - Quick Deploy to VPS
# Run this script on your Windows machine to push deployment files and deploy

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Besta Apparels VPS Deployment Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Push to GitHub
Write-Host "Step 1: Pushing deployment files to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "Add VPS deployment configuration"
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to push to GitHub. Please check your git configuration." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Files pushed to GitHub successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Instructions for VPS deployment
Write-Host "Step 2: Connect to your VPS and run deployment" -ForegroundColor Yellow
Write-Host ""
Write-Host "Copy and paste these commands into your VPS terminal:" -ForegroundColor Cyan
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "ssh administrator@108.181.187.124" -ForegroundColor White
Write-Host ""
Write-Host "# Once connected, run:" -ForegroundColor Gray
Write-Host "sudo -i" -ForegroundColor White
Write-Host "cd /opt" -ForegroundColor White
Write-Host "git clone https://github.com/Hacnine/BestaTechnology.git" -ForegroundColor White
Write-Host "cd BestaTechnology" -ForegroundColor White
Write-Host "chmod +x deploy.sh" -ForegroundColor White
Write-Host "bash deploy.sh" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "Or for a quick one-liner:" -ForegroundColor Cyan
Write-Host "ssh administrator@108.181.187.124 'sudo bash -c ""cd /opt && git clone https://github.com/Hacnine/BestaTechnology.git && cd BestaTechnology && chmod +x deploy.sh && bash deploy.sh""'" -ForegroundColor White
Write-Host ""

Write-Host "✓ Your application will be available at:" -ForegroundColor Green
Write-Host "  - Frontend: http://108.181.187.124" -ForegroundColor Cyan
Write-Host "  - Backend: http://108.181.187.124:3001" -ForegroundColor Cyan
Write-Host ""

Write-Host "📖 For detailed instructions, see VPS_DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""

# Optional: Open SSH connection
$response = Read-Host "Would you like to open SSH connection now? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "Opening SSH connection..." -ForegroundColor Yellow
    ssh administrator@108.181.187.124
}
