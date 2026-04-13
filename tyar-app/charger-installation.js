// Additional JavaScript for Charger Installation Section

document.addEventListener('DOMContentLoaded', function() {
    // Status update display functionality
    const statusSteps = [
        { id: 'request-received', label: 'Request Received' },
        { id: 'under-review', label: 'Under Review' },
        { id: 'site-assessment', label: 'Site Assessment' },
        { id: 'installation-scheduled', label: 'Installation Scheduled' },
        { id: 'installation-complete', label: 'Installation Complete' }
    ];
    
    // Create status tracker element
    const createStatusTracker = () => {
        const chargerSection = document.getElementById('charger');
        if (!chargerSection) return;
        
        const chargerContent = chargerSection.querySelector('.charger-content');
        if (!chargerContent) return;
        
        // Create status tracker container
        const statusContainer = document.createElement('div');
        statusContainer.className = 'status-tracker';
        statusContainer.innerHTML = `
            <h3>Track Your Installation Status</h3>
            <p>Enter your request ID to check the current status of your installation:</p>
            <div class="status-input">
                <input type="text" id="request-id" placeholder="Enter Request ID">
                <button class="btn-primary" id="check-status">Check Status</button>
            </div>
            <div class="status-display" id="status-display" style="display: none;">
                <div class="status-timeline">
                    ${statusSteps.map((step, index) => `
                        <div class="status-step" id="${step.id}">
                            <div class="status-dot"></div>
                            <div class="status-label">${step.label}</div>
                        </div>
                        ${index < statusSteps.length - 1 ? '<div class="status-line"></div>' : ''}
                    `).join('')}
                </div>
                <div class="status-details">
                    <p><strong>Request ID:</strong> <span id="display-id"></span></p>
                    <p><strong>Current Status:</strong> <span id="current-status"></span></p>
                    <p><strong>Last Updated:</strong> <span id="last-updated"></span></p>
                    <p><strong>Next Step:</strong> <span id="next-step"></span></p>
                </div>
            </div>
        `;
        
        // Insert status tracker before the form
        const chargerForm = chargerContent.querySelector('.charger-form');
        chargerContent.insertBefore(statusContainer, chargerForm);
        
        // Add event listener for status check button
        const checkStatusBtn = statusContainer.querySelector('#check-status');
        checkStatusBtn.addEventListener('click', function() {
            const requestId = document.getElementById('request-id').value;
            if (!requestId) {
                alert('Please enter a Request ID');
                return;
            }
            
            // In a real app, this would fetch the status from a database
            // For demo purposes, we'll simulate a random status
            const statusIndex = Math.floor(Math.random() * statusSteps.length);
            const currentStatus = statusSteps[statusIndex];
            
            // Update status display
            document.getElementById('status-display').style.display = 'block';
            document.getElementById('display-id').textContent = requestId;
            document.getElementById('current-status').textContent = currentStatus.label;
            document.getElementById('last-updated').textContent = new Date().toLocaleString();
            
            const nextStepIndex = statusIndex + 1;
            if (nextStepIndex < statusSteps.length) {
                document.getElementById('next-step').textContent = statusSteps[nextStepIndex].label;
            } else {
                document.getElementById('next-step').textContent = 'Complete';
            }
            
            // Update timeline visualization
            statusSteps.forEach((step, index) => {
                const stepElement = document.getElementById(step.id);
                if (index <= statusIndex) {
                    stepElement.classList.add('completed');
                } else {
                    stepElement.classList.remove('completed');
                }
                
                if (index === statusIndex) {
                    stepElement.classList.add('current');
                } else {
                    stepElement.classList.remove('current');
                }
            });
        });
    };
    
    // Create interactive building type selector
    const createBuildingTypeSelector = () => {
        const buildingTypeSelect = document.getElementById('building-type');
        if (!buildingTypeSelect) return;
        
        buildingTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            let additionalFields = '';
            
            // Remove any previously added additional fields
            const existingAdditionalFields = document.getElementById('additional-building-fields');
            if (existingAdditionalFields) {
                existingAdditionalFields.remove();
            }
            
            if (selectedType === 'single-family') {
                additionalFields = `
                    <div class="form-group">
                        <label for="garage-type">Garage Type</label>
                        <select id="garage-type">
                            <option value="">Select Type</option>
                            <option value="attached">Attached Garage</option>
                            <option value="detached">Detached Garage</option>
                            <option value="none">No Garage</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="electrical-panel">Electrical Panel Capacity</label>
                        <select id="electrical-panel">
                            <option value="">Select Capacity</option>
                            <option value="100">100 Amp</option>
                            <option value="200">200 Amp</option>
                            <option value="400">400 Amp</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>
                `;
            } else if (selectedType === 'multi-unit') {
                additionalFields = `
                    <div class="form-group">
                        <label for="unit-count">Number of Units</label>
                        <input type="number" id="unit-count" min="2">
                    </div>
                    <div class="form-group">
                        <label for="parking-type">Parking Type</label>
                        <select id="parking-type">
                            <option value="">Select Type</option>
                            <option value="garage">Individual Garages</option>
                            <option value="lot">Shared Parking Lot</option>
                            <option value="street">Street Parking</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="hoa">HOA Approval Required?</label>
                        <select id="hoa">
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>
                `;
            } else if (selectedType === 'commercial') {
                additionalFields = `
                    <div class="form-group">
                        <label for="business-type">Business Type</label>
                        <input type="text" id="business-type">
                    </div>
                    <div class="form-group">
                        <label for="charger-count">Number of Chargers Needed</label>
                        <input type="number" id="charger-count" min="1">
                    </div>
                    <div class="form-group">
                        <label for="public-access">Public Access Required?</label>
                        <select id="public-access">
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                `;
            }
            
            if (additionalFields) {
                const additionalFieldsContainer = document.createElement('div');
                additionalFieldsContainer.id = 'additional-building-fields';
                additionalFieldsContainer.innerHTML = additionalFields;
                
                // Insert after building type field
                const messageField = document.getElementById('message').parentNode;
                buildingTypeSelect.parentNode.parentNode.insertBefore(additionalFieldsContainer, messageField);
            }
        });
    };
    
    // Create location input with map integration
    const createLocationInput = () => {
        const addressInput = document.getElementById('address');
        if (!addressInput) return;
        
        // Create a container for the map preview
        const mapPreviewContainer = document.createElement('div');
        mapPreviewContainer.className = 'map-preview';
        mapPreviewContainer.innerHTML = `
            <div class="map-placeholder">
                <i class="fas fa-map-marked-alt"></i>
                <p>Enter your address above to see a map preview</p>
            </div>
        `;
        
        // Insert after address input
        addressInput.parentNode.appendChild(mapPreviewContainer);
        
        // Add event listener to address input
        addressInput.addEventListener('blur', function() {
            const address = this.value;
            if (address) {
                // In a real app, this would use a mapping API
                // For demo purposes, we'll just update the placeholder
                mapPreviewContainer.innerHTML = `
                    <div class="map-preview-content">
                        <div class="map-image" style="background-color: #e9e9e9; height: 150px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-map-pin" style="color: var(--primary-color); font-size: 2rem;"></i>
                        </div>
                        <p class="map-address">${address}</p>
                        <p class="map-confirmation">Location confirmed</p>
                    </div>
                `;
            }
        });
    };
    
    // Initialize charger installation features
    createStatusTracker();
    createBuildingTypeSelector();
    createLocationInput();
    
    // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .status-tracker {
            background-color: var(--light-color);
            padding: 30px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            margin-bottom: 30px;
        }
        
        .status-tracker h3 {
            margin-bottom: 15px;
            text-align: center;
        }
        
        .status-input {
            display: flex;
            gap: 10px;
            margin: 20px 0;
        }
        
        .status-input input {
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
        }
        
        .status-timeline {
            display: flex;
            align-items: center;
            margin: 30px 0;
        }
        
        .status-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            flex: 1;
        }
        
        .status-dot {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #ddd;
            margin-bottom: 10px;
            z-index: 2;
        }
        
        .status-line {
            height: 3px;
            background-color: #ddd;
            flex: 1;
            z-index: 1;
        }
        
        .status-label {
            font-size: 0.8rem;
            text-align: center;
            max-width: 80px;
        }
        
        .status-step.completed .status-dot,
        .status-step.current .status-dot {
            background-color: var(--primary-color);
        }
        
        .status-step.current .status-dot {
            box-shadow: 0 0 0 3px rgba(42, 141, 141, 0.3);
        }
        
        .status-details {
            background-color: #fff;
            padding: 15px;
            border-radius: var(--border-radius);
        }
        
        .status-details p {
            margin-bottom: 10px;
        }
        
        .map-preview {
            margin-top: 10px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
            overflow: hidden;
        }
        
        .map-placeholder {
            height: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #f5f5f5;
            color: #888;
        }
        
        .map-placeholder i {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .map-preview-content {
            background-color: #fff;
        }
        
        .map-address {
            padding: 10px;
            font-weight: 500;
        }
        
        .map-confirmation {
            padding: 0 10px 10px;
            color: var(--primary-color);
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .status-timeline {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .status-step {
                flex-direction: row;
                width: 100%;
                margin-bottom: 15px;
            }
            
            .status-dot {
                margin-right: 15px;
                margin-bottom: 0;
            }
            
            .status-line {
                width: 3px;
                height: 20px;
                margin-left: 8.5px;
            }
            
            .status-label {
                max-width: none;
                text-align: left;
            }
        }
    `;
    document.head.appendChild(style);
});
