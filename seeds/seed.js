const sequelize = require('../config/connection');
const { Users, Posts, Comments } = require('../models');

const usersData = require('./userData.json');
const postsData = require('./postData.json');
const commentsData = require('./commentData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await Users.bulkCreate(usersData, {
    individualHooks: true,
    returning: true,
  });

  for (const post of postsData) {
    await Posts.create({
      ...post,
      users_id: users[Math.floor(Math.random() * users.length)].id,
      
    });
  }

//   const posts = await Posts.bulkCreate(postsData, {
//     individualHooks: true,
//     returning: true,
//   });

for (const comment of commentsData) {
        await Comments.create({
          ...comment,
          post_id: users[Math.floor(Math.random() * posts.length)].id,
        });
  }

  process.exit(0);
};

seedDatabase();
