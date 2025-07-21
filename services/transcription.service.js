const fs = require('fs');
const axios = require('axios');

// Chave da API AssemblyAI
const API_KEY = process.env.ASSEMBLYAI_API_KEY;

/**
 * Serviço para transcrição de áudio usando a API da AssemblyAI
 */
class TranscriptionService {
    constructor() {
        // Configurar cliente Axios com headers padrão
        this.client = axios.create({
            baseURL: 'https://api.assemblyai.com/v2',
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Faz upload de um arquivo de áudio para a API da AssemblyAI
     * @param {string} audioPath - Caminho para o arquivo de áudio
     * @returns {Promise<Object>} - Resposta da API com a URL de upload
     */
    async uploadAudio(audioPath) {
        try {
            // Ler o arquivo de áudio
            const audioData = fs.readFileSync(audioPath);
            
            // Configurar headers para upload
            const headers = {
                'Authorization': API_KEY,
                'Content-Type': 'application/octet-stream'
            };
            
            // Fazer upload do áudio
            const response = await axios.post(
                'https://api.assemblyai.com/v2/upload',
                audioData,
                { headers }
            );
            
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer upload do áudio:', error);
            throw new Error(`Falha ao fazer upload do áudio`);
        }
    }

    /**
     * Solicita uma transcrição para um áudio já carregado
     * @param {string} audioUrl - URL do áudio carregado
     * @returns {Promise<Object>} - Resposta da API com o ID da transcrição
     */
    async requestTranscription(audioUrl) {
        try {
            // Configurar parâmetros da transcrição
            const data = {
                audio_url: audioUrl,
                language_code: 'pt'  // Português
            };
            
            // Solicitar transcrição
            const response = await this.client.post('/transcript', data);
            
            return response.data;
        } catch (error) {
            console.error('Erro ao solicitar transcrição:', error);
            throw new Error(`Falha ao solicitar transcrição`);
        }
    }

    /**
     * Verifica o status de uma transcrição
     * @param {string} transcriptionId - ID da transcrição
     * @returns {Promise<Object>} - Resposta da API com o status da transcrição
     */
    async checkTranscriptionStatus(transcriptionId) {
        try {
            // Verificar status da transcrição
            const response = await this.client.get(`/transcript/${transcriptionId}`);
            
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar status da transcrição:', error);
            throw new Error(`Falha ao verificar status da transcrição`);
        }
    }
}

module.exports = new TranscriptionService();

