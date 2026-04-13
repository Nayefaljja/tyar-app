// Language toggle and RTL support for Tyar website

document.addEventListener('DOMContentLoaded', function() {
    // Add language toggle button to header
    const addLanguageToggle = () => {
        const nav = document.querySelector('.nav-links');
        if (!nav) return;
        
        const languageToggle = document.createElement('li');
        languageToggle.className = 'language-toggle';
        languageToggle.innerHTML = `
            <a href="#" id="language-switch">
                <i class="fas fa-globe"></i> العربية
            </a>
        `;
        
        nav.appendChild(languageToggle);
        
        // Add language toggle to mobile menu
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-language-toggle';
        mobileNav.innerHTML = `
            <a href="#" id="mobile-language-switch">
                <i class="fas fa-globe"></i> العربية
            </a>
        `;
        
        const header = document.querySelector('header .container');
        if (header) {
            header.appendChild(mobileNav);
        }
        
        // Add event listeners to language toggle buttons
        document.getElementById('language-switch').addEventListener('click', toggleLanguage);
        document.getElementById('mobile-language-switch').addEventListener('click', toggleLanguage);
    };
    
    // Function to toggle between English and Arabic
    const toggleLanguage = (e) => {
        e.preventDefault();
        
        const html = document.documentElement;
        const isArabic = html.getAttribute('lang') === 'ar';
        
        if (isArabic) {
            // Switch to English
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            document.getElementById('language-switch').innerHTML = '<i class="fas fa-globe"></i> العربية';
            document.getElementById('mobile-language-switch').innerHTML = '<i class="fas fa-globe"></i> العربية';
            document.body.classList.remove('rtl');
            translateToEnglish();
        } else {
            // Switch to Arabic
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            document.getElementById('language-switch').innerHTML = '<i class="fas fa-globe"></i> English';
            document.getElementById('mobile-language-switch').innerHTML = '<i class="fas fa-globe"></i> English';
            document.body.classList.add('rtl');
            translateToArabic();
        }
    };
    
    // Function to translate content to Arabic
    const translateToArabic = () => {
        // Import translations
        const translations = window.translations;
        if (!translations) {
            console.error('Translations not found');
            return;
        }
        
        // Import Saudi data
        const saudiData = window.saudiData;
        if (!saudiData) {
            console.error('Saudi data not found');
            return;
        }
        
        // Translate navigation
        document.querySelectorAll('.nav-links li a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#marketplace') {
                link.textContent = translations.nav_marketplace;
            } else if (href === '#charger') {
                link.textContent = translations.nav_charger;
            } else if (href === '#maintenance') {
                link.textContent = translations.nav_maintenance;
            } else if (href === '#about') {
                link.textContent = translations.nav_about;
            } else if (href === '#contact') {
                link.textContent = translations.nav_contact;
            }
        });
        
        // Translate hero section
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            heroTitle.innerHTML = translations.hero_title + ' <span class="highlight">المستدام</span>';
        }
        
        const heroSubtitle = document.querySelector('.hero-content p');
        if (heroSubtitle) {
            heroSubtitle.textContent = translations.hero_subtitle;
        }
        
        const heroBrowseBtn = document.querySelector('.hero-buttons a[href="#marketplace"]');
        if (heroBrowseBtn) {
            heroBrowseBtn.textContent = translations.hero_button_browse;
        }
        
        const heroLearnBtn = document.querySelector('.hero-buttons a[href="#about"]');
        if (heroLearnBtn) {
            heroLearnBtn.textContent = translations.hero_button_learn;
        }
        
        // Translate services showcase section
        const servicesTitle = document.querySelector('.services-showcase .section-header h2');
        if (servicesTitle) {
            servicesTitle.textContent = translations.features_title;
        }
        
        const servicesSubtitle = document.querySelector('.services-showcase .section-header p');
        if (servicesSubtitle) {
            servicesSubtitle.textContent = translations.features_subtitle;
        }
        
        // Translate service icons
        const serviceIcons = document.querySelectorAll('.service-icon-container');
        if (serviceIcons.length >= 3) {
            // Marketplace icon
            serviceIcons[0].querySelector('h3').textContent = translations.feature_marketplace_title;
            
            // Charger icon
            serviceIcons[1].querySelector('h3').textContent = translations.feature_charger_title;
            
            // Maintenance icon
            serviceIcons[2].querySelector('h3').textContent = translations.feature_maintenance_title;
        }
        
        // Translate services description
        const servicesDescription = document.querySelector('.services-description p');
        if (servicesDescription) {
            servicesDescription.textContent = "في تيار، نحن ملتزمون بتقديم حلول شاملة للسيارات الكهربائية. يربط سوقنا المشترين بسيارات كهربائية مستعملة عالية الجودة، وتضمن خدمات التركيب لدينا شحنًا موثوقًا في المنزل أو العمل، وتحافظ جدولة الصيانة لدينا على سيارتك في حالة مثالية.";
        }
        
        // Translate services CTA
        const servicesCTA = document.querySelector('.services-cta a');
        if (servicesCTA) {
            servicesCTA.textContent = "تعرف على المزيد عن خدماتنا";
        }
        
        // Translate marketplace section
        const marketplaceTitle = document.querySelector('.marketplace .section-header h2');
        if (marketplaceTitle) {
            marketplaceTitle.textContent = translations.marketplace_title;
        }
        
        const marketplaceSubtitle = document.querySelector('.marketplace .section-header p');
        if (marketplaceSubtitle) {
            marketplaceSubtitle.textContent = translations.marketplace_subtitle;
        }
        
        // Update marketplace filters
        document.querySelector('label[for="model"]').textContent = translations.marketplace_model;
        document.querySelector('#model option:first-child').textContent = translations.marketplace_all_models;
        
        // Update model options with Saudi-specific models
        const modelSelect = document.getElementById('model');
        if (modelSelect) {
            // Clear existing options except the first one
            while (modelSelect.options.length > 1) {
                modelSelect.remove(1);
            }
            
            // Add Saudi-specific models
            saudiData.evModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model.name.toLowerCase().replace(/\s+/g, '-');
                option.textContent = model.name;
                modelSelect.appendChild(option);
            });
        }
        
        document.querySelector('label[for="price"]').textContent = translations.marketplace_price;
        document.querySelector('#price option:first-child').textContent = translations.marketplace_any_price;
        
        // Update price options with SAR
        const priceSelect = document.getElementById('price');
        if (priceSelect) {
            // Clear existing options except the first one
            while (priceSelect.options.length > 1) {
                priceSelect.remove(1);
            }
            
            // Add Saudi-specific price ranges
            const option1 = document.createElement('option');
            option1.value = '0-150000';
            option1.textContent = translations.marketplace_under + ' 150,000 ' + translations.currency;
            priceSelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = '150000-250000';
            option2.textContent = translations.marketplace_between + ' 150,000 - 250,000 ' + translations.currency;
            priceSelect.appendChild(option2);
            
            const option3 = document.createElement('option');
            option3.value = '250000-350000';
            option3.textContent = translations.marketplace_between + ' 250,000 - 350,000 ' + translations.currency;
            priceSelect.appendChild(option3);
            
            const option4 = document.createElement('option');
            option4.value = '350000+';
            option4.textContent = translations.marketplace_above + ' 350,000 ' + translations.currency;
            priceSelect.appendChild(option4);
        }
        
        document.querySelector('label[for="location"]').textContent = translations.marketplace_location;
        document.querySelector('#location').placeholder = translations.marketplace_location_placeholder;
        document.querySelector('.marketplace-filters .btn-primary').textContent = translations.marketplace_search;
        
        // Update marketplace listings with Saudi-specific models
        const listingCards = document.querySelectorAll('.listing-card');
        if (listingCards.length >= 2 && saudiData.evModels.length >= 2) {
            // Update first listing
            const firstListing = listingCards[0];
            firstListing.querySelector('h3').textContent = saudiData.evModels[0].name;
            firstListing.querySelector('.listing-price').textContent = saudiData.evModels[0].price;
            firstListing.querySelector('.listing-specs span:nth-child(1)').innerHTML = 
                `<i class="fas fa-road"></i> 15,000 ${translations.marketplace_miles}`;
            firstListing.querySelector('.listing-specs span:nth-child(2)').innerHTML = 
                `<i class="fas fa-battery-full"></i> ${saudiData.evModels[0].range} ${translations.marketplace_range}`;
            firstListing.querySelector('.listing-specs span:nth-child(3)').innerHTML = 
                `<i class="fas fa-map-marker-alt"></i> ${saudiData.serviceCities[0].name}`;
            firstListing.querySelector('.btn-secondary').textContent = translations.marketplace_contact_seller;
            
            // Update second listing
            const secondListing = listingCards[1];
            secondListing.querySelector('h3').textContent = saudiData.evModels[1].name;
            secondListing.querySelector('.listing-price').textContent = saudiData.evModels[1].price;
            secondListing.querySelector('.listing-specs span:nth-child(1)').innerHTML = 
                `<i class="fas fa-road"></i> 8,200 ${translations.marketplace_miles}`;
            secondListing.querySelector('.listing-specs span:nth-child(2)').innerHTML = 
                `<i class="fas fa-battery-full"></i> ${saudiData.evModels[1].range} ${translations.marketplace_range}`;
            secondListing.querySelector('.listing-specs span:nth-child(3)').innerHTML = 
                `<i class="fas fa-map-marker-alt"></i> ${saudiData.serviceCities[1].name}`;
            secondListing.querySelector('.btn-secondary').textContent = translations.marketplace_contact_seller;
        }
        
        // Translate marketplace CTA
        const marketplaceCta = document.querySelector('.marketplace-cta');
        if (marketplaceCta) {
            marketplaceCta.querySelector('h3').textContent = translations.marketplace_sell_title;
            marketplaceCta.querySelector('p').textContent = translations.marketplace_sell_desc;
            marketplaceCta.querySelector('.btn-primary').textContent = translations.marketplace_post_ev;
        }
        
        // Translate charger installation section
        const chargerTitle = document.querySelector('.charger-installation .section-header h2');
        if (chargerTitle) {
            chargerTitle.textContent = translations.charger_title;
        }
        
        const chargerSubtitle = document.querySelector('.charger-installation .section-header p');
        if (chargerSubtitle) {
            chargerSubtitle.textContent = translations.charger_subtitle;
        }
        
        // Translate charger types
        const chargerTypes = document.querySelectorAll('.charger-type');
        if (chargerTypes.length >= 2) {
            chargerTypes[0].querySelector('h3').textContent = translations.charger_home_title;
            chargerTypes[0].querySelector('p').textContent = translations.charger_home_desc;
            
            chargerTypes[1].querySelector('h3').textContent = translations.charger_commercial_title;
            chargerTypes[1].querySelector('p').textContent = translations.charger_commercial_desc;
        }
        
        // Translate installation process
        const installationProcess = document.querySelector('.installation-process');
        if (installationProcess) {
            installationProcess.querySelector('h3').textContent = translations.charger_process_title;
            
            const processSteps = installationProcess.querySelectorAll('.process-step');
            if (processSteps.length >= 4) {
                processSteps[0].querySelector('h4').textContent = translations.charger_step1_title;
                processSteps[0].querySelector('p').textContent = translations.charger_step1_desc;
                
                processSteps[1].querySelector('h4').textContent = translations.charger_step2_title;
                processSteps[1].querySelector('p').textContent = translations.charger_step2_desc;
                
                processSteps[2].querySelector('h4').textContent = translations.charger_step3_title;
                processSteps[2].querySelector('p').textContent = translations.charger_step3_desc;
                
                processSteps[3].querySelector('h4').textContent = translations.charger_step4_title;
                processSteps[3].querySelector('p').textContent = translations.charger_step4_desc;
            }
        }
        
        // Translate charger form
        const chargerForm = document.querySelector('.charger-form');
        if (chargerForm) {
            chargerForm.querySelector('h3').textContent = translations.charger_form_title;
            
            chargerForm.querySelector('label[for="name"]').textContent = translations.charger_form_name;
            chargerForm.querySelector('label[for="email"]').textContent = translations.charger_form_email;
            chargerForm.querySelector('label[for="phone"]').textContent = translations.charger_form_phone;
            chargerForm.querySelector('label[for="address"]').textContent = translations.charger_form_address;
            chargerForm.querySelector('label[for="building-type"]').textContent = translations.charger_form_building;
            
            const buildingTypeSelect = chargerForm.querySelector('#building-type');
            if (buildingTypeSelect) {
                buildingTypeSelect.querySelector('option:first-child').textContent = translations.charger_form_select_type;
                buildingTypeSelect.querySelector('option[value="single-family"]').textContent = translations.charger_form_single_family;
                buildingTypeSelect.querySelector('option[value="multi-unit"]').textContent = translations.charger_form_multi_unit;
                buildingTypeSelect.querySelector('option[value="commercial"]').textContent = translations.charger_form_commercial;
            }
            
            chargerForm.querySelector('label[for="message"]').textContent = translations.charger_form_additional;
            chargerForm.querySelector('button[type="submit"]').textContent = translations.charger_form_submit;
        }
        
        // Translate status tracker if it exists
        const statusTracker = document.querySelector('.status-tracker');
        if (statusTracker) {
            statusTracker.querySelector('h3').textContent = translations.charger_status_title;
            statusTracker.querySelector('p').textContent = translations.charger_status_desc;
            statusTracker.querySelector('#request-id').placeholder = translations.charger_status_placeholder;
            statusTracker.querySelector('#check-status').textContent = translations.charger_status_check;
        }
        
        // Translate maintenance section
        const maintenanceTitle = document.querySelector('.maintenance .section-header h2');
        if (maintenanceTitle) {
            maintenanceTitle.textContent = translations.maintenance_title;
        }
        
        const maintenanceSubtitle = document.querySelector('.maintenance .section-header p');
        if (maintenanceSubtitle) {
            maintenanceSubtitle.textContent = translations.maintenance_subtitle;
        }
        
        // Translate service cards
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length >= 4) {
            serviceCards[0].querySelector('h3').textContent = translations.maintenance_battery_title;
            serviceCards[0].querySelector('p').textContent = translations.maintenance_battery_desc;
            
            serviceCards[1].querySelector('h3').textContent = translations.maintenance_general_title;
            serviceCards[1].querySelector('p').textContent = translations.maintenance_general_desc;
            
            serviceCards[2].querySelector('h3').textContent = translations.maintenance_software_title;
            serviceCards[2].querySelector('p').textContent = translations.maintenance_software_desc;
            
            serviceCards[3].querySelector('h3').textContent = translations.maintenance_tire_title;
            serviceCards[3].querySelector('p').textContent = translations.maintenance_tire_desc;
        }
        
        // Translate scheduling system
        const schedulingSystem = document.querySelector('.scheduling-system');
        if (schedulingSystem) {
            schedulingSystem.querySelector('h3').textContent = translations.maintenance_schedule_title;
            
            schedulingSystem.querySelector('label[for="service-type"]').textContent = translations.maintenance_service_type;
            const serviceTypeSelect = schedulingSystem.querySelector('#service-type');
            if (serviceTypeSelect) {
                serviceTypeSelect.querySelector('option:first-child').textContent = translations.maintenance_select_service;
                serviceTypeSelect.querySelector('option[value="battery"]').textContent = translations.maintenance_battery_title;
                serviceTypeSelect.querySelector('option[value="general"]').textContent = translations.maintenance_general_title;
                serviceTypeSelect.querySelector('option[value="software"]').textContent = translations.maintenance_software_title;
                serviceTypeSelect.querySelector('option[value="tire"]').textContent = translations.maintenance_tire_title;
            }
            
            schedulingSystem.querySelector('label[for="vehicle-model"]').textContent = translations.maintenance_vehicle_model;
            const vehicleModelSelect = schedulingSystem.querySelector('#vehicle-model');
            if (vehicleModelSelect) {
                // Clear existing options except the first one
                while (vehicleModelSelect.options.length > 1) {
                    vehicleModelSelect.remove(1);
                }
                
                vehicleModelSelect.querySelector('option:first-child').textContent = translations.maintenance_select_model;
                
                // Add Saudi-specific models
                saudiData.evModels.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.name.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = model.name;
                    vehicleModelSelect.appendChild(option);
                });
                
                // Add "Other" option
                const otherOption = document.createElement('option');
                otherOption.value = "other";
                otherOption.textContent = "أخرى (حدد في الملاحظات)";
                vehicleModelSelect.appendChild(otherOption);
            }
            
            schedulingSystem.querySelector('label[for="service-date"]').textContent = translations.maintenance_preferred_date;
            schedulingSystem.querySelector('label[for="service-time"]').textContent = translations.maintenance_preferred_time;
            
            const serviceTimeSelect = schedulingSystem.querySelector('#service-time');
            if (serviceTimeSelect) {
                serviceTimeSelect.querySelector('option:first-child').textContent = translations.maintenance_select_time;
                serviceTimeSelect.querySelector('option[value="morning"]').textContent = translations.maintenance_morning;
                serviceTimeSelect.querySelector('option[value="afternoon"]').textContent = translations.maintenance_afternoon;
                serviceTimeSelect.querySelector('option[value="evening"]').textContent = translations.maintenance_evening;
            }
            
            schedulingSystem.querySelector('label[for="service-location"]').textContent = translations.maintenance_service_location;
            const serviceLocationSelect = schedulingSystem.querySelector('#service-location');
            if (serviceLocationSelect) {
                // Clear existing options except the first one
                while (serviceLocationSelect.options.length > 1) {
                    serviceLocationSelect.remove(1);
                }
                
                serviceLocationSelect.querySelector('option:first-child').textContent = translations.maintenance_select_location;
                
                // Add Saudi cities
                saudiData.serviceCities.forEach((city, index) => {
                    const option = document.createElement('option');
                    option.value = city.nameEn.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = `${city.name} ${city.centers[0]}`;
                    serviceLocationSelect.appendChild(option);
                });
            }
            
            schedulingSystem.querySelector('label[for="contact-preference"]').textContent = translations.maintenance_contact_preference;
            
            const contactPreferences = schedulingSystem.querySelectorAll('.checkbox-group label');
            if (contactPreferences.length >= 3) {
                contactPreferences[0].childNodes[1].textContent = ` ${translations.maintenance_email}`;
                contactPreferences[1].childNodes[1].textContent = ` ${translations.maintenance_sms}`;
                contactPreferences[2].childNodes[1].textContent = ` ${translations.maintenance_push}`;
            }
            
            schedulingSystem.querySelector('button[type="submit"]').textContent = translations.maintenance_schedule_button;
        }
        
        // Translate reminder settings if they exist
        const reminderSettings = document.querySelector('.reminder-settings');
        if (reminderSettings) {
            reminderSettings.querySelector('h4').textContent = "تفضيلات التذكير";
            
            const reminderOptions = reminderSettings.querySelectorAll('.reminder-option label');
            if (reminderOptions.length >= 3) {
                reminderOptions[0].childNodes[1].textContent = " قبل الموعد بيوم";
                reminderOptions[1].childNodes[1].textContent = " صباح يوم الموعد";
                reminderOptions[2].childNodes[1].textContent = " قبل الموعد بساعة";
            }
        }
        
        // Translate about section
        const aboutTitle = document.querySelector('.about .section-header h2');
        if (aboutTitle) {
            aboutTitle.textContent = translations.about_title;
        }
        
        const aboutSubtitle = document.querySelector('.about .section-header p');
        if (aboutSubtitle) {
            aboutSubtitle.textContent = translations.about_subtitle;
        }
        
        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            aboutText.querySelector('h3:nth-of-type(1)').textContent = translations.about_mission_title;
            aboutText.querySelector('p:nth-of-type(1)').textContent = translations.about_mission_desc;
            
            aboutText.querySelector('h3:nth-of-type(2)').textContent = translations.about_commitment_title;
            aboutText.querySelector('p:nth-of-type(2)').textContent = translations.about_commitment_desc;
        }
        
        const ecoStats = document.querySelectorAll('.stat');
        if (ecoStats.length >= 3) {
            ecoStats[0].querySelector('p').textContent = translations.about_stats_chargers;
            ecoStats[1].querySelector('p').textContent = translations.about_stats_evs;
            ecoStats[2].querySelector('p').textContent = translations.about_stats_services;
        }
        
        // Translate contact section
        const contactTitle = document.querySelector('.contact .section-header h2');
        if (contactTitle) {
            contactTitle.textContent = translations.contact_title;
        }
        
        const contactSubtitle = document.querySelector('.contact .section-header p');
        if (contactSubtitle) {
            contactSubtitle.textContent = translations.contact_subtitle;
        }
        
        const contactItems = document.querySelectorAll('.contact-item');
        if (contactItems.length >= 3) {
            contactItems[0].querySelector('h3').textContent = translations.contact_address_title;
            contactItems[1].querySelector('h3').textContent = translations.contact_phone_title;
            contactItems[2].querySelector('h3').textContent = translations.contact_email_title;
        }
        
        // Update address to Saudi address
        const addressText = contactItems[0].querySelector('p');
        if (addressText) {
            addressText.innerHTML = "123 شارع الطاقة الخضراء<br>الرياض، المملكة العربية السعودية";
        }
        
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.querySelector('label[for="contact-name"]').textContent = translations.contact_form_name;
            contactForm.querySelector('label[for="contact-email"]').textContent = translations.contact_form_email;
            contactForm.querySelector('label[for="contact-subject"]').textContent = translations.contact_form_subject;
            contactForm.querySelector('label[for="contact-message"]').textContent = translations.contact_form_message;
            contactForm.querySelector('button[type="submit"]').textContent = translations.contact_form_send;
        }
        
        // Translate footer
        const footerColumns = document.querySelectorAll('.footer-column');
        if (footerColumns.length >= 3) {
            footerColumns[0].querySelector('h3').textContent = translations.footer_services;
            footerColumns[1].querySelector('h3').textContent = translations.footer_company;
            footerColumns[2].querySelector('h3').textContent = translations.footer_legal;
            
            // Translate footer links
            const servicesLinks = footerColumns[0].querySelectorAll('a');
            if (servicesLinks.length >= 3) {
                servicesLinks[0].textContent = translations.nav_marketplace;
                servicesLinks[1].textContent = translations.nav_charger;
                servicesLinks[2].textContent = translations.nav_maintenance;
            }
            
            const companyLinks = footerColumns[1].querySelectorAll('a');
            if (companyLinks.length >= 3) {
                companyLinks[0].textContent = translations.nav_about;
                companyLinks[1].textContent = translations.nav_contact;
                companyLinks[2].textContent = translations.footer_careers;
            }
            
            const legalLinks = footerColumns[2].querySelectorAll('a');
            if (legalLinks.length >= 3) {
                legalLinks[0].textContent = translations.footer_privacy;
                legalLinks[1].textContent = translations.footer_terms;
                legalLinks[2].textContent = translations.footer_cookie;
            }
        }
        
        const footerBottom = document.querySelector('.footer-bottom');
        if (footerBottom) {
            const copyright = footerBottom.querySelector('p');
            if (copyright) {
                copyright.textContent = `© 2025 تيار. ${translations.footer_copyright}.`;
            }
            
            const ecoBadge = footerBottom.querySelector('.eco-badge');
            if (ecoBadge) {
                ecoBadge.textContent = translations.footer_eco_badge;
                // Re-add the leaf icon
                const leafIcon = document.createElement('i');
                leafIcon.className = 'fas fa-leaf';
                ecoBadge.prepend(leafIcon);
                ecoBadge.prepend(' ');
            }
        }
    };
    
    // Function to translate content back to English
    const translateToEnglish = () => {
        // Reload the page to restore English content
        // This is a simple approach; in a production environment, 
        // you would implement a more sophisticated solution
        window.location.reload();
    };
    
    // Add RTL styles
    const addRtlStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* RTL Styles */
            body.rtl {
                font-family: 'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            body.rtl * {
                letter-spacing: 0;
            }
            
            body.rtl .nav-links li {
                margin-right: 30px;
                margin-left: 0;
            }
            
            body.rtl .hero-content {
                padding-left: 50px;
                padding-right: 0;
            }
            
            body.rtl .feature-icon,
            body.rtl .service-icon {
                margin-left: 0;
            }
            
            body.rtl .listing-specs span i,
            body.rtl .service-meta span i {
                margin-left: 5px;
                margin-right: 0;
            }
            
            body.rtl .process-step {
                flex-direction: row-reverse;
            }
            
            body.rtl .step-number {
                margin-left: 15px;
                margin-right: 0;
            }
            
            body.rtl .checkbox-group label,
            body.rtl .reminder-option label {
                flex-direction: row-reverse;
            }
            
            body.rtl .checkbox-group label input,
            body.rtl .reminder-option label input {
                margin-left: 8px;
                margin-right: 0;
            }
            
            body.rtl .contact-item {
                flex-direction: row-reverse;
            }
            
            body.rtl .contact-item i {
                margin-left: 15px;
                margin-right: 0;
            }
            
            body.rtl .service-includes {
                padding-right: 20px;
                padding-left: 0;
            }
            
            body.rtl .eco-badge i {
                margin-left: 10px;
                margin-right: 0;
            }
            
            /* Mobile language toggle */
            .mobile-language-toggle {
                display: none;
                margin-right: 20px;
            }
            
            .mobile-language-toggle a {
                color: var(--primary-color);
                font-weight: 500;
            }
            
            @media (max-width: 768px) {
                .language-toggle {
                    display: none;
                }
                
                .mobile-language-toggle {
                    display: block;
                }
                
                body.rtl .mobile-language-toggle {
                    margin-left: 20px;
                    margin-right: 0;
                }
            }
            
            /* Add Tajawal font for Arabic */
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
        `;
        
        document.head.appendChild(style);
    };
    
    // Initialize localization
    const initLocalization = () => {
        // Add language toggle
        addLanguageToggle();
        
        // Add RTL styles
        addRtlStyles();
        
        // Load translations and Saudi data
        const loadScripts = () => {
            // Load Arabic translations
            const translationsScript = document.createElement('script');
            translationsScript.src = 'arabic-translations.js';
            document.body.appendChild(translationsScript);
            
            // Load Saudi data
            const saudiDataScript = document.createElement('script');
            saudiDataScript.src = 'saudi-data.js';
            document.body.appendChild(saudiDataScript);
            
            // Make translations and data available globally
            translationsScript.onload = function() {
                window.translations = translations;
            };
            
            saudiDataScript.onload = function() {
                window.saudiData = saudiData;
            };
        };
        
        loadScripts();
    };
    
    // Initialize localization
    initLocalization();
});
