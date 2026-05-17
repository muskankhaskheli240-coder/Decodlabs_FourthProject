

// ============================================
// CONFIGURATION & STATE MANAGEMENT
// ============================================

const CONFIG = {
    DEBOUNCE_DELAY: 300,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 3,
    MIN_AGE: 18,
    USERNAME_CHECK_DELAY: 1000,
};

const state = {
    currentStep: 1,
    formData: {},
    validationErrors: {},
    isSubmitting: false,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Show toast notification
 */
function showToast(title, message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-circle',
    };

    toast.innerHTML = `
        <i class="toast-icon ${icons[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button type="button" class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideInRight 0.4s ease-out reverse';
            setTimeout(() => toast.remove(), 400);
        }
    }, 4000);
}

/**
 * Display validation error for a field
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);

    if (field) {
        field.classList.remove('success');
        field.classList.add('error');
    }

    if (errorElement) {
        errorElement.textContent = message;
    }

    state.validationErrors[fieldId] = message;
}

/**
 * Clear validation error for a field
 */
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);

    if (field) {
        field.classList.remove('error');
    }

    if (errorElement) {
        errorElement.textContent = '';
    }

    delete state.validationErrors[fieldId];
}

/**
 * Mark field as valid
 */
function markAsValid(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('error');
        field.classList.add('success');
    }
}

/**
 * Animate element
 */
function animateElement(element, animationName, duration = 500) {
    return new Promise((resolve) => {
        element.style.animation = `${animationName} ${duration}ms ease-out`;
        setTimeout(() => {
            element.style.animation = '';
            resolve();
        }, duration);
    });
}

// ============================================
// THEME MANAGEMENT
// ============================================

/**
 * Initialize theme from localStorage
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

/**
 * Set theme and save preference
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggle(theme);
}

/**
 * Update theme toggle button
 */
function updateThemeToggle(theme) {
    const toggle = document.getElementById('themeToggle');
    const icon = toggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// ============================================
// FORM VALIDATORS
// ============================================

/**
 * Validate full name
 */
function validateFullName(value) {
    if (!value) return 'Full name is required';
    if (value.length < CONFIG.NAME_MIN_LENGTH) return `Full name must be at least ${CONFIG.NAME_MIN_LENGTH} characters`;
    if (/\d/.test(value)) return 'Full name cannot contain numbers';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Full name can only contain letters and spaces';
    return null;
}

/**
 * Validate username (format only)
 */
function validateUsernameFormat(value) {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (/\s/.test(value)) return 'Username cannot contain spaces';
    if (!/^[a-z0-9_-]+$/.test(value)) return 'Username can only contain lowercase letters, numbers, hyphens, and underscores';
    return null;
}

/**
 * Simulate username availability check
 */
function checkUsernameAvailability(username) {
    return new Promise((resolve) => {
        const usernameCheck = document.getElementById('usernameCheck');
        
        // Show loading state
        usernameCheck.className = 'username-check checking';
        usernameCheck.innerHTML = '<i class="fas fa-circle-notch"></i>';

        // Simulate API call
        setTimeout(() => {
            // Simulate some usernames being taken
            const takenUsernames = ['admin', 'user', 'test', 'demo', 'root', 'administrator'];
            const isAvailable = !takenUsernames.includes(username.toLowerCase());

            usernameCheck.className = isAvailable ? 'username-check available' : 'username-check taken';
            usernameCheck.innerHTML = isAvailable 
                ? '<i class="fas fa-check"></i>' 
                : '<i class="fas fa-times"></i>';

            resolve(isAvailable);
        }, 1500);
    });
}

/**
 * Validate email
 */
function validateEmail(value) {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    
    const domain = value.split('@')[1];
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com', 'test.com'];
    
    return null;
}

/**
 * Validate phone number
 */
function validatePhone(value) {
    if (!value) return 'Phone number is required';
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length < 10) return 'Phone number must contain at least 10 digits';
    return null;
}

/**
 * Format phone number
 */
function formatPhoneNumber(value) {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length === 0) return '';
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 6) return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
    const requirements = {
        length: password.length >= CONFIG.PASSWORD_MIN_LENGTH,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const allMet = Object.values(requirements).every(req => req);
    return { requirements, allMet, met: Object.values(requirements).filter(r => r).length };
}

/**
 * Get password strength percentage
 */
function getPasswordStrengthPercentage(password) {
    const { requirements } = validatePasswordStrength(password);
    const metCount = Object.values(requirements).filter(r => r).length;
    return (metCount / Object.keys(requirements).length) * 100;
}

/**
 * Get password strength label
 */
function getPasswordStrengthLabel(percentage) {
    if (percentage === 0) return 'No password';
    if (percentage <= 20) return 'Very weak';
    if (percentage <= 40) return 'Weak';
    if (percentage <= 60) return 'Fair';
    if (percentage <= 80) return 'Good';
    return 'Strong';
}

/**
 * Validate password
 */
function validatePassword(value) {
    if (!value) return 'Password is required';
    const { allMet } = validatePasswordStrength(value);
    if (!allMet) return 'Password does not meet requirements';
    return null;
}

/**
 * Validate confirm password
 */
function validateConfirmPassword(value, password) {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
}

/**
 * Validate date of birth
 */
function validateDOB(value) {
    if (!value) return 'Date of birth is required';
    
    const dob = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    if (age < CONFIG.MIN_AGE) {
        return `You must be at least ${CONFIG.MIN_AGE} years old`;
    }
    
    return null;
}

/**
 * Validate bio
 */
function validateBio(value) {
    if (value && value.length > 500) return 'Bio cannot exceed 500 characters';
    return null;
}

/**
 * Validate terms
 */
function validateTerms(checked) {
    if (!checked) return 'You must accept the terms and conditions';
    return null;
}

// ============================================
// FIELD EVENT HANDLERS
// ============================================

/**
 * Handle full name input
 */
function setupFullNameValidation() {
    const field = document.getElementById('fullName');
    
    field.addEventListener('blur', () => {
        const error = validateFullName(field.value);
        if (error) {
            showError('fullName', error);
        } else {
            clearError('fullName');
            markAsValid('fullName');
        }
    });

    field.addEventListener('input', debounce(() => {
        if (field.value && !field.classList.contains('error')) {
            const error = validateFullName(field.value);
            if (error) {
                showError('fullName', error);
            } else {
                clearError('fullName');
            }
        }
    }, CONFIG.DEBOUNCE_DELAY));
}

/**
 * Handle username input
 */
function setupUsernameValidation() {
    const field = document.getElementById('username');
    
    field.addEventListener('blur', async () => {
        const formatError = validateUsernameFormat(field.value);
        if (formatError) {
            showError('username', formatError);
        } else {
            clearError('username');
            const isAvailable = await checkUsernameAvailability(field.value);
            if (!isAvailable) {
                showError('username', 'This username is already taken');
            } else {
                markAsValid('username');
            }
        }
    });

    field.addEventListener('input', debounce(() => {
        if (field.value) {
            const error = validateUsernameFormat(field.value);
            if (error) {
                showError('username', error);
            } else {
                clearError('username');
            }
        }
    }, CONFIG.DEBOUNCE_DELAY));
}

/**
 * Handle email input
 */
function setupEmailValidation() {
    const field = document.getElementById('email');
    
    field.addEventListener('blur', () => {
        const error = validateEmail(field.value);
        if (error) {
            showError('email', error);
        } else {
            clearError('email');
            markAsValid('email');
        }
    });

    field.addEventListener('input', debounce(() => {
        if (field.value && !field.classList.contains('error')) {
            const error = validateEmail(field.value);
            if (error) {
                showError('email', error);
            } else {
                clearError('email');
            }
        }
    }, CONFIG.DEBOUNCE_DELAY));
}

/**
 * Handle phone input
 */
function setupPhoneValidation() {
    const field = document.getElementById('phone');
    
    field.addEventListener('input', (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        e.target.value = formatted;
    });

    field.addEventListener('blur', () => {
        const error = validatePhone(field.value);
        if (error) {
            showError('phone', error);
        } else {
            clearError('phone');
            markAsValid('phone');
        }
    });
}

/**
 * Handle password input
 */
function setupPasswordValidation() {
    const field = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const toggleBtn = document.getElementById('togglePassword');

    field.addEventListener('input', debounce(() => {
        const { requirements, allMet } = validatePasswordStrength(field.value);
        const percentage = getPasswordStrengthPercentage(field.value);
        const label = getPasswordStrengthLabel(percentage);

        // Update strength bar
        strengthFill.style.width = `${percentage}%`;
        strengthText.textContent = label;

        // Update requirements
        document.getElementById('req-length').classList.toggle('met', requirements.length);
        document.getElementById('req-upper').classList.toggle('met', requirements.uppercase);
        document.getElementById('req-lower').classList.toggle('met', requirements.lowercase);
        document.getElementById('req-number').classList.toggle('met', requirements.number);
        document.getElementById('req-special').classList.toggle('met', requirements.special);

        // Update icons
        updateRequirementIcon('req-length', requirements.length);
        updateRequirementIcon('req-upper', requirements.uppercase);
        updateRequirementIcon('req-lower', requirements.lowercase);
        updateRequirementIcon('req-number', requirements.number);
        updateRequirementIcon('req-special', requirements.special);

        // Real-time validation for confirm password
        const confirmField = document.getElementById('confirmPassword');
        if (confirmField.value) {
            validateConfirmPasswordMatch();
        }
    }, CONFIG.DEBOUNCE_DELAY));

    field.addEventListener('blur', () => {
        const error = validatePassword(field.value);
        if (error) {
            showError('password', error);
        } else {
            clearError('password');
        }
    });

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = toggleBtn.querySelector('i');
        if (field.type === 'password') {
            field.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            field.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

/**
 * Update requirement icon
 */
function updateRequirementIcon(reqId, isMet) {
    const element = document.getElementById(reqId);
    const icon = element.querySelector('i');
    if (isMet) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-check');
    } else {
        icon.classList.remove('fa-check');
        icon.classList.add('fa-times');
    }
}

/**
 * Handle confirm password input
 */
function setupConfirmPasswordValidation() {
    const field = document.getElementById('confirmPassword');
    
    field.addEventListener('input', debounce(() => {
        validateConfirmPasswordMatch();
    }, CONFIG.DEBOUNCE_DELAY));

    field.addEventListener('blur', () => {
        const password = document.getElementById('password').value;
        const error = validateConfirmPassword(field.value, password);
        if (error) {
            showError('confirmPassword', error);
        } else {
            clearError('confirmPassword');
        }
    });
}

/**
 * Validate confirm password match in real-time
 */
function validateConfirmPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchIndicator = document.getElementById('matchIndicator');

    if (confirmPassword && password === confirmPassword) {
        matchIndicator.classList.add('match');
        matchIndicator.innerHTML = '<i class="fas fa-check"></i>';
        clearError('confirmPassword');
    } else if (confirmPassword && password !== confirmPassword) {
        matchIndicator.classList.remove('match');
        matchIndicator.innerHTML = '<i class="fas fa-times"></i>';
        showError('confirmPassword', 'Passwords do not match');
    } else {
        matchIndicator.classList.remove('match');
        matchIndicator.innerHTML = '<i class="fas fa-times"></i>';
    }
}

/**
 * Handle DOB input
 */
function setupDOBValidation() {
    const field = document.getElementById('dob');
    
    field.addEventListener('blur', () => {
        const error = validateDOB(field.value);
        if (error) {
            showError('dob', error);
        } else {
            clearError('dob');
            markAsValid('dob');
        }
    });
}

/**
 * Handle bio input
 */
function setupBioValidation() {
    const field = document.getElementById('bio');
    const charCount = document.getElementById('charCount');
    
    field.addEventListener('input', () => {
        charCount.textContent = field.value.length;
        
        const error = validateBio(field.value);
        if (error) {
            showError('bio', error);
        } else {
            clearError('bio');
        }
    });
}

/**
 * Handle terms checkbox
 */
function setupTermsValidation() {
    const field = document.getElementById('terms');
    
    field.addEventListener('change', () => {
        const error = validateTerms(field.checked);
        if (error) {
            showError('terms', error);
        } else {
            clearError('terms');
        }
    });
}

// ============================================
// FORM STEP NAVIGATION
// ============================================

/**
 * Update progress bar
 */
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progress = (state.currentStep / 3) * 100;
    progressFill.style.width = `${progress}%`;

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === state.currentStep) {
            step.classList.add('active');
        } else if (stepNum < state.currentStep) {
            step.classList.add('completed');
        }
    });
}

/**
 * Show form step
 */
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (currentStep) {
        currentStep.classList.add('active');
        animateElement(currentStep, 'slideInUp', 300);
    }

    // Update button visibility
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = stepNumber === 1 ? 'none' : 'inline-flex';
    nextBtn.style.display = stepNumber === 3 ? 'none' : 'inline-flex';
    submitBtn.style.display = stepNumber === 3 ? 'inline-flex' : 'none';

    // Update progress
    updateProgressBar();

    // Scroll to top
    window.scrollTo({ top: document.querySelector('.form-container').offsetTop - 100, behavior: 'smooth' });
}

/**
 * Validate current step
 */
function validateStep(stepNumber) {
    state.validationErrors = {};

    switch (stepNumber) {
        case 1:
            validateFullName(document.getElementById('fullName').value) ? 
                showError('fullName', validateFullName(document.getElementById('fullName').value)) : 
                clearError('fullName');

            validateUsernameFormat(document.getElementById('username').value) ? 
                showError('username', validateUsernameFormat(document.getElementById('username').value)) : 
                clearError('username');

            validateEmail(document.getElementById('email').value) ? 
                showError('email', validateEmail(document.getElementById('email').value)) : 
                clearError('email');

            validatePhone(document.getElementById('phone').value) ? 
                showError('phone', validatePhone(document.getElementById('phone').value)) : 
                clearError('phone');
            break;

        case 2:
            validatePassword(document.getElementById('password').value) ? 
                showError('password', validatePassword(document.getElementById('password').value)) : 
                clearError('password');

            validateConfirmPassword(document.getElementById('confirmPassword').value, document.getElementById('password').value) ? 
                showError('confirmPassword', validateConfirmPassword(document.getElementById('confirmPassword').value, document.getElementById('password').value)) : 
                clearError('confirmPassword');
            break;

        case 3:
            validateDOB(document.getElementById('dob').value) ? 
                showError('dob', validateDOB(document.getElementById('dob').value)) : 
                clearError('dob');

            validateTerms(document.getElementById('terms').checked) ? 
                showError('terms', validateTerms(document.getElementById('terms').checked)) : 
                clearError('terms');
            break;
    }

    return Object.keys(state.validationErrors).length === 0;
}

/**
 * Move to next step
 */
function nextStep() {
    if (validateStep(state.currentStep)) {
        saveFormData();
        state.currentStep++;
        if (state.currentStep > 3) state.currentStep = 3;
        showStep(state.currentStep);
    } else {
        showToast('Validation Error', 'Please fix the errors before continuing', 'error');
        animateElement(document.querySelector('.form-step.active'), 'shake', 300);
    }
}

/**
 * Move to previous step
 */
function previousStep() {
    saveFormData();
    state.currentStep--;
    if (state.currentStep < 1) state.currentStep = 1;
    showStep(state.currentStep);
}

// ============================================
// FORM DATA MANAGEMENT
// ============================================

/**
 * Save form data to state and localStorage
 */
function saveFormData() {
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        if (input.type === 'checkbox') {
            state.formData[input.id] = input.checked;
        } else {
            state.formData[input.id] = input.value;
        }
    });

    localStorage.setItem('formData', JSON.stringify(state.formData));
}

/**
 * Load form data from localStorage
 */
function loadFormData() {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
        state.formData = JSON.parse(savedData);
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            if (input.id in state.formData) {
                if (input.type === 'checkbox') {
                    input.checked = state.formData[input.id];
                } else {
                    input.value = state.formData[input.id];
                }
            }
        });
    }
}

/**
 * Reset form
 */
function resetForm() {
    document.getElementById('smartForm').reset();
    state.formData = {};
    state.currentStep = 1;
    state.validationErrors = {};
    localStorage.removeItem('formData');
    showStep(1);
    closeModal();
}

// ============================================
// FORM SUBMISSION
// ============================================

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateStep(3)) {
        showToast('Validation Error', 'Please complete all fields', 'error');
        return;
    }

    state.isSubmitting = true;
    saveFormData();

    // Simulate submission
    showToast('Processing', 'Submitting your form...', 'warning');

    setTimeout(() => {
        state.isSubmitting = false;
        
        // Populate success modal
        const displayName = document.getElementById('fullName').value;
        const displayEmail = document.getElementById('email').value;
        const displayCountry = document.getElementById('country');
        const selectedCountry = displayCountry.options[displayCountry.selectedIndex].text;

        document.getElementById('displayName').textContent = displayName;
        document.getElementById('displayEmail').textContent = displayEmail;
        document.getElementById('displayCountry').textContent = selectedCountry;

        // Show success modal
        showSuccessModal();
        showToast('Success', 'Your form has been submitted successfully!', 'success');
        
        // Clear localStorage
        localStorage.removeItem('formData');
    }, 1500);
}

// ============================================
// SUCCESS MODAL & CONFETTI
// ============================================

/**
 * Show success modal
 */
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Create confetti
    createConfetti();
}

/**
 * Close success modal
 */
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

/**
 * Create confetti animation
 */
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    container.innerHTML = ''; // Clear previous confetti

    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.opacity = Math.random();
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        container.appendChild(confetti);
    }
}

// ============================================
// SCROLL NAVIGATION
// ============================================

/**
 * Scroll to form section
 */
function scrollToForm() {
    const formSection = document.getElementById('formSection');
    window.scrollTo({
        top: formSection.offsetTop - 100,
        behavior: 'smooth'
    });
}

/**
 * Scroll to features section
 */
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    window.scrollTo({
        top: featuresSection.offsetTop - 100,
        behavior: 'smooth'
    });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application
 */
function initializeApp() {
    // Theme
    initTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Load saved form data
    loadFormData();

    // Setup validation listeners
    setupFullNameValidation();
    setupUsernameValidation();
    setupEmailValidation();
    setupPhoneValidation();
    setupPasswordValidation();
    setupConfirmPasswordValidation();
    setupDOBValidation();
    setupBioValidation();
    setupTermsValidation();

    // Form submission
    document.getElementById('smartForm').addEventListener('submit', handleFormSubmit);

    // Show initial step
    showStep(1);

    // Initial animations
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '1';
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', initializeApp);

// Close modal on outside click
document.getElementById('successModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'successModal') {
        closeModal();
    }
});

// Prevent form submission on Enter key for navigation
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('form-input')) {
        e.preventDefault();
    }
});
