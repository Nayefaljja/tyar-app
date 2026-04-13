// Additional JavaScript for Maintenance Scheduling Section

document.addEventListener('DOMContentLoaded', function() {
    // Create interactive calendar for maintenance scheduling
    const createSchedulingCalendar = () => {
        const serviceDate = document.getElementById('service-date');
        if (!serviceDate) return;
        
        // Add min date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        serviceDate.min = tomorrow.toISOString().split('T')[0];
        
        // Add max date (3 months from now)
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        serviceDate.max = maxDate.toISOString().split('T')[0];
        
        // Create availability display
        const availabilityContainer = document.createElement('div');
        availabilityContainer.className = 'availability-display';
        availabilityContainer.innerHTML = `
            <h4>Available Time Slots</h4>
            <p class="availability-date">Select a date to see available time slots</p>
            <div class="time-slots" id="time-slots"></div>
        `;
        
        // Insert after service time dropdown
        const serviceTime = document.getElementById('service-time');
        serviceTime.parentNode.appendChild(availabilityContainer);
        
        // Hide the original time dropdown
        serviceTime.parentNode.style.display = 'none';
        
        // Add event listener to date input
        serviceDate.addEventListener('change', function() {
            const selectedDate = this.value;
            if (!selectedDate) return;
            
            // Show the date in the availability display
            const dateObj = new Date(selectedDate);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            document.querySelector('.availability-date').textContent = formattedDate;
            
            // Generate random available time slots
            // In a real app, this would fetch from a database
            const timeSlots = document.getElementById('time-slots');
            timeSlots.innerHTML = '';
            
            // Morning slots
            const morningSlots = generateTimeSlots(8, 12, dateObj.getDay() === 0 || dateObj.getDay() === 6);
            if (morningSlots.length > 0) {
                timeSlots.innerHTML += `
                    <div class="time-slot-group">
                        <h5>Morning</h5>
                        <div class="slot-buttons morning-slots">
                            ${morningSlots.map(slot => `
                                <button class="time-slot-btn" data-time="${slot}">${slot}</button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Afternoon slots
            const afternoonSlots = generateTimeSlots(12, 16, dateObj.getDay() === 0);
            if (afternoonSlots.length > 0) {
                timeSlots.innerHTML += `
                    <div class="time-slot-group">
                        <h5>Afternoon</h5>
                        <div class="slot-buttons afternoon-slots">
                            ${afternoonSlots.map(slot => `
                                <button class="time-slot-btn" data-time="${slot}">${slot}</button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Evening slots
            const eveningSlots = generateTimeSlots(16, 19, dateObj.getDay() === 0);
            if (eveningSlots.length > 0) {
                timeSlots.innerHTML += `
                    <div class="time-slot-group">
                        <h5>Evening</h5>
                        <div class="slot-buttons evening-slots">
                            ${eveningSlots.map(slot => `
                                <button class="time-slot-btn" data-time="${slot}">${slot}</button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Add event listeners to time slot buttons
            const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
            timeSlotBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    timeSlotBtns.forEach(b => b.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Set the value in the hidden select
                    const time = this.getAttribute('data-time');
                    const hour = parseInt(time.split(':')[0]);
                    
                    if (hour >= 8 && hour < 12) {
                        serviceTime.value = 'morning';
                    } else if (hour >= 12 && hour < 16) {
                        serviceTime.value = 'afternoon';
                    } else {
                        serviceTime.value = 'evening';
                    }
                });
            });
            
            // Show the time slots container
            serviceTime.parentNode.style.display = 'block';
        });
    };
    
    // Helper function to generate random time slots
    const generateTimeSlots = (startHour, endHour, isWeekend) => {
        const slots = [];
        const interval = 30; // minutes
        const slotsPerHour = 60 / interval;
        
        // Reduce available slots on weekends
        const availabilityFactor = isWeekend ? 0.5 : 0.8;
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let i = 0; i < slotsPerHour; i++) {
                const minutes = i * interval;
                // Randomly determine if slot is available based on availability factor
                if (Math.random() < availabilityFactor) {
                    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
                    const period = hour < 12 ? 'AM' : 'PM';
                    const formattedMinutes = minutes === 0 ? '00' : minutes;
                    slots.push(`${formattedHour}:${formattedMinutes} ${period}`);
                }
            }
        }
        
        return slots;
    };
    
    // Create service type selector with dynamic information
    const createServiceTypeSelector = () => {
        const serviceTypeSelect = document.getElementById('service-type');
        if (!serviceTypeSelect) return;
        
        // Create service info container
        const serviceInfoContainer = document.createElement('div');
        serviceInfoContainer.className = 'service-info-container';
        serviceInfoContainer.innerHTML = `
            <div class="service-info" id="service-info">
                <h4>Service Information</h4>
                <p>Select a service type to see details</p>
            </div>
        `;
        
        // Insert after service type select
        serviceTypeSelect.parentNode.appendChild(serviceInfoContainer);
        
        // Service details
        const serviceDetails = {
            'battery': {
                title: 'Battery Health Check',
                duration: '60-90 minutes',
                price: '$89.99',
                description: 'Comprehensive diagnostic of your EV battery system including capacity testing, cell balance analysis, and thermal management system inspection.',
                includes: [
                    'Battery capacity measurement',
                    'Cell voltage balance check',
                    'Cooling system inspection',
                    'Battery management system diagnostics',
                    'Performance optimization recommendations'
                ]
            },
            'general': {
                title: 'General Service',
                duration: '90-120 minutes',
                price: '$149.99',
                description: 'Complete vehicle inspection covering all mechanical components, electrical systems, and software diagnostics.',
                includes: [
                    'Brake system inspection',
                    'Suspension and steering check',
                    'Tire rotation and pressure adjustment',
                    'Cabin air filter replacement',
                    'Software diagnostics scan',
                    'Fluid levels check and top-up'
                ]
            },
            'software': {
                title: 'Software Updates',
                duration: '45-60 minutes',
                price: '$59.99',
                description: 'Installation of the latest software updates for your vehicle\'s systems to ensure optimal performance and access to new features.',
                includes: [
                    'System diagnostics',
                    'Software version verification',
                    'Update installation',
                    'System reboot and verification',
                    'Feature demonstration'
                ]
            },
            'tire': {
                title: 'Tire Service',
                duration: '30-45 minutes',
                price: '$49.99 (basic) / $129.99 (with alignment)',
                description: 'Comprehensive tire service including rotation, balancing, and optional wheel alignment for optimal efficiency and tire life.',
                includes: [
                    'Tire rotation',
                    'Tire pressure adjustment',
                    'Tread depth measurement',
                    'Wheel balancing',
                    'Optional wheel alignment'
                ]
            }
        };
        
        // Add event listener to service type select
        serviceTypeSelect.addEventListener('change', function() {
            const selectedService = this.value;
            const serviceInfo = document.getElementById('service-info');
            
            if (selectedService && serviceDetails[selectedService]) {
                const details = serviceDetails[selectedService];
                serviceInfo.innerHTML = `
                    <h4>${details.title}</h4>
                    <div class="service-meta">
                        <span><i class="fas fa-clock"></i> ${details.duration}</span>
                        <span><i class="fas fa-tag"></i> ${details.price}</span>
                    </div>
                    <p>${details.description}</p>
                    <h5>Service Includes:</h5>
                    <ul class="service-includes">
                        ${details.includes.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                `;
            } else {
                serviceInfo.innerHTML = `
                    <h4>Service Information</h4>
                    <p>Select a service type to see details</p>
                `;
            }
        });
    };
    
    // Create reminder preferences section
    const createReminderPreferences = () => {
        const contactPreference = document.querySelector('.checkbox-group');
        if (!contactPreference) return;
        
        // Create reminder settings container
        const reminderContainer = document.createElement('div');
        reminderContainer.className = 'reminder-settings';
        reminderContainer.innerHTML = `
            <h4>Reminder Preferences</h4>
            <div class="reminder-options">
                <div class="reminder-option">
                    <label>
                        <input type="checkbox" name="reminder-day-before" checked> Day before appointment
                    </label>
                </div>
                <div class="reminder-option">
                    <label>
                        <input type="checkbox" name="reminder-morning-of" checked> Morning of appointment
                    </label>
                </div>
                <div class="reminder-option">
                    <label>
                        <input type="checkbox" name="reminder-hour-before"> 1 hour before appointment
                    </label>
                </div>
            </div>
        `;
        
        // Insert after contact preference
        contactPreference.parentNode.appendChild(reminderContainer);
    };
    
    // Initialize maintenance scheduling features
    createSchedulingCalendar();
    createServiceTypeSelector();
    createReminderPreferences();
    
    // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .availability-display {
            margin-top: 15px;
            background-color: #f9f9f9;
            border-radius: var(--border-radius);
            padding: 15px;
            border: 1px solid #eee;
        }
        
        .availability-display h4 {
            margin-bottom: 10px;
            color: var(--primary-color);
        }
        
        .availability-date {
            font-weight: 500;
            margin-bottom: 15px;
        }
        
        .time-slot-group {
            margin-bottom: 20px;
        }
        
        .time-slot-group h5 {
            margin-bottom: 10px;
            color: var(--dark-color);
        }
        
        .slot-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .time-slot-btn {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .time-slot-btn:hover {
            border-color: var(--primary-color);
        }
        
        .time-slot-btn.active {
            background-color: var(--primary-color);
            color: #fff;
            border-color: var(--primary-color);
        }
        
        .service-info-container {
            margin-top: 15px;
        }
        
        .service-info {
            background-color: #f9f9f9;
            border-radius: var(--border-radius);
            padding: 15px;
            border: 1px solid #eee;
        }
        
        .service-info h4 {
            margin-bottom: 10px;
            color: var(--primary-color);
        }
        
        .service-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
            font-size: 0.9rem;
        }
        
        .service-meta span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .service-meta i {
            color: var(--primary-color);
        }
        
        .service-includes {
            list-style-type: disc;
            padding-left: 20px;
            margin-top: 10px;
        }
        
        .service-includes li {
            margin-bottom: 5px;
        }
        
        .reminder-settings {
            margin-top: 20px;
            background-color: #f9f9f9;
            border-radius: var(--border-radius);
            padding: 15px;
            border: 1px solid #eee;
        }
        
        .reminder-settings h4 {
            margin-bottom: 10px;
            color: var(--primary-color);
        }
        
        .reminder-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .reminder-option label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: normal;
        }
        
        @media (max-width: 768px) {
            .service-meta {
                flex-direction: column;
                gap: 10px;
            }
        }
    `;
    document.head.appendChild(style);
});
