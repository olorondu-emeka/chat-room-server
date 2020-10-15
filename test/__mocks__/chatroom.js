import faker from 'faker';

/**
 * @name getNewChatroom
 * @returns {object} a new chatroom object
 */
const getNewChatroom = () => ({
  name: faker.lorem.word(),
  description: faker.lorem.sentence()
});

export default getNewChatroom;
