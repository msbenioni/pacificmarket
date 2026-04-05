# PDN Daily Scheduler
# Automated discovery system for Pacific Diaspora Network

param(
    [switch]$ForceRun = $false,
    [string]$LogPath = "logs",
    [string]$ConfigPath = "config"
)

# Initialize logging
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LogFile = "$LogPath\pdn-scheduler-$Timestamp.log"

# Ensure log directory exists
if (-not (Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $LogEntry = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [$Level] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry
}

function Send-Alert {
    param([string]$Message, [string]$Severity = "warning")
    
    # Send to Telegram (configure with your bot token and chat ID)
    $TelegramBotToken = $env:TELEGRAM_BOT_TOKEN
    $TelegramChatId = $env:TELEGRAM_CHAT_ID
    
    if ($TelegramBotToken -and $TelegramChatId) {
        try {
            $Payload = @{
                chat_id = $TelegramChatId
                text    = "🚨 PDN Scheduler Alert [$Severity]: $Message"
            } | ConvertTo-Json
            
            Invoke-RestMethod -Uri "https://api.telegram.org/bot$TelegramBotToken/sendMessage" -Method Post -ContentType "application/json" -Body $Payload
            Write-Log "Telegram alert sent: $Message" "INFO"
        }
        catch {
            Write-Log "Failed to send Telegram alert: $($_.Exception.Message)" "ERROR"
        }
    }
    
    # Send email for critical alerts
    if ($Severity -eq "error") {
        try {
            $EmailBody = @"
PDN Scheduler Critical Error

Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Message: $Message
Log File: $LogFile

Please investigate immediately.
"@
            
            Send-MailMessage -To $env:ADMIN_NOTIFICATION_EMAIL -From "scheduler@pacificdiscoverynetwork.com" -Subject "PDN Scheduler Critical Error" -Body $EmailBody -SmtpServer "smtp.gmail.com" -Port 587 -UseSsl -Credential (New-Object System.Management.Automation.PSCredential($env:SMTP_USER, (ConvertTo-SecureString $env:SMTP_PASS -AsPlainText -Force)))
            Write-Log "Email alert sent to admin" "INFO"
        }
        catch {
            Write-Log "Failed to send email alert: $($_.Exception.Message)" "ERROR"
        }
    }
}

function Test-QualityThresholds {
    param([object]$Metrics)
    
    $Thresholds = @{
        MinVolume          = 20
        MaxDuplicateRate   = 0.1
        MinConfidenceScore = 60
        MinEmailCapture    = 0.25
    }
    
    $Alerts = @()
    
    if ($Metrics.total_discovered -lt $Thresholds.MinVolume) {
        $Alerts += @{
            type     = "LOW_VOLUME"
            message  = "Only $($Metrics.total_discovered) businesses discovered, below minimum of $($Thresholds.MinVolume)"
            severity = "error"
        }
    }
    
    if ($Metrics.avg_confidence_score -lt $Thresholds.MinConfidenceScore) {
        $Alerts += @{
            type     = "LOW_CONFIDENCE"
            message  = "Average confidence score $($Metrics.avg_confidence_score) below threshold $($Thresholds.MinConfidenceScore)"
            severity = "warning"
        }
    }
    
    if ($Metrics.email_capture_rate -lt $Thresholds.MinEmailCapture) {
        $Alerts += @{
            type     = "LOW_EMAIL_CAPTURE"
            message  = "Email capture rate $($Metrics.email_capture_rate.ToString('P')) below threshold $($Thresholds.MinEmailCapture.ToString('P'))"
            severity = "warning"
        }
    }
    
    return $Alerts
}

function Invoke-DiscoveryWorkflow {
    Write-Log "Starting PDN discovery workflow" "INFO"
    
    try {
        # Check if we should run (7:00 AM Auckland timezone)
        $AucklandTime = [System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId((Get-Date), "Pacific/Auckland")
        $CurrentHour = $AucklandTime.Hour
        
        if (-not $ForceRun -and $CurrentHour -ne 7) {
            Write-Log "Current hour is $CurrentHour (Auckland). Scheduled for 7:00 AM. Skipping execution." "INFO"
            return
        }
        
        Write-Log "Starting discovery process at $AucklandTime (Auckland timezone)" "INFO"
        
        # Step 1: Quality Check
        Write-Log "Step 1: Performing quality checks..." "INFO"
        $QualityCheck = Invoke-RestMethod -Uri "http://localhost:3000/api/client-discovery" -Method Post -ContentType "application/json" -Body '{"action": "quality_check"}' -TimeoutSec 30
        
        if (-not $QualityCheck.success) {
            throw "Quality check failed: $($QualityCheck.error)"
        }
        
        Write-Log "Quality checks passed: $($QualityCheck.data.results.count) checks" "INFO"
        
        # Step 2: Run Discovery
        Write-Log "Step 2: Running discovery workflow..." "INFO"
        $DiscoveryResult = Invoke-RestMethod -Uri "http://localhost:3000/api/client-discovery" -Method Post -ContentType "application/json" -Body '{"action": "run_discovery"}' -TimeoutSec 1800
        
        if (-not $DiscoveryResult.success) {
            throw "Discovery failed: $($DiscoveryResult.error)"
        }
        
        $Metrics = $DiscoveryResult.data.report.summary
        Write-Log "Discovery completed successfully:" "INFO"
        Write-Log "  - Discovered: $($Metrics.total_discovered) businesses" "INFO"
        Write-Log "  - Pending: $($Metrics.pending)" "INFO"
        Write-Log "  - Approved: $($Metrics.approved)" "INFO"
        Write-Log "  - Avg Confidence: $($Metrics.avg_confidence.ToString('F1'))%" "INFO"
        Write-Log "  - Email Capture Rate: $($Metrics.email_capture_rate.ToString('P'))" "INFO"
        Write-Log "  - Duration: $($DiscoveryResult.data.duration)" "INFO"
        
        # Step 3: Quality Threshold Check
        Write-Log "Step 3: Checking quality thresholds..." "INFO"
        $QualityAlerts = Test-QualityThresholds -Metrics $Metrics
        
        if ($QualityAlerts.Count -gt 0) {
            Write-Log "Quality alerts detected: $($QualityAlerts.Count)" "WARNING"
            foreach ($Alert in $QualityAlerts) {
                Write-Log "  - $($Alert.type): $($Alert.message)" "WARNING"
                Send-Alert -Message $Alert.message -Severity $Alert.severity
            }
        }
        else {
            Write-Log "All quality thresholds met" "INFO"
        }
        
        # Step 4: Generate Reports
        Write-Log "Step 4: Generating reports..." "INFO"
        $ReportResult = Invoke-RestMethod -Uri "http://localhost:3000/api/client-discovery" -Method Post -ContentType "application/json" -Body '{"action": "generate_report"}' -TimeoutSec 30
        
        if ($ReportResult.success) {
            Write-Log "Reports generated successfully" "INFO"
            
            # Save reports to file system
            $ReportDir = "reports"
            if (-not (Test-Path $ReportDir)) {
                New-Item -ItemType Directory -Path $ReportDir -Force
            }
            
            $ReportFile = "$ReportDir\pdn-daily-$(Get-Date -Format 'yyyy-MM-dd').json"
            $ReportResult.data | Out-File -FilePath $ReportFile -Encoding utf8
            Write-Log "Report saved to: $ReportFile" "INFO"
            
            # Generate CSV export
            $CsvResult = Invoke-RestMethod -Uri "http://localhost:3000/api/client-discovery" -Method Post -ContentType "application/json" -Body '{"action": "generate_report", "format": "csv"}' -TimeoutSec 30
            if ($CsvResult.success) {
                $CsvFile = "$ReportDir\pdn-daily-$(Get-Date -Format 'yyyy-MM-dd').csv"
                $CsvResult.data | Out-File -FilePath $CsvFile -Encoding utf8
                Write-Log "CSV export saved to: $CsvFile" "INFO"
            }
        }
        else {
            Write-Log "Failed to generate reports: $($ReportResult.error)" "WARNING"
        }
        
        # Step 5: Success Notification
        Write-Log "Discovery workflow completed successfully" "INFO"
        Send-Alert -Message "Daily discovery completed: $($Metrics.total_discovered) businesses discovered, $($Metrics.email_capture_rate.ToString('P')) email capture rate" -Severity "info"
        
    }
    catch {
        Write-Log "Discovery workflow failed: $($_.Exception.Message)" "ERROR"
        Send-Alert -Message "Discovery workflow failed: $($_.Exception.Message)" -Severity "error"
        throw
    }
}

function Test-Connectivity {
    Write-Log "Testing connectivity to API endpoint..." "INFO"
    
    try {
        $null = Invoke-RestMethod -Uri "http://localhost:3000/api/client-discovery" -Method Post -ContentType "application/json" -Body '{"action": "quality_check"}' -TimeoutSec 10
        Write-Log "API connectivity test passed" "INFO"
        return $true
    }
    catch {
        Write-Log "API connectivity test failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Start-SchedulerService {
    Write-Log "Starting PDN Scheduler Service..." "INFO"
    Write-Log "Log file: $LogFile" "INFO"
    
    # Test connectivity first
    if (-not (Test-Connectivity)) {
        Write-Log "Cannot connect to API endpoint. Please ensure the development server is running." "ERROR"
        exit 1
    }
    
    try {
        Invoke-DiscoveryWorkflow
        Write-Log "Scheduler execution completed" "INFO"
    }
    catch {
        Write-Log "Scheduler execution failed: $($_.Exception.Message)" "ERROR"
        exit 1
    }
}

# Main execution
try {
    Write-Log "PDN Scheduler v1.0 starting..." "INFO"
    Write-Log "Parameters: ForceRun=$ForceRun, LogPath=$LogPath" "INFO"
    
    # Check if running in correct directory
    if (-not (Test-Path "package.json")) {
        Write-Log "Please run this script from the project root directory (where package.json is located)" "ERROR"
        exit 1
    }
    
    # Load environment variables
    if (Test-Path ".env.local") {
        Get-Content ".env.local" | ForEach-Object {
            if ($_ -match '^([^=]+)=(.*)$') {
                [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
            }
        }
        Write-Log "Environment variables loaded from .env.local" "INFO"
    }
    
    # Start the scheduler
    Start-SchedulerService
    
    Write-Log "PDN Scheduler completed successfully" "INFO"
    
}
catch {
    Write-Log "Fatal error: $($_.Exception.Message)" "ERROR"
    Send-Alert -Message "Fatal scheduler error: $($_.Exception.Message)" -Severity "error"
    exit 1
}
