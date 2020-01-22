export class CameraController {

    constructor(videoEl) {

        this._videoEl = videoEl;

        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {


            this._stream = stream;
            this._videoEl.srcObject = stream;
            this._videoEl.play();
        }).catch(err => {
            console.error(err);
        });
    }
    //METODO PARA FECHAR A JANELA DE CAMERA.
    stop() {

        this._stream.getTracks().forEach(track => {

            track.stop();
        });
    }
    // Metodo de tira foto de retorna par ao usuario com canvas.
    takePicture(mimeType = 'img/png') {

        let canvas = document.createElement('canvas');

        canvas.setAttribute('height', this._videoEl.videoHeight);//DEFININDO A ALTURA PARA ESSE ATRIBUTO
        canvas.setAttribute('width', this._videoEl.videoWidth); // DEFININDO A LARGURA PARA ESSE ATRIBUTO

        let context = canvas.getContext('2d');

        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height); // isso ira desenha a Imagem 

        return canvas.toDataURL(mimeType);

    }
}