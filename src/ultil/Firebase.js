const firebase = require('firebase/app');
require("firebase/auth");
require('firebase/firestore');

export class Firebase {

    constructor() {

        this._config = {
            apiKey: "*****************",
            authDomain: "*-************",
            databaseURL: "*********************",
            projectId: "*****************",
            storageBucket: "****************",
            messagingSenderId: "***************",
            appId: "************",
            measurementId: "******************"
        }


        this.init();
    }

    init() {

        //VALIDAÇÃO PARA SABER SE ESTÁ INICIALIZADO OU NÃO
        if (!this._initialized) {

            firebase.initializeApp(this._config);

            firebase.firestore().settings({});

            this._initialized = true;
        }

    }

    static db() {
        return firebase.firestore();
    }

    static hd() {
        return firebase.storage();
    }

    initAuth() {
        return new Promise((s, f) => {

            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider).then(result => {

                let token = result.credential.accessToken;
                let user = result.user;

                s(user, token);

            }).catch(err => {
                f(err);
            });
        });
    }

}