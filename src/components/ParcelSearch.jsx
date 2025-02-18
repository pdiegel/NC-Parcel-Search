import { useState } from "react";
import { searchParcels } from "../api/ncParcels";
import { fieldAliases } from "../helpers/fields";


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
            const parcels = await searchParcels(query, field);
            setResults(parcels);
        } catch (error) {
            console.error("Search failed:", error);
            setResults([]);
        }

        setSearching(false);
        setNumSearches(numSearches + 1);
    };

    const handleEnter = async (event) => {
        if (event.key === 'Enter') {
            await handleSearch();
        }
    }

    return (
        <div className="search-container">
            <h2>NC Parcel Finder</h2>
            <div className="search-bar">
                <select name="field" id="field" onChange={e => setField(e.target.value)}>
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
                    placeholder="Enter owner name"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <ul className="search-results">
                {results.map((parcel, index) => (
                    <li key={index} onClick={() => setSelectedParcel(parcel)} style={{ cursor: "pointer", color: "blue" }}>
                        {parcel.attributes.siteadd}<br />
                        PID: {parcel.attributes.parno || parcel.attributes.altparno}<br />
                        Owner: {parcel.attributes.ownname}

                    </li>
                ))}
            </ul>
            {numSearches > 0 && !searching && <p>{results.length} results found.</p>}
            {searching && <p>Searching {fieldAliases[field]} for {query}...</p>}
        </div >
    );
};

export default ParcelSearch;
