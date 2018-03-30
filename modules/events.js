/**
 * I may move event types to a database at some point.
 * For now I haven't encountered any problem to
 * justify this.
 */

const getEvent = function(type, org, dat, ref)
{
    let msg;
    switch(type)
    {
        case 'comment':
            msg = `${org} commented, ${dat}, - <a href="ref">view</a>`;
            break;

        case 'post':
            msg = `${org} commented, ${dat}, - <a href="ref">view</a>`;
            break;

        case 'follow':
            msg = `${org} followed you!`;
            break;

        default:
            msg = `${type}: ${dat}`;
    };
};


module.exports = { getEvent };
