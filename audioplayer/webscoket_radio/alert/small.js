(function () {
  const popupContainerId = "popup-container";

const createPopup = ({ id, popup, fulltext }) => {
  if (!popup || !popup.title || !popup.shortdesc) return;

  const container = document.getElementById(popupContainerId) || (() => {
    const c = document.createElement("div");
    c.id = popupContainerId;
    c.style.position = "fixed";
    c.style.top = "10px";
    c.style.right = "10px";
    c.style.zIndex = "9999";
    c.style.display = "flex";
    c.style.flexDirection = "column";
    c.style.gap = "10px";
    document.body.appendChild(c);
    return c;
  })();

  const box = document.createElement("div");
  box.style.background = "white";
  box.style.border = `2px solid ${popup["outline-hex"] || "#000"}`;
  box.style.borderRadius = "8px";
  box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  box.style.padding = "10px 15px";
  box.style.width = popup.icon ? "320px" : "280px"; // widen if icon
  box.style.fontFamily = "Arial, sans-serif";
  box.style.opacity = "0";
  box.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  box.style.transform = "translateY(-10px)";
  box.style.backgroundClip = "padding-box";
  box.style.display = "flex";
  box.style.flexDirection = "row";
  box.style.alignItems = "flex-start";
  box.style.gap = "10px";

  requestAnimationFrame(() => {
    box.style.opacity = "1";
    box.style.transform = "translateY(0)";
  });

  // If there's an icon, add it on the left
  if (popup.icon) {
    const iconWrapper = document.createElement("div");
    iconWrapper.style.flexShrink = "0";
iconWrapper.style.width = "40px";
iconWrapper.style.height = "40px";
iconWrapper.style.display = "flex";
iconWrapper.style.alignItems = "center";
iconWrapper.style.justifyContent = "center";
iconWrapper.style.fontSize = "24px";
iconWrapper.style.lineHeight = "1";
    iconWrapper.innerHTML = `<img src="${popup.icon}" alt="icon" style="max-width: 100%; max-height: 100%;">`;


    box.appendChild(iconWrapper);
  }

  const content = document.createElement("div");
  content.style.flex = "1";

  const title = document.createElement("div");
  title.innerHTML = `📰 <strong>${popup.title}</strong>`;
  title.style.fontSize = "16px";
  title.style.marginBottom = "6px";
  title.style.color = "#000000";

  const desc = document.createElement("div");
  desc.innerHTML = `💬 ${popup.shortdesc}`;
  desc.style.fontSize = "14px";
  desc.style.marginBottom = "6px";
  desc.style.color = "#000000";

//  const link = document.createElement("button");
//  link.textContent = "🔗 Read more";
//  link.style.fontSize = "14px";
//  link.style.color = "#007BFF";
//  link.style.border = "none";
//  link.style.background = "none";
//  link.style.cursor = "pointer";
//  link.style.padding = "0";
//  link.onclick = () => {
//    const url = new URL("popup", location.origin);
//    const hash = new URLSearchParams({
//      title: encodeURIComponent(popup.title),
//      fulltext: encodeURIComponent(fulltext),
//      outline: encodeURIComponent(popup["outline-hex"] || "#000")
//    }).toString();
//
//    window.open(`${url}#${hash}`, "_blank");
//  };

  const progressBar = document.createElement("div");
  progressBar.style.height = "4px";
  progressBar.style.background = popup["lifetimebar-hex"] || "#007BFF";
  progressBar.style.borderRadius = "2px";
  progressBar.style.marginTop = "8px";
  progressBar.style.transition = `width ${popup.lifetimems || 3000}ms linear`;
  progressBar.style.width = "100%";

  content.appendChild(title);
  content.appendChild(desc);
  content.appendChild(link);
  content.appendChild(progressBar);
  box.appendChild(content);
  container.appendChild(box);

  setTimeout(() => {
    progressBar.style.width = "0%";
  }, 50);

  setTimeout(() => {
    box.style.opacity = "0";
    box.style.transform = "translateY(-10px)";
    setTimeout(() => container.removeChild(box), 400);
  }, popup.lifetimems || 3000);
};


  window.showSmallPopup = (data) => {
    try {
      createPopup(data);
    } catch (err) {
      console.error("Failed to show popup:", err);
    }
  };
window.file1func = (data) => {
  try {
    createPopup(data);
  } catch (err) {
    console.error("Failed to show popup:", err);
  }
};

})();
