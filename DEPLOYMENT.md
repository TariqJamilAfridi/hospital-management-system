# Deployment Guide

This guide covers deploying the CarePlus Hospital Management System to production environments.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] Production domain ready
- [ ] SSL certificate obtained
- [ ] Payment gateway credentials verified
- [ ] Security audit completed
- [ ] Performance testing done

## 🚀 Deployment Options

### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

#### Frontend Deployment (Vercel)

1. **Prepare the application**
   ```bash
   npm run build
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set environment variables** in Vercel dashboard:
   - `REACT_APP_API_URL` - Your backend API URL

#### Backend Deployment (Render)

1. **Create a `render.yaml`** in the backend directory:
   ```yaml
   services:
     - type: web
       name: careplus-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 5000
         - key: MONGO_URI
           sync: false
         - key: SAFEPAY_API_KEY
           sync: false
   ```

2. **Connect your GitHub repository** to Render

3. **Set environment variables** in Render dashboard

4. **Deploy** - Render will auto-deploy on push to main branch

### Option 2: Deploy to Heroku

#### Backend Deployment

1. **Create a Heroku app**
   ```bash
   heroku create careplus-backend
   ```

2. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI="your_mongodb_uri"
   heroku config:set SAFEPAY_API_KEY="your_key"
   ```

3. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

#### Frontend Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create careplus-frontend
   heroku buildpacks:set mars/create-react-app
   git push heroku main
   ```

### Option 3: Deploy to AWS

#### Backend (EC2 + MongoDB Atlas)

1. **Set up EC2 instance**
   - Launch Ubuntu 22.04 LTS instance
   - Configure security groups (ports 80, 443, 22)

2. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx
   ```

3. **Clone repository**
   ```bash
   git clone your-repo-url
   cd hospital-management-system/backend
   npm install
   ```

4. **Set up PM2** for process management
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name careplus-backend
   pm2 startup
   pm2 save
   ```

5. **Configure Nginx** as reverse proxy
   ```nginx
   server {
       listen 80;
       server_name api.yourdomai.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Frontend (S3 + CloudFront)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Create S3 bucket**
   - Enable static website hosting
   - Set bucket policy for public read access

3. **Upload build files**
   ```bash
   aws s3 sync build/ s3://your-bucket-name
   ```

4. **Set up CloudFront distribution**
   - Point origin to S3 bucket
   - Configure SSL certificate
   - Set up custom domain

### Option 4: Docker Deployment

#### Create Docker files

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
    depends_on:
      - mongodb

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

#### Deploy with Docker

```bash
docker-compose up -d
```

## 🔒 Security Considerations

### Environment Variables

Never commit `.env` files. Use environment variable management:
- **Vercel**: Use Vercel dashboard
- **Heroku**: Use `heroku config:set`
- **AWS**: Use AWS Systems Manager Parameter Store
- **Docker**: Use Docker secrets

### SSL/TLS

Always use HTTPS in production:
- **Let's Encrypt**: Free SSL certificates
- **Cloudflare**: Free SSL with CDN
- **AWS Certificate Manager**: Free for AWS resources

### Database Security

- Use MongoDB Atlas with IP whitelisting
- Enable authentication
- Use strong passwords
- Regular backups
- Enable encryption at rest

### API Security

- Implement rate limiting
- Use CORS properly
- Validate all inputs
- Sanitize user data
- Use helmet.js for Express
- Keep dependencies updated

## 📊 Monitoring & Logging

### Application Monitoring

- **Sentry**: Error tracking
- **New Relic**: Performance monitoring
- **LogRocket**: Session replay
- **Google Analytics**: User analytics

### Server Monitoring

- **PM2**: Process monitoring
- **Datadog**: Infrastructure monitoring
- **CloudWatch**: AWS monitoring
- **Uptime Robot**: Uptime monitoring

### Setup Logging

```javascript
// Add to backend
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 Performance Optimization

### Frontend

- Enable gzip compression
- Use CDN for static assets
- Implement code splitting
- Lazy load components
- Optimize images
- Use React.memo for expensive components
- Implement service workers (PWA)

### Backend

- Enable compression middleware
- Use database indexing
- Implement caching (Redis)
- Use connection pooling
- Optimize queries
- Enable HTTP/2

### Database

- Create indexes for frequently queried fields
- Use aggregation pipelines
- Implement pagination
- Regular database maintenance
- Monitor slow queries

## 🔥 Rollback Strategy

### Quick Rollback

1. **Vercel**: Use deployment history
   ```bash
   vercel rollback
   ```

2. **Heroku**: Rollback release
   ```bash
   heroku rollback
   ```

3. **Git**: Revert commit
   ```bash
   git revert HEAD
   git push origin main
   ```

## 📞 Post-Deployment

### Verification Checklist

- [ ] All pages load correctly
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] Payment integration functional
- [ ] Email notifications working
- [ ] Forms submit successfully
- [ ] Mobile responsiveness verified
- [ ] SSL certificate active
- [ ] Monitoring tools active
- [ ] Error tracking configured

### Support

For deployment support:
- Email: info@careplushospital.com
- Documentation: Check README.md
- Issues: GitHub Issues

---

**Last Updated:** September 19, 2026
