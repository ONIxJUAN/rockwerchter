buildUI();
let currentFilter = null;

function buildUI() {
  buildNav();
  buildFilter();
  buildCards();
  buildCountdown();
}

function buildNav() {
  let headerNav = document.getElementById("headerNav");
  let html = "";
  for (const listItem of headnav) {
    if (listItem.type == "internal") {
      html += `<li><a href="${listItem.link}">${listItem.name}</a></li>`;
    } else {
      html += `<li><a target="_blank" href="${listItem.link}">${listItem.name}</a></li>`;
    }
  }
  headerNav.innerHTML = html;
}

function buildCountdown() {
  let html = document.getElementById("countdown");
  countdownContent(html);
  setInterval(() => {
    countdownContent(html);
  }, 1000);
}

function countdownContent(html) {
  const date = new Date();
  html.innerHTML = `<h1>${countdownTimer(timeLeft - date)}</h1>
  <p>till next edition</p>`;
}

function countdownTimer(time) {
  const date = new Date(time);
  const day = Math.floor(date / (60 * 60 * 24) / 1000);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${day}days ${hour}h ${minute}m ${second}s`;
}

function buildFilter() {
  let $filterContainer = document.getElementById("filter");
  let html = "<button data-type='' class='btn-filter'>All</button>";
  for (activeFilter of filterInf) {
    html += `<button data-type="${activeFilter}" class="btn-filter">${activeFilter}</button>`;
  }
  $filterContainer.innerHTML = html;

  const $filters = document.querySelectorAll(".btn-filter");
  for (const $filter of $filters) {
    $filter.addEventListener("click", function (e) {
      const type = e.currentTarget.dataset.type;
      currentFilter = type;
      buildCards(currentFilter);
    });
  }
}

function buildCards(filter = "") {
  let cards = document.getElementById("cards-container");
  let html = "";

  let filteredLineUp = lineup;
  if (filter !== "") {
    filteredLineUp = lineup.filter((artist) => artist.stage === filter);
  }

  for (const artist of filteredLineUp) {
    html += `<div id="${artist.id}" class="card">
<img src="${artist.artist.image}">
<h2>${artist.artist.name}</h2>
<p>${artist.stage} | ${timeOnStage(artist.from, artist.to)}</p>
</div>`;
  }
  cards.innerHTML = html;
  getDescription(filter);
}

function timeOnStage(start, end) {
  let date = new Date(start);
  const month = toAmountOfDigits(date.getMonth(), 2);
  const day = toAmountOfDigits(date.getDate(), 2);

  return `${day}/${month} ${time(start)}-${time(end)}`;
}

function time(time) {
  const date = new Date(time);
  let hour = toAmountOfDigits(date.getHours(), 2);
  let minute = toAmountOfDigits(date.getMinutes(), 2);

  return `${hour}.${minute}`;
}

function toAmountOfDigits(number, amountOfDigits) {
  for (i = number.length; i < amountOfDigits; i++) {
    number = "0" + number;
  }
  return number;
}

function getDescription(filter) {
  const description = document.getElementById("description");

  let filteredLineUp = lineup;
  if (filter !== "") {
    filteredLineUp = lineup.filter((artist) => artist.stage === filter);
  }

  for (const artist of filteredLineUp) {
    if (artist.stage === filter || filter === "") {
      const card = document.getElementById(`${artist.id}`);
      card.addEventListener(
        "click",
        function () {
          document.getElementById("description_under_overlay").style.display =
            "block";
          description.innerHTML = `<div class="desc_exit"><a id="description_btn">X</a></div>
          <div class="desc_content"><div class="desc_img_video"><div><img src="${
            artist.artist.image
          }"></div><div><video src="${
            artist.artist.video
          }" controls="controls"></div></div>
          <div class="desc_text"><div class="desc_stage_inf"><p>${
            artist.stage
          } | ${timeOnStage(artist.from, artist.to)}</p>
        <h2>${artist.artist.name}</h2></div>
        <div class="desc_socials"><p>socials:</p>
        <div class="desc_socials_lined_up">${getSocials(
          artist.artist.socials
        )}</div></div>
        ${artist.artist.description}</div></div>`;
          description.classList.add("desc_transition");
          let descriptionBtn = document.getElementById("description_btn");
          descriptionBtn.addEventListener(
            "click",
            function () {
              document.getElementById(
                "description_under_overlay"
              ).style.display = "none";
              description.classList.remove("desc_transition");
            },
            false
          );
        },
        false
      );
    }
  }
}

function getSocials(socials) {
  let html = "";
  for (const social in socials) {
    if (socials[social] == "") {
    } else {
      html += `<a href="${socials[social]}"><img src="${getSocialSVG(
        social
      )}"></a></p>`;
    }
  }
  return html;
}

function getSocialSVG(platform) {
  for (const svg in socialSVG) {
    if (svg === platform) {
      return socialSVG[svg];
    }
  }
}
