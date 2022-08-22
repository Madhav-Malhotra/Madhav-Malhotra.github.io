const linkInsert = `
  <li>
    <a href="https://www.linkedin.com/in/madhav-malhotra/" target="_blank"><i class="fa fa-linkedin"></i></a>
  </li>
  <li>
    <a href="https://madhav-malhotra003.medium.com/" target="_blank"><i class="fa fa-medium"></i></a>
  </li>
  <li>
    <a href="https://github.com/Madhav-Malhotra" target="_blank"><i class="fa fa-github"></i></a>
  </li>
  <li>
    <a href="https://www.youtube.com/c/MadhavMalhotra003" target="_blank"><i class="fa fa-youtube-play"></i></a>
  </li>
`;

const links = document.querySelectorAll("ul.social-links");
for (l of links) {
  l.innerHTML = linkInsert;
}