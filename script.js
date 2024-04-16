//List

document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll(".sidebar-list li");

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      // Remove 'active' class from all links
      links.forEach(function (link) {
        link.classList.remove("active");
      });

      // Add 'active' class to the clicked link
      this.classList.add("active");
    });
  });

  document.getElementById("home-btn").addEventListener("click", resetView);
  
  document
    .getElementById("play-btn")
    .addEventListener("click", onPlayButtonClick);
  
  //document.getElementById('stopButton').addEventListener('click', stopPlayAnimation);

  document
    .getElementById("show-btn")
    .addEventListener("click", toggleHotspotsVisibility);
});

//Listener for sidebar collapse / expand
document.addEventListener("DOMContentLoaded", function () {
  var coll = document.getElementsByClassName("collapse-header");
  for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      var icon = this.querySelector(".collapse-icon");
      if (content.style.display === "block") {
        content.style.display = "none";
        //icon.textContent = '+'; // Change to your expand icon
      } else {
        content.style.display = "block";
        //icon.textContent = '−'; // Change to your collapse icon
      }
    });
  }
});


function onPlayButtonClick() {
  const playButton = document.getElementById("play-btn");
  // 
  const icon = playButton.querySelector(".icon-horizontal");
  const textSpan = playButton.querySelector("span");

  if (textSpan.textContent === "Play") {
    // Update to "Stop" state
    icon.src = "https://cdn.glitch.global/a1b1a317-1c06-4953-8f0a-8c480eeb0bdc/stop.svg?v=1712926910876"; // URL for the "Stop" icon
    textSpan.textContent = "Stop";
    showAllHotspots();
  } else {
    // Update to "Play" state
    icon.src = "https://cdn.glitch.global/a1b1a317-1c06-4953-8f0a-8c480eeb0bdc/play_arrow.svg?v=1712686105394"; // URL for the "Play" icon
    textSpan.textContent = "Play";
    stopPlayAnimation();
  }
}

//Old code
const modelViewer = document.querySelector("#hotspot-camera-view-demo");

document.addEventListener("DOMContentLoaded", function () {
  modelViewer.querySelectorAll(".view-button").forEach((hotspot) => {
    hotspot.addEventListener("click", () => annotationClicked(hotspot));
  });

  document.querySelectorAll(".sidebar-list li").forEach((item) => {
    item.addEventListener("click", () => itemClicked(item));
  });
});

function itemClicked(item) {
  const element = document.getElementById(item.textContent);
  annotationClicked(element);
}

let lightboxTimeoutID;

function annotationClicked(annotation) {
  let dataset = annotation.dataset;
  modelViewer.cameraTarget = dataset.target;
  modelViewer.cameraOrbit = dataset.orbit;
  modelViewer.fieldOfView = "25deg";

  lightboxTimeoutID = setTimeout(() => {
    openLightbox(annotation);
  }, 5000);
}

let timeoutID; // Stores the timeout ID

function showAllHotspots() {
  const hotspots = modelViewer.querySelectorAll(".view-button");
  let currentHotspot = 0;

  function showNextHotspot() {

    closeLightbox();
    if (currentHotspot < hotspots.length) {
      const hotspot = hotspots[currentHotspot];
      if (!hotspot.id.includes("show-hotspots")) {
        annotationClicked(hotspot);
      }
      currentHotspot++;
      // Save the timeout ID with the check for continuation inside the timeout
      timeoutID = setTimeout(showNextHotspot, 10000);
    } else {
      resetView();
      currentHotspot = 0;
    }
  }

  showNextHotspot();
}

// Function to stop the play animation
function stopPlayAnimation() {
  clearTimeout(timeoutID); // Clears the ongoing timeout
  clearTimeout(lightboxTimeoutID);
  resetView(); // Optionally reset the view or perform any cleanup
}




function resetView() {
  modelViewer.cameraOrbit = "90deg 70deg 15m";
  modelViewer.cameraTarget = "0m 1m 0m";
  modelViewer.fieldOfView = "45deg";
}

function toggleHotspotsVisibility() {
  // Assuming there's only one button for simplicity; adjust as needed
  const button = document.getElementById("show-btn");
  const icon = button.querySelector(".icon-horizontal");
  const textSpan = button.querySelector("span");

  const hotspotButtons = document.querySelectorAll(".view-button");
  let areHotspotsVisible = textSpan.textContent.includes("Hide");

  hotspotButtons.forEach((hotspotButton) => {
    // Toggle the visibility
    hotspotButton.style.display = areHotspotsVisible ? "none" : "";
  });

  if (textSpan.textContent === "Show") {
    // Update to "Hide" state
    icon.src =
      "https://cdn.glitch.global/a1b1a317-1c06-4953-8f0a-8c480eeb0bdc/remove_red_eye_closed.svg"; // URL for the "Hide" icon
    textSpan.textContent = "Hide";
  } else {
    // Update to "Show" state
    icon.src =
      "https://cdn.glitch.global/a1b1a317-1c06-4953-8f0a-8c480eeb0bdc/remove_red_eye.svg"; // URL for the "Show" icon, replace with your actual URL
    textSpan.textContent = "Show";
  }
}

let hotspotDetails;

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    hotspotDetails = data;
  });

function openLightbox(hotspot) {
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightbox-image");
  const modelViewer = document.getElementById("lightbox-model"); // Get the model viewer
  const name = document.getElementById("lightbox-name");
  const detailsContainer = document.getElementById("lightbox-details");

  // Clear previous details
  detailsContainer.innerHTML = "";

  // Assuming hotspotId is passed to this function correctly
  const hotspotId = hotspot.getAttribute("id");
  const details = hotspotDetails[hotspotId];

  // Update image and name
  image.src = details.image;
  name.textContent = details.name;

  // Hide the model viewer initially
  modelViewer.style.display = "none";
  image.style.display = "block"; // Make sure the image is visible

  // Save the model URL for later
  modelViewer.setAttribute("model-url", details.model); // Use a custom data attribute to store the model URL
  modelViewer.setAttribute("model-camera-orbit", details.camera_orbit);
  modelViewer.setAttribute("model-camera-target", details.camera_target);

  // Dynamically add subheaders and descriptions with classes for styling
  details.details.forEach((detail) => {
    // Header Element
    const headerElement = document.createElement("div");
    headerElement.innerHTML = `<strong>${detail.subheader}</strong>`; // Render as HTML
    headerElement.classList.add("lightbox-subheader"); // Add class for styling
    detailsContainer.appendChild(headerElement);

    // Description Element
    const descriptionElement = document.createElement("div");
    descriptionElement.innerHTML = detail.description; // Render as HTML
    descriptionElement.classList.add("lightbox-description"); // Add class for styling
    detailsContainer.appendChild(descriptionElement);
  });

  lightbox.style.display = "flex";
}


function closeLightbox() {
  var image = document.getElementById("lightbox-image");
  var lightboxLeft = document.getElementById("lightbox-left");
  var lightboxRight = document.getElementById("lightbox-right");
  var modelViewer = document.getElementById("lightbox-model");
  var view3DButton = document.getElementById("3d-view-btn");
  var buttonText = view3DButton.querySelector("span"); // Assuming the button text is within a <span> tag

  // Check if the model viewer is currently displayed
  if (modelViewer.style.display === "block") {
    // Reset to initial state: Hide the model viewer, show the image and text
    modelViewer.style.display = "none";
    image.style.display = "block";
    lightboxLeft.style.width = "50%";
    lightboxRight.style.width = "50%";
    lightboxRight.style.display = "block";
    buttonText.textContent = "View in 3D"; // Reset button text
  }

  // Finally, hide the lightbox
  document.getElementById("lightbox").style.display = "none";
}


//Add Event Listener for the "View in 3D" Button
document.getElementById("3d-view-btn").addEventListener("click", function () {
  var image = document.getElementById("lightbox-image");
  var lightboxLeft = document.getElementById("lightbox-left");
  var lightboxRight = document.getElementById("lightbox-right");
  var modelViewer = document.getElementById("lightbox-model");
  var buttonText = this.querySelector("span"); // Assuming the button text is within a <span> tag
  var modelUrl = modelViewer.getAttribute("model-url"); // Get the model URL
  var modelOrbit = modelViewer.getAttribute("model-camera-orbit");
  var modelTarget = modelViewer.getAttribute("model-camera-target");

  if (image.style.display !== "none") {
    // Load and show the model viewer, hide the image
    image.style.display = "none";
    lightboxLeft.style.width = "100%";
    lightboxRight.style.width = "0%";
    lightboxRight.style.display = "none";
    modelViewer.style.display = "block";
    modelViewer.setAttribute("src", modelUrl); // Dynamically set the model source
    modelViewer.setAttribute("camera-orbit", modelOrbit);
    modelViewer.setAttribute("camera-target", modelTarget);
    buttonText.textContent = "Close 3D View"; // Change button text
  } else {
    // Hide the model viewer, show the image
    modelViewer.style.display = "none";
    image.style.display = "block";
    lightboxLeft.style.width = "50%";
    lightboxRight.style.width = "50%";
    lightboxRight.style.display = "block";
    buttonText.textContent = "View in 3D"; // Reset button text
  }
});


// Function to open fullscreen mode
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen(); // Standard syntax
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

// Function to close fullscreen mode
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen(); // Standard syntax
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}


document.getElementById("full-screen-btn").addEventListener("click", function () {
  var image = this.querySelector("img");
  if (image.alt == 'Open Fullscreen button'){
    // Get the document's element (you can also use any other element)
    var elem = document.documentElement;
    // Call the function to open the document in full screen
    openFullscreen(elem);
    image.alt = 'Close Fullscreen button';
    image.src = 'https://cdn.glitch.global/a1b1a317-1c06-4953-8f0a-8c480eeb0bdc/fullscreen_exit.svg'
  }
  else{
    // Call the function to exit full screen
    closeFullscreen();
    image.alt = 'Open Fullscreen button';
    image.src = 'https://cdn.glitch.global/a1b1a317-1c06-4953-8f0a-8c480eeb0bdc/fullscreen.svg'    
  }  
});


var show_popup = true;
document.getElementById("rotate-popup-close-btn").addEventListener("click", function () {
   show_popup = false;
   checkOrientation();
  });

function checkOrientation() {
    const rotatePrompt = document.getElementById('rotateDevicePrompt');
    if ((window.innerHeight > window.innerWidth) && (show_popup)) {
        // If the height is greater than the width, assume portrait mode
        rotatePrompt.style.display = 'flex';
    } else {
        // Otherwise, assume landscape mode
        rotatePrompt.style.display = 'none';
    }
}

// Check the orientation when the page is loaded
window.addEventListener('load', checkOrientation);

// Check the orientation when the viewport size changes, e.g., when rotating the device
window.addEventListener('resize', checkOrientation);


//Function to show / hide togglebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleButton = document.getElementById('toggle-sidebar');
  // Fix the selector if toggle-sidebar-icon is a class or adjust accordingly if it's an ID
  const toggleIcon = toggleButton.querySelector('.toggle-sidebar-icon'); // If it's a class
  const modelViewer = document.getElementById('hotspot-camera-view-demo');

  if (sidebar.style.display === 'none') {
    // If the sidebar is hidden, show it
    sidebar.style.display = 'block';
    modelViewer.style.width = '80%';
    // Ensure the icon rotates back to its original state
    toggleIcon.classList.remove('rotate');
  } else {
    // If the sidebar is visible, hide it
    sidebar.style.display = 'none';
    modelViewer.style.width = '100%';
    // Rotate the icon
    toggleIcon.classList.add('rotate');
  }
}

//Listener to show / hide sidebar
document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);
document.getElementById('sidebar-header').addEventListener('click', toggleSidebar);
