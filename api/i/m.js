

exports.getUserPosition = (User, pubid, callBack) => {
    console.log(this);
    console.log(pubid);
    console.log('callBack');
    User.find({ _id: { $lte: pubid } }).countDocuments((err, pos) => {
        callBack(err, pos);
    });
};
