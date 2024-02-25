const CountryInput = ({ inputText, handleInputChange }) => {
  return (
    <div>
      find countries{" "}
      <input
        value={inputText}
        onChange={(event) => handleInputChange(event.target.value)}
      />
    </div>
  )
}

export default CountryInput
