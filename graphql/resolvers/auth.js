const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email,
      });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(
        args.userInput.password,
        12
      );

      const user = new User({
        username: args.userInput.username,
        email: args.userInput.email,
        password: hashedPassword,
      });

      await user.save();

      const token = await jwt.sign(
        { userId: user.id, email: user.email },
        process.env.SECRET,
        {
          expiresIn: '1h',
        }
      );
      return {
        userId: user.id,
        username: user.username,
        token: token,
        tokenExpiration: 1,
      };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET,
      {
        expiresIn: '1h',
      }
    );
    return {
      userId: user.id,
      username: user.username,
      token: token,
      tokenExpiration: 1,
    };
  },
};
