import React, { Component } from 'react';
import Pagination from './Pagination';
import CreateListing from './CreateListing';
import DisplayListing from './DisplayListing';
import axios from 'axios';
import './styles/MarketPlace.css';

class MarketPlace extends Component {
  constructor() {
    super();
    this.state ={
      isLoading: true,
      listings: [],
      error: null,
      click: false, //added to see if it respond on click
      open: false,
      name: '',
      id: '',
      description: '',
      insurance: '',
      return_date: '',
      images: '',
      listing_type: '',
      pageOfItems: [],
    }

    // bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
    this.onChangePage = this.onChangePage.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    //this.openListing = this.openListing.bind(this);
  }

  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  }

  onClickHandler(e) {
    e.preventDefault();
    this.setState({ click: true });
  }


  
  openListing(item) {
    //console.log('open listing wth item', item)
    this.setState({name: item.item_name});
    this.setState({description: item.item_desc});
    this.setState({return_date: item.return_by});
    this.setState({listing_type: item.type})
    this.setState({insurance: item.insurance_amount});
    this.setState({images: item.image});
    this.setState({ open: true });
  }

  // componentDidMount() {
  //   axios.get(`/market-place`).then((res) => {
  //     const item = res.data;
  //     this.setState({ item });
  //   });
  //   console.log(this.item);
  // }

  async componentDidMount() {
    const response = await axios.get('http://localhost:4000/market-place/active')
    console.log('listings', response)
    this.setState({listings: response.data, isLoading: false})   
  }
 
  render() {
    const {isLoading} = this.state;
    if (this.state.click === true) {
      return <CreateListing />;
    }
    
    if(this.state.open === true){
      return <DisplayListing
              name = {this.state.name}
              description = {this.state.description}
              return_date = {this.state.return_date}
              insurance = {this.state.insurance}
              listing_type = {this.state.listing_type}
              />;
    }
    return (      
      <div className='containerParent'>
      <div className='container'>
        <h1 className='title'>Market Place</h1>
        <div className='itemBoard'>
          <div className='button-wrapper'>
            <button className='listing-button' onClick={this.onClickHandler}>
              Create a Listing
            </button>
          </div>
          <div className='searchItemsWrapper'>
            <input
              type='text'
              className='item-search-input'
              placeholder='search for item'
              maxLength='200'
            ></input>
            <button className='listing-button'>Search</button>
          </div>      
          {console.log('test res',this.state.listings)} 
          <React.Fragment>
            {!isLoading ? (
              Object.values(this.state.listings).map(listing => {
                return(
                  <div className='itemContainer' key={listing.id}>
                    {console.log('test listing',listing)} 
                    <div className='itemImage'
                      onClick={this.openListing.bind(this, listing)}>
                      image {listing.image}
                  {listing.item_name}
                  </div>
                  <div className='paginate'>
                    <Pagination
                    items={this.state.listing}
                    onChangePage={this.onChangePage}
                    />
                  </div>
                  </div>
                );
              })
            ) : (
            <h3>Loading</h3>
              )}
            </React.Fragment>
        </div>
      </div>
      </div>
    );
  }
}
export default MarketPlace;

{/*
class Profile_Listed extends Component {

  constructor() {
    super();

    var numItems = [...Array(100).keys()].map(i => ({
      id: i + 1,
      name: 'Item ' + (i + 1),
      description: 'this is an item',
      cost: i+1,
    }));

    this.state = {
      numItems: numItems,
      name: 'some existing name',
      click: false //added to see if it respond on click
    };
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  testClick(item){
    alert(item.name);
    this.setState({name: item.name});
    this.setState({ click: true });
  }

  onClickHandler(e) {
    e.preventDefault();
    this.setState({ click: true });
  }


  render(){
    {/*routes to an edit listing page*

    if (this.state.click === true) {
      return <EditListing name = {this.state.name} />;
    }

    return (
      <div className='ItemListWrapper'>
      {this.state.numItems.map(item => (
        <div className='item' key={item.id}>

          <div className='itemImageWrapper'>
            <h1> img {item.id} </h1>
          </div>

          <div className='itemInfoWrapper'>
            <h1 className='itemInfoField'> Name: {item.name}</h1>
            <h1 className='itemInfoField'> Cost: ${item.cost}</h1>
          </div>

          <div className='editListingButtonWrapper'>
            <button class="edit-button" onClick={this.testClick.bind(this, item)}>
              Edit Listed Item
            </button>
          </div>
        </div>
      ))}
      </div>

    );
  }
}
export default Profile_Listed;

*/}
