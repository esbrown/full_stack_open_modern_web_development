import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [maxVoteIndex, setMaxVoteIndex] = useState(0);
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length));

  const handleNextClick = () => {
    let random = Math.floor(Math.random() * anecdotes.length);
    setSelected(random);
  };

  const handleVoteClick = () => {
    const votesCopy = { ...votes };
    votesCopy[selected] += 1;
    setVotes(votesCopy);

    // Update index of max if we have a new max value
    if (votesCopy[selected] > votesCopy[maxVoteIndex]) {
      setMaxVoteIndex(selected);
    }
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <button onClick={handleVoteClick}>vote</button>
      <button onClick={handleNextClick}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[maxVoteIndex]}</div>
      <div>has {votes[maxVoteIndex]} votes</div>
    </div>
  );
};

export default App;
