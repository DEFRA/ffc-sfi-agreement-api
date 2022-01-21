module.exports = (sequelize, DataTypes) => {
  const agreement = sequelize.define('agreement', {
    agreementId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    agreementNumber: DataTypes.STRING,
    crn: DataTypes.STRING,
    sbi: DataTypes.INTEGER,
    agreementData: DataTypes.JSON,
    statusId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    updatedAtFormatted: {
      type: DataTypes.VIRTUAL,
      get () {
        const formattedDate = this.updatedAt.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
        const formattedTime = this.updatedAt.toLocaleTimeString('en-GB')
        return `${formattedDate} ${formattedTime}`
      }
    }
  },
  {
    tableName: 'agreements',
    freezeTableName: true
  })
  agreement.associate = function (models) {
    agreement.belongsTo(models.status, {
      foreignKey: 'statusId',
      as: 'status'
    })
  }
  return agreement
}
