async function analyzeSite() {
  const siteUrl = document.getElementById("site-url").value;
  try {
    const response = await fetch(siteUrl);
    const data = await response.json();
    displayMetadata(data);
    displayPages(data.pages || []); // Handles if 'pages' is missing
  } catch (error) {
    console.error("Error fetching site data:", error);
    alert("Failed to fetch site data. Please check the URL or try again later.");
  }
}

/**
 * Displays main site metadata.
 * @param {Object} data - The site JSON data.
 */
function displayMetadata(data) {
  const metadataContainer = document.getElementById("metadata");
  metadataContainer.innerHTML = `
    <h2>Site Metadata</h2>
    <div class="metadata-item"><strong>Name:</strong> ${data.name || "N/A"}</div>
    <div class="metadata-item"><strong>Description:</strong> ${data.description || "N/A"}</div>
    <div class="metadata-item"><strong>Theme:</strong> ${data.metadata?.theme || "N/A"}</div>
    <div class="metadata-item"><strong>Created:</strong> ${data.metadata?.created || "N/A"}</div>
    <div class="metadata-item"><strong>Last Updated:</strong> ${data.metadata?.updated || "N/A"}</div>
    <div class="metadata-item"><strong>Hex Code:</strong> <span style="color:${data.metadata?.hexCode || '#000'}">${data.metadata?.hexCode || "N/A"}</span></div>
    <img src="${data.metadata?.logo || ''}" alt="Site Logo" style="max-width: 150px; margin-top: 10px;">
  `;
}

/**
 * Displays cards for each page in the site.
 * @param {Array} pages - Array of page objects.
 */
function displayPages(pages) {
  const pagesContainer = document.getElementById("pages-container");
  pagesContainer.innerHTML = ""; // Clear existing cards
  pages.forEach(page => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${page.thumbnail || 'https://via.placeholder.com/150'}" alt="Page Thumbnail">
      <h3>${page.title || "Page Title"}</h3>
      <p><strong>Last Updated:</strong> ${page.metadata?.updated || "N/A"}</p>
      <p><strong>Description:</strong> ${page.description || "No description available."}</p>
      <p><a href="${page.location}" target="_blank">Open Content</a></p>
      <p><a href="${page.source}" target="_blank">Open Source</a></p>
    `;
    pagesContainer.appendChild(card);
  });
}
