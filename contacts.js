function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' 
        ? '<i class="fa-solid fa-check-circle"></i>'
        : '<i class="fa-solid fa-exclamation-circle"></i>';
    
    toast.innerHTML = `
        ${icon}
        <div class="toast-content">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger reflow
    toast.offsetHeight;
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function sendMail(e) {
    e.preventDefault();

    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
        subject: document.getElementById("subject").value,
    };

    emailjs.send("service_55zzkbl", "template_22f4vag", params)
        .then(function(response) {
            console.log("SUCCESS", response);
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            document.getElementById("contactForm").reset();
        })
        .catch(function(error) {
            console.error("FAILED", error);
            showToast('Failed to send message. Please try again.', 'error');
        });

    return false;
}

// Add event listener to form
document.getElementById("contactForm").addEventListener("submit", sendMail);

// Rate limiting (keep your existing code)
let lastSubmission = 0;
document.getElementById('contactForm').addEventListener('submit', function(e) {
    const now = Date.now();
    if (now - lastSubmission < 60000) {
        e.preventDefault();
        alert('Please wait a minute before sending another message.');
        return false;
    }
    lastSubmission = now;
});