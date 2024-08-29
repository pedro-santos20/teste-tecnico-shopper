import axios from 'axios'
import FormData from 'form-data'

export const processImage = async (imageBase64: string) => {
	const GEMINI_API_KEY = process.env.GEMINI_API_KEY

	try {
		const form = new FormData()
		form.append('file', Buffer.from(imageBase64, 'base64'), 'image.jpeg')

		const uploadFile = await axios.request({
			method: 'POST',
			url: `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}`,
			data: form,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})

		const fileUri = uploadFile.data.file.uri

		const verifyImage = await axios.request({
			method: 'POST',
			url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
			data: {
				contents: [
					{
						parts: [
							{
								text: 'Extract the measurement value from the image, only value.',
							},
							{
								file_data: {
									mime_type: 'image/jpeg',
									file_uri: fileUri,
								},
							},
						],
					},
				],
			},
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (verifyImage.data.candidates.length <= 0) {
			throw new Error('Nenhum valor numérico foi detectado na imagem.')
		}

		return {
			image_url: fileUri,
			measure_value: parseInt(
				verifyImage.data.candidates[0].content.parts[0].text
			),
		}
	} catch (error) {
		console.error('Erro ao processar a imagem com Gemini:', error)
		throw new Error('Erro ao processar a imagem com Gemini.')
	}
}
