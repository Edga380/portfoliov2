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

// Next previous project
function NextPreviousProject(num) {
  window.location.href = `./project.html?project=${
    parseInt(currentProjectIndex) + num
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
                    <p>${CalculatePercentage(tag[1], total).toFixed(1)}%</p>
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
function CalculatePercentage(individualValue, total) {
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
        // Check if you are on /index.html page if yes limit projects that being shown to 4
        if (window.location.pathname === "/index.html" && i > 3) {
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
