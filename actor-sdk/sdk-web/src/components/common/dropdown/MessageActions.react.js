/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ReactMixin from 'react-mixin';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import isInside from '../../../utils/isInside';

import { MessageContentTypes } from '../../../constants/ActorAppConstants';

import MessageActionCreators from '../../../actions/MessageActionCreators';
import ComposeActionCreators from '../../../actions/ComposeActionCreators';
import DropdownActionCreators from '../../../actions/DropdownActionCreators';

import UserStore from '../../../stores/UserStore';

class MessageActions extends Component {
  static propTypes = {
    peer: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    targetRect: PropTypes.object.isRequired,
    hideOnScroll: PropTypes.bool.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object
  };

  constructor(props) {
    super(props);
    document.addEventListener('click', this.handleDocumentClick, true);

    if (props.hideOnScroll) {
      document.addEventListener('scroll', this.handleDropdownClose, true);
    }
  }

  componentWillUnmount() {
    const { hideOnScroll } = this.props;
    document.removeEventListener('click', this.handleDocumentClick, true);

    if (hideOnScroll) {
      document.removeEventListener('scroll', this.handleDropdownClose, true);
    }
  }

  handleDocumentClick = (event) => {
    const dropdown = findDOMNode(this.refs.dropdown);
    const dropdownRect = dropdown.getBoundingClientRect();
    const coords = {
      x: event.pageX || event.clientX,
      y: event.pageY || event.clientY
    };

    if (!isInside(coords, dropdownRect)) {
      event.preventDefault();
      this.handleDropdownClose();
    }
  };


  handleDropdownClose = () => DropdownActionCreators.hide();

  handleDelete = () => {
    const { peer, message } = this.props;
    MessageActionCreators.deleteMessage(peer, message.rid);
    this.handleDropdownClose();
  };

  handleReply = () => {
    const { message } = this.props;
    const info = UserStore.getUser(message.sender.peer.id);
    const replyText = info.nick ? `@${info.nick}: ` : `${info.name}: `;
    ComposeActionCreators.pasteText(replyText);
    this.handleDropdownClose();
  };

  handleQuote = () => {
    const { message } = this.props;
    ComposeActionCreators.pasteText(`> ${message.content.text} \n`);
    this.handleDropdownClose();
  };

  render() {
    const { message, targetRect } = this.props;
    const { intl } = this.context;

    const isThisMyMessage = UserStore.getMyId() === message.sender.peer.id;

    const dropdownStyles = {
      top: targetRect.top,
      left: targetRect.left
    };

    const dropdownMenuStyles = {
      minWidth: 120,
      right: 2,
      top: -4
    };

    return (
      <div className="dropdown dropdown--opened dropdown--small" style={dropdownStyles}>
        <ul className="dropdown__menu dropdown__menu--right" ref="dropdown" style={dropdownMenuStyles}>
          <li className="dropdown__menu__item hide">
            <i className="icon material-icons">star_rate</i> {intl.messages['message.pin']}
          </li>
          {
            !isThisMyMessage
              ? <li className="dropdown__menu__item" onClick={this.handleReply}>
                  <i className="icon material-icons">reply</i> {intl.messages['message.reply']}
                </li>
              : null
          }
          {
            message.content.content === MessageContentTypes.TEXT
              ? <li className="dropdown__menu__item" onClick={this.handleQuote}>
                  <i className="icon material-icons">format_quote</i> {intl.messages['message.quote']}
                </li>
              : null
          }
          <li className="dropdown__menu__item hide">
            <i className="icon material-icons">forward</i> {intl.messages['message.forward']}
          </li>
          <li className="dropdown__menu__item" onClick={this.handleDelete}>
            <i className="icon material-icons">delete</i> {intl.messages['message.delete']}
          </li>
        </ul>
      </div>

    );
  }
}

ReactMixin.onClass(MessageActions, PureRenderMixin);

export default MessageActions;
