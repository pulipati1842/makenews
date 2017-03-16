/* eslint react/jsx-no-literals:0 brace-style:0 */
import React, { Component } from "react";
import UserProfile from "./UserProfile";
import AppSessionStorage from "./../../utils/AppSessionStorage";

export default class UserProfileTab extends Component {

    render() {
        const appSessionStorage = AppSessionStorage.instance();
        const userName = appSessionStorage.getValue(AppSessionStorage.KEYS.USER_NAME) || "user";
        return (
            <div className="user-profile">
                <span className="user-profile__image">
                    <img src="../../../images/userprofile-icon.png"/>
                </span>
                <span className="user-profile__name">{userName}</span>
                <span className="user-profile__downarrow">
                    <i className="fa fa-caret-down" aria-hidden="true"/>
                </span>
                <div className="user-profile__dropdown">
                    <UserProfile />
                </div>
            </div>
        );
    }
}
