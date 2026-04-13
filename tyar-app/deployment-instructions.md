# Tyar Website - Deployment Instructions

This document provides instructions for deploying the Tyar website to your own hosting service with your custom domain (tyar.my).

## Website Files Overview

The website consists of the following files:

- **HTML Files**:
  - `index.html` - Homepage with all sections
  - `marketplace.html` - EV Marketplace page
  - `charger.html` - Charger Installation page
  - `maintenance.html` - Maintenance page

- **CSS Files**:
  - `styles.css` - Main stylesheet
  - `branding.css` - Brand-specific styles
  - `service-icons.css` - Styles for service icons

- **JavaScript Files**:
  - `script.js` - Main JavaScript functionality
  - `charger-installation.js` - Charger installation functionality
  - `maintenance-scheduling.js` - Maintenance scheduling functionality
  - `localization.js` - Language switching functionality
  - `arabic-translations.js` - Arabic translations
  - `saudi-data.js` - Saudi Arabia specific data

- **Image Files**:
  - `images/tyar-logo-transparent.png` - Transparent logo
  - `images/tyar-logo.png` - Original logo
  - `images/desert_ev_hero.jpeg` - Hero image

## Deployment Steps

### 1. Choose a Web Hosting Provider

Select a web hosting provider that supports:
- Static website hosting
- Custom domain configuration
- SSL certificate (for https)

Popular options include:
- Netlify
- Vercel
- Amazon S3 + CloudFront
- GitHub Pages
- Traditional web hosts like Bluehost, HostGator, etc.

### 2. Upload Website Files

Most hosting providers offer one of these methods to upload files:

**FTP Upload**:
- Use an FTP client (like FileZilla)
- Connect to your hosting using credentials provided by your host
- Upload all files maintaining the same directory structure

**Web Interface Upload**:
- Log in to your hosting control panel
- Navigate to file manager
- Upload all files and folders

**Git-based Deployment** (for Netlify, Vercel, GitHub Pages):
- Create a repository with these files
- Connect your repository to the deployment platform

### 3. Configure Your Domain

1. Log in to your domain registrar where tyar.my is registered
2. Navigate to DNS settings
3. Add/update the following records:

For most hosting providers:
- Type: A Record
- Name: @ (or leave blank)
- Value: IP address provided by your hosting company

For Netlify/Vercel:
- Type: CNAME
- Name: www
- Value: Your netlify/vercel subdomain (e.g., tyar-website.netlify.app)

Additionally:
- Add another A record or CNAME for "www" subdomain
- Set up URL redirects if needed (www to non-www or vice versa)

### 4. SSL Certificate

For secure HTTPS:
- Many hosts offer free Let's Encrypt certificates
- Enable SSL/HTTPS in your hosting control panel
- Some services like Netlify and Vercel handle this automatically

### 5. Test Your Website

After deployment:
- Visit your domain (tyar.my) to verify it loads correctly
- Test on different devices and browsers
- Check all links and functionality
- Verify language switching works properly

## Making Future Updates

To update your website in the future:

1. Edit the HTML, CSS, or JavaScript files as needed
2. Upload the modified files to your hosting using the same method as initial deployment
3. If using git-based deployment, commit and push your changes

## Support

If you need assistance with deployment or have questions about the website files, please reach out for support.
