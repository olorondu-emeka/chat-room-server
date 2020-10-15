export default (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'userId must be an integer'
          }
        }
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      devicePlatform: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'browser',
        validate: {
          isIn: {
            args: [['browser', 'mobile']],
            msg: 'devicePlatform must be either browser or mobile'
          }
        }
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'expiresAt must be a date string'
          }
        }
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  Session.findActiveSessionByToken = async (token) => {
    const session = await Session.findOne({ where: { token, active: true } });
    if (session) return session;
    return null;
  };
  Session.associate = (models) => {
    Session.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  Session.revokeAll = async (userId) => {
    await Session.update({ active: false }, { where: { userId } });
  };
  return Session;
};
