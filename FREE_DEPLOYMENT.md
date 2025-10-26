# 🆓 100% FREE DEPLOYMENT GUIDE

## **Deploy Your Climate Portal for $0/month**

Everything can be FREE for 12+ months!

---

## **🎯 COMPLETE FREE STACK**

| Component | Free Solution | Limit | Perfect For |
|-----------|---------------|-------|-------------|
| **Backend Hosting** | Railway / Render | 500 hours/month | Your portal |
| **Database** | Supabase PostgreSQL | 500MB | Climate data |
| **Redis Cache** | Upstash | 10k commands/day | Caching |
| **Frontend Hosting** | Vercel / Netlify | Unlimited | Static site |
| **Domain** | Freenom (.tk/.ml) | Free forever | Testing |
| **SSL Certificate** | Auto (included) | Unlimited | All platforms |
| **CDN** | Cloudflare | Unlimited | Global |
| **Monitoring** | Sentry | 5k errors/month | Error tracking |
| **Analytics** | Google Analytics | Unlimited | User tracking |
| **Email** | Gmail SMTP | 500 emails/day | Notifications |

**TOTAL COST: $0/month** ✅

---

## **🚀 OPTION 1: FASTEST FREE DEPLOYMENT**

### **Stack: Vercel + Railway + Supabase + Upstash**

**Deployment Time:** 30 minutes
**No Credit Card Required:** Yes
**Good For:** Immediate deployment, demos, thesis

---

### **Step 1: Deploy Backend (Railway.app)** ⏱️ 10 min

**Why Railway:** 
- ✅ FREE 500 hours/month ($5 credit)
- ✅ No credit card required
- ✅ Auto-deploy from GitHub
- ✅ Built-in SSL

```bash
# 1. Create account
Go to: https://railway.app/
Sign up with GitHub (FREE)

# 2. Push your code to GitHub
cd "G:\My Drive\THESIS\GEE-Climate-Portal"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/climate-portal.git
git push -u origin main

# 3. Deploy to Railway
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your climate-portal repo
4. Railway auto-detects Python
5. Add environment variables:
   - DATABASE_URL: (we'll add from Supabase)
   - REDIS_URL: (we'll add from Upstash)
   - GEE_PROJECT_ID: your-project-id
   - SECRET_KEY: generate-random-key
6. Click "Deploy"
```

**Configure for FastAPI:**

Create `railway.json` in your project root:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Create `Procfile`:
```
web: uvicorn app:app --host 0.0.0.0 --port $PORT --workers 2
```

---

### **Step 2: Free PostgreSQL (Supabase)** ⏱️ 5 min

**Why Supabase:**
- ✅ FREE 500MB database
- ✅ Built-in PostGIS
- ✅ No credit card required
- ✅ Auto backups

```bash
# 1. Create account
Go to: https://supabase.com/
Sign up with GitHub (FREE)

# 2. Create project
1. New Project
2. Name: climate-portal
3. Database Password: (save this!)
4. Region: Choose closest to Pakistan (Singapore)
5. Wait 2 minutes for setup

# 3. Enable PostGIS
1. Go to SQL Editor
2. Run this:
   CREATE EXTENSION IF NOT EXISTS postgis;
   CREATE EXTENSION IF NOT EXISTS postgis_topology;

# 4. Get connection string
1. Settings → Database
2. Copy "Connection string" (URI mode)
3. Example: postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# 5. Add to Railway
1. Go to Railway dashboard
2. Add environment variable:
   DATABASE_URL=your-supabase-connection-string
```

---

### **Step 3: Free Redis (Upstash)** ⏱️ 5 min

**Why Upstash:**
- ✅ FREE 10k commands/day
- ✅ No credit card required
- ✅ Serverless Redis

```bash
# 1. Create account
Go to: https://upstash.com/
Sign up with GitHub (FREE)

# 2. Create database
1. Create Database
2. Name: climate-cache
3. Type: Regional
4. Region: Asia Pacific (closest to Pakistan)
5. Click Create

# 3. Get connection string
1. Click your database
2. Copy "Redis URL" (starts with rediss://)

# 4. Add to Railway
1. Railway dashboard
2. Add environment variable:
   REDIS_URL=your-upstash-redis-url
```

---

### **Step 4: Deploy Frontend (Vercel)** ⏱️ 5 min

**Why Vercel:**
- ✅ 100% FREE for hobby projects
- ✅ Unlimited bandwidth
- ✅ Auto SSL
- ✅ Global CDN

```bash
# 1. Update API URL in frontend
cd frontend
nano .env.production
```

```env
VITE_API_URL=https://your-railway-url.railway.app
```

```bash
# 2. Commit changes
git add .
git commit -m "Update API URL for production"
git push

# 3. Deploy to Vercel
1. Go to: https://vercel.com/
2. Sign up with GitHub (FREE)
3. Import Git Repository
4. Select climate-portal repo
5. Framework Preset: Vite
6. Root Directory: frontend
7. Build Command: npm run build
8. Output Directory: dist
9. Click "Deploy"
10. Wait 2 minutes - DONE!

# Your frontend is live at:
# https://your-project.vercel.app
```

---

### **Step 5: Free Domain (Optional)** ⏱️ 5 min

**Option A: Freenom (100% Free)**
```bash
Go to: https://www.freenom.com/
Search for available domain
Choose: .tk, .ml, .ga, .cf, or .gq (all FREE)
Register for 12 months FREE
Point to your Vercel/Railway URLs
```

**Option B: Use Default URLs (Also Free)**
```bash
Frontend: your-project.vercel.app
Backend: your-project.railway.app
Both work perfectly!
```

---

## **🆓 OPTION 2: RENDER (All-in-One Free)**

### **One Platform for Everything**

**Why Render:**
- ✅ FREE tier forever
- ✅ PostgreSQL included (1GB)
- ✅ Redis included (25MB)
- ✅ Web service FREE (750 hours/month)
- ✅ No credit card required

```bash
# 1. Create account
Go to: https://render.com/
Sign up with GitHub (FREE)

# 2. Create PostgreSQL Database
1. New → PostgreSQL
2. Name: climate-db
3. Database: climate_portal
4. User: climate_admin
5. Region: Singapore
6. Instance Type: FREE
7. Click "Create Database"
8. Wait 2 minutes
9. Copy "Internal Database URL"

# 3. Enable PostGIS
1. Click your database
2. Connect with "PSQL Command"
3. Run: CREATE EXTENSION postgis;

# 4. Create Redis
1. New → Redis
2. Name: climate-cache
3. Region: Singapore
4. Plan: FREE (25MB)
5. Create
6. Copy "Internal Redis URL"

# 5. Deploy Backend
1. New → Web Service
2. Connect GitHub repo
3. Name: climate-api
4. Runtime: Python 3
5. Build Command: pip install -r requirements.txt
6. Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
7. Instance Type: FREE
8. Environment Variables:
   - DATABASE_URL: (from step 2)
   - REDIS_URL: (from step 4)
   - SECRET_KEY: (generate random)
   - GEE_PROJECT_ID: your-project
9. Create Web Service

# 6. Deploy Frontend (on Render)
1. New → Static Site
2. Connect GitHub repo
3. Build Command: cd frontend && npm install && npm run build
4. Publish Directory: frontend/dist
5. Environment Variables:
   - VITE_API_URL: https://climate-api.onrender.com
6. Create Static Site

# DONE! Both deployed on one platform
```

**Render Free Limits:**
- Web Services: 750 hours/month (enough for 24/7)
- PostgreSQL: 1GB storage, 1GB RAM
- Redis: 25MB storage
- Static Sites: Unlimited
- Bandwidth: 100GB/month

---

## **🆓 OPTION 3: AWS FREE TIER** (12 Months)

### **Most Generous Free Tier**

**What's FREE for 12 months:**
- EC2: 750 hours/month (t2.micro)
- RDS: 750 hours/month (db.t2.micro, 20GB)
- S3: 5GB storage
- CloudFront: 50GB transfer
- Lambda: 1M requests/month
- ElastiCache: 750 hours/month (cache.t2.micro)

```bash
# 1. Sign up
Go to: https://aws.amazon.com/free/
Sign up (requires credit card but won't charge)
Get 12 months FREE

# 2. Launch EC2 Instance
1. EC2 → Launch Instance
2. AMI: Ubuntu 22.04 LTS
3. Instance Type: t2.micro (FREE tier)
4. Storage: 30GB (FREE tier)
5. Security Group: Allow 80, 443, 22, 8000
6. Launch

# 3. Create RDS PostgreSQL
1. RDS → Create Database
2. Engine: PostgreSQL 14
3. Template: Free Tier
4. Instance: db.t2.micro
5. Storage: 20GB
6. Create

# 4. Setup ElastiCache Redis
1. ElastiCache → Create
2. Engine: Redis
3. Node Type: cache.t2.micro (FREE)
4. Create

# 5. Deploy code
SSH to EC2 and follow standard deployment
(See PRODUCTION_DEPLOYMENT.md)
```

**Cost After 12 Months:** ~$15-20/month

---

## **🆓 OPTION 4: GOOGLE CLOUD FREE TIER** (Always Free)

### **Best for GEE Integration**

**Always Free Products:**
- Cloud Run: 2M requests/month
- Cloud Storage: 5GB
- Firestore: 1GB storage
- BigQuery: 10GB storage
- Cloud Functions: 2M invocations
- Cloud Build: 120 build-minutes/day

```bash
# 1. Create account
Go to: https://cloud.google.com/free
$300 credit for 90 days + Always Free

# 2. Deploy Backend (Cloud Run)
1. Enable Cloud Run API
2. gcloud run deploy climate-api \
   --source . \
   --platform managed \
   --region asia-south1 \
   --allow-unauthenticated

# 3. Deploy Frontend (Firebase Hosting)
cd frontend
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

**Always Free Limits:**
- Cloud Run: 2M requests, 360k GB-seconds
- Perfect for your portal!

---

## **🆓 OPTION 5: NETLIFY + PLANETSCALE**

### **Another Great Free Stack**

```bash
# Frontend: Netlify (FREE)
1. Go to: https://netlify.com
2. Drag & drop frontend/dist folder
3. Done! Auto SSL + CDN

# Database: PlanetScale (FREE 5GB)
1. Go to: https://planetscale.com
2. Create database (MySQL)
3. Get connection string

# Backend: Fly.io (FREE)
1. Go to: https://fly.io
2. Deploy: fly launch
3. FREE: 3 shared-cpu-1x VMs
```

---

## **🎯 RECOMMENDED FREE STACK**

### **For Your Climate Portal:**

**Best Choice: Railway + Vercel + Supabase + Upstash**

**Why:**
- ✅ Easiest to setup (30 minutes total)
- ✅ No credit card required
- ✅ Auto-deploy from GitHub
- ✅ Built-in SSL
- ✅ Good free tier limits
- ✅ Perfect for thesis/demo

**Limits:**
- Railway: 500 hours/month (enough for 24/7 if optimized)
- Supabase: 500MB database (enough for your data)
- Upstash: 10k Redis commands/day (good for caching)
- Vercel: Unlimited (perfect!)

---

## **💰 COST COMPARISON**

| Option | Monthly Cost | Setup Time | Best For |
|--------|-------------|------------|----------|
| Railway Stack | **$0** | 30 min | Quick start |
| Render | **$0** | 20 min | All-in-one |
| AWS Free Tier | **$0** (12 mo) | 2 hours | Learning AWS |
| Google Cloud | **$0** + $300 | 1 hour | GEE integration |
| DigitalOcean | $60 | 1 week | Production |

---

## **🚀 QUICK START - FREE DEPLOYMENT**

### **Do This Now (30 Minutes):**

```bash
# 1. Push code to GitHub (5 min)
git init
git add .
git commit -m "Climate Portal v1.0"
git remote add origin https://github.com/yourusername/climate-portal.git
git push -u origin main

# 2. Deploy Backend to Railway (10 min)
- Sign up: https://railway.app
- New Project → Deploy from GitHub
- Select repo
- Add env variables
- Deploy

# 3. Create Supabase Database (5 min)
- Sign up: https://supabase.com
- New Project
- Enable PostGIS
- Copy connection string to Railway

# 4. Create Upstash Redis (5 min)
- Sign up: https://upstash.com
- Create database
- Copy URL to Railway

# 5. Deploy Frontend to Vercel (5 min)
- Sign up: https://vercel.com
- Import repo
- Set root to "frontend"
- Deploy

# DONE! Your portal is LIVE at:
# Frontend: https://your-project.vercel.app
# Backend: https://your-project.railway.app
```

---

## **🎓 FOR STUDENTS**

### **Additional Free Resources:**

**GitHub Student Developer Pack:**
- Free Domain from Namecheap (1 year)
- DigitalOcean $200 credit
- AWS $150 credit
- Azure $100 credit
- Heroku credits

**Apply at:** https://education.github.com/pack

**Requirements:**
- Student email address
- School ID or proof of enrollment

---

## **⚠️ FREE TIER LIMITATIONS**

### **What to Watch:**

**Railway (Free):**
- 500 hours/month
- Sleeps after 30 min inactivity
- Can be kept awake with cron job

**Supabase (Free):**
- 500MB database
- Pauses after 1 week inactivity
- Auto-wake on query

**Upstash (Free):**
- 10k commands/day
- ~416 commands/hour
- Fine for caching

**Vercel (Free):**
- Unlimited (perfect!)
- No limitations for your use case

---

## **🔄 KEEP FREE SERVICES ALIVE**

### **Prevent Sleep/Pause:**

**Create a Ping Service:**

```python
# ping_service.py
import requests
import time
from datetime import datetime

def ping_backend():
    """Keep Railway/Render awake"""
    try:
        response = requests.get("https://your-backend.railway.app/health")
        print(f"{datetime.now()}: Ping successful - {response.status_code}")
    except Exception as e:
        print(f"{datetime.now()}: Ping failed - {e}")

# Run every 25 minutes
while True:
    ping_backend()
    time.sleep(1500)  # 25 minutes
```

**Or use UptimeRobot (FREE):**
```bash
1. Sign up: https://uptimerobot.com
2. Add Monitor
3. Type: HTTP(s)
4. URL: https://your-backend.railway.app/health
5. Monitoring Interval: 5 minutes
6. This keeps your service awake 24/7!
```

---

## **✅ VERIFICATION**

### **Test Your Free Deployment:**

```bash
# Test backend
curl https://your-project.railway.app/health

# Should return:
{
  "status": "healthy",
  "gee_initialized": true,
  "redis_connected": true,
  "version": "2.0.0"
}

# Test frontend
Open: https://your-project.vercel.app
Should load your climate portal!

# Test API
curl https://your-project.railway.app/api/statistics/summary

# Should return climate statistics
```

---

## **🎯 NEXT STEPS**

After free deployment:

1. **Add Your Domain** (free from Freenom)
2. **Setup Monitoring** (Sentry - free)
3. **Add Analytics** (Google Analytics - free)
4. **Share Your Portal!** 🎉

---

## **💡 PRO TIPS**

### **Maximize Free Tiers:**

1. **Use Multiple Free Tiers:**
   - Frontend on Vercel (unlimited)
   - Backend on Railway (500 hrs)
   - DB on Supabase (500MB)
   - Redis on Upstash (10k/day)
   - CDN on Cloudflare (unlimited)

2. **GitHub Student Pack:**
   - Get $200-500 in free credits
   - Free domains
   - Enough for 6+ months

3. **Optimize for Free Tier:**
   - Enable caching (reduce DB queries)
   - Compress responses
   - Use CDN for static assets

4. **Keep Services Active:**
   - Use UptimeRobot
   - Query DB weekly
   - Keep Railway awake with pings

---

## **🎉 SUMMARY**

### **Your FREE Climate Portal:**

**Total Cost:** $0/month ✅

**What You Get:**
- ✅ Live website (HTTPS)
- ✅ Backend API (18 endpoints)
- ✅ PostgreSQL + PostGIS
- ✅ Redis caching
- ✅ Global CDN
- ✅ Auto-deploy from GitHub
- ✅ SSL certificates
- ✅ Professional URLs

**Perfect for:**
- ✅ Thesis project
- ✅ Demo/Portfolio
- ✅ Academic research
- ✅ Testing with real users
- ✅ First 1000 users

**Upgrade when:**
- Need more database (>500MB)
- Need 24/7 uptime
- Need >10k users/month
- Want custom domain (.com)

---

## **🚀 START NOW!**

**Recommended: Railway Stack** (30 minutes)

1. Sign up Railway: https://railway.app
2. Sign up Supabase: https://supabase.com
3. Sign up Upstash: https://upstash.com
4. Sign up Vercel: https://vercel.com
5. Push to GitHub
6. Deploy!

**Your portal will be LIVE in 30 minutes for $0!** 🎉

---

**Questions? Everything is FREE - just try it!** 💪

