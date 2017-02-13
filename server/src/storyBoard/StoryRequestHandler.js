import CouchClient from "../CouchClient";


export async function addStory(story, authSession) {
    let document = {
        "docType": "story",
        "title": story
    };
    let couchClient = CouchClient.instance(authSession);
    let stories = await getStoryWithTitle(story.title, authSession);
    if (stories.docs.length) {
        let conflictMsg = "Story title already exist";
        throw conflictMsg;
    }
    try {
        return await couchClient.updateDocument(document);
    } catch (error) {
        let errorMsg = "Unable to add the story";
        throw errorMsg;
    }
}

export async function getStoryWithTitle(title, authSession) {
    let couchClient = CouchClient.instance(authSession);
    let query = {
        "selector": {
            "docType": {
                "$eq": "story"
            },
            "title": {
                "$eq": title
            }
        }
    };
    return await couchClient.findDocuments(query);
}

export async function getStory(id, authSession) {
    let couchClient = CouchClient.instance(authSession);
    try {
        return await couchClient.getDocument(id);
    } catch (error) {
        let notFoundMsg = "No document found";
        throw notFoundMsg;
    }
}

export async function getStories(authSession) {
    let couchClient = CouchClient.instance(authSession);
    let query = {
        "selector": {
            "docType": {
                "$eq": "story"
            }
        },
        "fields": ["title", "_id"]
    };
    return await couchClient.findDocuments(query);
}