# Afrisca GPT - Complete Setup Guide

## Overview

Afrisca GPT is a full-featured AI platform with 8 phases of functionality ready to use.

## Getting Started (5 minutes)

### Step 1: Get OpenAI API Key

1. Visit [openai.com/api](https://openai.com/api)
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy the key (starts with `sk-`)

### Step 2: Configure Environment

1. Open `.env.local` in project root
2. Add your API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Save file

### Step 3: Start Development Server

```bash
npm run dev -- --webpack
```

Open `http://localhost:3000` in browser

## Features at a Glance

| Feature | Page | What It Does |
|---------|------|------------|
| **Chat** | `/` | Ask questions with Afrisca context |
| **Generate** | `/image-generation` | Create images from text |
| **Edit** | `/image-editor` | Edit existing images |
| **Analyze** | `/image-analysis` | Ask AI about images |
| **Write** | `/writing-tools` | Generate marketing content |

## Project Structure

```
afrisca-gpt/
├── app/
│   ├── api/                    # Backend API routes
│   ├── components/             # Reusable components
│   ├── [pages]/               # Page components
│   ├── globals.css            # Styling
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Chat page
├── lib/
│   ├── afrisca-knowledge.ts   # Business context
│   ├── rate-limit.ts          # Request limiting
│   └── validation.ts          # Input validation
├── .env.local                 # API keys (DON'T COMMIT)
├── .env.example               # Template
├── package.json               # Dependencies
└── README.md                  # Full docs
```

## Security Checklist

✅ API keys in `.env.local` only
✅ Rate limiting: 30 requests/minute
✅ Input validation on all fields
✅ Error messages don't expose secrets
✅ HTTPS recommended for production

## Development Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev -- --webpack

# Build for production
npm run build

# Start production server
npm run start
```

## Testing Each Feature

### 1. Chat
Go to `/` and type: "What products does Afrisca offer?"

### 2. Image Generation
Go to `/image-generation`
- Prompt: "Premium leather handbag"
- Size: Square
- Click "Generate Image"

### 3. Image Editor
Go to `/image-editor`
- Upload any image
- Select "Clean White Background"
- Click "Edit Image"

### 4. Image Analysis
Go to `/image-analysis`
- Upload a product image
- Ask: "What's the quality of this product?"

### 5. Writing Tools
Go to `/writing-tools`
- Select "Instagram Captions"
- Input: "Handmade leather products"
- Click "Generate Content"

## Customization

### Update Business Info
File: `lib/afrisca-knowledge.ts`

Change these sections:
- `BRAND INFORMATION`
- `LOCATIONS`
- `CONTACT INFORMATION`
- `PRICING STRUCTURE`

### Adjust Rate Limits
File: `lib/rate-limit.ts`

```typescript
const RATE_LIMIT_MAX = 30;      // Change from 30 to your preferred number
const RATE_LIMIT_WINDOW = 60000; // Change from 1 min to your preferred time
```

### Add New Writing Types
File: `app/writing-tools/page.tsx`

Add to `CONTENT_TYPES` array, then add prompt to API.

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "OpenAI API key not found" | Check `.env.local` has correct key |
| "Port 3000 already in use" | Kill process: `lsof -ti:3000 \| xargs kill -9` |
| "Dev server won't start" | Clear cache: `rm -rf .next && npm install` |
| "Rate limit exceeded" | Wait 1 minute or increase `RATE_LIMIT_MAX` |
| "Image generation timeout" | Normal, takes 30-60 seconds |

## Deployment Guide

### Option 1: Vercel (Easiest)
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repository
4. Add environment variable: `OPENAI_API_KEY`
5. Click Deploy

### Option 2: Your Server
```bash
npm run build
npm run start
```

See `DEPLOYMENT.md` for more options (Docker, AWS, etc).

## Cost Management

### Typical Costs
- Chat message: $0.001-0.002
- Image generation: $0.08 per image
- Image edit: $0.02 per edit
- Image analysis: $0.001 per analysis

### Cost Controls
1. Set budget in OpenAI dashboard
2. Monitor usage: `openai.com/account/billing`
3. Rate limiting prevents overuse
4. Review monthly spend

## Next Steps

1. ✅ Set up API key in `.env.local`
2. ✅ Run `npm run dev -- --webpack`
3. ✅ Test all 5 features
4. ✅ Update business info in `lib/afrisca-knowledge.ts`
5. ✅ Deploy using Vercel or your server

## Need Help?

1. Check `README.md` for full documentation
2. Review `DEPLOYMENT.md` for deployment options
3. Check `.env.example` for configuration template
4. Review error messages in browser console (F12)

---

**Ready to go!** 🚀

```bash
npm run dev -- --webpack
```

Visit: http://localhost:3000
