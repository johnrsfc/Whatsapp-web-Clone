import { ClassEvent } from '../utils/ClassEvent';

export class MicrophoneController extends ClassEvent {

    constructor() {

        //FUNÇÃO PARA NAO SUPRESCREVER O OUTRO CONSTRUTOR
        // SUPER? CHAMA O CONSTRUTOR DO PAI DELE
        super();

        this._mimeType = 'audio/webm';

        this._available = false;

        //ATIVANDO API DE AUDIO PARA QUE O MICROPHONE GRAVA
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {
            this._available = true;

            this._stream = stream;

            this.trigger('ready', this._stream);
        }).catch(err => {

            console.error(err);
        });

    }
    isAvailable() {
        return this._available
    }


    // DANDO UM STOP NO  AUDIO
    stop() {

        this._stream.getTracks().forEach(track => {

            track.stop();
        });
    }

    //METODO PARA GRAVA O AUDIO
    startRecorder() {

        if (this.isAvailable()) {

            //ISSO É O METEODO NATIVO DO JS PARA GRAVAR
            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            });

            //RECEBENDO O AUDIO DO USUARIO EM ARRAY
            this._recordedChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', e => {

                if (e.data.size > 0) this._recordedChunks.push(e.data);
            });

            this._mediaRecorder.addEventListener('stop', e => {
                let blob = new Blob(this._recordedChunks, {
                    type: this._mimeType
                });

                let filename = `rec${Date.now()}.webm`;

                let file = new File([blob], filename, {
                    type: this._mimeType,
                    lastModified: Date.now()
                });

                console.log('READER FILE', file);

                //IRA OUVIR O AUDIO APENAS PARA TESTE
                let reader = new FileReader();

                reader.onload = e => {

                    let audio = new Audio(reader.result);
                    audio.play();
                }

                reader.readAsDataURL(file);
            });
            //iniciando o metodo RECORD
            this._mediaRecorder.start();
            this.startTimer();



        }

    }

    //METEODO PARA PARA O AUDIO
    stopRecorder() {

        if (this.isAvailable()) {

            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();

        }

    }

    startTimer() {
        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(() => {

            this.trigger('recordtimer', (Date.now() - start));
        }, 100);
    }

    stopTimer() {
        clearInterval(this._recordMicrophoneInterval);
    }
}