// Smooth scrolling to target
document.body.addEventListener("click", function (event) {
  if (
    (event.target.tagName === "A" &&
      event.target.getAttribute("href") &&
      event.target.getAttribute("href").startsWith("#")) ||
    (event.target.parentNode.tagName === "A" &&
      event.target.parentNode.getAttribute("href") &&
      event.target.parentNode.getAttribute("href").startsWith("#"))
  ) {
    event.preventDefault();
    const targetId =
      event.target.getAttribute("href") ||
      event.target.parentNode.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const targetPosition = targetElement.offsetTop;
      window.scroll({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }
});

const codeColours = {
  HTML: "rgb(175, 0, 0)",
  CSS: "rgb(48, 0, 90)",
  JavaScript: "rgb(240, 216, 0)",
  TypeScript: "rgb(0, 130, 205)",
  default: "rgb(112, 35, 205)",
};

let SESSION_STORAGE_KEY = "cachedLanguagesData";

async function fetchReposInformation() {
  let cachedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (cachedData) {
    console.log("Using cached data from Session Storage");
    displayMostUsedLanguagesChart(JSON.parse(cachedData));
    return;
  }

  const languages = {};
  try {
    const repos = await fetchGitHubRepos();
    await fetchLanguagesForRepos(repos, languages);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(languages));
    displayMostUsedLanguagesChart(languages);
  } catch (error) {
    const skeletonElement = document.getElementById("skeleton-languages-table");
    skeletonElement.style.display = "none";
    const errorElement = document.getElementById("error-languages-table");
    errorElement.style.display = "flex";
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function fetchGitHubRepos() {
  const response = await fetch("https://api.github.com/users/Edga380/repos");
  if (!response.ok) throw new Error("Failed to fetch repositories");
  return response.json();
}

async function fetchLanguagesForRepos(repos, languages) {
  for (const repo of repos) {
    try {
      const languagesData = await fetchLanguages(repo.languages_url);
      updateLanguagesData(languages, languagesData);
    } catch (error) {
      console.error(`Error fetchin languages for repo ${repo.name}: `, error);
    }
  }
}

async function fetchLanguages(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch languages.");
  return response.json();
}

function updateLanguagesData(languages, languagesData) {
  for (const [language, value] of Object.entries(languagesData)) {
    languages[language] = (languages[language] || 0) + value;
  }
}

function displayMostUsedLanguagesChart(languages) {
  const mostUsedLanguages = document.getElementById("most-used-languages");

  if (!mostUsedLanguages) return;
  mostUsedLanguages.innerHTML = `
    <div id="languages-table">
      <a class="languages-header-text">Most used languages</a>
    </div>
    `;

  const languagesTable = document.getElementById("languages-table");
  const total = Object.values(languages).reduce((acc, value) => acc + value, 0);
  const languageEntries = Object.entries(languages)
    .map(([language, value]) => ({
      language,
      percentage: calculatePercentage(value, total).toFixed(1),
    }))
    .filter(({ percentage }) => percentage >= 3);

  let html = "";
  for (const { language, percentage } of languageEntries) {
    html = `
      <div class="languages-background" style="background-color: ${
        codeColours[language] || codeColours.default
      }; width: ${percentage}%;">
          <a class="languages-procentage-text"></a>
      </div>
          <a class="languages-text">${language} ${percentage}%</a>
    `;
    languagesTable.insertAdjacentHTML("beforeend", html);
  }
  disableSkeletonAnimation("skeleton-languages-table");
}

function disableSkeletonAnimation(elementId) {
  if (!document.getElementById(elementId)) return;
  const element = document.getElementById(elementId);
  element.style.display = "none";
}

fetchReposInformation();

// Next previous project
function NextPreviousProject(num) {
  window.location.href = `./project.html?project=${
    storedProjectsData[currentProjectIndex + num].href
  }`;
}

// Project page populate with information from json file
let projectImages;
function AddProjectInformation() {
  // Check if html element exist
  if (document.getElementById("slideshow-container")) {
    fetch("./projectsinfo.json")
      .then((response) => response.json())
      .then((data) => {
        // SlideShow images
        data[currentProjectIndex].slideShowImg.forEach((image) => {
          document.getElementById("slideshow-container").insertAdjacentHTML(
            "beforeend",
            `
            <img class="my-slide-image ${
              image === 0 ? "active" : ""
            }" src="${image}">`
          );
        });
        //
        projectImages = document.querySelectorAll(".my-slide-image");
        // Insert project name into destination link
        document.getElementById("project-destination").innerText =
          data[currentProjectIndex].name;
        // Insert project name
        document.getElementById("project-name").innerText =
          data[currentProjectIndex].name;
        // Insert project description
        document.getElementById("project-description").innerText =
          data[currentProjectIndex].description.join("");
        // Insert links
        data[currentProjectIndex].links.forEach((link) => {
          document.getElementById("project-links-list").insertAdjacentHTML(
            "beforeend",
            `
                <ul>
                    <a href="${link[1]}" target="_blank">${link[0]}</a>
                </ul>`
          );
        });
        // Insert next/previous buttons
        if (currentProjectIndex > 0 && currentProjectIndex < data.length - 1) {
          document
            .getElementById("project-next-prev-container")
            .insertAdjacentHTML(
              "afterbegin",
              '<a onclick="NextPreviousProject(1)">Next</a>'
            );
          document
            .getElementById("project-next-prev-container")
            .insertAdjacentHTML(
              "afterbegin",
              '<a onclick="NextPreviousProject(-1)">Previous</a>'
            );
        } else if (currentProjectIndex == 0) {
          document
            .getElementById("project-next-prev-container")
            .insertAdjacentHTML(
              "afterbegin",
              '<a onclick="NextPreviousProject(1)">Next</a>'
            );
        } else if (currentProjectIndex == data.length - 1) {
          document
            .getElementById("project-next-prev-container")
            .insertAdjacentHTML(
              "afterbegin",
              '<a onclick="NextPreviousProject(-1)">Previous</a>'
            );
        }
        showSlides();
        // Pause the slideshow on hover
        projectImages.forEach((e) => {
          e.addEventListener("mouseover", () => {
            pauseSlideshow();
          });
          // Resume the slideshow when the cursor leaves the slideshow area
          e.addEventListener("mouseout", () => {
            resumeSlideshow();
          });
        });
        // Fetch Languages from specific GitHub repository
        fetch(
          "https://api.github.com/repos/Edga380/" +
            data[currentProjectIndex].gitHubRepName +
            "/languages"
        )
          .then((gitHubResponse) => {
            if (!gitHubResponse.ok) {
              throw new Error(
                `GitHub API request failed with status: ${gitHubResponse.status}`
              );
            }
            return gitHubResponse.json();
          })
          .then((gitHubData) => {
            let gitHubTechTags = [];
            if ("JavaScript" in gitHubData) {
              gitHubTechTags.push([
                "./images/technologiesicons/javascript_icon.png",
                gitHubData.JavaScript,
              ]);
            }
            if ("TypeScript" in gitHubData) {
              gitHubTechTags.push([
                "./images/technologiesicons/typescript_icon.png",
                gitHubData.TypeScript,
              ]);
            }
            if ("CSS" in gitHubData) {
              gitHubTechTags.push([
                "./images/technologiesicons/css_icon.png",
                gitHubData.CSS,
              ]);
            }
            if ("HTML" in gitHubData) {
              gitHubTechTags.push([
                "./images/technologiesicons/html_icon.png",
                gitHubData.HTML,
              ]);
            }
            //Calculate total JS/CSS/HTML etc...
            const total = gitHubTechTags.reduce(
              (sum, array) => sum + array[1],
              0
            );
            // Insert html with tags
            gitHubTechTags.forEach((tag) => {
              document.getElementById("tech-tags").insertAdjacentHTML(
                "beforeend",
                `
                <div class="tag">
                    <img src="${tag[0]}">
                    <p>${calculatePercentage(tag[1], total).toFixed(1)}%</p>
                </div>`
              );
            });
          })
          .catch(() => {
            data[currentProjectIndex].tags.forEach((tag) => {
              document.getElementById("tech-tags").insertAdjacentHTML(
                "beforeend",
                `
                <div class="tag">
                    <img src="${tag[0]}">
                    <p>${tag[1]}%</p>
                </div>`
              );
            });
          });
      });
  }
}

// Calculate %
function calculatePercentage(individualValue, total) {
  return (individualValue / total) * 100;
}

// Project slideShow
// Slide show variables
let index = 0;
let showSlidesInterval;
// Previous slide
function btnPrevious() {
  clearTimeout(showSlidesInterval);
  projectImages[index].classList.remove("active");
  projectImages[
    index <= 0 ? projectImages.length - 1 : index - 1
  ].classList.add("active");
  index--;
  if (index < 0) {
    index = projectImages.length - 1;
  }
  showSlides();
}
// Next slide
function btnNext() {
  clearTimeout(showSlidesInterval);
  index++;
  if (index >= projectImages.length) {
    index = 0;
  }
  showSlides();
}
// Slide show runs automatically
function showSlides() {
  projectImages.forEach((image, i) => {
    if (i === index) {
      image.classList.add("active");
      projectImages[
        index <= 0 ? projectImages.length - 1 : index - 1
      ].classList.remove("active");
    }
  });
  showSlidesInterval = setTimeout(btnNext, 5000);
}
// Pause slide show
function pauseSlideshow() {
  clearTimeout(showSlidesInterval);
}
// Resume slide show
function resumeSlideshow() {
  showSlidesInterval = setTimeout(btnNext, 5000);
  showSlides();
}

// Toggle mobile dropbox menu
let mobNavButton = document.querySelector(".mob-nav-button");
let dropdownMenu = document.querySelector(".mob-dropdown-menu-container");
let lines = document.querySelectorAll(".mob-nav-line");

mobNavButton.addEventListener("click", function () {
  dropdownMenu.classList.toggle("open");
  lines.forEach((line) => {
    line.classList.toggle("line");
  });
});

// Toggle mobile projects dropdown menu
let mobProjectsButton = document.getElementById("mob-projects-button");
let subDropdownMenu = document.querySelector(".mob-sub-dropdown-menu");
let arrows = document.querySelectorAll(".mob-arrow-line");

mobProjectsButton.addEventListener("click", function () {
  arrows.forEach((arrow) => {
    arrow.classList.toggle("open");
  });
  subDropdownMenu.classList.toggle("open");
});

// Populate mobile dropdown menu with projects from json file
fetch("./projectsinfo.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((project) => {
      subDropdownMenu.insertAdjacentHTML(
        "beforeend",
        `
            <a href="./project.html?project=${project.href}">${project.name}</a>`
      );
      document.querySelector(".dropdown-menu-container").insertAdjacentHTML(
        "beforeend",
        `
            <a href="./project.html?project=${project.href}">${project.name}</a>`
      );
    });
  });

// Populate projects.html with projects
const cardContainer = document.querySelector(".card-container");
if (cardContainer) {
  fetch("./projectsinfo.json")
    .then((response) => response.json())
    .then((data) => {
      // Counter for changing card size
      let counter = 0;
      // For loop to insert html elements
      data.forEach((projects, i) => {
        // Check if you are on /index.html page if yes limit projects to 4
        const pageUrl = window.location.pathname;
        if (
          (pageUrl.endsWith("/index.html") && i > 3) ||
          (pageUrl.endsWith("/") && i > 3)
        ) {
          return;
        }
        cardContainer.insertAdjacentHTML(
          "beforeend",
          `
                <div class="card ${
                  (i + counter) % 2 === 0
                    ? "large-project-card"
                    : "small-project-card"
                }">
                    <div class="image-container">
                        <img src="${projects.slideShowImg[0]}" alt="${
            projects.name
          }">
                    </div>
                    <div class="card-content">
                        <a href="./project.html?project=${projects.href}">${
            projects.name
          }</a>
                        <p>${projects.description[0]}</p>
                    </div>
                </div>`
        );
        // Here we change counter so that card size changes every time loop runs
        i % 2 === 0 ? (counter += 2) : counter++;
      });
    });
}
