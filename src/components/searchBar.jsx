import React, { useEffect, useState } from 'react';
import languages from '../data/languages.json'

const SearchBar = () => {
    const [search,setSearch] = useState()
    const [results,setResults] = useState()
    
    useEffect(()=>{
        if(search){
            setResults(['test','test','test'])
        }else{
            setResults()
        }
    },[search])

    return (
        <div className='searchBar'>
            <span>Search By Language</span>
            <input type="text" onChange={e=>setSearch(e.target.value)} />
            {results?
                <div className='results'>
                    <ul>
                        {
                            results.map(item=>(<li>{item}</li>))
                        }
                    </ul>
                </div>
            :""}
        </div>
    );
}

export default SearchBar;
