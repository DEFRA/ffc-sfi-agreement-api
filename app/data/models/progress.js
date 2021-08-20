module.exports = (sequelize, DataTypes) => {
  const progress = sequelize.define('progress', {
    progressId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    progress: DataTypes.JSON
  },
  {
    tableName: 'progress',
    freezeTableName: true,
    timestamps: false
  })
  progress.associate = function (models) {
    progress.hasMany(models.agreement, {
      foreignKey: 'progressId',
      as: 'agreements'
    })
  }
  return progress
}
