

var view = {
    stylesheets: [
        'files/stylesheets/bootstrap.min.css',
        'files/stylesheets/style.css',
        'files/stylesheets/sign-in.css',
    ],


};


/**
 * Extend default option to user's defined options
 * 
 * @param {object} default_ele default options
 * @param {object} to_change the options the need to be change in default options
 */
view.extend = function ( to_change ) {
    for ( var key in to_change ) {
        this[key] = to_change[key];
    }
    return this;
};

module.exports = view;