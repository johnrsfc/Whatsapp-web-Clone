export class DocumentPreviewController {

    constructor(file) {

        this._file = file;
    }

    getPreviewData() {
        return new Promise((s, f) => {

            switch (this._file.type) {

                case 'img/png':
                case 'img/jpeg':
                case 'img/jpg':
                case 'img/gif':
                    let reader = newFileReader();

                    reader.onload = e => {

                        s(render.result);
                    }
                    reader.onerror = e => {
                        f(e);
                    }

                    reader.readAsDataURL(this._file);
                    break;

                case 'application/pdf':
                    break;
                default:

                    f();
            }

        });
    }
}