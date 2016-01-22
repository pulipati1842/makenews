/*eslint new-cap:0, no-unused-vars:0*/
"use strict";
import { DISPLAY_ALL_FEEDS, DISPLAY_EXISTING_FEEDS } from "../actions/AllFeedsActions.js";
import { List } from "immutable";
import Locale from "../../utils/Locale.js";


export function allFeeds(state = { "feeds": [], "messages": Locale.applicationStrings().messages.surfPage }, action = {}) {
    let surfMessages = Locale.applicationStrings().messages.surfPage;
    switch(action.type) {
    case DISPLAY_ALL_FEEDS:
        return Object.assign({}, state, { "feeds": action.feeds, "messages": surfMessages, "refreshState": action.refreshState, "progressPercentage": action.progressPercentage });
    case DISPLAY_EXISTING_FEEDS:
        return Object.assign({}, state, { "messages": surfMessages, "refreshState": action.refreshState, "progressPercentage": action.progressPercentage });
    default:
        return state;
    }
}
