import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize({
	dialect: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5433,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	logging: false,
})
