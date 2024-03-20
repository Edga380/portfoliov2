let currentProjectIndex;

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const project = urlParams.get("project");
  currentProjectIndex = project;
  console.log(project);
  AddProjectInformation();
};
