"use strict";
import FacebookRouteHelper from "./helpers/FacebookRouteHelper.js";

export default (app) => {
    app.get("/facebook-posts", (request, response) => {
        new FacebookRouteHelper(request, response).pageRouter();
    });
};