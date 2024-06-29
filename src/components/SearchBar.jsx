import React, { useState, useEffect, useRef } from 'react';

import './SearchBar.css';
import Result from './Result';

const SearchBar = (props) => {
    const [search, setSearch] = useState("");
    const textareaRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        let results = [];
        setLoading(true);
        if (props.tabs) {
            props.tabs.forEach(tab => {
                const key = tab.key;
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
                        results.push(
                            {
                                key: key,
                                title: title,
                                content: line,
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
            try {
                const response = await fetch(`http://localhost:8080/api/execFeature`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ feature: "SEARCH", 
                        params : [search], 
                        project: "project" }), // Fix project maybe
                });
                if (!response.ok) {
                    throw new Error('File not found');
                }
                const data = await response.json();
                console.log(data);
                for (const item of data.l) {
                    console.log("Item: " + item);
                    console.log(typeof item.line, item.line);
                    results.push({
                        key: item.key,
                        title: item.title,
                        content: item.content,
                        path: item.path,
                        line: item.line,
                        position: item.position,
                        language: ""
                    })
                }
            } catch (error) {
                console.log(error.message);
            }
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
                    {results.map((result, index) => <Result key={index} result={result} query={search} onClick={() => props.onResultClick(result)}/>)}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
