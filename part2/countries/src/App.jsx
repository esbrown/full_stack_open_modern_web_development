import { useState, useEffect } from "react"
import countryService from "./services/countries"
import CountryList from "./components/CountryList"
import CountryInput from "./components/CountryInfo"

const App = () => {
  const [input, setInput] = useState("")
  const [allCountries, setAllCountries] = useState([])

  useEffect(() => {
    console.log("fetching all...")
    countryService.getAll().then((countries) => {
      console.log("fetched all")
      setAllCountries(countries)
    })
  }, [])

  const onInputChange = (inputText) => {
    setInput(inputText.toLowerCase())
  }

  return (
    <div>
      <CountryInput inputText={input} handleInputChange={onInputChange} />
      <CountryList allCountries={allCountries} inputText={input} />
    </div>
  )
}

export default App
