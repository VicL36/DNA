import { supabase } from '../lib/supabase';
import { UserResponse } from './UserResponse';

/**
 * @class AnalysisSession
 * @description Represents a user's analysis session, containing metadata and a list of responses.
 * Provides methods for creating, retrieving, and managing session data in the database.
 */
export class AnalysisSession {
    id: string;
    userId: string;
    userEmail: string;
    responses: UserResponse[];
    status: 'ongoing' | 'completed' | 'error';
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        userId: string,
        userEmail: string,
        responses: UserResponse[] = [],
        status: 'ongoing' | 'completed' | 'error' = 'ongoing',
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.responses = responses;
        this.status = status;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    /**
     * @description Creates a new analysis session in the database.
     * @param {string} userId - The ID of the user.
     * @param {string} userEmail - The email of the user.
     * @returns {Promise<AnalysisSession>} A promise that resolves with the new session instance.
     */
    static async create(userId: string, userEmail: string): Promise<AnalysisSession> {
        const newSession = {
            user_id: userId,
            user_email: userEmail,
            status: 'ongoing',
        };

        const { data, error } = await supabase
            .from('analysis_sessions')
            .insert(newSession)
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar a sessão:', error);
            throw error;
        }

        return new AnalysisSession(data.id, data.user_id, data.user_email, [], data.status, new Date(data.created_at), new Date(data.updated_at));
    }

    /**
     * @description Filters sessions based on provided criteria.
     * @param {object} filters - The filter criteria (e.g., { user_email: 'test@test.com' }).
     * @param {string} sortBy - The field to sort by.
     * @param {boolean} ascending - The sort order.
     * @param {number} limit - The maximum number of sessions to return.
     * @returns {Promise<AnalysisSession[]>} A promise that resolves with an array of sessions.
     */
    static async filter(filters: any = {}, sortBy = 'created_at', ascending = false, limit = 10): Promise<AnalysisSession[]> {
        console.log(`Filtrando sessões:`, filters, `-${sortBy}`, limit);
        try {
            let query = supabase.from('analysis_sessions').select('*');

            for (const key in filters) {
                query = query.eq(key, filters[key]);
            }

            query = query.order(sortBy, { ascending });

            if (limit) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Erro ao filtrar sessões:', error);
                throw error;
            }
            
            console.log(`Sessões filtradas: ${data?.length || 0}`);
            return (data || []).map(s => new AnalysisSession(s.id, s.user_id, s.user_email, [], s.status, new Date(s.created_at), new Date(s.updated_at)));

        } catch (error) {
            console.error('Erro ao executar filtro de sessão:', error);
            return [];
        }
    }

    /**
     * @description Finds the latest ongoing session for a user or creates a new one.
     * @param {string} userId - The ID of the user.
     * @param {string} userEmail - The email of the user.
     * @returns {Promise<AnalysisSession>} A promise that resolves with the ongoing session.
     */
    static async findOrCreateOngoing(userId: string, userEmail: string): Promise<AnalysisSession> {
        const existing = await this.filter({ user_email: userEmail, status: 'ongoing' }, 'created_at', false, 1);
        if (existing.length > 0) {
            const session = existing[0];
            const responses = await UserResponse.filter({ session_id: session.id }, 'created_at', true, 50);
            session.responses = responses;
            return session;
        }
        return this.create(userId, userEmail);
    }

    /**
     * @description Updates the session in the database.
     * @param {object} updates - The fields to update.
     * @returns {Promise<AnalysisSession>} A promise that resolves with the updated session instance.
     */
    async update(updates: any): Promise<AnalysisSession> {
        this.updatedAt = new Date();
        const sessionUpdates = {
            ...updates,
            updated_at: this.updatedAt.toISOString(),
        };

        const { data, error } = await supabase
            .from('analysis_sessions')
            .update(sessionUpdates)
            .eq('id', this.id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar a sessão:', error);
            throw error;
        }

        // Update local instance properties
        for (const key in updates) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                (this as any)[key] = updates[key];
            }
        }
        
        return this;
    }

    /**
     * @description Adds a user response to the session.
     * @param {UserResponse} response - The response to add.
     */
    addResponse(response: UserResponse) {
        this.responses.push(response);
    }
}
