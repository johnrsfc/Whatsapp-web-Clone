const pdfjsLib = require('pdfjs-dist');
const path = require('path');

//CONFIGURANDO O CAMINHO DO PDF
pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname,
    '../../dist/pdf.worker.bundle.js');


export class DocumentPreviewController {

    constructor(file) {

        this._file = file;
    }

    getPreviewData() {
        return new Promise((s, f) => {

            //fazendo a leitura do PDF
            let reader = new FileReader();


            // ISSO IRÁ VERIFICAR QUE TIPO DE ARQUIVOS FOI ENVIADO
            switch (this._file.type) {

                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':

                    reader.onload = e => {

                        s({
                            src: reader.result,
                            info: this._file.name
                        });
                    }
                    reader.onerror = e => {

                        f(e);
                    }
                    reader.readAsDataURL(this._file);
                    break;

                case 'application/pdf':

                    reader.onload = e => {

                        //CARREGAR TODAS AS PROPRIADES DO PDF E DESENHA EM CANVAS.
                        pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf => {

                            //ISSO IRA PEGA QUAL A PAGINA SELECIONADA DO PDF
                            pdf.getPage(1).then(page => {

                                //CONVERTE PDF EM IMAGE
                                let viewport = page.getViewport(1);

                                let canvas = document.createElement('canvas');
                                let canvasContext = canvas.getContext('2d');

                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                page.render({
                                    canvasContext,
                                    viewport
                                }).then(() => {

                                    let _s = (pdf.numPages > 1) ? 's' : '';

                                    s({
                                        src: canvas.toDataURL('image/png'),
                                        info: `${pdf.numPages} página${_s}`
                                    });

                                }).catch(err => {
                                    f(err)
                                });

                            }).catch(err => {
                                f(err);
                            })

                        }).catch(err => {
                            f(err);
                        })

                    }

                    reader.readAsArrayBuffer(this._file);
                    break;

                default:
                    f(e);

            }

        });
    }
}