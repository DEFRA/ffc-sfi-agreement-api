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
    updatedAtFormated: {
      type: DataTypes.VIRTUAL,
      get () {
        const formatedDate = this.updatedAt.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
        const formatedTime = this.updatedAt.toLocaleTimeString('en-GB')
        return `${formatedDate} ${formatedTime}`
      }
    }
  },
  {
    tableName: 'agreements',
    freezeTableName: true
  })
  agreement.associate = function (models) {
    agreement.hasOne(models.status, {
      foreignKey: 'statusId',
      as: 'status'
    })
  }
  return agreement
}
