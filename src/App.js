import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import { FaSearchengin } from "react-icons/fa";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";

import Linegraph from "./Linegraph";
import "leaflet/dist/leaflet.css";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Footer from "./Footer";
////////////////////////

// https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]); // this is used to select countries worldwide
  const [country, setInputCountry] = useState("worldwide");
  const [countryName, setCountryName] = useState("");
  const [casesType, setCasesType] = useState("cases");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 38, lng: -97 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    //this useEffect will run when the page loads/refreshed and give us data for whole wolrd stats of covid-19
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  // console.log(countryInfo);

  useEffect(() => {
    //  now an async function need to run for getting list of countries
    const getCountriesData = async () => {
      await fetch(" https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //this will give full name of a country
            value: country.countryInfo.iso3, // this will give code name of country
          }));
          console.log(data);
          let sortedData = sortData(data); //this function will sort the data in desc order
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, []);
  ////////////////////////////////////////////
  const searchCountry = async (e) => {
    const country = countryName;
    // const countryName = e.target.value;
    // const countryCode = countryName;
    // console.log(inputField);
    setCountryName(country); // this will help in selecting country name from dropdown

    //now here we will fetch the data from the url to display the current stats
    //and here we will address two conditions
    // first is to show stats for whole world abd second is to show stats for specific country from dropdown list
    const url = `https://disease.sh/v3/covid-19/countries/${country}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // setInputCountry(countryCode);
        setCountryInfo(data); // this will give all the info related to covid-19 in the selected country. this will we a json data.
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        setCountryName("");
      });
  };
  /////////////////////////////////////////////////
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    // console.log(countryCode);
    setInputCountry(countryCode); // this will help in selecting country name from dropdown

    //now here we will fetch the data from the url to display the current stats
    //and here we will address two conditions
    // first is to show stats for whole world abd second is to show stats for specific country from dropdown list
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/countries"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // setInputCountry(countryCode);
        setCountryInfo(data); // this will give all the info related to covid-19 in the selected country. this will we a json data.
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  // console.log("covid info", countryInfo);

  return (
    <div className="app">
      <div className="app-1">
        <div className="app__left">
          <header className="app__header">
            <h1>COVID-19 TRACKER</h1>
            <div className="app__media">
              <div className="app__input">
                <input
                  className="app__search"
                  type="text"
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  placeholder="Country Name"
                />
                <button>
                  <FaSearchengin onClick={searchCountry} />
                </button>
              </div>

              <FormControl className="app__dropdown">
                <Select
                  value={country}
                  variant="outlined"
                  onChange={onCountryChange}
                >
                  <MenuItem value="worldwide">WorldWide</MenuItem>
                  {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </header>

          <div className="app__stats">
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              isRed
              active={casesType === "cases"}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
            />
            <InfoBox
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              active={casesType === "recovered"}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0.0a")}
            />
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              isRed
              active={casesType === "deaths"}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0.0a")}
            />
          </div>
          <div className="app__map">
            <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
          </div>
        </div>
        <Card className="app__right">
          <CardContent>
            <h1>Live cases by Country </h1>
            <Table countries={tableData} />
            {}
            <h1>
              {country} {casesType}
            </h1>
            <Linegraph casesType={casesType} />
          </CardContent>
        </Card>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
