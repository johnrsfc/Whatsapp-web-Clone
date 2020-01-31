import { Firebase } from '../utils/Firebase';
import { Model } from './Model';

export class User extends Model {

    constructor(id) {

        super();

        if (id) this.getById(id);
    }

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    get chatId() { return this._data.chatId; }
    set chatId(value) { this._data.chatId = value; }

    getById(id) {

        return new Promise((s, f) => {

            User.findByEmail(id).onSnapshot(doc => {

                this.fromJSON(doc.data());

                s(doc);

            });
        });
    }

    save() {

        return User.findByEmail(this.email).set(this.toJSON());
    }

    static getRef() { //METEODO PARA CRIAR REFERENCIAS

        return Firebase.db().collection('/users');
    }

    static getContactsRef(id) {

        return User.getRef()
            .doc(id)
            .collection('contacts')
    }


    static findByEmail(email) {

        return User.getRef().doc(email);
    }

    addContact(contact) {

        return User.getContactsRef(this.email)
            .doc(btoa(contact.email))
            .set(contact.toJSON());

    }

    getContacts(filter = '') {
        // Método para retornar a lita de amigos de um úsuario.
        return new Promise((s, f) => {

            // Aqui ocorre o filtro de usuarios tambem,na condição where.
            User.getContactsRef(this.email).where('name', '>=', filter).onSnapshot(docs => {

                let contacts = [];

                //PEGANDO USUARIO, UM POR UM
                docs.forEach(doc => {

                    let data = doc.data()
                    data.id = doc.id;
                    contacts.push(data);
                });

                this.trigger('contactschange', docs);

                s(contacts);
            });

        })
    }

}