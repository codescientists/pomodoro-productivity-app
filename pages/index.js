import Head from "next/head";
import { useRef, useState } from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const NotificationSound = require("../assets/notification.mp3");

const style = {
  title: "text-3xl font-bold text-gray-200",
  tabs: "my-4 flex items-center bg-gray-800 p-2 rounded-full",
  tab: " p-2 rounded-full font-bold cursor-pointer",
  selectedTab: "bg-cyan-500",
  timer:
    "bg-gray-800 w-72 h-72 p-5 flex items-center justify-center rounded-full shadow-lg",
  timerText: "text-5xl font-bold text-center",
  button: "bg-gray-800 w-32 h-10 mt-4 rounded-lg shadow-md",
};

const Home = () => {
  const [selectedTab, setSelectedTab] = useState("pomodoro");
  const [percentage, setPercentage] = useState(0);
  const [audio] = useState(
    typeof Audio !== "undefined" && new Audio(NotificationSound)
  );

  const Ref = useRef(null);

  // The state for our timer
  const [timer, setTimer] = useState("25:00");

  let breakTimeMinutes = 25;
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total > 0) {
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
        ":" +
        (seconds > 9 ? seconds : "0" + seconds)
      );

      setPercentage(Math.ceil((total / (breakTimeMinutes * 60000)) * 100));
    }
    if (total == 0) {
      setPercentage(0);
      audio.play(1);
      setTimer("Take a 5 mins break!");
    }
  };

  const clearTimer = (e) => {
    setTimer("25:00");

    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    deadline.setSeconds(deadline.getSeconds() + breakTimeMinutes * 60);
    return deadline;
  };

  const handleReset = () => {
    clearTimer(getDeadTime());
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col items-center justify-center">
      <Head>
        <title>Pomodoro Productivity App</title>
        <meta
          name="description"
          content="Pomodoro Productivity App to increase your productivity while working."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2 className={style.title}>pomodoro</h2>

      <div className={style.tabs}>
        <div
          className={`${style.tab} ${selectedTab === "pomodoro" ? style.selectedTab : ""
            }`}
          onClick={() => setSelectedTab("pomodoro")}
        >
          Pomodoro
        </div>
        <div
          className={`${style.tab} ${selectedTab === "shortBreak" ? style.selectedTab : ""
            }`}
          onClick={() => setSelectedTab("shortBreak")}
        >
          Short Break
        </div>
        <div
          className={`${style.tab} ${selectedTab === "longBreak" ? style.selectedTab : ""
            }`}
          onClick={() => setSelectedTab("longBreak")}
        >
          Long Break
        </div>
      </div>

      <div className={style.timer}>
        <CircularProgressbarWithChildren
          strokeWidth={4}
          styles={{
            path: {
              stroke: `cyan`,
              strokeLinecap: "round",
              transition: "stroke-dashoffset 0.5s ease 0s",
            },
            trail: {
              stroke: "transparent",
            },
          }}
          value={percentage}
        >
          <h1 className={style.timerText}>{timer}</h1>
        </CircularProgressbarWithChildren>
      </div>
      <button className={style.button} onClick={() => handleReset()}>
        {percentage == 0 ? "Start" : "Reset"}
      </button>
    </div>
  );
};

export default Home;
