

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '8858f35a2dmsh5c01ecf4a0a87fbp16c1bfjsnf46ad578b89e',
        'X-RapidAPI-Host': 'anime-db.p.rapidapi.com'
    }
};

// fetch('https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=Fullmetal&genres=Fantasy%2CDrama&sortBy=ranking&sortOrder=asc', options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));

const searchBox = document.getElementById("searchBox");
const container = document.getElementById("container")
const searchBar = document.getElementById("search-bar")
const list = document.getElementById("list");
const listItems = document.getElementById("list-items");

const suggestedList = document.getElementById("suggested-list");
// let searchResults = document.getElementById("search-results");
let barMoved = false;

// For Next Page
const nextPage = document.getElementById("next-container");
const leftSection = document.getElementById("left-Side");
const righSection = document.getElementById("desc");
const titleImg = document.getElementById("title-img");
const episode = document.getElementById("episode");
const type = document.getElementById("type");
const status = document.getElementById("status");
const genre = document.getElementById("genre");



let dataArr = [];

let suggestedData = [];

console.log("Data Array:", dataArr);

async function fetchApi(url) {
    try {
        let response = await fetch(url, options);
        let data = await response.json();
        // console.log("Data:",data);
        dataArr = data.data;
        console.log("Data Array:", dataArr);
        suggestedData = dataArr.slice(0, 5);
        console.log("Suggested Data", suggestedData);

        list.innerHTML = "";
        for (let arr of suggestedData) {
            console.log(arr.image, arr.title);

            let li = document.createElement("li");
            li.setAttribute("id", "list-items");
            li.innerHTML =
                `
                <div id="anime-suggestion">
                <div class="suggested-img-box">
            <img class="suggested-img"
                src="${arr.image}" alt="">
                </div>
            <h5 class="suggested-name" id="${arr._id}">${arr.title}</h5>
        </div>
        `;
            list.append(li);
        }
    } catch (error) {
        console.log("Error Occured while fetching Data", error);
    }
}
const resultsContainer = document.getElementById("search-results");
// const card = document.getElementById("card");
const cards = document.getElementsByClassName("cards");

let timeout;

function takeInput() {
    searchBar.addEventListener("input", function (event) {
        console.log(searchBar.value);
        clearTimeout(timeout);
        let searchWord;
        // removeSuggestions();
        if (searchBar.value.trim() === "") {
            console.log("Empty");
            removeSuggestions();
            return;
        }
        timeout = setTimeout(() => {
            searchWord = searchBar.value;
            // let searchWord = searchBar.value;
            console.log("search Word", searchWord);
            let url = `https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=${searchWord}&sortBy=ranking&sortOrder=asc`;
            dataArr = [];
            suggestedData = [];
            console.log("Data Array Inside Timeout:", dataArr);
            fetchApi(url);
            showSuggestions();
        }, 1000);
    });
}



// Moving The Bar Upwards
function moveBar() {
    if (barMoved) {
        console.log("Barmoved", barMoved)
        return;
    }
    barMoved = true;
    searchBox.style.overflow = "hidden";
    searchBox.style.height = "0";
    searchBox.style.width = "0";

    setTimeout(() => {
        searchBox.style.top = "10px";
        searchBox.style.left = "5vw"
        searchBox.style.height = "40px";
        searchBox.style.width = "50vw";
        searchBox.style.transform = "translate(0)";
    }, 200);
}

function showSuggestions() {
    list.style.display = "block";
    searchBox.style.overflow = "visible";
    list.addEventListener("mouseleave", removeSuggestions);
}

function removeSuggestions() {
    list.style.display = "none";
    searchBox.style.overflow = "hidden";
}

function showAllData() {
    nextPage.style.width = "0";
    nextPage.style.height = "0";
    resultsContainer.style.width = "95vw";
    resultsContainer.style.height = "92vh";
    resultsContainer.innerHTML = "";
    for (let eachElements of dataArr) {
        let div = document.createElement("div");
        div.setAttribute("id", "card");
        div.setAttribute("class", "cards");

        div.innerHTML = `
            <img  id="${eachElements._id}" src="${eachElements.image}"
            class="card-img-top" id="${eachElements._id}" alt="">
                <div class="card-body" id="${eachElements._id}">
                    <h5 id="${eachElements._id}" class="card-title">${eachElements.title}</h5>
                </div>
                `;
        resultsContainer.append(div);
    }
    setTimeout(() => {
        for (let elements of cards) {
            elements.style.height = "380px";
            elements.style.width = "250px";
        }
    }, 400);


}

function showNextPageData(id) {
    console.log(id);
    console.log(dataArr);
    for (let eachElements of dataArr) {
        if (id == eachElements._id) {
            moveBar();
            resultsContainer.style.height = "0";
            resultsContainer.style.width = "0";
            nextPage.style.width = "95vw";
            nextPage.style.height = "92vh";

            console.log("Id Found", eachElements.title);
            leftSection.innerHTML = `
            <div id="details">
            <img id="title-img" src="${eachElements.image}"
                alt="...">
            <div id="type">Type: ${eachElements.type}</div>
            <div id="status">Status:${eachElements.status}</div>
        </div>
            `;

            righSection.innerHTML = `
            <div id="title">
            <h1>${eachElements.title}</h1>
        </div>
        <div id="buttons">
            <button class="button">Watch Now</button>
            <button class="button">Add to List</button>
            <span id="favourite"><i id="favourite-icon" class="bi bi-suit-heart"></i></span>
        </div>
        <div id="synopsis">
            <p>${eachElements.synopsis}</p>
        </div>
            `;

            return;
        }
    }
    console.log("Data Not Matched")
}

function handleClicks(event) {
    console.log("Clicked!")
    let target = event.target;
    let fetchId = target.id;
    let fetchClass = target.classList.value;
    console.log("FetchClass:", fetchClass)
    console.log("Target", target)
    console.log("Fetch ID", fetchId);
    if (fetchId == "search" || fetchId == "btn") {
        moveBar();
        removeSuggestions();
        showAllData();
    } else if (fetchId == "search-bar") {
        takeInput();
        showSuggestions();
    } else if (fetchClass == "suggested-name") {
        let id = fetchId;
        showNextPageData(id);
    }else if(fetchClass =="card-img-top" || fetchClass == "card-title"){
        showNextPageData(fetchId);
        console.log("Clicked on Card!")
    }
}

document.addEventListener("click", handleClicks);