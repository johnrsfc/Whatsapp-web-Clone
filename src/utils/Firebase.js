const firebase = require('firebase');
require('firebase/storage');

export class Firebase {

    constructor() {

        this._firebaseConfig =
        {
            apiKey: "AIzaSyBfDqkcdIZ21lwFZwfCFJo-vYFsud9FlMc",
            authDomain: "clone-zap-7d4e3.firebaseapp.com",
            databaseURL: "https://clone-zap-7d4e3.firebaseio.com",
            projectId: "clone-zap-7d4e3",
            storageBucket: "gs://clone-zap-7d4e3.appspot.com",
            messagingSenderId: "625322087421",
            appId: "1:625322087421:web:a2a44de41bec0c9892bf94",
            measurementId: "G-VN6322B1BC"
        };

        this.init();
    }

    init() {

        //VALIDAR SE ESTÁ INICIALIZADO OU NÃO
        if (!window._initializedFirebase) {

            firebase.initializeApp(this._firebaseConfig);

            firebase.firestore().settings({});

            window._initializedFirebase = true;
        }


    }
    //DATABASE
    static db() {
        return firebase.firestore();
    }

    static hd() {

        return firebase.storage();
    }

    initAuth() {
        return new Promise((s, f) => {

            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
                .then(result => {

                    let token = result.credential.acessToken;
                    let user = result.user;

                    s({
                        user,
                        token
                    });
                })
                .catch(err => {
                    f(err);
                });
        });
    }

}