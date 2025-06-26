// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the button and gallery elements
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// Listen for clicks on the "Get Space Images" button
getImagesButton.addEventListener('click', function () {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both a start and end date.');
    return;
  }

  // Show a loading message while we fetch images
  gallery.innerHTML = '<div class="loading-message">🔄 Loading space photos…</div>';

  // Build the NASA API URL
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from the NASA API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Call a function to show the images in the gallery
      showGallery(data);
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = '<p>Sorry, something went wrong. Please try again later.</p>';
      console.error(error);
    });
});

// This function displays the images in the gallery
function showGallery(items) {
  // Check if we got an array of items
  if (!Array.isArray(items) || items.length === 0) {
    gallery.innerHTML = '<p>No images found for this date range.</p>';
    return;
  }

  // Start with an empty string for the gallery HTML
  let html = '';

  // Go through each item and add it to the gallery
  for (const item of items) {
    if (item.media_type === 'image') {
      // Add a data attribute for modal details
      html += `
        <div class="gallery-item" 
          data-url="${item.url}"
          data-title="${item.title}"
          data-date="${item.date}"
          data-explanation="${item.explanation.replace(/"/g, '&quot;')}">
          <img src="${item.url}" alt="${item.title}" />
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        </div>
      `;
    } else if (item.media_type === 'video') {
      // If it's a video, embed it if possible or show a link
      let videoEmbed = '';
      // Try to embed YouTube or Vimeo videos
      if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
        // Extract YouTube video ID
        let videoId = '';
        if (item.url.includes('youtube.com')) {
          const urlParams = new URLSearchParams(item.url.split('?')[1]);
          videoId = urlParams.get('v');
        } else if (item.url.includes('youtu.be')) {
          videoId = item.url.split('/').pop();
        }
        if (videoId) {
          videoEmbed = `<iframe width="100%" height="250" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        }
      } else if (item.url.includes('vimeo.com')) {
        // Extract Vimeo video ID
        const videoId = item.url.split('/').pop();
        videoEmbed = `<iframe width="100%" height="250" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      }
      html += `
        <div class="gallery-item video-item">
          ${videoEmbed ? videoEmbed : `<a href="${item.url}" target="_blank" rel="noopener">Watch Video</a>`}
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        </div>
      `;
    }
  }

  // If there were no images (all were videos), show a message
  if (html === '') {
    gallery.innerHTML = '<p>No images found for this date range.</p>';
    return;
  }

  // Show the images in the gallery
  gallery.innerHTML = html;

  // Add click listeners to gallery items for modal
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      openModal({
        url: item.getAttribute('data-url'),
        title: item.getAttribute('data-title'),
        date: item.getAttribute('data-date'),
        explanation: item.getAttribute('data-explanation')
      });
    });
  });
}

// Modal logic
const imageModal = document.getElementById('imageModal');
const closeModalBtn = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

function openModal(data) {
  modalImage.src = data.url;
  modalTitle.textContent = data.title;
  modalDate.textContent = data.date;
  modalExplanation.textContent = data.explanation;
  imageModal.style.display = 'block';
}

closeModalBtn.addEventListener('click', function () {
  imageModal.style.display = 'none';
});

// Optional: Close modal when clicking outside modal content
window.addEventListener('click', function (event) {
  if (event.target === imageModal) {
    imageModal.style.display = 'none';
  }
});

// Fun array of 'Did You Know?' space facts
const spaceFacts = [
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second!",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? One million Earths could fit inside the Sun!",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter has 95 known moons!",
  "Did you know? Space is completely silent—there’s no air for sound to travel.",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? Saturn would float if you could put it in water!",
  "Did you know? The International Space Station travels at 28,000 km/h!"
];

// Pick a random fact
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Display the fact in the spaceFact div
const spaceFactDiv = document.getElementById('spaceFact');
spaceFactDiv.textContent = randomFact;
