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
  32: "<h3 id=\"what-i-learned\">What I learned</h3> <ul> <li><strong>If I don&#39;t know what to do, helping others is a good default.</strong> It benefits others, makes me happier, strengthens relationships, and gives me new perspectives.</li> <li>If I can’t get 10 good ideas, get 20 ideas. - <a target=\"_blank\" href=\"http://resources.madhavmalhotra.com/56d126378c1f4188a1795008820776d3?p=e711c8c058e147cb8a40fef9528467a8\">James Altucher</a><ul> <li>Intentionally get stupid ideas! Combine 2+ stupid ideas into 1 uniquely-good idea.</li> <li>Ex: What’s a unique project? A) Make video games (stupid - not unique). B) Cut off a leg (stupid - not feasible). Combine: make video games as less-boring rehab exercises for amputees.</li> </ul> </li> <li><strong>Tag people on social media whenever I find something that might interest them</strong>. Low-effort way to show I’m looking out for others.</li> <li><strong>Calmness is in what’s inside, not what’s outside.</strong><ul> <li>Ex: I can hold my tongue in an argument, but still feel annoyed at the other. That isn’t being ‘calm’. I have more work to do.</li> </ul> </li> <li><strong>Don’t push away negative thoughts. Don’t ruminate over them endlessly. Seek the balanced middle.</strong><ul> <li>Ex: Letting myself recount a sad experience by journaling about it. But closing the journal after and not thinking about it.</li> </ul> </li> <li><strong>Enthusiasm hack: just add more exclamation marks and emojis!!</strong></li> <li>How to argue less: ask myself: <strong>“Am I helping the situation right now?”</strong><h3 id=\"what-i-did\">What I did</h3> </li> <li><strong>Started a <a target=\"_blank\" href=\"https://www.youtube.com/watch?v=1YF7KurH8Dg&amp;list=PLqgr5FD_y_wLuR5DMQCRNQN0UYNab983G\">weekly public speaking challenge</a></strong> for 52 weeks!<ul> <li>My favourite challenge this month was <a target=\"_blank\" href=\"https://www.youtube.com/watch?v=XmzvgUjQf4Y&amp;list=PLqgr5FD_y_wLuR5DMQCRNQN0UYNab983G&amp;index=3\">this skit</a> on Winston Churchill arguing with his mother :D</li> <li>I researched <a target=\"_blank\" href=\"https://quizlet.com/ca/629919820\">Mr. Rogers</a>, <a target=\"_blank\" href=\"https://quizlet.com/ca/626869343\">Martin Luther King</a>, <a target=\"_blank\" href=\"https://quizlet.com/ca/635430181\">John F. Kennedy</a>, and <a target=\"_blank\" href=\"https://quizlet.com/ca/632717024\">Winston Churchill</a></li> </ul> </li> <li><strong>Started learning 3D printing basics</strong>. Made an <a target=\"_blank\" href=\"https://drive.google.com/file/d/17CqCKOmza7OfFLE1rN5ZNSh4qqmsqUBo/view?usp=sharing\">extra painful Lego brick</a> and <a target=\"_blank\" href=\"https://drive.google.com/file/d/1YIALbcsAhIjP2MnnNlAKaUzNhqo6vrtp/view?usp=sharing\">bike handle lightsaber</a> :D</li> <li>Publicly shared <strong>notes on all the <a target=\"_blank\" href=\"https://resources.madhavmalhotra.com/book-notes\">books</a> I&#39;ve read!</strong></li> <li><strong>Training to speak about mental health</strong> at a <a target=\"_blank\" href=\"http://jack.org/\">nonprofit</a></li> <li>Made <a target=\"_blank\" href=\"https://drive.google.com/file/d/105WsGk86y0iJP4uvUVnhHdftvg_mThce/view?usp=sharing\">dinosaur art</a> for seniors :-)</li> </ul>",
  33: "<h3 id=\"what-i-learned\">What I learned</h3> <ul> <li><strong>No matter how much pain I go through, I can get unimaginably better.</strong> See <a target=\"_blank\" href=\"https://madhav-malhotra003.medium.com/all-greatness-comes-from-suffering-3a39d85ca77d\">case studies</a>. </li> <li><strong>Do things that I&#39;m curious about, especially if most others aren&#39;t curious about them.</strong> Then, I know prestige isn&#39;t biasing me.</li> <li>To be authentic, be spontaneous. Ex: <strong>Set a timer and <a target=\"_blank\" href=\"https://www.squibler.io/dangerous-writing-prompt-app\">don&#39;t stop writing</a>.</strong></li> <li>Venting emotions to others is a healthy habit.</li> <li>To get to 10x better, ask: <strong>“What can X do that can’t be done anywhere else?”</strong></li> <li>To listen well, I have to WANT to listen. I&#39;ll want to listen if I&#39;m asking questions that lead to interesting answers. Ask:<ul> <li><strong>“What’s the most surprising thing you learned about this week?”</strong></li> <li><strong>“What’s something [adjective] you do that most others don’t?”</strong></li> <li><strong>“What’s a big challenge you’ve faced that shapes who you are today?”</strong></li> </ul> </li> <li>Immediately after negativity, reflect: <strong>“How can I grow from this?”</strong></li> <li><strong>When thanking, complimenting, encouraging, etc. - add SPECIFIC details</strong>.</li> <li>Keep giving till I learn to stop expecting something in return. Ex: <strong>Thank someone every day</strong>.</li> <li>Usually, I fear what others think. Not failure. <ul> <li><strong>To overcome the fear of what others think, do tiny things to look ridiculous</strong>. Ex: Wear a tie with a sports shirt.</li> </ul> </li> <li>Self-confidence is based on intention, not results. <ul> <li><strong>Before starting a task, do a positive affirmation about my intention</strong>. Ex: “I will pursue this out of curiosity and will persist even if there are setbacks.”</li> </ul> </li> <li>Avoid preprepared questions in meetings. <strong>Ask followups whenever possible.</strong></li> <li><strong>Ask: “WHY am I feeling [negative emotion]?” Curiosity dissipates negativity.</strong></li> </ul> <h3 id=\"what-i-did\">What I did</h3> <ul> <li><strong>Started teaching a course on AI starting with grade 8 math</strong> <a target=\"_blank\" href=\"https://youtube.com/playlist?list=PLqgr5FD_y_wLYetqEkzc68eReW2gHK14Q\">here</a></li> <li>Volunteering at a <a target=\"_blank\" href=\"http://terraoptima.ca/\">startup</a> to make <a target=\"_blank\" href=\"https://drive.google.com/file/d/1rRZ7ocCgJ5Z8mmdlc8DyFeFb4hUxDWtM/view?usp=sharing\">3D models</a> of composting systems</li> <li>Training to be a speaker at a <a target=\"_blank\" href=\"http://jack.org/\">mental health nonprofit</a></li> <li>4 speaking challenges: a history presentation, two skits, and reading children&#39;s books <a target=\"_blank\" href=\"https://www.youtube.com/watch?v=g0PsdWnY7Ec&amp;list=PLqgr5FD_y_wLuR5DMQCRNQN0UYNab983G&amp;index=5\">here</a></li> <li>Researched 4 speakers: <a target=\"_blank\" href=\"https://quizlet.com/ca/649001197/\">Oprah Winfrey</a>, <a target=\"_blank\" href=\"https://quizlet.com/ca/645654600/\">Cal Fussman</a>, <a target=\"_blank\" href=\"https://quizlet.com/ca/643587057/\">Ben Shapiro</a>, and <a target=\"_blank\" href=\"https://quizlet.com/ca/641175196/\">Christopher Hitchens</a>.</li> <li>Made <strong><a target=\"_blank\" href=\"https://resources.madhavmalhotra.com/health-notes\">notes</a> on how to fix dozens of health and mental health issues.</strong></li> <li>Researched childhood trauma in 27 influential historical figures. <strong>Wrote an <a target=\"_blank\" href=\"https://madhav-malhotra003.medium.com/all-greatness-comes-from-suffering-3a39d85ca77d\">article</a> on how &#39;heros&#39; are as vulnerable as all of us.</strong></li> </ul>",
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