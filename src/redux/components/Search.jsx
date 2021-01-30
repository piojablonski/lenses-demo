import React from 'react'
import { connect } from 'react-redux'
import { Action } from '../actions';
import { findMessages } from '../util';
import cx from 'classnames'

const createEmptyState = () => ({ searchQuery: '', totalFilteredMessages: null, selectedFiltereMessageIndex: null })
export class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = createEmptyState()
  }

  handleSearchQueryKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSearch()()
    }
  }

  handleClearSearch = () => {
    this.setState(createEmptyState())
    this.props.updateSearchResult(null)
  }

  handleSearchQueryChange = (e) => {
    this.setState({ searchQuery: e.target.value }, () => {
      if (!this.state.searchQuery) {
        this.setState(createEmptyState())
        this.props.updateSearchResult(null)
      }
    })
  }

  handleSearch = (shouldSearchNext = true) => () => {
    const { updateSearchResult, messages, searchResultIndex } = this.props
    const { searchQuery } = this.state

    const filteredIds = findMessages(messages, searchQuery)
    const n = filteredIds.length
    if (n === 0) {
      updateSearchResult(null)
      this.setState({ totalFilteredMessages: 0 })
      return
    }

    let i = filteredIds.indexOf(searchResultIndex)

    if (shouldSearchNext) {
      i = i >= n - 1 ? 0 : i + 1

    } else {
      i = i > 0 ? i - 1 : n - 1
    }
    this.setState({ totalFilteredMessages: n, selectedFiltereMessageIndex: i })

    if (n === 1) {
      updateSearchResult(null)
    }

    setTimeout(() => {
      updateSearchResult(filteredIds[i])
    }, 0)
  }

  summaryText = () => {
    const { totalFilteredMessages, selectedFiltereMessageIndex } = this.state
    return totalFilteredMessages > 0 ?
      `${selectedFiltereMessageIndex + 1} / ${totalFilteredMessages}` : 'No results'
  }

  render() {
    const { searchQuery, totalFilteredMessages } = this.state
    const { messages } = this.props
    const areButtonsDisabled = !messages.length || !searchQuery.length
    const isSummaryVisible = messages.length > 0 && totalFilteredMessages !== null


    return (<div className="field has-addons">
      <div className="control has-icons-left has-icons-right is-expanded">
        <input name="searchQuery" type="text" className="input is-info is-small" placeholder="Enter search query" value={searchQuery} onKeyPress={this.handleSearchQueryKeyPress} onChange={this.handleSearchQueryChange} />
        <span className="icon is-medium is-left">
          <i className="fa fa-search"></i>
        </span>
      </div>
      <p className="control">
        <button name="searchPrev" disabled={areButtonsDisabled} onClick={this.handleSearch(false)} className="button is-info is-small">
          <span className="icon is-small">
            <i className="fa fa-chevron-up"></i>
          </span>
        </button>
      </p>
      <p className="control">
        <button name="searchNext" disabled={areButtonsDisabled} onClick={this.handleSearch()} className="button is-info is-small">
          <span className="icon is-small">
            <i className="fa fa-chevron-down"></i>
          </span>
        </button>
      </p>
      <p className="control">
        <button name="clearSearch" disabled={areButtonsDisabled} onClick={this.handleClearSearch} className="button is-info is-small">
          <span className="icon is-small">
            <i className="fa fa-times"></i>
          </span>
        </button>
      </p>
      {isSummaryVisible &&
        <p name="summaryBlock" className="control has-text-grey-light" style={{ marginLeft: 10 }}>
          {this.summaryText()}
        </p>
      }
    </div>)
  }
}

const msp = state => ({
  searchResultIndex: state.session.searchResultIndex,
  messages: state.session.messages
})

const mdp = {
  updateSearchResult: Action.updateSearchResult
}

export default connect(msp, mdp)(Search)