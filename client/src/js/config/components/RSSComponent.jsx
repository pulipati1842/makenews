/* eslint max-len:0 no-unused-vars:0, react/no-set-state:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import { addRssUrlAsync } from "../actions/CategoryActions.js";
import AddURLComponent from "../../utils/components/AddURLComponent.js";

export default class RSSComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { "errorMessage": "" };
    }

    _validateUrl(url, callback, props) {
        props.dispatch(addRssUrlAsync(props.categoryId, url, (response)=> {
            let errorMsg = response === "invalid" ? "Fetching feeds failed" : "Url is successfully added";
            return callback(errorMsg);
        }));
    }

    render() {
        return (
            <AddURLComponent content={this.props.content} categoryDetailsPageStrings={this.props.categoryDetailsPageStrings} addUrlLinkLabel={this.props.categoryDetailsPageStrings.addUrlLinkLabel} errorMessage={this.state.errorMessage} sourceDomainValidation={(url, callback) => this._validateUrl(url, callback, this.props)}/>
        );
    }
}

RSSComponent.displayName = "RSSComponent";
RSSComponent.propTypes = {
    "content": PropTypes.array.isRequired,
    "content.details": PropTypes.array,
    "categoryDetailsPageStrings": PropTypes.object.isRequired
};
