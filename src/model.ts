import * as Sequelize from 'sequelize'
import { ProfileTypeEnum } from './types/enums/profile'
import { ContractStatusEnum } from './types/enums/contract'

const sequelize = new Sequelize.Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
})

class Profile extends Sequelize.Model {
  declare id: number
  declare firstName: string
  declare lastName: string
  declare fullName: string
  declare profession: string
  declare balance: number | null
  declare type: ProfileTypeEnum
  declare createdAt: Date
  declare updatedAt: Date
}
Profile.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false
    },
    balance:{
      type:Sequelize.DECIMAL(12,2)
    },
    type: {
      type: Sequelize.ENUM('client', 'contractor')
    }
  },
  {
    sequelize,
    modelName: 'Profile'
  }
);

class Contract extends Sequelize.Model {
  declare id: number
  declare terms: string
  declare status: ContractStatusEnum
  declare ContractorId: number
  declare ClientId: number
  declare client: Profile
  declare createdAt: Date
  declare updatedAt: Date
}
Contract.init(
  {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status:{
      type: Sequelize.ENUM('new','in_progress','terminated')
    }
  },
  {
    sequelize,
    modelName: 'Contract'
  }
);

class Job extends Sequelize.Model {
  declare id: number
  declare description: string
  declare price: number
  declare paid: boolean
  declare paymentDate: Date
  declare createdAt: Date
  declare updatedAt: Date
  declare contract: Contract
}
Job.init(
  {
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    price:{
      type: Sequelize.DECIMAL(12,2),
      allowNull: false
    },
    paid: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    paymentDate:{
      type: Sequelize.DATE
    }
  },
  {
    sequelize,
    modelName: 'Job'
  }
);

Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId'})
Contract.belongsTo(Profile, {as: 'Contractor'})
Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId'})
Contract.belongsTo(Profile, {as: 'Client'})
Contract.hasMany(Job)
Job.belongsTo(Contract)

export {
  Profile,
  Contract,
  Job,
  sequelize
}
