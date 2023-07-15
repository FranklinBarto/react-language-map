import logo from './logo.svg';
import './App.css';
import Info from './components/info';
import Map from './components/map';
import Footer from './components/footer';
import Title from './components/title';
import SearchBar from './components/searchBar';

function App() {
  
  return (
    <main className="App">
      <Map/>
      <Title/>
      <SearchBar/>
      <Info/>
      <Footer/>
    </main>
  );
}

export default App;
