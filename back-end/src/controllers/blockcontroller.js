const User = require("../models/user");

const blockUser = async (req, res) => {
  const targetUserId = req.params.id;
  const user = await User.findById(req.user._id).select("-password");

  if (!user.blockedUsers.includes(targetUserId)) {
    user.blockedUsers.push(targetUserId);
    await user.save();
    let result = await User.populate(user, [
      {
        path: "blockedUsers",
        select: "_id username",
      },
    ]);

    console.log(result);

    return res.status(200).json({
      message: "User blocked successfully",
      success: true,
      result: result,
    });
  }

  res.status(400).json({ message: "User already blocked" });
};

const unblockUser = async (req, res) => {
  const targetUserId = req.params.id;
  const user = await User.findById(req.user._id).select("-password");

  user.blockedUsers = user.blockedUsers.filter(
    (id) => id.toString() !== targetUserId
  );
  const result = await user.save();

  res
    .status(200)
    .json({
      message: "User unblocked successfully",
      success: true,
      result: result,
    });
};

module.exports = { blockUser, unblockUser };
