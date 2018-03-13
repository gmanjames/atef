module.exports = {
    name : "post",
    Row  : {
        getComments: function(conn, cb) {
            cps.seq([
               (_, cb) => {
                    this.linkedBy(conn, 'post', cb);
               },
               (comments, cb) => {
                    cb(null, comments);
               }
            ], cb);
        }
    }
};
