import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
class SearchBar extends Component {
    state = {
        searchContext: 'business',
        query: null
    }
    componentWillMount() {
        this.setState({
            query: null
        })
    }
    gotoSearch = (e, keypress) => {
        if (!keypress || (e.keyCode === 13 || e.which === 13))
        {
            // e.preventDefault()
            let url = `/search/${this.state.searchContext}`
            if (this.state.query) {
                url += `?q=${this.state.query}` 
            }
            this.props.history.push(url)
        }
       
    }
    setQuery = e => {
        e.preventDefault()
        this.setState({query: e.target.value})
    }
    setContext = e => {
        e.preventDefault()
        console.log(e.target.value)
        this.setState({searchContext: e.target.value})
    }
    render() {
        return (
            <div className='search-bar'>
                <select onChange={e => this.setContext(e)}>
                    <option value='business'>Business</option>
                    <option value='room'>Room</option>
                    <option value='product'>Product</option>
                </select>
                <input type='text' className='search-input' onChange={e => this.setQuery(e)} onKeyPress={e => this.gotoSearch(e, 'enter')} />
                <button type='submit' onClick={e => this.gotoSearch(e)}>Search</button>
            </div>
        );
    }
}
export default withRouter(SearchBar);