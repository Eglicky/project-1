async function analyzeSite() {
  const siteUrl = document.getElementById("site-url").value;

  try {
    const response = await fetch(siteUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    displayMetadata(data);
    displayPages(data.pages || []);
  } catch (error) {
    console.error("Error fetching site data:", error);
    alert("Failed to fetch site data. Please check the URL or try again later.");
  }
}

function displayMetadata(data) {
  const metadataContainer = document.getElementById("site-metadata");
  
  metadataContainer.innerHTML = `
    <h2>Site Metadata</h2>
    <p><strong>Name:</strong> ${data.name || "N/A"}</p>
    <p><strong>Description:</strong> ${data.description || "N/A"}</p>
    <p><strong>Theme:</strong> ${data.theme ? JSON.stringify(data.theme) : "N/A"}</p>
    <p><strong>Created:</strong> ${data.created || "N/A"}</p>
    <p><strong>Last Updated:</strong> ${data.updated || "N/A"}</p>
    <p><strong>Hex Code:</strong> ${data.hexCode || "N/A"}</p>
    <img src="${data.logo || ""}" alt="Site Logo">
  `;
}

function displayPages(pages) {
  const pagesContainer = document.getElementById("site-pages");
  pagesContainer.innerHTML = ""; // Clear existing content
  
  pages.forEach(page => {
    const card = document.createElement("div");
    card.classList.add("page-card");

    card.innerHTML = `
      <h3>${page.title || "Untitled"}</h3>
      <p><strong>Description:</strong> ${page.description || "N/A"}</p>
      <a href="${page.url || "#"}" target="_blank">Visit Page</a>
    `;

    pagesContainer.appendChild(card);
  });
}
