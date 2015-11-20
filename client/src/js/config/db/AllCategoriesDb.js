/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import DbSession from "../../db/DbSession.js";
import HttpResponseHandler from "../../../../../common/src/HttpResponseHandler.js";

export default class AllCategoryDb {

    static fetchAllCategories() {
        return new Promise((resolve, reject) => {
            DbSession.instance().get(AllCategoryDb.documentType()).then(document => {
                let allCategories = {};
                if(document.categories) {
                    allCategories = document.categories;
                }
                resolve(allCategories);
            }).catch((error) => {
                if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                    resolve({});
                } else {
                    reject(error);
                }
            });
        });
    }

    static addCategoryDocument(document, categoryName) {
        if(!document || !categoryName) {
            throw new Error("document and category name can not be empty");
        }
        return new Promise((resolve, reject) => {
            if(document._rev) {
                DbSession.instance().put(document, document._rev).then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });

            } else {
                DbSession.instance().put(document).then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    }

    static addCategory(categoryName) {
        if(!categoryName) {
            throw new Error("category name can not be empty");
        }
        return new Promise((resolve, reject) => {
            DbSession.instance().get(AllCategoryDb.documentType()).then((document) => {
                resolve("");
            }).catch((error) => {
                if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                    let document = AllCategoryDb.newDocument();
                    AllCategoryDb.addCategoryDocument(document, categoryName).then((response) => {
                        resolve(response);
                    }).catch((addError) => {
                        reject(addError);
                    });
                }
            });
        });
    }

    static documentType() {
        return "ConfigAllCategory";
    }

    static newDocument() {
        return {
            "_id": this.documentType(),
            "categories": { "Default Category": true },
            "type": AllCategoryDb.documentType()
        };
    }

}