const User = require('../models/user');

exports.getUser = (req, res) => {
    console.log("Decoded user info:", req.user); // Додаємо лог для перевірки
    const userId = req.user.id; 
    User.findById(userId, (error, results) => {
        if (error || results.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(results[0]);
    });
};

exports.changePassword = (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user?.id; 

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  User.updatePassword(userId, newPassword, (error) => {
    if (error) return res.status(500).json({ message: 'Error updating password' });

    res.json({ message: 'Password changed successfully' });
  });
};
