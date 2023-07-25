import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);
const StatisticsLine = ({ label, value }) => (
  <div>
    {label} {value}
  </div>
);

const Statistics = (props) => {
  return (
    <div>
      <Header text="statistics" />
      {props.total <= 0 ? (
        <div>No feedback given</div>
      ) : (
        <div>
          <StatisticsLine label="good" value={props.good} />
          <StatisticsLine label="neutral" value={props.neutral} />
          <StatisticsLine label="bad" value={props.bad} />
          <StatisticsLine label="all" value={props.total} />
          <StatisticsLine label="average" value={props.average} />
          <StatisticsLine label="positive" value={props.positive} />
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;
  const average = (good + -1 * bad) / total;
  const positive = (good / total) * 100 + " %";

  return (
    <div>
      <Header text="give feedback" />
      <Button text={"good"} handleClick={() => setGood(good + 1)} />
      <Button text={"neutral"} handleClick={() => setNeutral(neutral + 1)} />
      <Button text={"bad"} handleClick={() => setBad(bad + 1)} />

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
