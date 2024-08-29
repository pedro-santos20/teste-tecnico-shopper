import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Measure } from '../models/measureModel'
import { processImage } from '../services/geminiService'

// POST /upload
export const uploadImage = async (req: Request, res: Response) => {
	const { image, customer_code, measure_datetime, measure_type } = req.body

	// Validar os dados
	if (!image || !customer_code || !measure_datetime || !measure_type) {
		return res.status(400).json({
			error_code: 'INVALID_DATA',
			error_description: 'Dados incompletos.',
		})
	}

	// Verificar se já foi feita a leitura mensal
	const startOfMonth = new Date(measure_datetime)
	startOfMonth.setDate(1)
	startOfMonth.setHours(0, 0, 0, 0)

	const endOfMonth = new Date(startOfMonth)
	endOfMonth.setMonth(endOfMonth.getMonth() + 1)
	endOfMonth.setDate(0)
	endOfMonth.setHours(23, 59, 59, 999)

	const existingMeasure = await Measure.findOne({
		where: {
			customer_code,
			measure_type,
			measure_datetime: {
				[Op.between]: [startOfMonth, endOfMonth],
			},
		},
	})

	if (existingMeasure) {
		return res.status(409).json({
			error_code: 'DOUBLE_REPORT',
			error_description: 'Leitura do mês já realizada',
		})
	}

	// Processar a imagem com API do Google Gemini
	try {
		const result = await processImage(image)

		const measure = await Measure.create({
			customer_code,
			measure_datetime,
			measure_type,
			measure_value: result.measure_value,
			image_url: result.image_url,
		})

		res.status(200).json({
			image_url: measure.image_url,
			measure_value: measure.measure_value,
			measure_uuid: measure.measure_uuid,
		})
	} catch (error) {
		res.status(500).json({ error: 'Erro ao processar a imagem.' })
	}
}

// PATCH /confirm
export const confirmMeasure = async (req: Request, res: Response) => {
	const { measure_uuid, confirmed_value } = req.body

	if (!measure_uuid || confirmed_value === undefined) {
		return res.status(400).json({
			error_code: 'INVALID_DATA',
			error_description: 'Dados incompletos.',
		})
	}

	const measure = await Measure.findByPk(measure_uuid)

	if (!measure) {
		return res.status(404).json({
			error_code: 'MEASURE_NOT_FOUND',
			error_description: 'Leitura não encontrada',
		})
	}

	if (measure.has_confirmed) {
		return res.status(409).json({
			error_code: 'CONFIRMATION_DUPLICATE',
			error_description: 'Leitura já confirmada',
		})
	}

	measure.measure_value = confirmed_value
	measure.has_confirmed = true
	await measure.save()

	res.status(200).json({ success: true })
}

// GET /<customer_code>/list
export const listMeasures = async (req: Request, res: Response) => {
	const { customer_code } = req.params
	const measure_type = req.query.measure_type as string | undefined

	const query: any = {
		where: { customer_code },
	}

	if (measure_type) {
		query.where.measure_type = measure_type.toUpperCase()
	}

	const measures = await Measure.findAll(query)

	if (measures.length === 0) {
		return res.status(404).json({
			error_code: 'MEASURES_NOT_FOUND',
			error_description: 'Nenhuma leitura encontrada',
		})
	}

	res.status(200).json({
		customer_code,
		measures: measures.map((m) => ({
			measure_uuid: m.measure_uuid,
			measure_datetime: m.measure_datetime,
			measure_type: m.measure_type,
			has_confirmed: m.has_confirmed,
			image_url: m.image_url,
		})),
	})
}
