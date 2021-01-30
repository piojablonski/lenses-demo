import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { List, AutoSizer } from "react-virtualized";
import { Action } from "../actions";
import ListItemDetails from "./ListItemDetails";

class MessageList extends React.Component {
  constructor(props) {
    super(props);

    this.onShowRowDetails = this.onShowRowDetails.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);

    this.state = {
      message: {}
    };
  }

  componentDidUpdate(prevProps) {
    const { searchResultIndex } = this.props

    if (Object.keys(this.state.message).length === 0 && searchResultIndex === null) {
      this.list.scrollToRow(this.props.messages.length);
    }

    if (searchResultIndex !== null && prevProps.searchResultIndex !== searchResultIndex) {
      this.list.scrollToRow(this.props.searchResultIndex)
    }
  }

  onShowRowDetails = d => {
    this.setState({ message: d });
  };

  rowRenderer = (messages, searchResultIndex) => ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) => {
    let arr = [],
      keys = [];
    Object.keys(JSON.parse(messages[index].key)).forEach(function(k) {
      keys.push({ label: k, value: JSON.parse(messages[index].key)[k] });
    });
    Object.keys(JSON.parse(messages[index].value)).forEach(function(k) {
      arr.push({ label: k, value: JSON.parse(messages[index].value)[k] });
    });
    const isCurrentSearchResultRow = index === searchResultIndex
    const className = classnames('message-row columns ws-message-list is-multiline', {'is-current-search-result-row' : isCurrentSearchResultRow })
    return (
      <div
        key={key}
        style={style}
        className={className}
        onClick={this.onShowRowDetails.bind(this, messages[index])}
      >
        <div className="column is-2">
          <div>Index</div>
          {index}
        </div>
        {keys.map(item => (
          <MessageListItem
            className="key"
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
        {arr.map(item => (
          <MessageListItem
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    );
  };

  render() {
    const { messages, onCommitMessage, searchResultIndex } = this.props;
    const { onShowRowDetails } = this;
    const { message } = this.state;

    return (
      <div>
        <ListItemDetails
          message={message}
          onCommitMessage={onCommitMessage}
          onShowRowDetails={onShowRowDetails}
        />
        <nav className="panel">
          <div className="panel-block">
            <AutoSizer className="autosizer-bulma-fix">
              {({ height, width, disableHeight = true }) => (
                <List
                  ref={list => {
                    this.list = list;
                  }}
                  width={width}
                  height={290}
                  rowCount={messages.length}
                  rowHeight={160}
                  rowRenderer={this.rowRenderer(messages, searchResultIndex)}
                />
              )}
            </AutoSizer>
          </div>
        </nav>
      </div>
    );
  }
}

class MessageListItem extends React.Component {
  render() {
    return (
      <div className="column is-2">
        <div>{this.props.label}</div>
        {this.props.value}
      </div>
    );
  }
}

MessageList.defaultProps = {};

MessageList.propTypes = {
  onCommitMessage: PropTypes.func,
  message: PropTypes.object,
  searchResultIndex: PropTypes.number
};

const mapStateToProps = state => ({
  message: state.session.message,
  messages: state.session.messages,
  searchResultIndex: state.session.searchResultIndex
});

const mapDispatchToProps = {
  ...Action
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList);
