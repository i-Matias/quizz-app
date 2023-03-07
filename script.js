document.addEventListener("DOMContentLoaded", () => {
  const api_url =
    "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple";

  const quiz = document.getElementById("quiz");
  const answerEls = document.querySelectorAll(".answer");
  const labelElements = document.getElementsByTagName("label");
  const question = document.getElementById("question");
  const a_text = document.getElementById("a_text");
  const b_text = document.getElementById("b_text");
  const c_text = document.getElementById("c_text");
  const d_text = document.getElementById("d_text");
  const submitBtn = document.getElementById("submit");

  let quizData;
  let index = 0;
  let score = 0;

  async function fetchQuizData() {
    try {
      const response = await fetch(api_url);
      const data = await response.json();
      quizData = data;
      submitBtn.addEventListener("click", () => {
        const answer = getSelected();
        if (answer && answer === quizData.results[index].correct_answer) {
          score++;
        }
        index++;
        if (index < quizData.results.length) {
          loadQuiz(quizData);
        } else {
          quiz.innerHTML = `
                    <h2> You answered ${score}/${quizData.results.length} questions correctly. </h2>
                    <button onclick="location.reload()">Reload</button>
                `;
        }
      });
      loadQuiz(quizData);
    } catch (err) {
      console.log(err);
    }
  }

  function loadQuiz(data) {
    deselectAnswer();
    const currQuestionIndex = data.results[index];

    question.innerText = currQuestionIndex.question;
    const answers = randomlySwapEl(currQuestionIndex);
    a_text.innerText = answers[0];
    b_text.innerText = answers[1];
    c_text.innerText = answers[2];
    d_text.innerText = answers[3];
  }

  function randomlySwapEl(currQuestionIndex) {
    const answers = currQuestionIndex.incorrect_answers;
    answers.push(currQuestionIndex.correct_answer);
    let firstRandom = Math.floor(Math.random() * answers.length);
    let secondRandom = Math.floor(Math.random() * answers.length);

    let tmp = answers[firstRandom];
    answers[firstRandom] = answers[secondRandom];
    answers[secondRandom] = tmp;
    return answers;
  }

  function deselectAnswer() {
    answerEls.forEach((anserEl) => {
      anserEl.checked = false;
    });
  }

  function getSelected() {
    let answer;
    let radioId = document.querySelector('input[name="answer"]:checked').id;
    for (const element of labelElements) {
      if (element.getAttribute("for") == radioId) {
        answer = element.innerHTML;
      }
    }
    return answer;
  }

  fetchQuizData();
});
