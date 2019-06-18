const Event = require('./../models/schedule');

const checkEvent = async () => {
    //@TODO add the condtion for date once functionality componeted.
    const result = await Event.find({});
    return result;
}

module.exports = checkEvent;
