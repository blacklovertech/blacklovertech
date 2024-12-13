console.log('Its working');

// Check if the theme is already set in localStorage
let theme = localStorage.getItem('theme');
if(theme == null){
    setTheme('light');  // Default to light theme
} else {
    setTheme(theme);  // Set theme from localStorage
}

// Attach event listeners to theme dots for theme selection
let themeDots = document.getElementsByClassName('theme-dot');
for (let i = 0; i < themeDots.length; i++) {
    themeDots[i].addEventListener('click', function() {
        let mode = this.dataset.mode;
        console.log('Option clicked:', mode);
        setTheme(mode);  // Change the theme
    });
}

// Set the theme and store it in localStorage
function setTheme(mode) {
    if(mode == 'light') {
        document.getElementById('theme-style').href = 'css/default.css';
    }

    if(mode == 'blue') {
        document.getElementById('theme-style').href = 'css/blue.css';
    }

    if(mode == 'green') {
        document.getElementById('theme-style').href = 'css/green.css';
    }

    if(mode == 'purple') {
        document.getElementById('theme-style').href = 'css/purple.css';
    }

    localStorage.setItem('theme', mode);  // Save selected theme to localStorage
}

// Typing animation effect
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Developer", "Programmer", "Freelancer", "Entrepreneur"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

// Initiate typing effect on DOM content loaded
document.addEventListener("DOMContentLoaded", function() {
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});
