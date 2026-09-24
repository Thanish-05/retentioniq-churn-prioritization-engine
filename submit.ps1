# Auto-submit PowerShell Wrapper
param(
    [string]$Message = ""
)

if ($Message -ne "") {
    python .\submit.py "$Message"
} else {
    python .\submit.py
}
