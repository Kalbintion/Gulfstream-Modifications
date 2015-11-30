// ==UserScript==
// @updateURL    https://raw.githubusercontent.com/Kalbintion/Gulfstream-Modifications/master/Main.js
// @name         Gulf Stream Modifications
// @namespace    https://gulfstream.fidlar.com
// @version      0.14
// @description  Modifies the Gulfstream website in various ways to provide a better user interface
// @author       Kalbintion
// @include		 https://gulfstream.fidlar.com/Views/GulfStream/GulfStream*
// @grant        none
// @icon         https://gulfstream.fidlar.com/Content/Images/favicon.ico
// @icon64       https://gulfstream.fidlar.com/Content/Images/favicon.ico
// ==/UserScript==


// ==========================================================================================================
// Settings
// ==========================================================================================================
// For Keycodes see http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// Use -1 to disable
var KEY_LAST_DOCUMENT = -1; // Goes to the previous document
var KEY_NEXT_DOCUMENT = -1; // Goes to the next document
var KEY_ADD_PAGE = 107; // Adds page to document
var KEY_NEXT_DOCUMENT_FOCUS = -1; // Focuses input onto Document name textbox
var KEY_PAGE_NUMBER_FOCUS = -1; // Focuses input onto page number textbox
var KEY_RENAME_YES = -1; // "Yes" on the rename dialog
var KEY_RENAME_NO = -1; // "No" on the rename dialog
var KEY_MULTI_DOC = 106; // Brings up the multiple document window
var KEY_BLANK_PAGE = 111; // Marks page as blank
var KEY_UNDO = -1; // Undo button (black toolbar, <)
var KEY_REDO = -1; // Redo button (black toolbar, >)
var KEY_CCW_ROTATE = -1; // Counter-clockwise rotate (black toolbar, < circle)
var KEY_CW_ROTATE = -1; // Clockwise rotate (black toolbar, > circle)
var KEY_AUTO_SCROLL = 110; // Auto-scrolling feature

// Auto-scroll settings
var SCROLL_SPEED = 10;
var SCROLL_AMOUNT = 6;

// Module enable/disable
var allowImageLocModification = true; // This module tries to modify the image on the screen to its original
var allowTimer = true; // This module adds a timer to the upper left of the page area indicating log in time


// ==========================================================================================================
// Key Shortcuts
// ==========================================================================================================
document.body.addEventListener("keydown", keyDownTextField, false);
function keyDownTextField(e) {
    // console.log(e.keyCode);
    var code = e.keyCode;
    switch ( code )
    {
        case KEY_LAST_DOCUMENT:
            document.getElementById("MainContent_DefaultMainContent_lbLastDocument").click();
            break;
        case KEY_NEXT_DOCUMENT:
            document.getElementById("MainContent_DefaultMainContent_lbNextDocument").click();
            break;
        case KEY_ADD_PAGE:
            document.getElementById("MainContent_DefaultMainContent_RadButtonAddPage").click();
            break;
        case KEY_NEXT_DOCUMENT_FOCUS:
            document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_TextBoxNextDocument").focus();
            break;
        case KEY_PAGE_NUMBER_FOCUS:
            document.getElementById("MainContent_DefaultMainContent_CurrentPageNumber").focus();
            break;
        case KEY_RENAME_YES:
            document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadWindowRenameDocument_C_RadButtonYes").click();
            break;
        case KEY_RENAME_NO:
            document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadWindowRenameDocument_C_RadButtonNo").click();
            break;
        case KEY_MULTI_DOC:
            document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_Arrow").click();document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_DropDown").lastChild.lastChild.lastChild.click();
            break;
        case KEY_BLANK_PAGE:
            document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_Arrow").click();document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_DropDown").lastChild.lastChild.children[2].click();
            break;
        case KEY_UNDO:
            document.getElementsByClassName("darkroom-toolbar-actions")[0].children[0].children[0].click();
            break;
        case KEY_REDO:
            document.getElementsByClassName("darkroom-toolbar-actions")[0].children[0].children[1].click();
            break;
        case KEY_CCW_ROTATE:
            document.getElementsByClassName("darkroom-toolbar-actions")[0].children[1].children[0].click();
            break;
        case KEY_CW_ROTATE:
            document.getElementsByClassName("darkroom-toolbar-actions")[0].children[1].children[1].click();
            break;
        case KEY_AUTO_SCROLL:
            document.getElementById("autoScroll_chk").checked = !document.getElementById("autoScroll_chk").checked;
            updateAutoScrollSetting();
            break;
        default:
            break;
    }
}

// ==========================================================================================================
// Modifies the image link to show original image
// ==========================================================================================================
var imageLinkTimer;
if (allowImageLocModification) {
    imageLinkTimer = setInterval(ModifyImageLink, 250);
}

function ModifyImageLink() {
    var obj = document.getElementById("documentImage");
    if(obj === null) {
        clearInterval(imageLinkTimer);
        return;
    } else if(obj.src.indexOf("index") != -1) {
        obj.src = obj.src.replace("index?", "OriginalImage?");
        obj.style.display = "";
        obj.style.width = "1150px";
    }
}

// ==========================================================================================================
// Multidoc Window Button Position
// ==========================================================================================================
var multidocTimer = setInterval(ModifyMultidoc, 250);
function ModifyMultidoc() {
    var obj = document.getElementById("RadWindowWrapper_ctl00_ctl00_MainContent_DefaultMainContent_RadWindowMultipleImages");
    if(obj === null) {
        // clearInterval(multidocTimer);
        return;
    } else {
        var parentGroup = document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadWindowMultipleImages_C").children[0];
        var buttonGroup = document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadWindowMultipleImages_C").children[0].lastElementChild;
        if(~buttonGroup.innerHTML.indexOf("button")) {
            parentGroup.insertBefore(buttonGroup, document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadWindowMultipleImages_C").children[0].children[0]);
        }
    }
}

// ==========================================================================================================
// Time Tracking System
// ==========================================================================================================
// Login Timer Div
var divLoginTimer = document.createElement("div");
divLoginTimer.id = "loginTimer_div";
divLoginTimer.style.color = "#FFF";
divLoginTimer.style.position = "absolute";
divLoginTimer.style.left = "25px";
divLoginTimer.style.top = document.getElementsByTagName("nav")[0].offsetHeight + 22 + "px";

// Login Timer Input
var inputLoginTimer = document.createElement("input");
inputLoginTimer.id = "loginTimer";
inputLoginTimer.disabled = "disabled";
inputLoginTimer.value = "0h 0m 0s";
inputLoginTimer.style.border = "1px solid black";
inputLoginTimer.style.color = "#FFF";
inputLoginTimer.style.backgroundColor = "#000";
inputLoginTimer.style.padding = "1px 5px";
inputLoginTimer.style.width = "100px";
divLoginTimer.innerHTML = "Timer: ";
divLoginTimer.appendChild(inputLoginTimer);

// Reset Button
var inputResetButton = document.createElement("input");
inputResetButton.id = "loginTimerReset";
inputResetButton.type = "button";
inputResetButton.onclick=timeReset;
inputResetButton.value="Reset";
inputResetButton.style.border = "1px solid black";
inputResetButton.style.backgroundColor = "#000";
inputResetButton.style.padding = "1px 5px";
divLoginTimer.appendChild(document.createElement("br"));
divLoginTimer.appendChild(inputResetButton);

// Append the timer to the page
document.body.appendChild(divLoginTimer);
// onbeforeunload Event
window.addEventListener("beforeunload", function(e){
    setCookie("unloadTime", Date());
}, false);

// Initiate the tracker
timeTrackerInit();

function timeTrackerInit() {
    if(getCookieValue("startTime") !== null) {
        // We have a startTime from before - do the difference on the dates and push it to logged time
        var startDate = new Date(getCookieValue("startTime"));
        var tickDate = new Date(getCookieValue("tickTime"));
        setCookie("time", Number(getCookieValue("time")) + getTimeDifference(startDate, tickDate));
    }

    // Page Load Check (Continuation)
    if(getCookieValue("unloadTime") !== null && getCookieValue("unloadTime") !== "") {
        var pageLoadTime = getTimeDifference(new Date(getCookieValue("unloadTime")), Date());
        console.log("pageLoadTime: " + pageLoadTime);
        if(pageLoadTime <= 10000) { // Only triggers if it has been less than 10 seconds
            setCookie("time", Number(getCookieValue("time")) + pageLoadTime);
            setCookie("unloadTime", null);
        }
    }

    // Reset both tickTime and startTime to now after calculations have been completed
    setCookie("startTime", Date());
    setCookie("tickTime", Date());

    // Initiate the timer
    setInterval(timeUpdate, 1000, inputLoginTimer);

    // Update display immediately
    timeUpdateDisplay(inputLoginTimer);
}

function timeUpdateDisplay(obj) {
    // Existing + Unaccounted marked time
    var milliseconds = (Number(getCookieValue("time")) + Number(getTimeDifference(getCookie("startTime"), getCookie("tickTime")))) / 1000;
    var sec = Math.floor(milliseconds) % 60;
    var min = Math.floor(milliseconds / 60) % 60;
    var hr = Math.floor(milliseconds / 60 / 60);

    obj.value = hr + "h " + min + "m " + sec + "s";
    obj.title = milliseconds + "s";
}

function timeUpdate(obj) {
    setCookie("tickTime", Date());
    timeUpdateDisplay(obj);
}

function getTimeDifference(date1, date2) {
    return new Date(date2).getTime() - new Date(date1).getTime();   
}

function timeReset() {
    var res = confirm("Do you wish to reset the time?");
    if(res === true) {
        setCookie("time", "0");
        setCookie("startTime", Date());
        setCookie("tickTime", Date());
    }
}

// ==========================================================================================================
// Auto-scroll Document
// ==========================================================================================================
// Container object
var divAutoScroll = document.createElement("div");
divAutoScroll.id = "autoScroll_div";
divAutoScroll.style.color = "#FFF";
divAutoScroll.style.position = "absolute";
divAutoScroll.style.left = "25px";
divAutoScroll.style.top = document.getElementsByTagName("nav")[0].offsetHeight + 82 + "px";

// Label
var lblAutoScroll = document.createElement("label");
lblAutoScroll.id="autoScroll_lbl";
lblAutoScroll.htmlFor="autoScroll_chk";
lblAutoScroll.innerHTML="Auto-Scroll";

// Checkbox
var chkAutoScroll = document.createElement("input");
chkAutoScroll.type = "checkbox";
chkAutoScroll.id = "autoScroll_chk";
chkAutoScroll.onchange = updateAutoScrollSetting;
chkAutoScroll.checked = Boolean(getCookieValueDef("autoScroll", "").replace("false", ""));

divAutoScroll.appendChild(chkAutoScroll);
divAutoScroll.appendChild(lblAutoScroll);

document.body.appendChild(divAutoScroll);

setInterval(scrollDocument, SCROLL_SPEED);

function scrollDocument() {
    if(document.getElementById("autoScroll_chk").checked) {
        document.getElementById("imageWrapper").scrollTop += SCROLL_AMOUNT;
    }
}

function updateAutoScrollSetting() {
    console.log("autoScroll = " + document.getElementById("autoScroll_chk").checked);
    setCookie("autoScroll", document.getElementById("autoScroll_chk").checked);
}

// timer & auto-scroll div location reset on resize
window.addEventListener("resize", function(e) {
    divLoginTimer.style.top = document.getElementsByTagName("nav")[0].offsetHeight + 22 + "px";
    divAutoScroll.style.top = document.getElementsByTagName("nav")[0].offsetHeight + 82 + "px";
});

// ==========================================================================================================
// Digit Prefix
// ==========================================================================================================
document.getElementsByClassName("container-fluid")[0].addEventListener("DOMSubtreeModified", prefixTextfield);
// Trigger function once on page loads, requires srcElement.id=imageWrapper
prefixTextfield({srcElement:{id:"imageWrapper"}});

function prefixTextfield(e) {
    console.log(e);
    if(e.srcElement.id == "imageWrapper") {
        var input = document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_TextBoxNextDocument");
        var count = 0;
        for(var i =0; i < input.value.length; i++) {
            if(input.value.charAt(i) == "_") {
                count++;
            }
        }

        // console.log("0".repeat(count) + input.value);
        var res = Number(input.value.replace(/_/g, ""));

        // Predictability
        var lastPageNumber = document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadGridDocuments_ctl00").children[2].children[0].children[1].innerHTML;
        input.value = "0".repeat(count) + (res + Number(lastPageNumber) - 1);
    }
}

// ==========================================================================================================
// Cookie Functions
// ==========================================================================================================
function getCookie(name) { return getCookieValue(name); }

function getCookieValue(name) {
    var keyValue = document.cookie.split("; ");
    for (i = 0; i < keyValue.length; i++) {
        var pairs = keyValue[i].split("=");
        if(pairs[0] == name)
            return pairs[1];
    }
    return null;
}

function getCookieValueDef(name, defaultValue) {
    var res = getCookieValue(name);
    if(res === null) { return defaultValue; } else { return res; }
}

function setCookie(name, value) {
    document.cookie=name + "=" + value;
}