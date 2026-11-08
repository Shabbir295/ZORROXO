import { supabaseAdmin } from '../config/supabaseAdmin.js';

export const resetUserPasswordByEmail = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  try {
    // 1. Supabase se user ko email ke zariye dhoondo
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) throw userError;

    const user = users.users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ error: 'User not found with this email.' });
    }

    // 2. Password update karo
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) throw error;

    res.status(200).json({ message: 'Password updated successfully!', data });
  } catch (error) {
    console.error('Password Reset Error:', error);
    res.status(500).json({ error: error.message });
  }
};