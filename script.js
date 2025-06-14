// Initialize Spline 3D Scene with enhanced watermark removal
async function initSpline() {
  try {
    const canvas = document.getElementById("canvas3d");
    if (canvas) {
      const { Application } = await import(
        "https://unpkg.com/@splinetool/runtime@1.9.28/build/runtime.js"
      );
      const app = new Application(canvas);

      // Set canvas background to transparent
      canvas.style.background = "transparent";

      await app.load(
        "https://prod.spline.design/qsYevAxQjhkdXOrr/scene.splinecode"
      );

      // Multiple watermark removal attempts
      setTimeout(() => {
        removeSplineWatermark();
      }, 500);

      setTimeout(() => {
        removeSplineWatermark();
      }, 1500);

      setTimeout(() => {
        removeSplineWatermark();
      }, 3000);
    }
  } catch (error) {
    console.log("Spline runtime error:", error);
    const canvas = document.getElementById("canvas3d");
    if (canvas) {
      canvas.style.background = "transparent";
      canvas.style.display = "flex";
      canvas.style.alignItems = "center";
      canvas.style.justifyContent = "center";
      canvas.innerHTML = '<div style="font-size: 4rem;">👨‍💻</div>';
    }
  }
}

// Enhanced watermark removal function
function removeSplineWatermark() {
  // Remove all potential watermark elements
  const watermarkSelectors = [
    '[class*="watermark"]',
    '[class*="logo"]',
    '[class*="spline"]',
    '[style*="position: absolute"]',
    '[style*="position: fixed"]',
    'a[href*="spline"]',
    'div[style*="bottom"]',
    'div[style*="z-index"]',
    "spline-viewer + div",
    "spline-viewer ~ div",
    "[data-spline]",
    ".spline-watermark",
  ];

  watermarkSelectors.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (
          el &&
          ((el.textContent &&
            (el.textContent.toLowerCase().includes("spline") ||
              el.textContent.toLowerCase().includes("made with") ||
              el.textContent.toLowerCase().includes("built with"))) ||
            (el.href && el.href.includes("spline")) ||
            (el.style &&
              el.style.position &&
              (el.style.position === "absolute" ||
                el.style.position === "fixed") &&
              el.getBoundingClientRect().bottom < 100))
        ) {
          el.remove();
        }
      });
    } catch (e) {
      // Silent fail for selector errors
    }
  });

  // Remove watermark from hero image specifically
  const heroImage = document.querySelector(".hero-image");
  if (heroImage) {
    const allElements = heroImage.querySelectorAll("*");
    allElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // Remove elements positioned at bottom of container
      if (
        (computedStyle.position === "absolute" ||
          computedStyle.position === "fixed") &&
        (computedStyle.bottom === "0px" ||
          rect.bottom < heroImage.getBoundingClientRect().bottom + 50)
      ) {
        el.remove();
      }

      // Remove elements with spline-related content
      if (
        el.textContent &&
        (el.textContent.toLowerCase().includes("spline") ||
          el.textContent.toLowerCase().includes("built with") ||
          el.textContent.toLowerCase().includes("made with"))
      ) {
        el.remove();
      }

      // Remove anchor elements linking to spline
      if (el.tagName === "A" && el.href && el.href.includes("spline")) {
        el.remove();
      }
    });
  }

  // Set canvas background to transparent
  const canvas = document.getElementById("canvas3d");
  if (canvas) {
    canvas.style.background = "transparent !important";
    canvas.style.backgroundColor = "transparent !important";
  }
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initSpline, 500);

  // Continuously remove watermark
  const watermarkRemovalInterval = setInterval(() => {
    removeSplineWatermark();
  }, 1000);

  // Stop aggressive removal after 30 seconds
  setTimeout(() => {
    clearInterval(watermarkRemovalInterval);
    // Continue with less frequent checks
    setInterval(removeSplineWatermark, 5000);
  }, 30000);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Side navigation active state
const sections = document.querySelectorAll("section");
const sideNavLinks = document.querySelectorAll(".side-nav a");

function updateActiveNav() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= 100) {
      current = section.getAttribute("id");
    }
  });

  sideNavLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").substring(1) === current) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNav);

// Form submission
document
  .querySelector(".contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Simple validation
    if (name && email && message) {
      alert("Thank you for your message! I'll get back to you soon.");
      this.reset();
    } else {
      alert("Please fill in all fields.");
    }
  });

// Add floating animation to hero image
const heroImage = document.querySelector(".hero-image");
let floatDirection = 1;

function floatAnimation() {
  const currentTransform = heroImage.style.transform || "translateY(0px)";
  const currentY = parseFloat(
    currentTransform.match(/translateY\(([^)]+)\)/)?.[1] || 0
  );

  if (currentY >= 10) floatDirection = -1;
  if (currentY <= -10) floatDirection = 1;

  heroImage.style.transform = `translateY(${
    currentY + floatDirection * 0.5
  }px)`;
}

setInterval(floatAnimation, 50);

// Parallax effect for background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector("body");
  const speed = scrolled * 0.5;
  parallax.style.backgroundPosition = `center ${speed}px`;
});

// Add hover effects to project cards
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Add typing effect to the name
const nameElement = document.querySelector(".name");
const originalText = nameElement.textContent;
nameElement.textContent = "";

setTimeout(() => {
  let i = 0;
  const typingInterval = setInterval(() => {
    nameElement.textContent += originalText[i];
    i++;
    if (i >= originalText.length) {
      clearInterval(typingInterval);
    }
  }, 100);
}, 1000);

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all sections
sections.forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(50px)";
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(section);
});

// Make the first section (hero) visible immediately
document.querySelector("#home").style.opacity = "1";
document.querySelector("#home").style.transform = "translateY(0)";
