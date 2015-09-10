/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import React from 'react';
import Modal from 'react-modal';

import { KeyCodes } from 'constants/ActorAppConstants';

import MyProfileActions from 'actions/MyProfileActionCreators';
import ProfilePictureActionCreators from 'actions/ProfilePictureActionCreators';

import MyProfileStore from 'stores/MyProfileStore';

import AvatarItem from 'components/common/AvatarItem.react';

import { Styles, TextField } from 'material-ui';
import ActorTheme from 'constants/ActorTheme';

const ThemeManager = new Styles.ThemeManager();

const getStateFromStores = () => {
  return {
    profile: MyProfileStore.getProfile(),
    name: MyProfileStore.getName(),
    nick: MyProfileStore.getNick(),
    about: MyProfileStore.getAbout(),
    isOpen: MyProfileStore.isModalOpen()
  };
};

class MyProfile extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  constructor(props) {
    super(props);

    this.state = getStateFromStores();

    ThemeManager.setTheme(ActorTheme);
    ThemeManager.setComponentThemes({
      textField: {
        textColor: 'rgba(0,0,0,.87)',
        focusColor: '#68a3e7',
        backgroundColor: 'transparent',
        borderColor: '#68a3e7',
        disabledTextColor: 'rgba(0,0,0,.4)'
      }
    });

    MyProfileStore.addChangeListener(this.onChange);
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    MyProfileStore.removeChangeListener(this.onChange);
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onClose = () => {
    MyProfileActions.hide();
  };

  onKeyDown = event => {
    if (event.keyCode === KeyCodes.ESC) {
      event.preventDefault();
      this.onClose();
    }
  };

  onChange = () => {
    this.setState(getStateFromStores());
  };

  onNameChange = event => {
    this.setState({name: event.target.value});
  };

  onNicknameChange = event => {
    this.setState({nick: event.target.value});
  };

  onAboutChange = event => {
    this.setState({about: event.target.value});
  };

  onSave = () => {
    const { nick, name, about } = this.state;

    MyProfileActions.saveName(name);
    MyProfileActions.saveNickname(nick);
    MyProfileActions.editMyAbout(about);
    this.onClose();
  };

  openProfilePictureModal = () => {
    ProfilePictureActionCreators.show();
    this.onClose()
  };

  render() {
    const { isOpen, profile, nick, name, about } = this.state;

    if (profile !== null && isOpen === true) {
      return (
        <Modal className="modal-new modal-new--profile"
               closeTimeoutMS={150}
               isOpen={isOpen}
               style={{width: 340}}>
          <header className="modal-new__header">
            <a className="modal-new__header__icon material-icons">person</a>
            <h4 className="modal-new__header__title">Profile</h4>
            <div className="pull-right">
              <button className="button button--lightblue"
                      onClick={this.onSave}>Done</button>
            </div>

          </header>
          <div className="modal-new__body row">
            <a onClick={this.openProfilePictureModal}>
              <AvatarItem image={profile.bigAvatar}
                          placeholder={profile.placeholder}
                          size="big"
                          title={profile.name}/>
            </a>
            <div className="col-xs">
              <div className="name">
                <TextField className="login__form__input"
                           floatingLabelText="Full name"
                           fullWidth
                           onChange={this.onNameChange}
                           type="text"
                           value={name}/>
              </div>
              <div className="nick">
                <TextField className="login__form__input"
                           floatingLabelText="Nickname"
                           fullWidth
                           onChange={this.onNicknameChange}
                           type="text"
                           value={nick}/>
              </div>
              <div className="phone">
                <TextField className="login__form__input"
                           disabled
                           floatingLabelText="Phone number"
                           fullWidth
                           type="tel"
                           value={profile.phones[0].number}/>
              </div>
              <div className="about">
                <label htmlFor="about">About</label>
                <textarea className="textarea"
                          id="about"
                          onChange={this.onAboutChange}
                          placeholder="Few words about you"
                          value={about}/>
              </div>
            </div>
          </div>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default MyProfile;
