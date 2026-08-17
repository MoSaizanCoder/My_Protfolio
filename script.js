document.addEventListener("DOMContentLoaded", () => {
  // --- Tab Navigation Logic ---
  const tablinks = document.querySelectorAll(".tab-links");
  const tabcontents = document.querySelectorAll(".tab-contents");

  window.opentab = function (tabname, event) {
    tablinks.forEach(tablink => tablink.classList.remove("active-link"));
    tabcontents.forEach(tabcontent => tabcontent.classList.remove("active-tab"));

    if (event && event.currentTarget) {
      event.currentTarget.classList.add("active-link");
    }
    
    const targetTab = document.getElementById(tabname);
    if (targetTab) {
      targetTab.classList.add("active-tab");
    }
  };

  // --- Side Menu Logic ---
  const sidemenu = document.getElementById("sidemenu");

  window.openmenu = function () {
    if (sidemenu) sidemenu.style.right = "0";
  };

  window.closemenu = function () {
    if (sidemenu) sidemenu.style.right = "-200px";
  };

  // --- Resume Dropdown Click Logic ---
  const resumeDropdown = document.getElementById("resumeDropdown");
  const dropdownToggle = document.getElementById("dropdownToggle");

  if (resumeDropdown && dropdownToggle) {
    // Toggle dropdown open/close
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      resumeDropdown.classList.toggle("active");
      const isExpanded = resumeDropdown.classList.contains("active");
      dropdownToggle.setAttribute("aria-expanded", isExpanded);
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!resumeDropdown.contains(e.target)) {
        resumeDropdown.classList.remove("active");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close when an option is selected
    resumeDropdown.querySelectorAll(".dropdown-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        resumeDropdown.classList.remove("active");
        dropdownToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Google Sheets Contact Form Submission ---
  const scriptURL = 'https://script.google.com/macros/s/AKfycby2YNw6KEAS5P_SVnOGablebLk66v8gKYntdHuDx2IiUv0NO9Lg8z0GF7Im6YkATdyp/exec';
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById("msg");

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Prevent duplicate submissions and provide feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";
      }

      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          body: new FormData(form),
        });

        if (response.ok) {
          if (msg) {
            msg.textContent = "Thank you for your message. I will get back to you soon.";
            setTimeout(() => {
              msg.textContent = "";
            }, 5000);
          }
          form.reset();
        } else {
          throw new Error("Form submission returned an error status.");
        }
      } catch (error) {
        console.error("Submission Error:", error.message);
        if (msg) {
          msg.textContent = "Something went wrong. Please try again later.";
          setTimeout(() => {
            msg.textContent = "";
          }, 5000);
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit";
        }
      }
    });
  }
});