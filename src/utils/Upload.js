import { Firebase } from './Firebase';

export class Upload {

    static send(file, from) {

        return new Promise((s, f) => {

            let uploadTask = Firebase.hd().ref(from).child(Date.now() + '_' + file.name).put(file);

            uploadTask.on('state_changed', e => {

                console.info('upload', e);

            }, err => {

                f(err);

            }, () => {

                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {

                    s(downloadURL);

                });

            });

        });
    }
}