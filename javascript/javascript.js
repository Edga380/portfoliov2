//
function ProjectIndex(index){
    localStorage.setItem("index", index);
    window.location.href = "./project.html"
};

// Next previous project
function NextPreviousProject(num){
    localStorage.setItem("index", parseInt(localStorage.getItem("index")) + num);
    window.location.href = "./project.html"
}

// Project page populate with information from json file
let projectIndex = localStorage.getItem("index");
let projectImages;
fetch('./projectsinfo.json')
    .then(response => response.json())
    .then(data => {
        if(document.getElementById("project-destination") != null){
            projectImages = data[projectIndex].slideShowImg;
            document.getElementById("project-destination").innerText = data[projectIndex].name
            document.getElementById("project-name").innerText = data[projectIndex].name;
            document.getElementById("project-description").innerText = data[projectIndex].description.join('');
            for (let i = 0; i < data[projectIndex].techTags.length; i++) {
                document.getElementById("tech-tags").insertAdjacentHTML('beforeend', '<div class="tag"><img src=".' + data[projectIndex].techTags[i][0] +'"><p>' + data[projectIndex].techTags[i][1] +'%</p></div>');
            }
            for (let i = 0; i < data[projectIndex].links.length; i++) {
                document.getElementById("project-links-list").insertAdjacentHTML('beforeend', '<ul><a href="' + data[projectIndex].links[i][1] + '" target="_blank">' + data[projectIndex].links[i][0] + '</a></ul>');
            }
            if(projectIndex > 0 && projectIndex < data.length - 1){
                document.getElementById("project-next-prev-container").insertAdjacentHTML('afterbegin', '<a onclick="NextPreviousProject(1)">Next</a>');
                document.getElementById("project-next-prev-container").insertAdjacentHTML('afterbegin', '<a onclick="NextPreviousProject(-1)">Previous</a>');
            }
            else if(projectIndex == 0){
                document.getElementById("project-next-prev-container").insertAdjacentHTML('afterbegin', '<a onclick="NextPreviousProject(1)">Next</a>');
            }
            else if(projectIndex == data.length - 1){
                document.getElementById("project-next-prev-container").insertAdjacentHTML('afterbegin', '<a onclick="NextPreviousProject(-1)">Previous</a>');
            }
            showSlides();
        }
});

// Project slideShow
let index = 0;
let slides = document.getElementById("my-slides");
let showSlidesInterval;
function btnPrevious() {
    clearTimeout(showSlidesInterval);
    index--;
    if (index < 0) {
        index = projectImages.length - 1;
    }
    showSlides();
};
function btnNext() {
    clearTimeout(showSlidesInterval);
    index++;
    if (index >= projectImages.length) {
        index = 0;
    }
    showSlides();
};
function showSlides() {
    for (let i = 0; i < projectImages.length; i++) {
        if (i === index) {
            slides.src = projectImages[i];
        }
    }
    showSlidesInterval = setTimeout(btnNext, 2000);
};

// Toggle mobile dropbox menu
let mobNavButton = document.querySelector(".mob-nav-button");
let dropdownMenu = document.querySelector(".mob-dropdown-menu-container");
let lines = document.querySelectorAll(".mob-nav-line");

mobNavButton.addEventListener("click", function(){
    dropdownMenu.classList.toggle("open");
    lines[0].classList.toggle("line");
    lines[1].classList.toggle("line");
    lines[2].classList.toggle("line");
});

// Toggle mobile projects dropdown menu
let mobProjectsButton = document.getElementById("mob-projects-button");
let subDropdownMenu = document.querySelector(".mob-sub-dropdown-menu");
let arrow = document.querySelectorAll(".mob-arrow-line");

mobProjectsButton.addEventListener("click", function(){
    arrow[0].classList.toggle("open");
    arrow[1].classList.toggle("open");
    subDropdownMenu.classList.toggle("open");
});