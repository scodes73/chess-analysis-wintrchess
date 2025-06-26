function showToastMessage(text, timeout = 200) {
    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";

        Object.assign(container.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: "99999",
            pointerEvents: "none"
        });

        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const message = document.createElement("span");
    
    Object.assign(toast.style, {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        background: "rgba(255,255,255,0.95)",
        color: "#111",
        fontSize: "14px",
        fontWeight: "800",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "10px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
        overflow: "hidden",
        pointerEvents: "auto",
        opacity: "0",
        transform: "translateX(20px)",
        transition: "opacity 0.4s ease, transform 0.4s ease"
    });

    message.textContent = text;
    toast.append(message);
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
    });

    const autoRemove = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(20px)";
        setTimeout(() => toast.remove(), 200);
    }, timeout);
}


function waitForElm(selectorOrCallback, options = {}) {
  return new Promise((resolve) => {
    const callback = typeof selectorOrCallback === 'function' ? selectorOrCallback : null;
    const selector = typeof selectorOrCallback === 'string' ? selectorOrCallback : null;
    const setValue = options.setValue;
    const value = options.value;

    const observer = new MutationObserver(() => {
      if (callback) {
        const element = callback(document);
        if (element) {
          if (setValue && value) {
            element.value = value;
            element.dispatchEvent(new Event('input',{bubbles: true}));
          }
          observer.disconnect();
          resolve(element);
        }
      } else if (selector) {
        const element = document.querySelector(selector);
        if (element) {
          if (setValue && value) {
            element.value = value;
            element.dispatchEvent(new Event('input',{bubbles: true}));
          }
          observer.disconnect();
          resolve(element);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
