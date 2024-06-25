import React, { useState, useEffect, useRef } from 'react';

import './SearchBar.css';
import Result from './Result';

const SearchBar = (props) => {
    const [search, setSearch] = useState("");
    const textareaRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);


    const handleSearch = () => {
        let results = [];
        setLoading(true);
        if (props.tabs) {
        props.tabs.forEach(tab => {
        const content = tab.content;
        const language = tab.language;
        const path = tab.path;
        const title = tab.title;
        const lines = content.split("\n");
        lines.forEach((line, index) => {
            let i = 0;
            while (i < line.length) {
                i = line.indexOf(search, i);
                if (i === -1) {
                    break;
                }
                const start = i - 3 < 0 ? 0 : i - 3;
                const end = i + search.length + 3 > line.length ? line.length : i + search.length + 3;
                let res = line.slice(start, end);
                if (start !== 0) {
                    res = "..." + res;
                }
                if (end !== line.length) {
                    res = res + "...";
                }
                results.push(
                    {
                        title: title,
                        content: res,
                        path: path,
                        line: index + 1,
                        position: i,
                        language: language
                    }
                );
                i += search.length;
            }
        });
    });
}

        if (props.data) {
            // TODO
            
        }
        setResults(results);
        setLoading(false);
    };

    const handleChange = (event) => {
        setSearch(event.target.value);
        setResults([]);
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        textarea.style.height = "10px";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [search]);

    return (
        <div>
            <p style={
                {
                    color: "white",
                    margin: "0",
                    padding: "10px",
                    paddingLeft: "20px",
                    fontSize: "11px"
                }
            }>
                SEARCH
            </p>
            <div className='search-bar-wrapper'>
                <textarea
                    ref={textareaRef}
                    className="search-bar"
                    placeholder="Enter search query..."
                    value={search}
                    onChange={handleChange}
                />
                {!props.data && <p style={{color: "white", marginLeft: 20, marginRight: 20, marginBottom: 20}}>You have not opened or specified a folder. Only open files are currently searched - <a href="#" onClick={props.openFolder} style={{color: "#017BFD", textDecoration: "none"}}>Open Folder</a></p>}
                <button className="search-button" onClick={handleSearch}>Search</button>
                {loading && <p>Loading...</p>}
                <div className="search-results">
                    {results.map((result, index) => <Result key={index} result={result} query={search} />)}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
