const User = require('../models/user');

exports.getUser = (req, res) => {
  console.log("Decoded user info:", req.user);
  const userId = req.user.id; 
  
  User.findById(userId, (error, user) => {
      if (error) {
          return res.status(500).json({ message: 'Error fetching user data' });
      }
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  });
};

exports.changePassword = (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });


  User.findById(userId, (err, user) => {
    if (err || !user) return res.status(404).json({ message: 'User not found' });

    if (user.password !== currentPassword) {
      return res.status(400).json({ message: 'Неправильний поточний пароль' });
    }


    User.updatePassword(userId, newPassword, (error) => {
      if (error) return res.status(500).json({ message: 'Error updating password' });

      res.json({ message: 'Пароль змінено успішно' });
    });
  });
};

exports.updateUser = (req, res) => {
  console.log(req.body);
  const { name, surname, email, city, country } = req.body;
  const userId = req.user?.id; 

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  User.update(userId, { name, surname, email, city, country }, (error) => {
      if (error) {
          console.error('Error updating user information:', error);
          return res.status(500).json({ message: 'Error updating user information' });
      }

      res.json({ message: 'User information updated successfully' });
  });
};