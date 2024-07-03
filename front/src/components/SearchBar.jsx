import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';
import Result from './Result';

const SearchBar = (props) => {
    const [search, setSearch] = useState("");
    const textareaRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);


    function get_language(s) {
        const extension = s.split('.').pop().toLowerCase();
        switch (extension) {
            case 'java':
                return 'java';
            case 'py':
                return 'python';
            case 'js':
                return 'javascript';
            case 'c':
                return 'c';
            case 'cpp':
            case 'cxx':
            case 'cc':
            case 'c++':
                return 'cpp';
            case 'txt':
                return 'text';
            default:
                return 'plaintext'
        }
    }

    const handleSearch = async () => {
        if (search.replace(/\s/g, '').length === 0) {
            setResults([]);
            setSearchPerformed(true);
            return;
        }
        let searchResults = [];
        setLoading(true);
        setSearchPerformed(true);

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
                        searchResults.push({
                            key: key,
                            title: title,
                            content: line,
                            path: path,
                            line: index + 1,
                            position: i,
                            language: language
                        });
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
                    body: JSON.stringify({ feature: "SEARCH", params: [search], project: "project" }),
                });
                if (!response.ok) {
                    console.log("Bad response");
                    setResults([]);
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                for (const item of data.l) {
                    if (!searchResults.some(result => result.path === item.path)) {
                        searchResults.push({
                            key: item.key,
                            title: item.title,
                            content: item.content,
                            path: item.path,
                            line: item.line,
                            position: item.position,
                            language: get_language(item.title)
                        });
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        setResults(searchResults);
        setLoading(false);
    };

    const handleChange = (event) => {
        setSearch(event.target.value);
        setResults([]);
        setSearchPerformed(false);
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        textarea.style.height = "10px";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [search]);

    return (
        <div>
            <p style={{
                color: "white",
                margin: "0",
                padding: "10px",
                paddingLeft: "20px",
                fontSize: "11px"
            }}>
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
                {!props.data && <p style={{ color: "white", marginLeft: 20, marginRight: 20, marginBottom: 20 }}>You have not opened or specified a folder. Only open files are currently searched - <a href="#" onClick={props.openFolder} style={{ color: "#017BFD", textDecoration: "none" }}>Open Folder</a></p>}
                <button className="search-button" onClick={handleSearch}>Search</button>
                {loading && <p>Loading...</p>}
                <div className="search-results">
                    {searchPerformed && results.length === 0 && !loading ? <div className="no-results">No results</div> : results.map((result, index) => <Result key={index} result={result} query={search} onClick={() => props.onResultClick(result)} />)}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;