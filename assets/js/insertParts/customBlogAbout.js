const aboutInsert = `
  <h4 class="about-heading">About Me</h4>
  <img src="../assets/img/paintedProfilePicture.jpg" alt="">
  <h4 style="margin-top: 1.5em;">I'm a student training to solve
    globally <span id="accentColor">neglected issues</span>!
  </h4>
`;

const widget = document.querySelector("div.widget.about-me");
widget.innerHTML = aboutInsert;