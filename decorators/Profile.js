const Profile  = class Profile {
    constructor(value) {
        this.value = value;
    }
}
module.exports = function (value) { return new Profile(value);}