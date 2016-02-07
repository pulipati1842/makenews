/*eslint no-nested-ternary:0, no-set-state:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import SurfFilterItem from "./SurfFilterItem.jsx";

export default class SurfFilter extends Component {

    constructor(props) {
        super(props);

        let mediaTypes = [
            {
                "name": "Text",
                "image": "file-text-o",
                "_id": "description"
            }, {
                "name": "Image Content",
                "image": "file-picture-o",
                "_id": "imagecontent"
            }, {
                "name": "Pictures",
                "image": "file-picture-o",
                "_id": "gallery"
            }, {
                "name": "Videos",
                "image": "play-circle-o",
                "_id": "videos"
            }
        ];
        this.state = { "mediaTypes": mediaTypes, "show": false };
    }

    updateFilter(type, filterItems) {
        let filter = this.props.filter;
        if(type === "text") {
            filter.categories = filterItems;
        } else {
            filter.mediaTypes = filterItems;
        }
        this.props.updateFilter(filter);
    }

    toggleFilter() {
        this.setState({ "show": !this.state.show });
    }

    render() {
        return (
            <div className="surf-filter show-filter">
                <div className={this.state.show ? "anim show-filter-container bottom-box-shadow show" : "anim show-filter-container bottom-box-shadow"}>
                    <SurfFilterItem type="content" displayItems={this.state.mediaTypes} filterItems={this.props.filter.mediaTypes} title="Content" dispatchFilterAction={this.updateFilter.bind(this)}/>
                    <SurfFilterItem type="text" displayItems={this.props.categories} filterItems={this.props.filter.categories} title="Categories" dispatchFilterAction={this.updateFilter.bind(this)}/>
                </div>
                <button id="filterToggle" onClick={this.toggleFilter.bind(this)}></button>
            </div>
        );
    }
}

SurfFilter.displayName = "SurfFilter";

SurfFilter.propTypes = {
    "filter": PropTypes.object.isRequired,
    "updateFilter": PropTypes.func.isRequired,
    "categories": PropTypes.array.isRequired
};

SurfFilter.defaultProps = {
};