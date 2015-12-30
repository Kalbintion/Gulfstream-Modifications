// ==UserScript==
// @updateURL    https://raw.githubusercontent.com/Kalbintion/Gulfstream-Modifications/master/Main.js
// @name         Gulf Stream Modifications
// @namespace    https://gulfstream.fidlar.com
// @version      0.17
// @description  Modifies the Gulfstream website in various ways to provide a better user interface
// @author       Kalbintion
// @include		 https://gulfstream.fidlar.com/Views/GulfStream/GulfStream*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://gulfstream.fidlar.com/Content/Images/favicon.ico
// @icon64       https://gulfstream.fidlar.com/Content/Images/favicon.ico
// ==/UserScript==


// ==========================================================================================================
// Settings
// ==========================================================================================================
var GS_SETTINGS = {
// MODULE: Shortcut Keys
    ShortcutKeys: { // This module adds custom shortcut keys to the system.
        Enabled: true, 
        
        // For Keycodes see http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        // Use -1 to disable
        PrevDocument: -1, // Goes to the previous document
        NextDocument: -1, // Goes to the next document
        AddPage: 107, // Adds page to document
        NextDocumentFocus: -1,  // Focuses input onto Document name textbox
        PageNumberFocus: -1, // Focuses input onto page number textbox
        RenameYes: -1, // "Yes" on the rename dialog
        RenameNo: -1, // "No" on the rename dialog
        MultiDoc: 106, // Brings up the multiple document window
        BlankPage: 111, // Marks page as blank
        Undo: -1, // Undo button (black toolbar, <)
        Redo: -1, // Redo button (black toolbar, >)
        RotateCCW: -1, // Counter-clockwise rotate (black toolbar, < circle)
        RotateCW: -1, // Clockwise rotate (black toolbar, > circle)
        DupePage: 109, // Duplicate page
        AutoScroll: 110, // Auto-scrolling feature, see MODULE: Auto-Scroll
    },
// MODULE: Login Timer
    LoginTimer: { // This module adds a timer to the top left of the document area keeping track of login time
        Enabled:true,
    },
// MODULE: Auto-Scroll
    AutoScroll: { // This module adds a checkbox to automatically scroll the document window
        Enabled:true,
        
        ScrollSpeed:10,
        ScrollAmount:6,
    },
// MODULE: Alternate Scroll
    AlternateScroll: { // This module will alternate the document area to the opposite side of every other document page
        Enabled:false,
        
        OddOrEven:"odd", // Whether to alternate the side the document is on on odd or even based page numbers
    },
// MODULE: Modify Image Source
    ImageSourceMods: {// This module tries to modify the image on the screen to its original
        Enabled: true,
    },
// MODULE: Digit Prediction
    DigitPrediction: { // This module predicts the next page document number and prefixes the name with zero's
        Enabled: true,
    },
};

// ==========================================================================================================
// Key Shortcuts
// ==========================================================================================================
if (GS_SETTINGS["ShortcutKeys"]["Enabled"]) {
    document.body.addEventListener("keydown", keyDownTextField, false);
    function keyDownTextField(e) {
        // console.log(e.keyCode);
        var code = e.keyCode;
        switch ( code )
        {
            case GS_SETTINGS.ShortcutKeys.PrevDocument:
                document.getElementById("MainContent_DefaultMainContent_lbLastDocument").click();
                break;
            case GS_SETTINGS.ShortcutKeys.NextDocument:
                document.getElementById("MainContent_DefaultMainContent_lbNextDocument").click();
                break;
            case GS_SETTINGS.ShortcutKeys.AddPage:
                document.getElementById("MainContent_DefaultMainContent_RadButtonAddPage").click();
                break;
            case GS_SETTINGS.ShortcutKeys.NextDocumentFocus:
                document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_TextBoxNextDocument").focus();
                break;
            case GS_SETTINGS.ShortcutKeys.PageNumberFocus:
                document.getElementById("MainContent_DefaultMainContent_CurrentPageNumber").focus();
                break;
            case GS_SETTINGS.ShortcutKeys.RenameYes:
                document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadWindowRenameDocument_C_RadButtonYes").click();
                break;
            case GS_SETTINGS.ShortcutKeys.RenameNo:
                document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadWindowRenameDocument_C_RadButtonNo").click();
                break;
            case GS_SETTINGS.ShortcutKeys.MultiDoc:
                document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_Arrow").click();document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_DropDown").lastChild.lastChild.lastChild.click();
                break;
            case GS_SETTINGS.ShortcutKeys.BlankPage:
                document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_Arrow").click();document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_DropDown").lastChild.lastChild.children[2].click();
                break;
            case GS_SETTINGS.ShortcutKeys.Undo:
                document.getElementsByClassName("darkroom-toolbar-actions")[0].children[0].children[0].click();
                break;
            case GS_SETTINGS.ShortcutKeys.Redo:
                document.getElementsByClassName("darkroom-toolbar-actions")[0].children[0].children[1].click();
                break;
            case GS_SETTINGS.ShortcutKeys.RotateCCW:
                document.getElementsByClassName("darkroom-toolbar-actions")[0].children[1].children[0].click();
                break;
            case GS_SETTINGS.ShortcutKeys.RotateCW:
                document.getElementsByClassName("darkroom-toolbar-actions")[0].children[1].children[1].click();
                break;
            case GS_SETTINGS.ShortcutKeys.AutoScroll:
                document.getElementById("autoScroll_chk").checked = !document.getElementById("autoScroll_chk").checked;
                updateAutoScrollSetting();
                break;
            case GS_SETTINGS.ShortcutKeys.BlankPage:
                document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_Arrow").click();document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_DropDown").lastChild.lastChild.children[2].click();
                break;
            case GS_SETTINGS.ShortcutKeys.DupePage:
                document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_Arrow").click();document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadComboBoxSpecialCondition_DropDown").lastChild.lastChild.children[1].click();
                break;
            default:
                break;
        }
    }
}

// ==========================================================================================================
// Modifies the image link to show original image
// ==========================================================================================================
if(GS_SETTINGS["ImageSourceMods"]["Enabled"]) {
    var imageLinkTimer = setInterval(ModifyImageLink, 250);

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
if(GS_SETTINGS.LoginTimer.Enabled) {
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
}

// ==========================================================================================================
// Auto-scroll Document
// ==========================================================================================================
if(GS_SETTINGS["AutoScroll"]["Enabled"]) {
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

    var scrollTimer = setInterval(scrollDocument, GS_SETTINGS["AutoScroll"]["ScrollSpeed"]);

    function scrollDocument() {
        if(document.getElementById("autoScroll_chk").checked) {
            document.getElementById("imageWrapper").scrollTop += GS_SETTINGS["AutoScroll"]["ScrollAmount"];
        }
    }

    function updateAutoScrollSetting() {
        console.log("autoScroll = " + document.getElementById("autoScroll_chk").checked);
        setCookie("autoScroll", document.getElementById("autoScroll_chk").checked);
    }
}

// ==========================================================================================================
// Alternate Scroll
// ==========================================================================================================
if(GS_SETTINGS["AlternateScroll"]["Enabled"]) {
    var alternateScrollTimer;
    var alreadyCreated = false;
    alternateScroll({srcElement:{innerHTML:"id=\"imageWrapper\""}});
    
    function alternateScroll(e) {
        if(e.srcElement.innerHTML.indexOf("id=\"imageWrapper\"") >= 0 && alreadyCreated === false) {
            console.log("Creating timer from:");
            console.log(e);
            alternateScrollTimer = setInterval(alternateScrollDocument, 10);
            alreadyCreated = true;
        }
    }
    
    function alternateScrollDocument() {
        var completeInfo = document.getElementById("MainContent_DefaultMainContent_ProjectCompleteLabel");
        var curPageNumber = Number(completeInfo.innerHTML.split("/")[0])+1;
        var isOddOrEven = curPageNumber%2; // 0 = even, 1 = odd
        if(GS_SETTINGS.AlternateScroll.OddOrEven == "odd" && isOddOrEven === 1) {
            document.getElementById("imageWrapper").scrollLeft = document.getElementById("imageWrapper").scrollWidth;
            if(document.getElementById("imageWrapper").scrollLeft >= 50) {
                clearInterval(alternateScrollTimer);
                alreadyCreated = false;
            }
        } else if(GS_SETTINGS.AlternateScroll.OddOrEven == "even" && isOddOrEven === 0) {
            document.getElementById("imageWrapper").scrollLeft = document.getElementById("imageWrapper").scrollWidth;
            if(document.getElementById("imageWrapper").scrollLeft >= 50) {
                clearInterval(alternateScrollTimer);
                alreadyCreated = false;
            }
        } else {
            clearInterval(alternateScrollTimer);
            alreadyCreated = false;
        }
        
        // console.log(document.getElementById("imageWrapper").scrollLeft + ", " + document.getElementById("imageWrapper").scrollWidth);
    }
}

// ==========================================================================================================
// Digit Prediction
// ==========================================================================================================
if(GS_SETTINGS["DigitPrediction"]["Enabled"]) {
    
    // Trigger function once on page loads, requires srcElement.id=imageWrapper
    prefixTextfield({srcElement:{id:"imageWrapper"}});

    function prefixTextfield(e) {
        // console.log(e);
        if(e.srcElement.id == "imageWrapper") {
            var instructionsInfo = document.getElementById("MainContent_DefaultMainContent_NotesLabel");
            var isLetterSuffixed = (document.getElementById("MainContent_DefaultMainContent_NotesLabel").title.indexOf("A)") >= 0 || document.getElementById("MainContent_DefaultMainContent_NotesLabel").title.indexOf("B)") >= 0);
            
            
            var input = document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_TextBoxNextDocument");
            var nameLength = input.value.length;
            
            var count = 0;
            for(var i = 0; i < input.value.length; i++) {
                if(input.value.charAt(i) == "_") {
                    count++;
                }
            }

            // console.log("0".repeat(count) + input.value);
            var res = Number(input.value.replace(/_/g, ""));

            // Predictability
            var numModifier = 0;
            var lastPageNumber = "";
            do {
                var pageInfo;
                do {
                    pageInfo = document.getElementById("ctl00_ctl00_MainContent_DefaultMainContent_RadGridDocuments").children[1].children[0].children[2].children[numModifier].children[1];
                } while(pageInfo === null);
                lastPageNumber = pageInfo.innerHTML;
                if(lastPageNumber == "&nbsp;") { numModifier++; }
            } while(lastPageNumber == "&nbsp;");
            
            // Set the value
            if(isLetterSuffixed) {
                input.value = "0".repeat(count - 1) + (res + Number(lastPageNumber) + numModifier - 1);
            } else {
                input.value = "0".repeat(count) + (res + Number(lastPageNumber) + numModifier - 1);
            }
        }
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

// ==========================================================================================================
// Misc Functions & Events
// ==========================================================================================================
// timer & auto-scroll div location reset on resize
window.addEventListener("resize", function(e) {
    var topOffset = 22;
    if(GS_SETTINGS.LoginTimer.Enabled) { divLoginTimer.style.top = document.getElementsByTagName("nav")[0].offsetHeight + topOffset + "px"; topOffset += 60; }
    if(GS_SETTINGS.AutoScroll.Enabled) { divAutoScroll.style.top = document.getElementsByTagName("nav")[0].offsetHeight + topOFfset + "px"; topOFfset += 60; }
});

// TODO: Look into how MutationObserver works in more detail, as this wasn't firing off events at all regardless of the config settings saying "FIRE ON EVERYTHING!"
/* var observer = new MutationObserver(domEventListener);
var config = {childList: true, attributes: true, characterData: true};
observer.observe(document.getElementsByClassName("container-fluid")[0], config); */

document.getElementsByClassName("container-fluid")[0].addEventListener("DOMSubtreeModified", domEventListener);

function domEventListener(e) {
    if(GS_SETTINGS.DigitPrediction.Enabled) { prefixTextfield(e); }
    if(GS_SETTINGS.AlternateScroll.Enabled) { alternateScroll(e); }
}