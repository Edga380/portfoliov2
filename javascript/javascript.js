// Smooth scrolling to target
document.body.addEventListener('click', function (e) {
    if ((e.target.tagName === 'A') && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const targetPosition = targetElement.offsetTop;
            window.scroll({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

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
            for (let i = 0; i < data[projectIndex].slideShowImg.length; i++) {
                document.getElementById('slideshow-container').insertAdjacentHTML('beforeend', '<img class="my-slide-image ' + (i === 0 ? 'active' : '') + '" src="' + data[projectIndex].slideShowImg[i] + '">');
            }
            projectImages = document.querySelectorAll('.my-slide-image');
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
            // Pause the slideshow on hover
            projectImages.forEach(e => {
                e.addEventListener('mouseover', () => {
                    pauseSlideshow();
                });
                // Resume the slideshow when the cursor leaves the slideshow area
                e.addEventListener('mouseout', () => {
                    resumeSlideshow();
                });
            });
        }
});

// Project slideShow
// Slide show variables
let index = 0;
let showSlidesInterval;
// Previous slide
function btnPrevious() {
    clearTimeout(showSlidesInterval);
    projectImages[index].classList.remove('active');
    projectImages[index <= 0 ? projectImages.length - 1 : index - 1].classList.add('active');
    index--;
    if (index < 0) {
        index = projectImages.length - 1;
    }
    showSlides();
};
// Next slide
function btnNext() {
    clearTimeout(showSlidesInterval);
    index++;
    if (index >= projectImages.length) {
        index = 0;
    }
    showSlides();
};
// Slide show runs automatically
function showSlides() {
    for (let i = 0; i < projectImages.length; i++) {
        if (i === index) {
            projectImages[index].classList.add('active');
            projectImages[index <= 0 ? projectImages.length - 1 : index - 1].classList.remove('active');
        }
    }
    showSlidesInterval = setTimeout(btnNext, 5000);
};
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