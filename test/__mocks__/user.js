import faker from 'faker';

/**
 * @name getNewUser
 * @returns {Object} new user
 */
const getNewUser = () => {
  const newUser = {
    username: faker.internet.userName(),
    password: faker.internet.password()
  };
  return newUser;
};

/**
 * @name getBadUser
 * @returns {Object} bad user
 */
const getBadUser = () => {
  const badUser = {
    username: faker.internet.userName()
  };
  return badUser;
};

export { getNewUser, getBadUser };
