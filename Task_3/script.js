// ==== CAROUSEL ====
const carouselImages = document.querySelector('.carousel-images');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const slides = document.querySelectorAll('.carousel-images img');
let slideIndex = 0;

function showSlide(index) {
  const slideWidth = document.querySelector('.carousel').clientWidth; 
  if (index < 0) slideIndex = slides.length - 1;
  else if (index >= slides.length) slideIndex = 0;
  else slideIndex = index;
  carouselImages.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
}
prevBtn.addEventListener('click', () => showSlide(slideIndex - 1));
nextBtn.addEventListener('click', () => showSlide(slideIndex + 1));
window.addEventListener('resize', () => showSlide(slideIndex)); 

// ==== QUIZ ====
const quizData = [
  { question: "Which language is used for styling web pages?", options: ["HTML", "CSS", "Python"], answer: "CSS" },
  { question: "Which is not a programming language?", options: ["Java", "Python", "HTML"], answer: "HTML" },
  { question: "Which symbol is used for comments in JavaScript?", options: ["//", "#", "<!--"], answer: "//" },
  { question: "Which tag is used to create a link in HTML?", options: ["<a>", "<link>", "<href>"], answer: "<a>" },
  { question: "Which property changes the text color in CSS?", options: ["color", "font-style", "text-style"], answer: "color" }
];

let currentIndex = 0;
let userAnswers = new Array(quizData.length).fill(null);
const quizContainer = document.getElementById("quiz-container");
const resultBox = document.getElementById("quizResult");

function loadQuestion() {
  if (currentIndex < quizData.length) {
    const q = quizData[currentIndex];
    quizContainer.innerHTML = `
      <h3>${q.question}</h3>
      ${q.options.map(opt => `
        <label class="option">
          <input type="radio" name="option" value="${opt}"
            ${userAnswers[currentIndex] === opt ? "checked" : ""}>
          ${opt.replace(/</g,"&lt;").replace(/>/g,"&gt;")}
        </label>
      `).join("")}
      <br>
      <div class="nav-buttons">
        <button id="prevBtn" ${currentIndex===0 ? "disabled" : ""}>Previous</button>
        ${currentIndex === quizData.length - 1 
          ? `<button id="submitBtn">Submit</button>` 
          : `<button id="nextBtn">Next</button>`}
      </div>
    `;

    document.querySelectorAll("input[name=option]").forEach(input => {
      input.addEventListener("change", () => userAnswers[currentIndex] = input.value);
    });

    if (currentIndex > 0)
      document.getElementById("prevBtn").onclick = () => { currentIndex--; loadQuestion(); };

    if (currentIndex < quizData.length - 1)
      document.getElementById("nextBtn").onclick = () => { currentIndex++; loadQuestion(); };

    if (currentIndex === quizData.length - 1)
      document.getElementById("submitBtn").onclick = showResult;
  }
}

function showResult() {
  const score = quizData.reduce((acc, q, i) =>
    acc + (userAnswers[i] === q.answer ? 1 : 0), 0);

  let reviewHTML = `<h3>📋 Review Answers</h3>
    <table class="review-table">
      <tr>
        <th>Question</th>
        <th>Your Answer</th>
        <th>Correct Answer</th>
      </tr>`;

  quizData.forEach((q, i) => {
    let ua = userAnswers[i];
    if (!ua || ua.trim() === "") ua = "❌ Not Answered";
    let color = (ua === q.answer) ? "green" : "red";
    reviewHTML += `
      <tr>
        <td>${q.question}</td>
        <td style="color:${color}; font-weight:bold;">${ua.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</td>
        <td style="color:green;">${q.answer.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</td>
      </tr>`;
  });

  reviewHTML += `</table>
                 <button class="restart-btn" onclick="restartQuiz()">Restart Quiz</button>`;

  resultBox.innerHTML = `<h3>🎯 Final Score: ${score}/${quizData.length}</h3>` + reviewHTML;
  quizContainer.innerHTML = "";
}

function restartQuiz() {
  currentIndex = 0;
  userAnswers = new Array(quizData.length).fill(null);
  resultBox.innerHTML = "";
  loadQuestion();
}
loadQuestion();

// ==== WEATHER ====
document.getElementById("loadWeather").addEventListener("click", async () => {
  const box = document.getElementById("weatherContainer");
  box.textContent = "Loading...";
  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=22.57&longitude=88.36&current_weather=true");
    const data = await res.json();
    const w = data.current_weather;
    box.innerHTML = `<p>🌡 Temp: ${w.temperature}°C</p>
                     <p>💨 Wind: ${w.windspeed} km/h</p>`;
  } catch { box.textContent = "Failed to load weather!"; }
});

// ==== JOKES ====
document.getElementById("loadJoke").addEventListener("click", async () => {
  const box = document.getElementById("jokeContainer");
  box.textContent = "Loading...";
  try {
    const res = await fetch("https://official-joke-api.appspot.com/random_joke");
    const joke = await res.json();
    box.innerHTML = `<p>${joke.setup}</p><p><b>${joke.punchline}</b></p>`;
  } catch { box.textContent = "Failed to load joke!"; }
});
