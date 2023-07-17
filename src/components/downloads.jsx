import React, {useState} from 'react';
import downloadIcon from '../icons/download-icon.png';

import Countries  from '../data/countries.geojson'
import LangByCountries  from '../data/languages.json'
import Languages  from '../data/countries.geojson'

const Downloads = () => {
    const [open,toggle] = useState(false)
    return (
        <div className='downloads'>
            <button onClick={()=>{toggle((curr=>!curr))}}><img src={downloadIcon} alt="Download icons"/>Datasets</button>
            {open&&
            <div>
                <ul>
                    <li><a href={Languages} download>Languages.json</a></li>
                    <li><a href={LangByCountries} download>LangByCountries.json</a></li>
                    <li><a href={Countries} download>Countries.geojson</a></li>
                </ul>
            </div>
            }
        </div>
    );
}

export default Downloads;
