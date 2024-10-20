// Drag and drop functionality
const dropZone = document.getElementById("dropZone");
const preview = document.getElementById("preview");
const svgContainer = document.getElementById("svgContainer");
const svgInput = document.getElementById("svgInput");

// Prevent default behavior for drag and drop
dropZone.addEventListener("dragover", function (event) {
    event.preventDefault();
});

dropZone.addEventListener("drop", function (event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result; // Set the image source to the preview
                preview.style.display = "block"; // Show the preview
                svgContainer.innerHTML = ''; // Clear previous SVG content
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please drop a PNG or SVG file.");
        }
    }
});

// Open file explorer when drop zone is clicked
dropZone.addEventListener("click", function () {
    document.getElementById("fileInput").click();
});

// Handle file selection from the file input
document.getElementById("fileInput").addEventListener("change", function (event) {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = "block"; // Show the preview
                svgContainer.innerHTML = ''; // Clear previous SVG content
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a PNG or SVG file.");
        }
    }
});

// Function to prettify SVG XML
function prettifyXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "image/svg+xml");

    const serializer = new XMLSerializer();
    let prettyXML = serializer.serializeToString(xmlDoc);
    prettyXML = prettyXML.replace(/></g, ">\n<");
    return prettyXML;
}

// Event listener for SVG input
svgInput.addEventListener("input", (e) => {
    let svgData = e.target.value;
    if (svgData.startsWith("<svg")) {
        const prettifiedSVG = prettifyXML(svgData);
        svgInput.value = prettifiedSVG;
        svgContainer.innerHTML = prettifiedSVG; // Automatically render SVG
    }
});

// Reset button functionality
document.getElementById('reset-button').addEventListener('click', function () {
    svgContainer.innerHTML = '';
    preview.style.display = 'none';
    preview.src = '';
    svgInput.value = '';
});

// Enable dragging to scroll in the result container
let isDraggingContainer = false;
let startXContainer, startYContainer, scrollLeftContainer, scrollTopContainer;

const resultContainer = document.getElementById('resultContainer');

resultContainer.addEventListener('mousedown', (e) => {
    isDraggingContainer = true;
    startXContainer = e.pageX - resultContainer.offsetLeft;
    startYContainer = e.pageY - resultContainer.offsetTop;
    scrollLeftContainer = resultContainer.scrollLeft;
    scrollTopContainer = resultContainer.scrollTop;
    resultContainer.style.cursor = 'grabbing';
});

resultContainer.addEventListener('mouseleave', () => {
    isDraggingContainer = false;
    resultContainer.style.cursor = 'grab';
});

resultContainer.addEventListener('mouseup', () => {
    isDraggingContainer = false;
    resultContainer.style.cursor = 'grab';
});

resultContainer.addEventListener('mousemove', (e) => {
    if (!isDraggingContainer) return;
    e.preventDefault();
    const x = e.pageX - resultContainer.offsetLeft;
    const y = e.pageY - resultContainer.offsetTop;
    const walkX = (x - startXContainer) * 1; 
    const walkY = (y - startYContainer) * 1; 
    resultContainer.scrollLeft = scrollLeftContainer - walkX;
    resultContainer.scrollTop = scrollTopContainer - walkY; 
});
