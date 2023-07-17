import React, { useEffect, useState } from 'react';
import languages from '../data/languages.json'
import countryLanguages from '../data/languagesByCountries.json'

const SearchBar = ({setInfoData,setCountryHighlights,title}) => {
    const [selected,setSelected] = useState(false)
    const [search,setSearch] = useState()
    const [results,setResults] = useState()
    
    const languageData = languages
    const countryData = countryLanguages

    const searchByString = (target)=>{
        let filteredData = languageData.filter(item => {
          // Check if the item contains the substring, use all lowercase to allow for case insensitive search
          return JSON.stringify(item).toLowerCase().includes(target.toLowerCase());
        });
        return(filteredData.slice(0,20))
    }


    const searchByLanguage = (target)=>{
        let filteredData = countryData.filter(item => {
            // Check if the item contains the substring, use all lowercase to allow for case insensitive search
            return JSON.stringify(item).toLowerCase().includes(target.toLowerCase());
          });
        setSearch(target)
        setCountryHighlights(filteredData)
        setInfoData({title: target, data: filteredData, dataType: 'searchByLanguage'})
    }

    useEffect(()=>{
        if(search){
            setResults(searchByString(search))
        }else{
            setResults()
            setSelected()
        }
    },[search])

    useEffect(()=>{
        if(title!==''&&title!==search){
            setSearch('')
        }
    },[title])

    return (
        <div className='searchBar'>
            <span>Search By Language</span>
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} />
            {results&&!selected?
                <div className='results'>
                    <ul>
                        {
                            results.map(item=>(<li onClick={()=>{searchByLanguage(item.name);setSelected(true)}}>{item.name}</li>))
                        }
                    </ul>
                </div>
            :""}
        </div>
    );
}

export default SearchBar;
