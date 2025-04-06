/* Page class that represents each of the webpages */
class Page { 
    constructor(title, inputList, infotext) {
        this.title = title; 
        this.inputList = inputList; 
        this.infotext = infotext; 
    }

    loadPage() {
        header.innerHTML = ""; 
        infoimg.title = ""; 
        while(inputdiv.firstChild) {
            inputdiv.removeChild(inputdiv.firstChild);
        }
        header.innerHTML = this.title; 
        infoimg.title = this.infotext; 
        this.inputList.forEach((element) => inputdiv.appendChild(element));
    }
}

/* Tab class that can represent each of the user's open tabs */
class Tab {
    constructor (tabname, icon, url) {
        this.tabname = tabname; 
        this.icon = icon; 
        this.url = url; 
    }
}

const backbutton = document.getElementById("backbutton"); 
const forwardbutton = document.getElementById("forwardbutton"); 
const infoimg = document.getElementById("infoimg");
const header = document.getElementById("header"); 
const inputdiv = document.getElementById("inputdiv"); 
const footer = document.getElementById("footer");

preferences = []; 
tabsList = []; 
pages = loadPages(); 

pointer = 0; 
currentpage = pages[pointer];
currentpage.loadPage();

// functionality for back and next buttons 
backbutton.addEventListener("click", goLastPage);
forwardbutton.addEventListener("click", goNextPage);

// Function to fetch and display productive percentage after running the Python script
function fetchAndDisplayProductivePercent() {
    // Send a POST request to the backend to run main.py and calculate productive percentage
    fetch('http://127.0.0.1:5000/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Assuming the response contains 'productive_percent'
        const productivePercent = data.productive_percent;
        
        // Display the percent on the page dynamically
        document.getElementById('productive-percent').innerText = `${productivePercent}%`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Load pages for navigation
function loadPages() {
    // Page to show the productive percent (single tab display)
    const productivePageInfo = "This is where your productive percentage will be shown dynamically.";

    // Creating the "Productive Display" page
    const productiveDisplayPageInputs = [
        createProductiveDisplayTab(),
        createStartButton()  // Button to start the program
    ];

    const productivePage = new Page("Productive Percentage: ", productiveDisplayPageInputs, productivePageInfo);

    return [productivePage];  // Only one page to display the percent
}

// Create a single tab to display the productive percentage
function createProductiveDisplayTab() {
    const tabDiv = document.createElement("div");

    const percentTitle = document.createElement("h2");
    percentTitle.innerText = "Productive Time Percentage:";

    const percentValue = document.createElement("span");
    percentValue.id = "productive-percent";
    percentValue.innerText = "0";  // Initial value

    // Add the title and the value to the div
    tabDiv.appendChild(percentTitle);
    tabDiv.appendChild(percentValue);

    return tabDiv;
}

// Create a "Start" button to turn the program on
function createStartButton() {
    const button = document.createElement("button");
    button.id = "startbutton";
    button.innerText = "Start Tracking";
    button.addEventListener("click", function() {
        // Once the button is clicked, run main.py and display the productive percentage
        fetchAndDisplayProductivePercent();
        button.disabled = true;  // Disable the button after it's clicked
        button.innerText = "Tracking";  // Change button text
    });

    return button;
}

// Page navigation functions (if required)
function goNextPage() {
    if(pointer == 0) {
        currentpage = pages[pointer].loadPage(); 
    }
}

function goLastPage() {
    if(pointer == 0) {
        currentpage = pages[0].loadPage(); 
    }
}
