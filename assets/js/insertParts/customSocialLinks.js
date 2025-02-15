const linkInsert = `
  <li>
    <a href="https://www.linkedin.com/in/madhav-malhotra/" target="_blank"><i class="fa fa-linkedin"></i></a>
  </li>
  <li>
    <a href="https://github.com/Madhav-Malhotra" target="_blank"><i class="fa fa-github"></i></a>
  </li>
  <li>
    <a href="https://www.youtube.com/@MadhavMalhotra" target="_blank"><i class="fa fa-youtube-play"></i></a>
  </li>
  <li>
    <a href="https://madhav-malhotra.medium.com/" target="_blank"><i class="fa fa-medium"></i></a>
  </li>
`;

const socialInsertLinks = document.querySelectorAll("ul.social-links");
for (l of socialInsertLinks) {
  l.innerHTML = linkInsert;
}