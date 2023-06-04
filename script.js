var Date_Storage_Arr = [];
let formEle = document.getElementById("search-form");
let currInputDateEle = document.getElementById("search-input");
let image_Section_Ele = document.getElementById("current-image-container");
let search_history_Ele = document.getElementById("search-history");

let your_api_key = `M1sb1vvQpl7b5l7tYvYfbfiMnIWaqLSZXgk1Ij8h`;
let Current_date = new Date().toISOString().split("T")[0];

async function getCurrentImageOfTheDay(date) {
  try {
    let givenDate = `${date}`;
    let url = `https://api.nasa.gov/planetary/apod?date=${givenDate}&api_key=${your_api_key}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.code == 400) {
      showError(data.msg);
      console.log(data);
      return;
    }
    console.log("working");
    image_Section_Ele.innerHTML = "";

    image_Section_Ele.innerHTML = `
    <h1>Nasa picture on the day of <span id="date"> (${date}) <span/></h1>
   <img
    src="${data.hdurl}"alt=" Sorry,image not available at the server,its not my fault."/>
   <h2 id="title">${data.title}</h2>
   <p>${data.explanation}</p>
`;
  } catch (error) {
    console.log(error);
    image_Section_Ele.innerHTML = `<h1 id=msgError>${error.message}</h1>`;
  }
}

getCurrentImageOfTheDay(Current_date);

function showError(msg) {
  // image_Section_Ele.innerHTML = "";
  image_Section_Ele.innerHTML = `<h1 id=msgError>${msg}</h1>`;
  return;
}

// searching according to  input date
document.querySelector("button").onclick = function () {
  document.querySelector("button").classList.add("shaking");
  setTimeout(() => {
    document.querySelector("button").classList.remove("shaking");
  }, 1000);
};

formEle.addEventListener("submit", getImageOfTheDay);
function getImageOfTheDay(event) {
  event.preventDefault();

  if (currInputDateEle.value) {
    getCurrentImageOfTheDay(currInputDateEle.value);
    saveSearch(currInputDateEle.value);
  }
}

function saveSearch(currInputDateEle_value) {
  Date_Storage_Arr = JSON.parse(localStorage.getItem("Date_Storage_Arr")) || [];

  Date_Storage_Arr.push(currInputDateEle_value);
  localStorage.setItem("Date_Storage_Arr", JSON.stringify(Date_Storage_Arr));

  addSearchToHistory();
}

function addSearchToHistory() {
  let all_Dates_List =
    JSON.parse(localStorage.getItem("Date_Storage_Arr")) || [];

  search_history_Ele.innerHTML = ``;

  if (all_Dates_List.length != 0) {
    all_Dates_List.forEach((date) => {
      search_history_Ele.innerHTML += `
        <li><a class="all_dates">${date}</a></li>
        `;
    });
  }

  let all_dates = document.querySelectorAll(".all_dates");

  all_dates.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      // console.log(event.target);
      getCurrentImageOfTheDay(event.target.textContent.trim());
    });
  });
}

window.onload = function () {
  addSearchToHistory();
};
