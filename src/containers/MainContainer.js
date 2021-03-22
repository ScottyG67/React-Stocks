import React, { Component } from 'react';
import StockContainer from './StockContainer'
import PortfolioContainer from './PortfolioContainer'
import SearchBar from '../components/SearchBar'

class MainContainer extends Component {

  state={
    stocks:[],
    portfolio:[],
    filter:'none',
    sort:'none'
  }

  componentDidMount(){
    fetch('http://localhost:3000/stocks').then(res => res.json()).then(fetchStocks => this.setState({stocks: fetchStocks}))
  }

  buyStock = (stockId) => {
    if(!this.state.portfolio.includes(stockId)){
      this.setState(previousState => {return {portfolio: [...previousState.portfolio, stockId]}})
    }
  }

  sellStock = (stockId) => {
    if(this.state.portfolio.includes(stockId)){
      let newPortfolio = this.state.portfolio.filter(stock => stock !== stockId)
      this.setState({portfolio: newPortfolio})
    }
  }

  renderPortfolio = () => {
    let myPortfolio =  this.state.stocks.filter(stock => this.state.portfolio.includes(stock.id))
    return myPortfolio
  }

  filterStocks = ({target}) => {
    let filterValue = target.value
    this.setState({filter: filterValue})
  }

  sortStocks = ({target}) => {
    let sortValue = target.value
    if(sortValue !== this.state.sort){
      this.setState({sort: sortValue})
    } else {this.setState({sort: 'none'})}
  }

  renderStocks = () => {
    let returnArray = this.state.stocks.map(stock => stock)
    if(this.state.sort ==="Alphabetically"){
      returnArray = this.sortFunction(returnArray,'name')
    } else if( this.state.sort === "Price"){
      returnArray = this.sortFunction(returnArray,'price')
    } 
    if(this.state.filter !== "none"){
      return returnArray.filter(stock => stock.type === this.state.filter)
    }
    return returnArray
  }

  sortFunction = (listToSort, key) => {
    listToSort.sort((a, b) => {
      const itemA = a[key]
      const itemB = b[key]
      if (itemA < itemB) {
        return -1
      }
      if (itemA > itemB) {
        return 1
      }
      return 0
    })
    return listToSort
  }


  render() {
    return (
      <div>
        <SearchBar filterStocks = {this.filterStocks} sortStocks = {this.sortStocks} 
        alphaSort = {this.state.sort === "Alphabetically" ? true:false}
        priceSort = {this.state.sort === "Price" ? true:false}/>

          <div className="row">
            <div className="col-8">

              <StockContainer stocks={this.renderStocks()} buyStock = {this.buyStock}/>

            </div>
            <div className="col-4">

              <PortfolioContainer stocks = {this.renderPortfolio()} sellStock = {this.sellStock}/>

            </div>
          </div>
      </div>
    );
  }

}

export default MainContainer;
