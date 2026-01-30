// AdSense Configuration
class AdSenseManager {
    constructor() {
        this.adClient = null;
        this.adSlots = [];
        this.isInitialized = false;
    }

    // Initialize AdSense (call this after approval)
    init(adClientId) {
        if (!adClientId) {
            console.log('AdSense: Waiting for approval - using placeholders');
            return;
        }

        this.adClient = adClientId;
        
        // Create AdSense script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`;
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
            this.isInitialized = true;
            this.createAds();
        };
        
        document.head.appendChild(script);
    }

    // Create ad slots
    createAds() {
        // Top banner ad
        this.createAdSlot('adsense-top', {
            width: 728,
            height: 90,
            format: 'horizontal'
        });

        // Middle banner ad
        this.createAdSlot('adsense-middle', {
            width: 728,
            height: 90,
            format: 'horizontal'
        });

        // Sidebar ad (if exists)
        this.createAdSlot('adsense-sidebar', {
            width: 300,
            height: 600,
            format: 'vertical'
        });
    }

    // Create individual ad slot
    createAdSlot(elementId, dimensions) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Remove placeholder
        const placeholder = element.querySelector('.ads-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        // Create ad container
        const adContainer = document.createElement('ins');
        adContainer.className = 'adsbygoogle';
        adContainer.style.display = 'block';
        adContainer.setAttribute('data-ad-client', this.adClient);
        adContainer.setAttribute('data-ad-slot', this.generateSlotId());
        adContainer.setAttribute('data-ad-format', 'auto');
        adContainer.setAttribute('data-full-width-responsive', 'true');
        
        element.appendChild(adContainer);

        // Push to adsbygoogle array
        if (window.adsbygoogle) {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }

    // Generate unique slot ID
    generateSlotId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Show ad placeholders (before AdSense approval)
    showPlaceholders() {
        const adElements = document.querySelectorAll('.ads-container');
        adElements.forEach(container => {
            if (!container.querySelector('.ads-placeholder')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'ads-placeholder';
                placeholder.innerHTML = '<p>Advertisement</p>';
                container.appendChild(placeholder);
            }
        });
    }
}

// Initialize AdSense manager
const adManager = new AdSenseManager();

// Show placeholders initially
document.addEventListener('DOMContentLoaded', () => {
    adManager.showPlaceholders();
    
    // Replace with your AdSense client ID after approval
    // adManager.init('ca-pub-YOUR_CLIENT_ID');
});

// Function to update AdSense ID after approval
function updateAdSenseId(clientId) {
    adManager.init(clientId);
}
