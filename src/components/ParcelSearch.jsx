import { useState } from "react";
import { searchParcels } from "../api/ncParcels";

const ParcelSearch = ({ setSelectedParcel }) => {
    const [query, setQuery] = useState("");
    const [field, setField] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        console.log("Searching " + field + " for " + query);
        const parcels = await searchParcels(query, field);
        console.log("Results: " + parcels);
        setResults(parcels);
    };

    return (
        <div className="search-container">
            <h2>NC Parcel Finder</h2>
            <div className="search-bar">
                <input
                    type="text"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="Enter field to query"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter owner name"
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <ul className="search-results">
                {results.map((parcel, index) => (
                    <li key={index} onClick={() => setSelectedParcel(parcel)} style={{ cursor: "pointer", color: "blue" }}>
                        {parcel.attributes.ownname} - Parcel ID: {parcel.attributes.altparno}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParcelSearch;
