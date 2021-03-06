import CouchClient from "../CouchClient";

export async function getStoryWithTitle(title, authSession) {
    const couchClient = CouchClient.instance(authSession);
    const query = {
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
    const couchClient = CouchClient.instance(authSession);
    try {
        return await couchClient.getDocument(id);
    } catch (error) {
        const notFoundMsg = "No document found";
        throw notFoundMsg;
    }
}

export async function deleteStory(id, authSession) {
    try {
        const couchClient = CouchClient.instance(authSession);
        await couchClient.deleteDocument(id);
        return { "message": "deleted" };
    } catch (error) {
        const errorMsg = { "message": `Unable to delete story. Details: ${JSON.stringify(error)}` };
        throw errorMsg;
    }
}

export async function getStories(authSession) {
    const couchClient = CouchClient.instance(authSession);
    const query = {
        "selector": {
            "docType": {
                "$eq": "story"
            }
        },
        "fields": ["title", "_id"]
    };
    return await couchClient.findDocuments(query);
}

export async function saveStory(story, authSession) {
    const sameTitledStory = await getStoryWithTitle(story.title, authSession);
    if(sameTitledStory.docs.length && story._id !== sameTitledStory.docs[0]._id) { //eslint-disable-line no-magic-numbers
        throw new Error("Title Already exists");
    }
    // eslint-disable-next-line require-atomic-updates
    story.docType = "story";
    const couchInstance = CouchClient.instance(authSession);
    return await couchInstance.updateDocument(story);
}
