//Setup variables
const root = document.getElementById("timeline-grid");
const modalBox = document.getElementById("timeline-modals");
const modalInfo = {
  0: "<p>Coming Soon!</p>",
  1: "<p>Coming Soon!</p>",
  2: "<p>Coming Soon!</p>",
  3: "<p>Coming Soon!</p>",
  4: "<p>Coming Soon!</p>",
  5: "<p>Coming Soon!</p>",
  6: "<p>Coming Soon!</p>",
  7: "<p>Coming Soon!</p>",
  8: "<p>Coming Soon!</p>",
  9: "<p>Coming Soon!</p>",
  10: "<p>Coming Soon!</p>",
  11: "<p>Coming Soon!</p>",
  12: "<p>Coming Soon!</p>",
  13: "<p>Coming Soon!</p>",
  14: "<p>Coming Soon!</p>",
  15: "<p>Coming Soon!</p>",
  16: "<p>Coming Soon!</p>",
  17: "<p>Coming Soon!</p>",
  18: "<p>Coming Soon!</p>",
  19: "<p>Coming Soon!</p>",
  20: "<p>Coming Soon!</p>",
  21: "<p>Coming Soon!</p>",
  22: "<p>Coming Soon!</p>",
  23: "<p>Coming Soon!</p>",
  24: "<p>Coming Soon!</p>",
  25: "<p>Coming Soon!</p>",
  26: "<p>Coming Soon!</p>",
  27: "<p>Coming Soon!</p>",
  28: "<p>Coming Soon!</p>",
  29: "<p>Coming Soon!</p>",
  30: "<p>Coming Soon!</p>",
  31: "<p>Coming Soon!</p>",
  32: "<p>Coming Soon!</p>",
  33: "<p>Coming soon!</p>",
  34: "<h3 id=\"what-i-learned\">What I Learned</h3> <ul> <li>My friend <a target=\"_blank\" href=\"https://www.linkedin.com/in/jesse-lauren-pound/\">Jesse</a> taught me to <strong>just try</strong>. No matter what. One opportunity always leads to the next. <ul> <li>Ex: I applied to work at a <a target=\"_blank\" href=\"http://jack.org/\">mental health nonprofit</a>. In just 40 mins :D Now, I&#39;m a speaker there. Suits my personal goals :-)</li> </ul> </li> <li><strong>Be vulnerable first</strong>. Ex: In a call, share a personal story first. Ex: Ask a new friend for their address to send a christmas gift first.</li> <li><strong>Curiosity dissipates conflict</strong>. When mad, ask: &quot;Why am I mad?&quot;</li> <li><strong>At the start of the day, make a todo list. Write WHY I&#39;m doing each todo. Write which part of each task holds most value. Do that first. Identify which task has least priority. Do that last or don&#39;t do that. Work in 15-minute sprints (set a timer). After each sprint, check if still on task.</strong><ul> <li>For work. Not for relationships/fun. Ex: not for a call with friend.</li> </ul> </li> <li><strong>Intentionally make tiny mistakes in front of others</strong>. Less ego<ul> <li>Ex: leave bug in code while showing it to others. </li> </ul> </li> <li><strong>Work on what&#39;s possible &gt; what I&#39;d like</strong>. Less stress.<ul> <li>Ex: I had house repairs one day. Just set one goal. </li> <li>Ex: Had bugs in website. Asked: <strong>&quot;What&#39;s the cost of fixing it now?&quot;</strong> That I might not publish this reflection. So I left the bug.</li> </ul> </li> <li><strong>Meditate/listen to calming music before calls.</strong> Less stress = more authenticity, enthusiasm.</li> </ul> <h3 id=\"what-i-did\">What I did</h3> <ul> <li>Wrote annual reflection on lessons learned in 2021 (<a target=\"_blank\" href=\"https://www.madhavmalhotra.com/blog/2021-Annual-Reflection/index.html\">here</a>)</li> <li>Finished teaching a course on AI starting with grade 9 math (<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=EYQnyfLeI8g&amp;list=PLqgr5FD_y_wLYetqEkzc68eReW2gHK14Q\">here</a>)</li> <li>Recorded podcasts with an e-waste researcher. And a researcher of psychotherapy in developing countries. Will publish in January.</li> <li>Designed 3D model of a commercial kitchen. (<a target=\"_blank\" href=\"https://drive.google.com/file/d/1PP0f5fHIyWf3_XkRL-V2AghQDANZBu_M/view?usp=sharing\">here</a>)</li> <li>Published monthly newsletter with helpful tips. (here)</li> <li>4 speaking challenges: a corporate skit, presentation on fungi, documentary on food waste, and fake news report. (<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=XB8rzJAh-W4&amp;list=PLqgr5FD_y_wLuR5DMQCRNQN0UYNab983G&amp;index=9\">here</a>)</li> <li>Researched the speaking style of 4 speakers: <a target=\"_blank\" href=\"https://quizlet.com/ca/651545782\">Barack Obama</a>, <a target=\"_blank\" href=\"https://quizlet.com/ca/654352291\">Stephen Colbert</a>, <a target=\"_blank\" href=\"https://quizlet.com/ca/655008469\">Jordan Peterson</a>, <a target=\"_blank\" href=\"https://quizlet.com/ca/655472353\">Mel Robbins</a></li> <li>Read 4 reports on biodiversity loss. (<a target=\"_blank\" href=\"https://madhav-malhotra.notion.site/Initial-Exploration-0b0f7d23c79440788bdbac462fab89b2\">notes</a>)</li> <li>Finished reading How to Win Friends and Influence People. (notes)</li> <li>Did chores in a house of 3 for a week :D </li> <li>Learned to cook 3 Indian dishes: <a target=\"_blank\" href=\"https://www.cookwithmanali.com/punjabi-chole-chickpeas-curry/\">chhole</a>, <a target=\"_blank\" href=\"https://www.indianhealthyrecipes.com/pav-bhaji-recipe-how-to-make-pav-bhaji-step-by-step-pictures/\">pav bhaji</a>, <a target=\"_blank\" href=\"https://www.cookwithmanali.com/palak-paneer/\">palak paneer</a></li> <li>25+ calls with friends :-) And made 3 christmas gifts &lt;3</li> <li>Updated website to include these updates :D</li> </ul>",
}

//Check how many squares to render. 
const today = new Date();
const start = new Date("Feb 01 2019");
const numYears = today.getFullYear() - start.getFullYear();
const numMonths = today.getMonth() + numYears * 12 - 1;

for (let i = numMonths; i > 0; i--) {
  const square = getSquare(i);
  root.appendChild(square);
  const modal = getModal(i);
  modalBox.appendChild(modal);
  square.addEventListener("click", (e) => displayModal(e.target.id));
}

//Create a div that has the square visual
function getSquare(m) {
  div = document.createElement("div");

  let time = addMonths(new Date(start.getTime()), -(1-m));
  time = time.toLocaleDateString("en-US", {month: "short", year: "2-digit"});
  div.innerText = time + "'";

  div.className = "timeline-item";
  div.href = `#${time}-update`
  div.id = m.toString() + "-item";
  return div;
}

//Create a div that has the square modal info
function getModal(m) {
  modal = document.createElement("div");
  modal.className = "timeline-modal";
  modal.id = m.toString() + "-modal";
  const content = modalInfo[m-1] || "<p>Coming Soon!</p>"
  modal.innerHTML = `<i class=\"fa fa-close button-close-modal\"></i>${content}`;
  return modal;
}
function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}

//On click, display modal.
function displayModal(id) {
  const num = id.split("-")[0];
  const modal = document.getElementById(`${num}-modal`);
  modal.className = `timeline-modal active`;
  setTimeout(() => closeModal(num), 50);
}

function closeModal(num) {
  const modal = document.getElementById(`${num}-modal`);
  const closeHandler = (e) => {
    if (e.target.matches(".button-close-modal") || !e.target.closest(".timeline-modal.active")) {
      modal.className = "timeline-modal";
      document.removeEventListener("click", closeHandler);
    }
  };
  document.addEventListener("click", closeHandler);
}