import React, { useState } from "react";
import { searchParcels } from "../api/ncParcels";
import { fieldAliases } from "../helpers/fields";
import { getFieldData } from "../api/ncParcels";
import { Parcel } from "../types/Parcel";
import { Field } from "../types/Field";
// @ts-ignore
import loading from "../assets/loading.gif";

const fieldTypes = new Set();
let fieldData: Field[] = [];

async function fetchFieldData() {
  return await getFieldData();
}

fetchFieldData().then((data) => {
  // Use fieldData inside your app
  fieldData = data;
});

fieldData.forEach((field) => fieldTypes.add(field.type));

const ParcelSearch = ({ setSelectedParcel }) => {
  const [query, setQuery] = useState("");
  const [field, setField] = useState(Object.keys(fieldAliases)[0]);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [numSearches, setNumSearches] = useState(0);

  const handleSearch = async () => {
    if (!query.trim() || !field) {
      alert("Please enter a search query and select a field.");
      return;
    }

    setSearching(true);
    console.log(`Searching ${field} for ${query}...`);

    try {
      const currentFieldData = fieldData.find(
        (fieldData) => fieldData.name === field
      );
      if (!currentFieldData) {
        alert("Field data not found for the selected field.");
        setSearching(false);
        return;
      }
      const parcels = await searchParcels(query, currentFieldData.type, field);
      setResults(parcels);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }

    setSearching(false);
    setNumSearches(numSearches + 1);
  };

  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

  return (
    <div className="search-container">
      <h2>NC Parcel Finder</h2>
      <div className="search-bar">
        <select
          name="field"
          id="field"
          onChange={(e) => setField(e.target.value)}
        >
          {Object.entries(fieldAliases).map(([field, alias]) => (
            <option key={field} value={field}>
              {alias}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => handleEnter(e)}
          placeholder="Enter search query..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul className="search-results">
        {results.map((parcel: Parcel, index) => (
          <li
            key={index}
            onClick={() => setSelectedParcel(parcel)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {parcel.attributes.siteadd && (
              <>
                {parcel.attributes.siteadd}
                <br />
              </>
            )}
            PID: {parcel.attributes.parno || parcel.attributes.altparno}
            <br />
            Owner: {parcel.attributes.ownname}
          </li>
        ))}
      </ul>
      {numSearches > 0 && !searching && (
        <p className="loading">{results.length} results found.</p>
      )}
      {searching && (
        <div className="loading">
          <p>Searching for parcels...</p>
          <img src={loading} alt="loading..." />
        </div>
      )}
    </div>
  );
};

export default ParcelSearch;
