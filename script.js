document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const MASTER_PASSWORD = "1122"; // Aapka master password
    const LOGIN_EMAIL = "usmancodex.dev@gmail.com";        // Aapka login email
    const LOGIN_PASSWORD = "usman1212";  // Aapka login password

    // Aapki images ke naam (images folder mein honi chahiye)
    // Example: agar image ka naam "my_trip.jpg" hai to "my_trip.jpg" likhen
    const IMAGES = [
        "class-man.png",
        "class-stock.png",
        "classs-girl.png",
        // Yahan apni saari images ke naam add karein
        // "photo_4.gif",
        // "vacation_pic.webp",
    ];

    // --- DOM Elements ---
    const initialPasswordScreen = document.getElementById('initial-password-screen');
    const masterPasswordInput = document.getElementById('master-password-input');
    const masterPasswordSubmit = document.getElementById('master-password-submit');
    const masterPasswordError = document.getElementById('master-password-error');

    const loginScreen = document.getElementById('login-screen');
    const emailInput = document.getElementById('email-input');
    const loginPasswordInput = document.getElementById('login-password-input');
    const loginSubmit = document.getElementById('login-submit');
    const loginError = document.getElementById('login-error');

    const galleryScreen = document.getElementById('gallery-screen');
    const imageGalleryContainer = document.getElementById('image-gallery-container');
    const logoutButton = document.getElementById('logout-button');

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxButton = document.querySelector('.close-lightbox');

    let currentImageIndex = 0;
    let touchstartX = 0;
    let touchendX = 0;

    // --- FUNCTIONS ---

    function showScreen(screenElement) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screenElement.classList.add('active');
    }

    function handleMasterPassword() {
        if (masterPasswordInput.value === MASTER_PASSWORD) {
            masterPasswordError.textContent = '';
            masterPasswordInput.value = ''; // Clear input
            showScreen(loginScreen);
        } else {
            masterPasswordError.textContent = 'Incorrect master password.';
        }
    }

    function handleLogin() {
        if (emailInput.value === LOGIN_EMAIL && loginPasswordInput.value === LOGIN_PASSWORD) {
            loginError.textContent = '';
            emailInput.value = ''; // Clear inputs
            loginPasswordInput.value = '';
            loadGallery();
            showScreen(galleryScreen);
        } else {
            loginError.textContent = 'Incorrect email or password.';
        }
    }

    function loadGallery() {
        imageGalleryContainer.innerHTML = ''; // Clear previous images
        IMAGES.forEach((imageName, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = `images/${imageName}`;
            imgElement.alt = imageName;
            imgElement.classList.add('gallery-thumbnail');
            imgElement.dataset.index = index; // Store index for lightbox
            imgElement.addEventListener('click', () => openLightbox(index));
            imageGalleryContainer.appendChild(imgElement);
        });
    }

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = `images/${IMAGES[currentImageIndex]}`;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    window.changeImage = function(step) { // Expose to global scope for onclick
        currentImageIndex += step;
        if (currentImageIndex >= IMAGES.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = IMAGES.length - 1;
        }
        lightboxImg.src = `images/${IMAGES[currentImageIndex]}`;
    }

    function handleLogout() {
        // Clear sensitive info if any was stored (not much in this simple version)
        showScreen(initialPasswordScreen);
    }
    
    // Swipe functionality for lightbox
    function handleTouchStart(event) {
        touchstartX = event.changedTouches[0].screenX;
    }

    function handleTouchEnd(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipeGesture();
    }

    function handleSwipeGesture() {
        const swipeThreshold = 50; // Minimum pixels for a swipe
        if (touchendX < touchstartX - swipeThreshold) { // Swiped left
            changeImage(1); // Next image
        }
        if (touchendX > touchstartX + swipeThreshold) { // Swiped right
            changeImage(-1); // Previous image
        }
    }


    // --- EVENT LISTENERS ---
    masterPasswordSubmit.addEventListener('click', handleMasterPassword);
    masterPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleMasterPassword();
    });

    loginSubmit.addEventListener('click', handleLogin);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    loginPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    

    logoutButton.addEventListener('click', handleLogout);
    closeLightboxButton.addEventListener('click', closeLightbox);
    
    // Close lightbox if clicked outside the image
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) { // Clicked on the background, not the image or controls
            closeLightbox();
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowRight') {
                changeImage(1);
            } else if (e.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Swipe listeners for lightbox image
    lightboxImg.addEventListener('touchstart', handleTouchStart, false);
    lightboxImg.addEventListener('touchend', handleTouchEnd, false);
    // It's often better to attach swipe listeners to the lightbox container
    // if the image itself doesn't fill the swipe area.
    // For simplicity, attaching to image here. Consider attaching to `lightbox` div.


    // --- INITIALIZATION ---
    showScreen(initialPasswordScreen); // Show initial password screen on load

});