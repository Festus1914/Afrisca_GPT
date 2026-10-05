# Deployment Guide

## Quick Start

### 1. Build the Application

```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

### 2. Set Environment Variables

In your hosting provider, set:
```
OPENAI_API_KEY=sk-your-actual-api-key
```

### 3. Start Production Server

```bash
npm run start
```

The app will run on `http://localhost:3000` (or specified port).

## Deployment Options

### Vercel (Recommended for Next.js)

1. **Connect GitHub Repository**
   ```bash
   git push origin main
   ```

2. **Import on Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Vercel auto-detects Next.js settings

3. **Add Environment Variables**
   - Project Settings → Environment Variables
   - Add `OPENAI_API_KEY`
   - Make sure it's accessible in all environments

4. **Deploy**
   - Click Deploy
   - Wait for build and deployment
   - Your app is live!

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t afrisca-gpt .
docker run -e OPENAI_API_KEY=sk-your-key -p 3000:3000 afrisca-gpt
```

### AWS EC2

1. **Launch EC2 Instance** (Ubuntu 20.04)
   ```bash
   # SSH into instance
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and Setup**
   ```bash
   git clone your-repo.git
   cd afrisca-gpt
   npm install
   npm run build
   ```

4. **Set Environment Variables**
   ```bash
   export OPENAI_API_KEY=sk-your-key
   ```

5. **Run with PM2** (for background process)
   ```bash
   npm install -g pm2
   pm2 start "npm start" --name "afrisca-gpt"
   pm2 save
   ```

### Google Cloud Run

1. **Create Dockerfile** (see Docker section)

2. **Deploy**
   ```bash
   gcloud run deploy afrisca-gpt \
     --source . \
     --platform managed \
     --region us-central1 \
     --set-env-vars OPENAI_API_KEY=sk-your-key
   ```

### DigitalOcean App Platform

1. Create a `app.yaml`:

```yaml
name: afrisca-gpt
services:
- name: api
  github:
    repo: yourusername/afrisca-gpt
    branch: main
  build_command: npm run build
  run_command: npm start
  envs:
  - key: NODE_ENV
    value: production
  - key: OPENAI_API_KEY
    value: ${OPENAI_API_KEY}
    scope: RUN_AND_BUILD_TIME
```

2. Deploy through DigitalOcean dashboard or CLI

## Production Checklist

- [ ] API key is securely set in environment variables
- [ ] HTTPS is enabled (all hosting provides this by default)
- [ ] Rate limiting is active and tuned appropriately
- [ ] Error logs are being monitored
- [ ] API usage is being tracked (prevent bill shock)
- [ ] Database backups are configured (if applicable)
- [ ] Custom domain is configured
- [ ] SSL certificate is valid
- [ ] Analytics/monitoring is set up
- [ ] Documentation is updated

## Monitoring

### View Logs

**Vercel:**
```
Dashboard → Function Logs
```

**Your Server:**
```bash
tail -f /var/log/app.log
pm2 logs afrisca-gpt
```

### Monitor API Costs

Visit [OpenAI Platform](https://platform.openai.com/account/billing/overview) to:
- View current usage
- Set spending limits
- View cost breakdown by model

## Scaling Considerations

### If traffic increases:

1. **Switch to Vercel Pro** for higher concurrency
2. **Implement caching** for generated content
3. **Use Redis** for distributed rate limiting (not in-memory)
4. **Database** for storing user data and generations
5. **CDN** for static assets
6. **Load balancing** if self-hosting

### Cost Optimization

- Cache image generation results
- Implement queue system for heavy operations
- Use cheaper model alternatives where appropriate
- Set API rate limits to control costs
- Monitor usage patterns

## Troubleshooting Deployment

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### API Key Not Found
```bash
# Verify variable is set
echo $OPENAI_API_KEY

# Check Vercel environment
vercel env ls
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

## Security Checklist

- [ ] No hardcoded API keys in code
- [ ] `.env.local` is in `.gitignore`
- [ ] Input validation active
- [ ] Rate limiting active
- [ ] HTTPS enforced
- [ ] Sensitive errors sanitized
- [ ] Logs don't contain API keys
- [ ] Regular security updates

## Rollback

If something breaks:

**Vercel:**
- Deployments tab → Select previous version → Promote

**Manual:**
```bash
git revert <commit-hash>
npm run build
npm start
```

## Support

For deployment issues:
1. Check logs for error messages
2. Verify environment variables
3. Ensure API key is valid
4. Check rate limits aren't exceeded
5. Review OpenAI API status
