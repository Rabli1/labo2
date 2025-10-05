class Bookmarks_API {
    static Etag = null;
    static API_URL() { return "http://localhost:5000/api/bookmarks" };
    static initHttpState() {
        this.currentHttpError = "";
        this.currentStatus = 0;
        this.error = false;
    }
    static setHttpErrorState(httpErreur) {
        if (httpErreur.responseJSON)
            this.currentHttpError = httpErreur.responseJSON.error_description;
        else
            this.currentHttpError = httpErreur.statusText == 'error' ? "Service introuvable" : httpErreur.statusText;
        this.currentStatus = httpErreur.status;
        this.error = true;
    }
    static async Head() {
        Bookmarks_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: this.API_URL(),
                type: 'HEAD',
                contentType: 'text/plain',
                success: (_data, _textStatus, response) => {
                    Bookmarks_API.Etag = response.getResponseHeader('ETag');
                    resolve(Bookmarks_API.Etag);
                },
                error: (httpErreur) => { Bookmarks_API.setHttpErrorState(httpErreur); resolve(null); }
            });
        });
    }
    static async Get(id = null) {
        Bookmarks_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: this.API_URL() + (id != null ? "/" + id : ""),
                success: (data, _textStatus, response) => {
                    Bookmarks_API.Etag = response.getResponseHeader('ETag');
                    resolve(data);
                },
                error: (httpErreur) => { Bookmarks_API.setHttpErrorState(httpErreur); resolve(null); }
            });
        });
    }
    static async Save(data, create = true) {
        Bookmarks_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: create ? this.API_URL() :  this.API_URL() + "/" + data.Id,
                type: create ? "POST" : "PUT",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: async () => { await Bookmarks_API.Head(); resolve(true); },
                error: (httpErreur) => { Bookmarks_API.setHttpErrorState(httpErreur); resolve(null); }
            });
        });
    }
    static async Delete(id) {
        Bookmarks_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: this.API_URL() + "/" + id,
                type: "DELETE",
                success: async () => { await Bookmarks_API.Head(); resolve(true); },
                error: (httpErreur) => { Bookmarks_API.setHttpErrorState(httpErreur); resolve(null); }
            });
        });
    }
}
