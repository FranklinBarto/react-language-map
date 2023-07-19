import React, { useEffect, useState } from 'react';
import languages from '../data/languages.json'
import countryLanguages from '../data/languagesByCountries.json'

// The search bar has an auto complete function
const SearchBar = ({setInfoData,setCountryHighlights,title}) => {
    // State to support search function of the drop down
    const [selected,setSelected] = useState(false)
    const [search,setSearch] = useState()
    const [results,setResults] = useState()
    
    // Lets take in the data directly from the import to eliminate setting variables in case of state refresh
    // const languageData = languages
    // const countryData = countryLanguages

    // Search for languages by string
    const searchByString = (target)=>{
        let filteredData = languages.filter(item => {
          // Check if the item contains the substring, use all lowercase to allow for case insensitive search
          return JSON.stringify(item).toLowerCase().includes(target.toLowerCase());
        });
        return(filteredData.slice(0,20))
    }

    const handleLanguageSelect = (target)=>{
        let filteredData = countryLanguages.filter(item => {
            // Check if the item contains the substring, use all lowercase to allow for case insensitive search
            return JSON.stringify(item).toLowerCase().includes(target.toLowerCase());
          });
        setSearch(target)
        setCountryHighlights(filteredData)
        setInfoData({title: target, data: filteredData, dataType: 'searchByLanguage'})
    }

    // Handle search language input change
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
                            results.map(item=>(<li onClick={()=>{handleLanguageSelect(item.name);setSelected(true)}}>{item.name}</li>))
                        }
                    </ul>
                </div>
            :""}
        </div>
    );
}

export default SearchBar;
