const { createWorker } = require('tesseract.js');

/**
 * Serviço para processamento de OCR usando Tesseract.js
 */
class OcrService {
    /**
     * Extrai texto de uma imagem usando Tesseract.js
     * @param {string} imagePath - Caminho para o arquivo de imagem
     * @returns {Promise<string>} - Texto extraído da imagem
     */
    async extractTextFromImage(imagePath) {
        // Criar worker do Tesseract
        const worker = await createWorker('por', 1, {
            logger: m => console.log(m) // Log do progresso
        });

        try {
            // Processar a imagem
            const { data: { text } } = await worker.recognize(imagePath);
            return text;
        } finally {
            // Sempre terminar o worker
            await worker.terminate();
        }
    }
}

module.exports = new OcrService();

