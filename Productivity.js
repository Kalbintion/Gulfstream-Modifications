// ==UserScript==
// @updateURL    https://raw.githubusercontent.com/Kalbintion/Gulfstream-Modifications/master/Productivity.js
// @name         Gulf Stream Modifications - Productivity
// @namespace    https://gulfstream.fidlar.com
// @version      0.2
// @description  
// @author       Kalbintion
// @include		 https://gulfstream.fidlar.com/Account/StreamerInformation
// @include		 https://gulfstream.fidlar.com/Account/StreamerInformation/
// @grant        none
// @icon         https://gulfstream.fidlar.com/Content/Images/favicon.ico
// @icon64       https://gulfstream.fidlar.com/Content/Images/favicon.ico
// ==/UserScript==

// Settings
var docValue = 0.026422
var multValue = 0.015
var cropValue = 0.012

// Elements
var holder = document.getElementsByClassName("col-md-6")[0].children[0];
holder.appendChild(createNewEntry("documentCnt", "Document $"));
holder.appendChild(createNewEntry("multidocCnt", "MultiDoc $"));
holder.appendChild(createNewEntry("crop_docCnt", "Crop Doc $"));
holder.appendChild(createNewEntry("totalAmt", "Total $"));
updateMoneyAmounts();

function updateMoneyAmounts() {
    var docCnt = document.getElementsByTagName("input")[0].value;
    var mulCnt = document.getElementsByTagName("input")[1].value;
    var crpCnt = document.getElementsByTagName("input")[2].value;
    
    var docAmt = document.getElementById("documentCnt-divInput");
    var mulAmt = document.getElementById("multidocCnt-divInput");
    var crpAmt = document.getElementById("crop_docCnt-divInput");
    var ttlAmt = document.getElementById("totalAmt-divInput");
    
    docAmt.value = roundToDecimal(docCnt * docValue, 2);
    mulAmt.value = roundToDecimal(mulCnt * multValue, 2);
    crpAmt.value = roundToDecimal(crpCnt * cropValue, 2);
    ttlAmt.value = roundToDecimal(Number(docCnt * docValue) + Number(mulCnt * multValue) + Number(crpCnt * cropValue), 2);
}

function createNewEntry(name, label) {
    var divHolder = document.createElement("div");
    divHolder.className = "form-group";
    divHolder.id = name + "-divHolder";
   
    var divLabel = document.createElement("label");
    divLabel.className = "col-md-4 control-label";
    divLabel.id = name + "-divLabel";
    divLabel.innerHTML = label;
   
    var divInputHolder = document.createElement("div");
    divInputHolder.className = "col-md-8";
    divInputHolder.id = name + "-divInputHolder";
    
    var divInput = document.createElement("input");
    divInput.className = "form-control";
    divInput.id = name + "-divInput";
    divInput.readOnly = true;
    
    divHolder.appendChild(divLabel);
    divInputHolder.appendChild(divInput);
    divHolder.appendChild(divInputHolder);
    
    return divHolder;
}

function roundToDecimal(value, places) {
  value = value * Math.pow(10, places);
  value = Math.round(value);
  return value / Math.pow(10, places);
}