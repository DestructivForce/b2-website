const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.toolList');

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

function tableSwap(){
    var t= document.getElementsByTagName('tbody')[0],
    r= t.getElementsByTagName('tr'),
    cols= r.length, rows= r[0].getElementsByTagName('td').length,
    cell, next, tem, i= 0, tbod= document.createElement('tbody');

    while(i<rows){
        cell= 0;
        tem= document.createElement('tr');
        while(cell<cols){
            next= r[cell++].getElementsByTagName('td')[0];
            tem.appendChild(next);
        }
        tbod.appendChild(tem);
        ++i;
    }
    t.parentNode.replaceChild(tbod, t);
}

function getMatchInfo() {
    let url = window.location.toString().replace(/^[^?]*/, '').replace(/^\?/, '');
    fetch(url)
        .then(response => response.json())
        .then((json) => processMatchInfo(json))
        .catch((error) => console.error(`Error fetching data: ${error.message}`));
}

function processMatchInfo(json) {
    matchHistory = json.body
    generateMatchTable(matchHistory);
}
function generateMatchTable(matchHistory) {
    let tableContainer = document.querySelector(".matchTableContainer");
    for (let i = 0; i < matchHistory.length; i++) {
        let currentMatchContainer = document.createElement('div')
        currentMatchContainer.classList.add("match");
        let table = document.createElement("table");
        table.classList.add("matchTable");
        currentMatchContainer.appendChild(table);
        tableContainer.appendChild(currentMatchContainer);
        //generate headers
        let row1 = table.insertRow();
        let row2 = table.insertRow();
        let expanderButton = document.createElement("button");
        expanderButton.classList.add("expanderButton");
        expanderButton.textContent = "More Info";
        currentMatchContainer.appendChild(expanderButton);
        expanderButton.addEventListener("click", function handleClick() {
            expandTable(currentMatchContainer, matchHistory[i])
        });
        row1.classList.add("playerHeaderRow");
        let playerLeftHeader = document.createElement("th");
        playerLeftHeader.classList.add("playerHeaderCell");
        playerLeftHeader.classList.add('playerLeft')
        row1.appendChild(playerLeftHeader);
        playerLeftHeader.colSpan = 4;
        let playerRightHeader = document.createElement("th");
        playerRightHeader.classList.add("playerHeaderCell");
        playerRightHeader.classList.add('playerRight')
        row1.appendChild(playerRightHeader);
        playerRightHeader.colSpan = 4;
        if (matchHistory[i].playerLeft.result == "win") {
            playerLeftHeader.classList.add("win");
            playerRightHeader.classList.add("lose");
        } else if (matchHistory[i].playerLeft.result == "lose") {
            playerLeftHeader.classList.add("lose");
            playerRightHeader.classList.add("win");
        } else if (matchHistory[i].playerLeft.result == "draw") {
            playerLeftHeader.classList.add("draw");
            playerRightHeader.classList.add("draw");
        }

        updatePlayerName(matchHistory[i].playerLeft, playerLeftHeader);
        updatePlayerName(matchHistory[i].playerRight, playerRightHeader);

        //generate dataRows
        for (key in matchHistory[i].playerLeft) {
            let newRow = table.insertRow()
            newRow.classList.add("playerDataRow");
            if (key == "profileURL" || key == "currentUser" || key == "result") {
                continue;
            }
            let cellLeft = newRow.insertCell();
            cellLeft.textContent = matchHistory[i].playerLeft[key];
            cellLeft.classList.add("playerDataLeft");
            if (matchHistory[i].playerLeft.currentUser) {
                cellLeft.classList.add("currentUser");
            }
        }
        let j = 0;
        for (key in matchHistory[i].playerRight) {
            j++
            if (key == "profileURL" || key == "currentUser" || key == "result") {
                continue;
            }
            let currentRow = table.querySelector('tr:nth-child('+(j+2)+')')
            let cellRight = currentRow.insertCell();
            cellRight.textContent = matchHistory[i].playerRight[key];
            cellRight.classList.add("playerDataRight");
            if (matchHistory[i].playerRight.currentUser) {
                cellRight.classList.add("currentUser");
            }
        }
        if (matchHistory[i].playerLeft.currentUser) {
            playerLeftHeader.classList.add("currentUser");
        } else {
            playerRightHeader.classList.add("currentUser");
        }
    }

}

function updatePlayerName(player, slot) {
    let url = player.profileURL;
    async function nameFetch(url) {
        const response = await fetch(url);
        const json = await response.json();
        slot.textContent = json.body.displayName;
        slot.addEventListener("click", () => {
            window.open('../playerInfo/playerInfo.html?' + url, '_self');
        })
    }

    nameFetch(url);
}

let playerSideToggle = document.querySelector("#playerSideToggle");
playerSideToggle.addEventListener("click", () => {togglePlayerSide()});

function togglePlayerSide() {
    currentPlayers = document.getElementsByClassName("currentUser");

    for(i = 0; i < currentPlayers.length; i++) {
        if (currentPlayers[i].classList.contains('playerLeft') === false) {
            if (currentPlayers[i].classList.contains('forceLeft')) {
                currentPlayers[i].classList.remove('forceLeft');
            } else {
                currentPlayers[i].classList.add('forceLeft');
            }
        }
    }
}

function expandTable(matchContainer, matchInfo) {
    console.log(matchInfo);
    toggleExpansionState(matchContainer);
    if (matchContainer.classList.contains("expanded")) {
        createExpansion(matchInfo, matchContainer);
    } else {
        matchContainer.removeChild(matchContainer.lastChild);
    }
}
getMatchInfo();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createExpansion(matchInfo, matchContainer) {
    let extraInfoContainer = document.createElement("div");
    extraInfoContainer.classList.add("extraInfoContainer");
    for (key in matchInfo) {
        if (!(key == "duration" || key == "endRound" || key == "map" || key == "gametype")) {
            continue;
        }
        let extraInfo = document.createElement("span");
        extraInfo.classList.add("extraInfo");
        extraInfo.textContent = capitalizeFirstLetter(key) + ": " + matchInfo[key] + " ";
        extraInfoContainer.appendChild(extraInfo);
    }
    matchContainer.appendChild(extraInfoContainer);
}

function toggleExpansionState(matchContainer) {
    let expanderButton = matchContainer.querySelector(".expanderButton");
    if (matchContainer.classList.contains("expanded")) {
        setExpansionStateToExpanded(matchContainer, expanderButton);
    } else {
        matchContainer.classList.add("expanded");
        expanderButton.textContent = "Less Info";
    }
}
function setExpansionStateToExpanded(matchContainer, expanderButton) {
    matchContainer.classList.remove("expanded");
    expanderButton.textContent = "More Info";
}
