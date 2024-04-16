let currentProjectIndex;

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectUrl = urlParams.get("project");
  // Fetch project data and set currentProjectIndex
  fetch("./projectsinfo.json")
    .then((response) => response.json())
    .then((projectData) => {
      projectData.map((project, i) => {
        if (project.href === projectUrl) {
          currentProjectIndex = i;
        }
      });
    });
  AddProjectInformation();
};
