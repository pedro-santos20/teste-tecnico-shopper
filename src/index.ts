import express from 'express'
import bodyParser from 'body-parser'
import measureRoutes from './routes/measureRoutes'
import { sequelize } from './database'

const app = express()
app.use(
	bodyParser.json({
		limit: '10mb',
	})
)

app.use('/', measureRoutes)

sequelize.sync().then(() => {
	const PORT = process.env.PORT || 3000
	app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
})
