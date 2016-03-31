import React from 'react';
import ReactDOM from 'react-dom';
import Searchpagebody from './components/searchpagebody.js';
import Postbookpagebody from './components/Postbook/postbookbody.js';
import Frontpagebody from './components/frontpagebody';
import Howitworkbody from './components/howitworkbody.js';
import Bookinfobody from './components/Bookinfo/bookinfobody';
import ResetDatabase from'./components/resetdatabase.js';
import Header from './components/header';
import {Link} from 'react-router';
import Profilebody from './components/profilebody';
import Mailbox from './components/mailbox';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';
import ErrorBanner from './components/errorbanner'
import {hideElement} from './util';
import {myfilter,gethistory} from './server';
import Searchpagebook from './components/searchpagebook';
import Searchpagebookslist from './components/searchpagebookslist';

class SearchPage extends React.Component {
  render() {
    return (
      <div>
        <Searchpagebody user={4}/>
      </div>
    );
  }
}

// HEAD
class BookPage extends React.Component {
  render() {
    return (
      <div>
        <Bookinfobody user={4} book={1}/>
      </div>
    );
  }
}

class PostbookPage extends React.Component {
  render() {
    return (
      <div>
        <Postbookpagebody user={4}/>
      </div>
    );
  }
}

class ContactPage extends React.Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="row body">
            <div className="col-md-6 col-md-offset-3">
              <br /><font size="10">Sold Out!</font>
              <br /><font size="5">Please Wait for other onwer post!</font>
              <br /><Link to="/search"><font size="5">Go Back</font></Link>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

class SuccessPost extends React.Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="row body">
            <div className="col-md-6 col-md-offset-3">
              <br /><font size="10">Success!</font>
              <br /><font size="5">Thanks for posting!</font>
              <br /><Link to="/post"><font size="5">Go Back</font></Link>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

class FrontPage extends React.Component {
  render() {
    return <Frontpagebody user={4}/>;
  }
}

class PRofile extends React.Component {
  render(){
    return <Profilebody user={4}/>;
  }
}
class HowitWork extends React.Component {
  render() {
    return <Howitworkbody user={4} />;
  }
}

class SearchResultsPage extends React.Component {
  getSearchTerm() {
    var queryVars = this.props.location.query;
    var searchTerm = "";
    if (queryVars && queryVars.q) {
      searchTerm = queryVars.q;
      searchTerm.trim();
    }
    return searchTerm;
  }
  render() {
    var searchTerm = this.getSearchTerm();
    return (
      <SearchResults key={searchTerm} user={4} searchTerm={searchTerm} />
    );
  }
}

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      invalidSearch: false,
      results: [],
      historys:[]
    };
  }

  refresh() {
    gethistory(this.props.user,(history) => {
      this.setState({
        historys:history
      });
    });
    var searchTerm = this.props.searchTerm;
    if (searchTerm !== "") {
      myfilter(searchTerm, (feedItems) => {
        this.setState({
          loaded: true,
          results: feedItems
        });
      });
    } else {
      this.setState({
        invalidSearch: true
      });
    }
  }

  componentDidMount() {
    this.refresh();
  }

  render() {
    return (
    <div>
      <div className={hideElement(this.state.loaded || this.state.invalidSearch)+ " col-md-offset-3"}>
        Search results are loading...
      </div>
      <div className={hideElement(!this.state.invalidSearch)+ " col-md-offset-3"}>
        <b>Invalid search query.</b>
      </div>
      <div className={hideElement(!this.state.loaded) + " container"}>
        <div className="row">
          <div className="col-md-2 zeropadding">
            <div className="panel panel-default">
              <div className="panel-body">
                <br /><font color="black" size="3">Popular Books</font>
                <hr className="hrcolor" />

              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="panel panel-default">
              <div className="panel-body keywordinput zeromargin">
                <div className="col-md-12 bookinstore">
                  <b><font className="pull-left">Search Results for {this.props.searchTerm}: ({this.state.results.length} results)</font></b>
                </div>
                <hr/>
                {this.state.results.map((feedItem) => {
                  return (
                    <Searchpagebook user={this.props.user} key={feedItem._id} data={feedItem} />
                  )
                })}
              </div>
            </div>
          </div>

          <div className="col-md-2 zeropadding">
            <div className={hideElement(this.state.historys.length === 0) + " panel panel-default" }>
              <div className="panel-body">
                <br /><font  color="black" size="3">Watch History</font>
                <hr className="hrcolor"/>
                    {this.state.historys.map((feedItem) => {
                      return (
                        <Searchpagebookslist key={feedItem._id} data={feedItem} />
                      )
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }
}

class App extends React.Component {
  render() {
    var queryVars = this.props.location.query;
    var searchTerm = null;
    if (queryVars && queryVars.searchTerm) {
      searchTerm = queryVars.searchTerm;
    }
    return (
      <div>
        <Header searchTerm={searchTerm} />
        <div className="row zeromargin">
          <ErrorBanner />
        </div>
        {this.props.children}
        <ResetDatabase />
      </div>
    )
  }
}

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      {/* Show the Feed at / */}
      <IndexRoute component={FrontPage} />
      <Route path="search" component={SearchPage} />
      <Route path="home" component={FrontPage} />
      <Route path="post" component={PostbookPage} />
      <Route path="howitwork" component={HowitWork} />
      <Route path="profile" component={PRofile} />
      <Route path="book" component={BookPage} />
      <Route path="contact" component={ContactPage} />
      <Route path="successpost" component={SuccessPost} />
      <Route path="mailbox/:mail" component={Mailbox} />
      <Route path="searchresult" component={SearchResultsPage} />
    </Route>
  </Router>
),document.getElementById('UBooksFeed'));
