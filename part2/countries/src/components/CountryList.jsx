const CountryInfo = ({ country }) => {
  console.log(country)
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h4>languages: </h4>
      <ul>
        {Object.values(country.languages).map((it) => {
          console.log(it)
          return <li key={it}>{it}</li>
        })}
      </ul>
      <img src={country.flags.png} />
    </div>
  )
}

const CountryList = ({ allCountries, inputText, onShowCountryInfo }) => {
  const matching = allCountries.filter((it) =>
    it.name.common.toLowerCase().includes(inputText)
  )
  console.log(matching)
  const size = matching.length
  if (size === 1) {
    return <CountryInfo country={matching[0]} />
  } else if (size === 0) {
    return <p>no matches...</p>
  } else if (size > 10) {
    return <p>Too many matches, specify another filter</p>
  } else {
    return matching.map((it) => (
      <div key={it.name.common}>
        {it.name.common}{" "}
        <button onClick={() => onShowCountryInfo(it)}>show</button>
      </div>
    ))
  }
}

export default CountryList
