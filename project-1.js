async function analyzeSite() {
  const siteUrl = document.getElementById("site-url").value;

  try {
    const response = await fetch(siteUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    displayMetadata(data.items[0] || {}); // Display metadata for the first listed page
    displayPages(data.items || [], siteUrl);
  } catch (error) {
    console.error("Error fetching site data:", error);
    alert("Failed to fetch site data. Please check the URL or try again later.");
  }
}

function formatDate(dateString) {
  if (!dateString || isNaN(Date.parse(dateString))) return "N/A";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function getValidIconUrl(iconUrl, baseUrl) {
  // If the icon URL is relative, prepend the base URL
  if (iconUrl && !iconUrl.startsWith("http")) {
    return new URL(iconUrl, baseUrl).href;
  }
  return iconUrl || "https://haxtheweb.org/assets/default-icon.png"; // Use default icon if missing
}

function displayMetadata(page) {
  const metadataContainer = document.getElementById("site-metadata");
  const { title, description, location, metadata } = page;
  const { icon, created, updated } = metadata || {};
  const iconUrl = getValidIconUrl(icon, "https://haxtheweb.org");

  metadataContainer.innerHTML = `
    <h2>Page Metadata</h2>
    <h3>${title || "Untitled"}</h3>
    <img src="${iconUrl}" alt="Page Icon" style="max-width: 150px;" onerror="this.onerror=null; this.src='https://haxtheweb.org/assets/default-icon.png'; this.alt='Icon not found';">
    <p><strong>Description:</strong> ${description || "N/A"}</p>
    <p><strong>Created On:</strong> ${formatDate(created)}</p>
    <p><strong>Last Updated:</strong> ${formatDate(updated)}</p>
    <a href="${location || "#"}" target="_blank">Visit Page</a>
  `;
}

function displayPages(pages, baseUrl) {
  const pagesContainer = document.getElementById("site-pages");
  pagesContainer.innerHTML = ""; // Clear existing content

  const pageGrid = document.createElement("div");
  pageGrid.classList.add("page-grid");

  pages.forEach(page => {
    const { title, description, location, metadata } = page;
    const { icon, updated, created } = metadata || {};
    const iconUrl = getValidIconUrl(icon, baseUrl);

    const card = document.createElement("div");
    card.classList.add("page-card");

    card.innerHTML = `
      <h3>${title || "Untitled"}</h3>
      <img src="${iconUrl}" alt="Page Icon" onerror="this.onerror=null; this.src='https://haxtheweb.org/assets/default-icon.png'; this.alt='Icon not found';">
      <p><strong>Description:</strong> ${description || "N/A"}</p>
      <p><strong>Created On:</strong> ${formatDate(created)}</p>
      <p><strong>Last Updated:</strong> ${formatDate(updated)}</p>
      <a href="${location || "#"}" target="_blank">Visit Page</a>
    `;

    pageGrid.appendChild(card);
  });

  pagesContainer.appendChild(pageGrid);
}
