import logo from './logo.svg';
import './App.css';
import Info from './components/info';
import Map from './components/map';
import Footer from './components/footer';
import AppTitle from './components/appTitle';
import Highlighted from './components/highlighted';
import SearchBar from './components/searchBar';
import Downloads from './components/downloads';
import { useState } from 'react';

function App() {
  const [infoData,setInfoData] = useState({title:'', data:['test']})
  const [highlight,setHighlight] = useState('none')

  return (
    <main className="App">
      <Map setInfoData={setInfoData} setHighlight={setHighlight}/>
      <AppTitle/>
      <SearchBar/>
      <Highlighted value={highlight}/>
      <Info title={infoData.title} data={infoData.data}/>
      <Downloads/>
      <Footer/>
    </main>
  );
}

export default App;
