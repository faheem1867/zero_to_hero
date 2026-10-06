$gitDir = "$env:LOCALAPPDATA\MinGit\cmd"
$env:PATH = "$gitDir;$env:PATH"

# Persist to user PATH
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($userPath -notlike "*$gitDir*") {
  [Environment]::SetEnvironmentVariable('Path', "$userPath;$gitDir", 'User')
}

Write-Host "Git path configured. Verifying git:"
git --version

# Initialize if needed
if (-not (Test-Path ".git")) {
  Write-Host "Initializing git repository..."
  git init
}

# Set default identity if unset
$userName = git config user.name
if (-not $userName) {
  git config user.name "faheem1867"
  git config user.email "faheem1867@users.noreply.github.com"
}

# Stage files
Write-Host "Staging files..."
git add .

# Commit if there are changes
$status = git status --porcelain
if ($status) {
  Write-Host "Committing changes..."
  git commit -m "Initial commit: Zero to Hero Salon luxury MERN web application with Vercel configuration and mobile optimizations"
} else {
  Write-Host "Working tree clean or already committed."
}

# Add or update remote
Write-Host "Configuring remote origin..."
$remotes = git remote
if ($remotes -contains "origin") {
  git remote set-url origin https://github.com/faheem1867/zero_to_hero.git
} else {
  git remote add origin https://github.com/faheem1867/zero_to_hero.git
}

# Branch rename
Write-Host "Setting branch to main..."
git branch -M main

# Push to origin main
Write-Host "Pushing to remote origin main..."
git push -u origin main
