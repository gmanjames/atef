const cps = require('cps');

module.exports = {
    name : "post",
    Row  : {
        getComments: function(conn, cb) {
            var me = this;
            cps.seq([
               function(_, cb) {
                    me.relatesTo(conn, 'comments', cb);
               },
               function(comments, cb) {
                    cb(null, comments);
               }
            ], cb);
        },
        addComment: function(conn, id, cb) {
            cps.seq([
                (_, cb) => {
                    conn.query('insert into comment_post (post_id, comment_id) values (' + id + ',' + this.getId() + ')', cb)
                },
                (post, cb) => {
                    cb(null, post);
                }
            ], cb)
        }
    }
};
