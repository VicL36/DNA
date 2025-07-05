import { supabase } from '../lib/supabase';

/**
 * @class UserResponse
 * @description Represents a single user response within an analysis session.
 * Provides methods for creating and retrieving response data from the database.
 */
export class UserResponse {
    id: string;
    sessionId: string;
    question: string;
    transcription: string;
    audioUrl?: string;
    llmAnalysis?: any;
    createdAt: Date;

    constructor(
        id: string,
        sessionId: string,
        question: string,
        transcription: string,
        audioUrl?: string,
        llmAnalysis?: any,
        createdAt?: Date
    ) {
        this.id = id;
        this.sessionId = sessionId;
        this.question = question;
        this.transcription = transcription;
        this.audioUrl = audioUrl;
        this.llmAnalysis = llmAnalysis;
        this.createdAt = createdAt || new Date();
    }

    /**
     * @description Creates a new user response in the database.
     * @param {string} sessionId - The ID of the session this response belongs to.
     * @param {string} question - The question that was asked.
     * @param {string} transcription - The transcribed text of the user's answer.
     * @param {string} [audioUrl] - The URL of the audio file.
     * @param {any} [llmAnalysis] - The analysis from the language model.
     * @returns {Promise<UserResponse>} A promise that resolves with the new response instance.
     */
    static async create(
        sessionId: string,
        question: string,
        transcription: string,
        audioUrl?: string,
        llmAnalysis?: any
    ): Promise<UserResponse> {
        const newResponse = {
            session_id: sessionId,
            question: question,
            transcription: transcription,
            audio_url: audioUrl,
            llm_analysis: llmAnalysis,
        };

        const { data, error } = await supabase
            .from('user_responses')
            .insert(newResponse)
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar a resposta do usuário:', error);
            throw error;
        }

        return new UserResponse(
            data.id,
            data.session_id,
            data.question,
            data.transcription,
            data.audio_url,
            data.llm_analysis,
            new Date(data.created_at)
        );
    }

    /**
     * @description Filters user responses based on provided criteria.
     * @param {object} filters - The filter criteria (e.g., { session_id: '...' }).
     * @param {string} sortBy - The field to sort by.
     * @param {boolean} ascending - The sort order.
     * @param {number} limit - The maximum number of responses to return.
     * @returns {Promise<UserResponse[]>} A promise that resolves with an array of responses.
     */
    static async filter(filters: any = {}, sortBy = 'created_at', ascending = false, limit = 50): Promise<UserResponse[]> {
        console.log(`Filtrando respostas:`, filters, `-${sortBy}`, limit);
        try {
            let query = supabase.from('user_responses').select('*');

            for (const key in filters) {
                query = query.eq(key, filters[key]);
            }

            query = query.order(sortBy, { ascending });

            if (limit) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Erro ao filtrar respostas:', error);
                throw error;
            }
            
            console.log(`Respostas filtradas: ${data?.length || 0}`);
            return (data || []).map(r => new UserResponse(
                r.id,
                r.session_id,
                r.question,
                r.transcription,
                r.audio_url,
                r.llm_analysis,
                new Date(r.created_at)
            ));

        } catch (error) {
            console.error('Erro ao executar filtro de resposta:', error);
            return [];
        }
    }
}
