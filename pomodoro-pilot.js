/* Page class that can represent each of the webpages */
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

/* Tab class that can represent each of the user's open tabs through their tab name and icon */
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

// const pages = [durationPage, selectPage, confirmPage];
pointer = 0; 
currentpage = pages[pointer];
currentpage.loadPage();

currentpage.


// functionality for back and next buttons 
backbutton.addEventListener("click", goLastPage);
forwardbutton.addEventListener("click", goNextPage);

function loadPages() {
    // making the elements and creating the object that represents the landing page 
    const startbutton = document.createElement("button");
    startbutton.id = "startbutton"; 
    startbutton.style.borderRadius = "10px";
    startbutton.innerHTML = "Get started!"; 
    startbutton.addEventListener("click", function() {
        footer.style.display = "inline"; 
        goNextPage(); 
    });
    const landingPageInputs = [startbutton]; 
    const landingInfo = "Nothing to see here!";
    const landingPage = new Page("Welcome to Pomo Pilot!", landingPageInputs, landingInfo);

    // making the elements and creating the object that represents the duration page (choosing how many intervals to cycle through)
    const timeSlider = document.createElement("input");
    timeSlider.id = "timeslider"; 
    timeSlider.type = "range"; 
    timeSlider.min = 1; 
    timeSlider.max = 6; 
    timeLabel = document.createElement("div"); 
    timeLabel.id = "timelabel"; 
    timeSlider.addEventListener("input", function(event) {
        time = timeSlider.value;
    if(time <= 4) {
        timeLabel.innerHTML = String(time*30) + " minutes";
    } else { 
        timeLabel.innerHTML = String((4*30) + (time-4)*40) + " minutes";
    }
    });

    const durationPageInputs = [timeSlider, timeLabel];
    const durationInfo = "Slide the slider to indicate how many intervals of the Pomodoro method you want to study for. Ranges from 1 interval (~30 mins) to 6 intervals (~3.3 hours)" ; 
    const durationPage = new Page("Choose duration: ", durationPageInputs, durationInfo);

    // making the elements and creating the object that represents the tab selection page 
    selectPageInputs = []; 
    tabsList.forEach((tab) => { selectPageInputs.append(tab) });

    const selectInfo = "Click all of the buttons corresponding to your tabs that you would like to be part of your study session"; 
    const selectPage = new Page("Select tabs: ", selectPageInputs, selectInfo);

    // making the elements and creating the object that represents the session confirmation page 
    const confirmButton = document.createElement("button");
    confirmButton.id = "confirmbutton";
    confirmButton.innerHTML = "Start"; 
    confirmButton.addEventListener("click", () => {
        launchTimer(getPreferences); 
    });

    const confirmPageInputs = [confirmButton]; 
    const confirmInfo = "Go back and check that all the information you selected is what you want for your upcoming Pomodoro study session!";
    const confirmPage = new Page("Confirm session: ", confirmPageInputs, confirmInfo);

    // making the elements and creating the object that represents the final timer page for the pomodoro study session 

    const timerPage = new Page("time", [], ""); 

    return [landingPage, durationPage, selectPage, confirmPage, timerPage];
}

// functions for page navigation
function goNextPage() {
    if(pointer == 1) {
        currentpage = pages[pointer++].loadPage(); 
        tabList = getTabs(); 

    }

    if(pointer == pages.length-1) {
        currentpage = pages[pages.length-1].loadPage();
    } else { 
        pointer++; 
        currentpage = pages[pointer].loadPage();
    }
}

function goLastPage() {
    if(pointer == 3) {
        currentpage = pages[pointer--].loadPage(); 
        tabsList = getTabs(); 
    }

    if(pointer == 0) {
        currentpage = pages[0].loadPage();
    } else { 
        pointer--; 
        currentpage = pages[pointer].loadPage();
    }
}

// function to ensure that even when there is no valid url to take, it does not break the program
function getFallbackFavicon(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}`;
    } catch {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkEEjAYQp2U1QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAJUlEQVQ4y2NgGAWjYBSMglEwCkbBKBgYwMjIyPgfxQ5qGAMDAwAAJQID0QjQ1QAAAABJRU5ErkJggg==';
    }
}

// creates buttons that correspond to each tab opened by the user in google chrome 
function createTabButton(tab) {
    const button = document.createElement("button"); 

    const icon = document.createElement("img");
    icon.src = tab.favIconUrl || getFallbackFavicon(tab.url);

    const title = document.createElement("span");
    title.textContent = tab.title || "Untitled tab"; 

    button.dataset.title = tab.title || ""; 
    button.dataset.url = tab.url; 

    button.appendChild(icon); 
    button.appendChild(title); 
    tabsList.append(button); 
}

// retrieves all tab data from tabs opened by the user 
function getTabs() {
    chrome.tabs.query({}, (tabs) => { 
        tabsList = []; 
        if(tabs.length === 0) {
            return; 
        }

        tabs.forEach(tab => { createTabButton(tab) });
    });
}

// function to grab all the settings from which the user selected and confirmed their session
function getPreferences() {

}

function launchTimer () {

}