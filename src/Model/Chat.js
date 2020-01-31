import { Model } from "./Model";
import { Firebase } from "../utils/Firebase";

export class Chat extends Model {
    constructor() {
        super();
    }

    get users() { this._data.users; }
    set users(value) { this._data.users = value; }

    get timeStamp() { this._data.timeStamp; }
    set timeStamp(value) { this._data.timeStamp = value; }


    static getRef() {

        return Firebase.db().collection('/chats');
    }

    static create(userEmail, contactEmail) {
        return new Promise((success, fail) => {
            let users = {};
            //segue aqui
            users[btoa(userEmail)] = true;
            users[btoa(contactEmail)] = true;

            Chat.getRef()
                .add({
                    users,
                    timeStamp: new Date()
                })
                .then(doc => {
                    Chat.getRef()
                        .doc(doc.id)
                        .get()
                        .then(chat => {
                            success(chat);
                        })
                        .catch(err => {
                            fail(err);
                        });
                })
                .catch(err => {
                    fail(err);
                });
        });
    }

    static find(meEmail, contactEmail) {

        return Chat.getRef()
            .where(btoa(meEmail), '==', true)
            .where(btoa(contactEmail), '==', true)
            .get();

    }

    static createIfNotExists(userEmail, contactEmail) {
        return new Promise((success, fail) => {
            Chat.find(userEmail, contactEmail)
                .then(chats => {
                    if (chats.empty) {
                        Chat.create(userEmail, contactEmail).then(chat => {
                            success(chat);
                        });
                    } else {
                        chats.forEach(chat => {
                            success(chat);
                        });
                    }
                })
                .catch(err => {
                    fail(err);
                });
        });
    }
}