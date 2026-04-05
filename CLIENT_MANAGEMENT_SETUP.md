# Client Management System Setup Guide

Complete setup guide for the PDN Client List Manager with automated discovery, manual approval, and bulk email campaigns.

## 🎯 System Overview

The system provides:
- **Automated Discovery**: Daily Firecrawl-based business discovery
- **Manual Review**: Edit and approve discovered businesses
- **Bulk Email**: Group and send emails to approved clients
- **Quality Control**: Threshold monitoring and alerts
- **Scheduling**: Automated daily execution

## 📋 Prerequisites

### Required Services
- **Next.js Development Server** (running on localhost:3000)
- **Supabase Database** (already configured)
- **Firecrawl API** (already configured)
- **PowerShell** (for Windows scheduler)
- **SMTP Server** (for email notifications)

### Environment Variables
Ensure these are in your `.env.local`:
```bash
# Already configured
FIRECRAWL_API_KEY=fc-f05ad0b98da746d69779aff8423e20ac
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url

# Add these for notifications
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
ADMIN_NOTIFICATION_EMAIL=admin@pacificdiscoverynetwork.com
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## 🚀 Quick Setup

### 1. Database Setup
```bash
# Run the migration
cd supabase
psql -h your-host -U postgres -d postgres -f migrations/20260405_client_management.sql
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access the Client Manager
Navigate to: `http://localhost:3000/admin/client-list-manager`

## 🛠️ Manual Setup Steps

### Step 1: Database Migration

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/20260405_client_management.sql`
   - Run the SQL script

2. **Verify Tables Created**
   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN (
     'discovered_businesses', 
     'daily_reports', 
     'quality_alerts',
     'email_groups',
     'email_campaigns',
     'error_logs',
     'scheduler_config'
   );
   ```

### Step 2: Add Client Manager to Navigation

Add to your admin navigation or create a route:

```javascript
// pages/admin/client-list-manager.jsx
import { ClientListManager } from '@/components/admin/ClientListManager';

export default function ClientListManagerPage() {
  return <ClientListManager />;
}
```

### Step 3: Test the System

1. **Manual Discovery Test**
   - Go to `/admin/client-list-manager`
   - Click "Start Discovery"
   - Verify businesses are discovered and appear in the review tab

2. **Edit and Approve Test**
   - Select a few businesses
   - Click "Edit" to modify details
   - Save changes
   - Select businesses and click "Approve Selected"

3. **Email Group Test**
   - Go to "Email Campaigns" tab
   - Click "Create Email Group"
   - Verify approved clients are included

## ⏰ Automated Scheduler Setup

### Option 1: Windows Task Scheduler (Recommended)

1. **Open Task Scheduler**
   ```
   Press Win + R, type taskschd.msc, press Enter
   ```

2. **Create New Task**
   - Click "Create Task" in the right panel
   - **General Tab**:
     - Name: "PDN Daily Scheduler"
     - Description: "Automated Pacific diaspora business discovery"
     - Select "Run with highest privileges"
   
3. **Trigger Tab**:
   - Click "New..."
   - Begin the task: "Daily"
   - Start time: "07:00:00"
   - Repeat every: "1 day"
   
4. **Actions Tab**:
   - Click "New..."
   - Action: "Start a program"
   - Program/script: `powershell.exe`
   - Add arguments: `-NoProfile -ExecutionPolicy Bypass -File "C:\Users\msben\Active Projects\Pacific Discovery Network\scripts\pdn-scheduler.ps1"`
   
5. **Settings Tab**:
   - Check "Allow task to be run on demand"
   - Check "Run task as soon as possible after a scheduled start is missed"
   - Check "Stop the task if it runs longer than: 2 hours"

6. **Save and Test**
   - Save the task
   - Right-click and select "Run" to test

### Option 2: PowerShell Background Process

For testing or manual execution:

```powershell
# Navigate to project directory
cd "C:\Users\msben\Active Projects\Pacific Discovery Network"

# Run scheduler manually
.\scripts\pdn-scheduler.ps1 -ForceRun:$true

# Run in background
Start-Process powershell -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`".\scripts\pdn-scheduler.ps1`"" -WindowStyle Hidden
```

## 📊 Monitoring and Maintenance

### Check Scheduler Status

```powershell
# Check today's log
Get-Content "C:\Users\msben\Active Projects\Pacific Discovery Network\logs\pdn-scheduler-*.log" -Tail 20

# Check latest report
Get-Content "C:\Users\msben\Active Projects\Pacific Discovery Network\reports\pdn-daily-$(Get-Date -Format 'yyyy-MM-dd').json"
```

### Quality Metrics Dashboard

Access quality metrics in the Client List Manager or query directly:

```sql
-- Get today's quality metrics
SELECT * FROM quality_alerts 
WHERE date = CURRENT_DATE 
ORDER BY severity DESC;

-- Get weekly summary
SELECT 
    date,
    (summary->>'total_discovered')::integer as discovered,
    (summary->>'email_capture_rate')::decimal as email_rate,
    (summary->>'avg_confidence')::decimal as avg_confidence
FROM daily_reports 
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;
```

### Alert Configuration

Configure alerts in `scripts\pdn-scheduler.ps1`:

```powershell
# Telegram alerts (optional but recommended)
$env:TELEGRAM_BOT_TOKEN = "your-bot-token"
$env:TELEGRAM_CHAT_ID = "your-chat-id"

# Email alerts for critical issues
$env:ADMIN_NOTIFICATION_EMAIL = "admin@pacificdiscoverynetwork.com"
```

## 🔄 Daily Workflow

### Automatic Process (7:00 AM Auckland Time)

1. **Quality Check** - Verify API connectivity and system health
2. **Discovery Phase** - Search for businesses in today's target region
3. **Data Extraction** - Extract structured information using Firecrawl
4. **Deduplication** - Remove duplicates (target < 10%)
5. **Storage** - Save to database with status "pending"
6. **Report Generation** - Create daily JSON and CSV reports
7. **Quality Alerts** - Send alerts if thresholds not met

### Manual Process (Any Time)

1. **Review** - Go to `/admin/client-list-manager`
2. **Edit** - Modify business details as needed
3. **Approve** - Select and approve quality businesses
4. **Group** - Create email groups from approved clients
5. **Send** - Launch email campaigns

## 📈 Performance Optimization

### Firecrawl Rate Limiting
- Built-in 1-second delays between requests
- Limited to 25 URLs per extraction batch
- Automatic retry logic for failed requests

### Database Optimization
- Indexed on status, region, and date fields
- Row-level security for multi-user access
- Automated cleanup of old logs (optional)

### Scheduler Performance
- 45-60 minute execution time target
- Timeout protection (30 minutes for API calls)
- Memory-efficient processing

## 🛠️ Troubleshooting

### Common Issues

**Issue: Scheduler doesn't run**
- Check Windows Task Scheduler is running
- Verify PowerShell execution policy: `Get-ExecutionPolicy`
- Ensure development server is running

**Issue: No businesses discovered**
- Check Firecrawl API key is valid
- Verify network connectivity
- Review logs for specific error messages

**Issue: High duplicate rate**
- Adjust search queries to be more specific
- Improve deduplication logic in API
- Review source quality

**Issue: Low email capture rate**
- Improve extraction prompts
- Add fallback email discovery methods
- Review business website structures

### Debug Mode

Run scheduler with debug output:

```powershell
# Enable verbose logging
$env:DEBUG = "true"
.\scripts\pdn-scheduler.ps1 -ForceRun:$true

# Check specific components
.\scripts\pdn-scheduler.ps1 -ForceRun:$true -LogPath "debug-logs"
```

### Log Analysis

```powershell
# Find errors in logs
Select-String -Path "logs\*.log" -Pattern "ERROR" | Select-Object -Last 10

# Check performance
Select-String -Path "logs\*.log" -Pattern "duration|completed" | Select-Object -Last 5
```

## 📱 Mobile Access

The Client List Manager is responsive and works on mobile devices. Access via:
- Phone browser: `http://your-domain/admin/client-list-manager`
- Tablet: Full functionality with touch-optimized interface

## 🔐 Security Considerations

- **API Keys**: Stored in environment variables, never in code
- **Database Access**: Row-level security enabled
- **Email Privacy**: Client data encrypted in transit
- **Audit Trail**: All changes tracked with user attribution

## 📚 API Reference

### Client Discovery API

```javascript
// Run discovery
POST /api/client-discovery
{
  "action": "run_discovery"
}

// Quality check
POST /api/client-discovery
{
  "action": "quality_check"
}

// Generate report
POST /api/client-discovery
{
  "action": "generate_report",
  "format": "csv"
}
```

### Database Schema

Key tables:
- `discovered_businesses` - Main client data
- `daily_reports` - Daily execution reports
- `quality_alerts` - Quality threshold alerts
- `email_groups` - Email campaign groups

## 🎯 Success Metrics

Track these KPIs:
- **Daily Discovery Volume**: Target 33 businesses/day
- **Approval Rate**: Target > 60% of discovered businesses
- **Email Capture Rate**: Target > 25%
- **Duplicate Rate**: Target < 10%
- **System Uptime**: Target > 95%

## 📞 Support

For issues:
1. Check logs in `logs/` directory
2. Review error logs in Supabase
3. Verify environment variables
4. Test API endpoints manually
5. Check Windows Task Scheduler status

---

**Version**: 1.0  
**Last Updated**: 2026-04-05  
**Status**: Production Ready
