const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/UserModel");
const Role = require("./models/RoleModel");
const bcrypt = require("bcrypt");
const { CONFIG_PERMISSIONS } = require("./configs");

const initializeDB = async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGO_DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        const defaultAdminRole = new Role({
          name: "Admin",
          permissions: [CONFIG_PERMISSIONS.ADMIN],
        });

        const defaultBasicRole = new Role({
          name: "Basic",
          permissions: [CONFIG_PERMISSIONS.BASIC],
        });

        await defaultAdminRole.save();
        await defaultBasicRole.save();

        const hash = bcrypt.hashSync("1234567890Kh@", 10);
        const roleAdmin = await Role.findOne({ name: "Admin" });
        if (roleAdmin) {
          const defaultUser = new User({
            email: "khiem.test.service@gmail.com",
            password: hash,
            role: roleAdmin,
          });
          await defaultUser.save();
        }
      })
      .then(() => {
        mongoose.connection.close();
      })
      .catch((e) => {});
  } catch (error) {}
};

dotenv.config();
initializeDB();
