const cps = require('cps');

module.exports = {
    name        : "event",
    Row : {
        addSubscriber: function(conn, sub, cb) {
            cps.seq([
                (_, cb) => {
                    conn.query('insert into event_subscriber (org_id, sub_id) values (' + this.getId() + ',' + sub + ')', cb)
                },
                (post, cb) => {
                    cb(null, post);
                }
            ], cb)
        }
    }
}
