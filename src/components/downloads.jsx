import React, {useState} from 'react';
import downloadIcon from '../icons/download-icon.png';

import Countries  from '../data/countries.geojson'
import LangByCountries  from '../data/languagesByCountries.json'
import Languages  from '../data/languages.json'

const Downloads = () => {
    const [open,toggle] = useState(false)
    return (
        <div className='downloads'>
            <button onClick={()=>{toggle((curr=>!curr))}}><img src={downloadIcon} alt="Download icons"/>Datasets</button>
            {open&&
            <div>
                <ul>
                    <li><a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(Languages))}`} download="languages.json">Languages.json</a></li>
                    <li><a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(LangByCountries))}`} download="languagesByCountries.json">LangByCountries.json</a></li>
                    <li><a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(Countries))}`} download="Countries.geojson">Countries.geojson</a></li>
                </ul>
            </div>
            }
        </div>
    );
}

export default Downloads;
