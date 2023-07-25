import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);
const StatisticsTableRow = ({ label, value }) => (
  <tr>
    <td>{label}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = (props) => {
  if (props.total <= 0) {
    return <div>No feedback given</div>;
  }
  return (
    <table>
      <tbody>
        <StatisticsTableRow label="good" value={props.good} />
        <StatisticsTableRow label="neutral" value={props.neutral} />
        <StatisticsTableRow label="bad" value={props.bad} />
        <StatisticsTableRow label="all" value={props.total} />
        <StatisticsTableRow label="average" value={props.average} />
        <StatisticsTableRow label="positive" value={props.positive} />
      </tbody>
    </table>
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

      <Header text="statistics" />
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
