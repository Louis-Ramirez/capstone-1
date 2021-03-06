import React, { Component } from 'react';
import {
  Link,
  NavLink,
} from 'react-router-dom';
//import Navigation from './Navigation';

import './styles/AllGuilds.css';
import CreateGuild from './CreateGuild';
import DisplayGuild from './DisplayGuild';
import Spinner from './layout/spinner_transparent.gif';
import noimage from '../images/noimageavailable.png';
import axios from 'axios';


function parsePath(orig) {
  let res = orig.substr(9);
  res = '.' + res;
  return res;
}

class AllGuilds extends Component {
  constructor() {
    super();
    this.state = {
      click: false, //added to see if it respond on click
      open: false,
      guilds: [],
      isLoading: true,
      description: '',
      search_key: '',
      picture: null,
      name: '',
      guildid: ''
    };
    this.onClickHandler = this.onClickHandler.bind(this);
    this.searchChangeHandler = this.searchChangeHandler.bind(this);
  }

  onClickHandler(e) {
    e.preventDefault();
    this.setState({ click: true });
  }

  searchChangeHandler = (e) => {
    this.setState({
      search_key: e.target.value,
    });
  };

  openGuild(item) {
    console.log('open guild listing with', item)
    this.setState({ name: item.name });
    this.setState({ description: item.guild_desc });
    this.setState({ guildmaster: item.creator_id });
    this.setState({ open: true });
    this.setState({ picture: item.picture }); //added
    this.setState({ guildid: item.id})
  }

  async componentDidMount() {
    const response = await axios.get('http://localhost:4000/all-guilds/')
    console.log('all guilds', response)
    this.setState({ guilds: response.data, isLoading: false })
  }

  render() {
    const { isLoading } = this.state;
    if (this.state.click === true) {
      return <CreateGuild />;
    }

    if (this.state.open === true) {
      return (
        <DisplayGuild
          name={this.state.name}
          description={this.state.description}
          picture={this.state.picture}
          guildmaster={this.state.guildmaster}
          guildid={this.state.guildid}
        />
      );
    }

    return (
      <div className='Background'>
        {' '}
        {/*the background color*/}
        <h1 className='title'>All Guilds</h1>
        <div className='GuildBoard'>
          <div className='addGuildsButtonWrapper'>
            <button className='add-button' onClick={this.onClickHandler}>
              Add New Guild
            </button>
          </div>

          <div className='searchWrapper'>
            <input
              type='text'
              className='search-input'
              placeholder='search for guilds'
              maxLength='200'
              value={this.state.search_key}
              onChange={this.searchChangeHandler}
            ></input>
            <button className='search-button'>
              <Link to={{
                pathname: '/all-guilds/search-results',
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
              Object.values(this.state.guilds).map(guild => {
                return (
                  <div className='GuildContainer' key={guild.id}>
                    <div
                      className='GuildImageWrapper'
                      onClick={this.openGuild.bind(this, guild)}
                    >
                      {/*<h1> Image {guild.picture} </h1> */}
                      {guild.picture != null ? (
                        <img
                          src={parsePath(guild.picture)}
                          height='200'
                          width='200'
                          alt=''
                        ></img>
                      ) : (
                          <img src={noimage} height='200' width="200" ></img>
                        )}
                    </div>
                    <div className='GuildNameWrapper'>
                      <h3>{guild.name} </h3>
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
      </div>
    );
  }
}

export default AllGuilds;
