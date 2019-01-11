import React, { Component } from 'react';
import './App.css';
import Result from "./result";

class App extends Component {

  constructor(props) {
    super(props);

    let favourites = [];
    if (localStorage.hasOwnProperty("favourites")){
      favourites = JSON.parse(localStorage.getItem("favourites"))
    }

    this.state = {
      searchValue: "",
      results: [],
      favourites: favourites,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    this.search().then(data => console.log(data));

    evt.preventDefault();
  }


  updateSearchValue(evt) {
    this.setState({
      searchValue: evt.target.value
    });

    this.clearSearchResultsIfEmpty(evt.target.value);
  }


  clearSearchResultsIfEmpty(text) {
    if (text.length === 0){
      this.setState({
        results: []
      })
    }
  }

  async getJson() {
    try {
      let resp = await fetch("https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000");
      let respJson = await resp.json();
      return respJson
    } catch(error) {
      console.error("Error getting waste data: ", error)
    }
  }

  async search() {

    let json = await this.getJson();

    const normalizedSearch = this.state.searchValue.toLowerCase();

    let results = json.filter(
      obj => {
        return (obj.keywords.toLowerCase().includes(normalizedSearch))
      }
    );

    this.setState({
      results: results
    });
    console.log(results)
  }


  favourite = (id) => {
    let resultToFavourite = this.state.results[id];

    // ensures that result is not already favourited
    if (!this.isFavourited(resultToFavourite.title)){

      let updatedFavs = this.state.favourites;

      updatedFavs.push(resultToFavourite);

      this.setState({
          favourites: updatedFavs
        }
      )
    } else {
      this.unfavouriteByTitle(resultToFavourite.title)
    }

    this.saveFavouritesToLocalStorage();
  };

  unfavouriteByTitle = (title) => {
    let updatedFavs = this.state.favourites.filter(obj => {
      return obj.title !== title
    });

    this.setState({
      favourites: updatedFavs
    });

    this.saveFavouritesToLocalStorage();
  };

  unfavouriteByIndex = (index) => {
    let updatedFavs = this.state.favourites;
    updatedFavs.splice(index, 1);

    this.setState({
      favourites: updatedFavs
    });

    this.saveFavouritesToLocalStorage();
  };

  isFavourited(title) {
    let results = this.state.favourites.filter(obj => {
      return obj.title === title
    });

    return results.length === 1
  }

  saveFavouritesToLocalStorage() {
    localStorage.setItem("favourites", JSON.stringify(this.state.favourites))
  }

  render() {
    const buildResults = (resultData, favouriteMethod) => {
      return resultData.map((result, index) => {
        
        return <Result title={result.title} body={result.body} key={index} id={index} favouriteMethod={favouriteMethod}
                       isFavourited={this.isFavourited(result.title)}
        />
      });
    };

    let resultItems = buildResults(this.state.results, this.favourite);

    let favouriteItems = buildResults(Object.values(this.state.favourites), this.unfavouriteByIndex);

    let favourites = <div/>;
    if (favouriteItems.length !== 0){
      favourites =
        <div className="favourites">
          <div className="container">
            <div className="title">
              Favourites
            </div>
            {favouriteItems}
          </div>
        </div>
    }

    return (
      <div className="App card">
          <header className="header">
          Toronto Waste Lookup
          </header>
          <div className="container">

            <form onSubmit={this.handleSubmit}>
              <input className="search-bar" type="text" name="search" value={this.state.searchValue} onChange={evt => this.updateSearchValue(evt)}/>
              <button type="submit" className="search-btn"><i className="fa fa-search fa-flip-horizontal"> </i></button>
            </form>
          </div>

          <div className="results container">
            {resultItems}
          </div>
          {favourites}
      </div>
    );
  }
}

export default App;
