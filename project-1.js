// Add event listener for Enter key press
document.getElementById("site-url").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    analyzeSite();
  }
});

async function analyzeSite() {
  let siteUrl = document.getElementById("site-url").value.trim();

  // Ensure the URL ends with /site.json
  if (!siteUrl.endsWith("/site.json")) {
    if (!siteUrl.endsWith("/")) siteUrl += "/";
    siteUrl += "site.json";
  }

  try {
    const response = await fetch(siteUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    // Display the main title of the site
    displayMainTitle(data.title || "Untitled Site");

    // Display the pages with proper image and metadata
    displayPages(data.items || [], siteUrl);
  } catch (error) {
    console.error("Error fetching site data:", error);
    alert("Failed to fetch site data. Please check the URL or try again later.");
  }
}

// Function to convert Unix timestamp to human-readable date
function formatDate(unixTimestamp) {
  if (!unixTimestamp || isNaN(unixTimestamp)) return "N/A";
  const date = new Date(unixTimestamp * 1000);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Function to get a valid image URL from images or files arrays
function getImageUrl(metadata, baseUrl) {
  // Check for images array
  if (metadata.images && metadata.images.length > 0) {
    const imageUrl = metadata.images[0];
    return imageUrl.startsWith("http") ? imageUrl : new URL(imageUrl, baseUrl).href;
  }

  // Check for files array with image type
  if (metadata.files && Array.isArray(metadata.files)) {
    const imageFile = metadata.files.find(file => file.type && file.type.startsWith("image/"));
    if (imageFile) {
      return imageFile.fullUrl.startsWith("http") ? imageFile.fullUrl : new URL(imageFile.fullUrl, baseUrl).href;
    }
  }

  // No image found
  return "";
}

function displayMainTitle(title) {
  const mainTitleContainer = document.getElementById("main-title");
  mainTitleContainer.innerHTML = `<h1>${title}</h1>`;
}

function displayPages(pages, baseUrl) {
  const pagesContainer = document.getElementById("site-pages");
  pagesContainer.innerHTML = ""; // Clear existing content

  const pageGrid = document.createElement("div");
  pageGrid.classList.add("page-grid");

  pages.forEach(page => {
    const { title, description, location, metadata } = page;
    const { created, updated } = metadata || {};
    const imageUrl = getImageUrl(metadata, baseUrl);

    // Convert Unix timestamps to readable dates
    const createdDate = formatDate(created);
    const updatedDate = formatDate(updated);

    // Create the card element
    const card = document.createElement("div");
    card.classList.add("page-card");

    card.innerHTML = `
      <h3>${title || "Untitled"}</h3>
      ${imageUrl ? `<img src="${imageUrl}" alt="Page Image" onerror="this.onerror=null; this.style.display='none';">` : ""}
      <p><strong>Description:</strong> ${description || "N/A"}</p>
      <p><strong>Created On:</strong> ${createdDate}</p>
      <p><strong>Last Updated:</strong> ${updatedDate}</p>
      <a href="${new URL(location, baseUrl).href}" target="_blank">Visit Page</a>
    `;

    pageGrid.appendChild(card);
  });

  pagesContainer.appendChild(pageGrid);
}
