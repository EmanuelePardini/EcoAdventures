import React, { MouseEvent, useEffect, useState } from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
import { quizQuestions } from "../../data/quizQuestions";
import { IGameDetail } from "../../interfaces/IGameDetail";
import { IQuestionState } from "../../interfaces/IQuestionState";
import { IAnswerObject } from "../../interfaces/IAnswerObject";
import "./app.scss";

// Main
const App = () => {
  // States
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<IQuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<IAnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [questionAmount] = useState(10);
  const [fetchFail, setFetchFail] = useState(false);
  const [gameEnd, setGameEnd] = useState(true);
  const [gameDate, setGameDate] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [gameScores, setGameScores] = useState<IGameDetail[]>(
    localStorage.getItem("game-scores") == null
      ? []
      : JSON.parse(localStorage.getItem("game-scores")!)
  );
  const [gameScoresPage, setGameScoresPage] = useState(1);
  const [gameScoresTotalPage, setGameScoresTotalPage] = useState(
    (gameScores.length > 0 ? Math.trunc((gameScores.length - 1) / 10) : 0) + 1
  );
  const [gamePageScores, setPageScores] = useState(
    gameScores.slice().splice(0, 10)
  );

  useEffect(() => {
    setGameScoresTotalPage(
      (gameScores.length > 0 ? Math.trunc((gameScores.length - 1) / 10) : 0) + 1
    );
    if (gameOver && gameEnd) {
      const pagination = document.querySelector(
        ".game-scores-pagination"
      ) as HTMLUListElement;
      let child = pagination.lastElementChild as HTMLElement;

      while (child) {
        pagination.removeChild(child);
        child = pagination.lastElementChild as HTMLElement;
      }

      const createPagination = () => {
        let beforePage = gameScoresPage - 1;
        let afterPage = gameScoresPage + 1;

        const dirBtn = (dir: string, limit: number) => {
          const li = document.createElement("li");
          const button = document.createElement("button");

          button.textContent = dir;
          button.type = "button";
          button.classList.add("pagination-direction");
          li.appendChild(button);

          if (dir === "Prev") {
            button.dataset.direction = "prev";
            button.addEventListener("click", () => {
              setGameScoresPage((prev) => prev - 1);
            });
          }

          if (dir === "Next") {
            button.dataset.direction = "next";
            button.addEventListener("click", () => {
              setGameScoresPage((prev) => prev + 1);
            });
          }

          if (gameScoresPage == limit) button.disabled = true;

          return li;
        };

        pagination.appendChild(dirBtn("Prev", 1));

        for (
          let pages =
            gameScoresPage === gameScoresTotalPage && gameScoresPage >= 3
              ? beforePage - 1
              : beforePage;
          pages <= afterPage;
          pages++
        ) {
          if (pages > gameScoresTotalPage) continue;
          if (pages === 0) {
            pages++;
            if (afterPage < gameScoresTotalPage) afterPage++;
          }

          const li = document.createElement("li");
          const button = document.createElement("button");
          button.type = "button";
          button.classList.add("pagination-numbers");
          button.textContent = pages.toString();

          if (pages === gameScoresPage) button.dataset.current = "true";

          li.appendChild(button);

          button.addEventListener("click", () => setGameScoresPage(pages));

          pagination.appendChild(li);
        }

        pagination.appendChild(dirBtn("Next", gameScoresTotalPage));
      };

      createPagination();
    }

    setPageScores(gameScores.slice().splice((gameScoresPage - 1) * 10, 10));
  }, [gameEnd, gameOver, gameScores, gameScoresPage, gameScoresTotalPage]);

  useEffect(() => {
    if (!gameOver && !loading) {
      window.document.title = `"EcoAdventures Quiz"`;
      const subtitle = document.querySelector(
        ".subtitle"
      ) as HTMLHeadingElement;
    }
  }, [gameOver, loading]);

  // When game starts
  async function startTrivia() {
    setQuestions([]);
    setLoading(true);
    setGameOver(false);
    setFetchFail(false);

    // Start Game when fetching succeeds.
    setQuestions(quizQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);

    // Start Game when fetching succeeds.
    setQuestions(quizQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);

    if (quizQuestions.length > 0) {
      // Start Game when fetching succeeds.
      setQuestions(quizQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);

      const getDateTime = new Date();
      const gameYears = getDateTime.getFullYear();
      const gameMonths = getDateTime.getMonth();
      const gameDays = getDateTime.getDate();
      const gameHours = getDateTime.getHours();
      const gameMinutes = getDateTime.getMinutes();

      setGameDate(
        `${gameYears}-${
          gameMonths <= 9 ? "0" + (gameMonths + 1) : gameMonths + 1
        }-${gameDays < 10 ? "0" + gameDays : gameDays}`
      );
      setGameTime(
        `${(gameHours % 12 < 10 ? "0" : "") + (gameHours % 12)}:${
          gameMinutes < 10 ? "0" + gameMinutes : gameMinutes
        } ${gameHours >= 12 ? "PM" : "AM"}`
      );

      setLoading(false);
    } else {
      // Go back to main menu when fetching fails.
      setLoading(false);
      setGameOver(true);
      setFetchFail(true);
    }
  }

  function getSkillLevel(score: number) {
    const correctAnswers = score;
    const skillLevels = ["Beginner", "Base", "Intermediate", "Expert", "Master"];

    if (correctAnswers == 10) {
      return skillLevels[4];
    } else if (correctAnswers ==9) {
      return skillLevels[3];
    } else if (correctAnswers >= 6) {
      return skillLevels[2];
    }
     else if (correctAnswers >= 3) {
    return skillLevels[1];
  } else {
      return skillLevels[0];
    }
  }

  // Check selected answer if correct.
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) {
        setScore((prev) => prev + 1);
      }
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  // Start a new game after finishing a game.
  const newGame = () => {
    setGameEnd(true);
    const endScore = document.querySelector(".score") as HTMLParagraphElement;
    const endScoreBtn = document.querySelector(
      ".btn-next"
    ) as HTMLButtonElement;
    endScore.classList.remove("end-score");
    endScoreBtn.classList.remove("end-score-btn");

    // Add to user data.
    const gameDetail: IGameDetail = {
      date: gameDate,
      time: gameTime,
      questions,
      userAnswers,
      score,
    };
    const tempScores = gameScores;
    tempScores.unshift(gameDetail);
    setGameScores(tempScores);
    localStorage.setItem("game-scores", JSON.stringify(gameScores));
    setGameScoresPage(1);
  };

  // Go to next question card.
  const nextQuestion = () => {
    const nextQuestion = number + 1;

    // Go to Game Over Screen once game is finished.
    if (nextQuestion === totalQuestions) {
      setGameOver(true);
      const endScore = document.querySelector(".score") as HTMLParagraphElement;
      const endScoreBtn = document.querySelector(
        ".btn-next"
      ) as HTMLButtonElement;
      endScore.classList.add("end-score");
      endScoreBtn.classList.add("end-score-btn");
      setGameEnd(false);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <div className="App">
      <div className="body">
        <div className="game-interface">
          <div className="title-container">
            <h1 className="title"></h1>
          </div>

          {/* Game Setup Interface */}
          {gameOver && gameEnd ? (
            <div className="game-setup">
              {/* Start Button */}
              <div className="start-container">
                <button
                  className="start btn-start"
                  onClick={() => {
                    setTotalQuestions(questionAmount);
                    startTrivia();
                  }}
                  onMouseOver={(e) => {
                    const startBtnParent = e.currentTarget.parentElement!;
                    startBtnParent.style.padding = "4px 0 0 0";
                  }}
                  onMouseOut={(e) => {
                    const startBtnParent = e.currentTarget.parentElement!;
                    startBtnParent.style.padding = "0 0 4px 0";
                  }}
                >
                  Start
                </button>
              </div>
              <p>
                "Welcome to our 'EcoExplorer Quiz' – a fun and enlightening
                experience for travelers who care about the environment! Test
                your knowledge on sustainable tourism, eco-friendly practices,
                and responsible travel.
              </p>
            </div>
          ) : null}

          {/* Score display once game is over. */}
          {!gameOver || !gameEnd ? (
            <div className="score-container">
              <p className="score">
                Score: <span className="score-number">{score}</span>
              </p>
              
              {gameOver && !gameEnd ? (
                <p className="end-score-label">
                  You scored {score} out of {totalQuestions}.
                  You're in a {getSkillLevel(score)} level!
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Loading Spinner display when fetching questions. */}
          {loading ? (
            <div className="loading-container">
              <p className="loading-questions">Loading Questions...</p>
              <div id="loader">
                <div id="spinner-back"></div>
                <div id="spinner"></div>
              </div>
            </div>
          ) : null}

          {/* Questions display upon game start. */}
          {!loading && !gameOver && questions.length > 0 ? (
            <QuestionCard
              questionNumber={number + 1}
              totalQuestions={totalQuestions}
              question={questions[number].question}
              answers={questions[number].answers}
              userAnswer={userAnswers[number]}
              callback={checkAnswer}
            />
          ) : null}

          {/* Next Question Button and New Game */}
          {(!gameOver || !gameEnd) && !loading && number !== totalQuestions ? (
            <div className="next-container">
              {/* Next question button. */}
              {!gameOver ? (
                <button
                  type="button"
                  className="next btn-next"
                  onClick={nextQuestion}
                  onMouseOver={(e) => {
                    const nextBtnParent = e.currentTarget
                      .parentElement as HTMLDivElement;
                    if (
                      !(nextBtnParent.childNodes[0] as HTMLButtonElement)
                        .disabled
                    ) {
                      nextBtnParent.style.padding = "2px 0 0 0";
                    }
                  }}
                  onMouseOut={(e) => {
                    const nextBtnParent = e.currentTarget
                      .parentElement as HTMLDivElement;
                    nextBtnParent.style.padding = "0 0 2px 0";
                  }}
                  disabled={userAnswers.length != number + 1 ? true : false}
                >
                  {number !== totalQuestions - 1 ? "Next Question" : "Next"}
                </button>
              ) : (
                // New Game Button
                <button
                  type="button"
                  className="next btn-next"
                  onClick={newGame}
                  onMouseOver={(e) => {
                    const nextBtnParent = e.currentTarget
                      .parentElement as HTMLDivElement;
                    if (
                      !(nextBtnParent.childNodes[0] as HTMLButtonElement)
                        .disabled
                    ) {
                      nextBtnParent.style.padding = "4px 0 0 0";
                    }
                  }}
                  onMouseOut={(e) => {
                    const nextBtnParent = e.currentTarget
                      .parentElement as HTMLDivElement;
                    nextBtnParent.style.padding = "0 0 4px 0";
                  }}
                  disabled={userAnswers.length != number + 1 ? true : false}
                >
                  New Game
                </button>
              )}
            </div>
          ) : null}
          {gameOver && gameEnd && !loading ? (
            <div className="game-scores-container">
              <div className="game-scores-header">
                <h2 className="game-scores-header-label">Game Scores</h2>
              </div>
              {gamePageScores.length > 0 ? (
                <div className="game-scores-table-container">
                  <p className="end-score-label">
                    You scored {score} out of {totalQuestions}!
                  </p>
                </div>
              ) : (
                <p className="game-scores-table-empty-label">
                  No score! Start a game and see your scores here.
                </p>
              )}
              <div className="game-scores-footer">
                <ul className="game-scores-pagination"></ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
