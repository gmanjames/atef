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
            var me = this;
            cps.seq([
                (_, cb) => {
                    conn.query('insert into comment_post (post_id, comment_id) values (' + id + ',' + this.getId() + ')', cb)
                },
                (results, cb) => {
                    conn.query('select * from post where id = ' + id, cb);
                },
                (results, cb) => {
                    let post = {};
                    post._data = results;
                    cb(null, post);
                }
            ], cb)
        }
    }
};
