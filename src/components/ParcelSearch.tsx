import React, { useState } from "react";
import { searchParcels } from "../api/ncParcels";
import { PARCEL_FIELD_ALIASES } from "../lib/constants";
import { Parcel } from "../types/Parcel";
import { Field } from "../types/Field";
// @ts-ignore

const ParcelSearch = ({
  fieldData,
  setSelectedParcel,
}: {
  fieldData: Field[];
  setSelectedParcel: (parcel: Parcel) => void;
}) => {
  const [query, setQuery] = useState("");
  const [field, setField] = useState(Object.keys(PARCEL_FIELD_ALIASES)[0]);
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
      const queryResult = await searchParcels(
        query,
        currentFieldData.type,
        field
      );
      if (typeof queryResult === "string") {
        alert(queryResult);
        setSearching(false);
        return;
      }
      const parcels = queryResult;

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
          {Object.entries(PARCEL_FIELD_ALIASES).map(([field, alias]) => (
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
          <img
            src={
              "https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/abfa05c49acf005b8b1e0ef8eb25a67a7057eb20/svg-css/ring-resize.svg"
            }
            alt="loading..."
          />
        </div>
      )}
    </div>
  );
};

export default ParcelSearch;
