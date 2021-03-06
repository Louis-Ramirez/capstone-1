import React, { Component } from 'react';
import {
  Link,
  NavLink,
} from 'react-router-dom';
import Pagination from './Pagination';
import CreateListing from './CreateListing';
import DisplayListing from './DisplayListing';
import noimage from '../images/noimageavailable.png';
import Spinner from './layout/spinner_transparent.gif';
import axios from 'axios';
import './styles/MarketPlace.css';


function parsePath(orig) {
  let res = orig.substr(9);
  res = '.' + res;
  return res;
}

const styleTitle = {
  fontFamily: 'fantasy',
  font: 'bold'
};


class MarketPlace extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      listings: [],
      error: null,
      click: false, //added to see if it respond on click
      open: false,
      name: '',
      listingid: '',
      description: '',
      insurance: '',
      return_date: '',
      images: null,
      listing_type: '',
      total_price: '',
      rent_amount: '',
      policy: '',
      pageOfItems: [],
      search_key: '',
      lenderid: '',
      borrowerid: '',
      itemid: '',
      reserved: false,
      currentuserid: ''
    }

    // bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
    this.onChangePage = this.onChangePage.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.searchChangeHandler = this.searchChangeHandler.bind(this);
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

  searchChangeHandler = (e) => {
    e.preventDefault();
    this.setState({
      search_key: e.target.value,
    });
  };


  async openListing(item) {
    const response = await axios.get('http://localhost:4000/market-place/' + item.id)
    console.log('checking if reserved ', response.data[0].reserved)
    console.log('open listing wth item', item)
    this.setState({ name: item.item_name });
    this.setState({ description: item.item_desc });
    this.setState({ listing_type: item.type })
    this.setState({ insurance: item.insurance_amount });
    this.setState({ images: item.image });   //changed this from item.image to images
    this.setState({ total_price: item.total_price });
    this.setState({ policy: item.policy });
    this.setState({ rent_amount: item.rent_amount });
    this.setState({ lenderid: item.lender_id });
    this.setState({ itemid: item.item_id })
    this.setState({ listingid: item.id })
    this.setState({ reserved: response.data[0].reserved })
    this.setState({ username: item.username })
    this.setState({ rating: item.rating })
    this.setState({ lenderid: item.userid })

    console.log('this.state after assigned', this.state)
    this.setState({ open: true }); // moved to the end because of a race condition


    if (item.return_by === null) {
      this.setState({ return_date: '' });
    }
    else {
      this.setState({ return_date: item.return_by });
    }
  }

  // componentDidMount() {
  //   axios.get(`/market-place`).then((res) => {
  //     const item = res.data;
  //     this.setState({ item });
  //   });
  //   console.log(this.item);
  // }

  async componentDidMount() {
    const [firstResp, secondResp] = await Promise.all([
      axios.get('http://localhost:4000/market-place/active'),
      // Getting the current profile of the user
      axios.get('http://localhost:4000/profile/' + -1)
    ]);
    console.log('listings in marketplace', firstResp.data)
    this.setState({ listings: firstResp.data, isLoading: false, currentuserid: secondResp.data.id })
    console.log(this.state.lenderid, 'current user id')
  }

  render() {
    const { isLoading } = this.state;
    if (this.state.click === true) {
      return <CreateListing />;
    }

    if (this.state.open === true) {
      console.log('opening a listing will display now \n', this.state)
      if (this.state.reserved === true) {
        // I think this would be a good place for a notification cause
        // the transition is jaring and you dont know what happened
        console.log('already reserved srry')
        return <MarketPlace />
      }
      return <DisplayListing
        name={this.state.name}
        description={this.state.description}
        return_date={this.state.return_date}
        insurance={this.state.insurance}
        listing_type={this.state.listing_type}
        total_price={this.state.total_price}
        rent_amount={this.state.rent_amount}
        policy={this.state.policy}
        images={this.state.images}
        lenderid={this.state.lenderid}
        itemid={this.state.itemid}
        listingid={this.state.listingid}
        username={this.state.username}
        rating={this.state.rating}
        currentuserid={this.state.currentuserid}
      />;
    }
    //{console.log('test listing', listing)}
    // {console.log('test res', this.state.listings)}
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
                value={this.state.search_key}
                onChange={this.searchChangeHandler}
              ></input>

              <button className='listing-button'>
                <Link to={{
                  pathname: '/market-place/search-results',
                  data: this.state.search_key,
                }}
                  className='yellow'
                >
                  Search
              </Link>
              </button>

            </div>
            <React.Fragment>
              {!isLoading ? (
                Object.values(this.state.listings).map(listing => {
                  return (
                    <div className='someContainer' key={listing.id}>
                      <div className='itemImage'
                        onClick={this.openListing.bind(this, listing)}>
                        {/*listing.image*/}
                        {/*<h1>{listing.image}</h1> */}
                        {listing.image != null ? (
                          <img
                            src={parsePath(listing.image)}
                            height='200'
                            width='200'
                            alt=''
                          ></img>
                        ) : (
                            <img src={noimage} height='200' width="200" ></img>
                          )}
                      </div>
                      <div>
                        <h5 style={styleTitle}>{listing.item_name}</h5>
                        {this.state.currentuserid == listing.lender_id &&
                          <h6>View Your listing</h6>
                        }
                        {this.state.currentuserid != listing.lender_id &&
                          <h6>Posted By: {listing.username} {Math.round((listing.rating + Number.EPSILON) * 100) / 100}/5</h6>
                        }
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
                  <div className='spinner'>
                    <img src={Spinner} alt="loading..." />
                  </div>
                )}
            </React.Fragment>
          </div>
          <div className='footer'>
            Need help? Contact us GuildsTeam499@gmail.com
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
