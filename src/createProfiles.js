require('./db/connect');
const ProfileModel = require('./db/models/profile');
const R = require('ramda');

const transformProfileIdToProfileObject = profileId => ({ profileId });

const createProfileModelInstance = profileObject => new ProfileModel(profileObject);

const saveProfileModel = profile =>
    profile.save()
        .then(() => console.log(`Added ${profile.profileId}`))
        .catch(console.error);

const createProfile = R.pipe(
    transformProfileIdToProfileObject,
    createProfileModelInstance,
    saveProfileModel
);

module.exports = R.map(createProfile);
