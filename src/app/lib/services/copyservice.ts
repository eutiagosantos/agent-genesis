import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";

// Configurando o modelo Gemini
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-001",
    temperature: 0.7,
    maxOutputTokens: 2048,
    apiKey: process.env.GOOGLE_API_KEY,
});

// Prompt do sistema para o copywriter senior
const COPYWRITER_SYSTEM_PROMPT = `Você é um copywriter senior com mais de 15 anos de experiência em marketing digital, publicidade e vendas.

ESPECIALIDADES:
- Criação de headlines que convertem
- Roteiros para vídeos e reels
- Copy para anúncios (Google Ads, Facebook, Instagram)
- Emails de vendas
- Landing pages
- Storytelling persuasivo

METODOLOGIA:
1. Sempre analise o público-alvo primeiro
2. Identifique a dor principal do cliente
3. Use gatilhos psicológicos (FOMO, autoridade, prova social)
4. Crie benefícios emocionais, não apenas funcionais
5. Use linguagem conversacional e direta
6. Inclua call-to-actions claros

FORMATO DE RESPOSTA:
- Seja direto e prático
- Dê exemplos específicos
- Explique o "porquê" das suas sugestões
- Mantenha tom profissional mas acessível

Lembre-se: seu objetivo é ajudar o cliente a criar copy que VENDE, não apenas que soa bonito.`;

// Interface para o estado da conversa
interface ConversationState {
    messages: (SystemMessage | HumanMessage | AIMessage)[];
    summary?: string;
    sessionId: string;
}

// Classe principal do chatbot
export class CopywriterChatbot {
    private conversations: Map<string, ConversationState> = new Map();

    constructor() {}

    // Criar nova sessão de conversa
    createSession(): string {
        const sessionId = uuidv4();
        this.conversations.set(sessionId, {
            messages: [],
            sessionId
        });
        return sessionId;
    }

    // Chat principal
    async chat(userInput: string, sessionId?: string): Promise<string> {
        try {
            // Não permitir prompt vazio
            if (!userInput || userInput.trim() === " ") {
                return "Por favor, digite uma mensagem para gerar a copy.";
            }

            // Usar sessão existente ou criar nova
            const currentSessionId = sessionId || this.createSession();
            const conversation = this.conversations.get(currentSessionId);
            
            if (!conversation) {
                throw new Error("Sessão não encontrada");
            }

            // Adicionar mensagem do usuário
            const userMessage = new HumanMessage({ content: userInput });
            conversation.messages.push(userMessage);

            // Preparar mensagens para o modelo
            let messagesToSend: (SystemMessage | HumanMessage | AIMessage)[] = [];

            // Adicionar resumo se existir
            if (conversation.summary) {
                const summaryMessage = new SystemMessage(
                    `Contexto da conversa anterior: ${conversation.summary}\n\n${COPYWRITER_SYSTEM_PROMPT}`
                );
                messagesToSend.push(summaryMessage);
            } else {
                // Adicionar prompt do sistema se não há resumo
                const systemMessage = new SystemMessage(COPYWRITER_SYSTEM_PROMPT);
                messagesToSend.push(systemMessage);
            }

            // Adicionar mensagens da conversa (últimas 10 para não sobrecarregar)
            const recentMessages = conversation.messages.slice(-10);
            messagesToSend.push(...recentMessages);

            // ⚠️ Checagem extra: não envie se não houver partes válidas
            if (messagesToSend.length === 0) {
                return "Ocorreu um erro interno: nenhuma mensagem válida para enviar ao modelo.";
            }

            // Gerar resposta
            const response = await model.invoke(messagesToSend);
            
            // Adicionar resposta ao histórico
            conversation.messages.push(response);

            // Resumir conversa se ficou muito longa (mais de 15 mensagens)
            if (conversation.messages.length > 15) {
                await this.summarizeConversation(currentSessionId);
            }

            return response.content as string;

        } catch (error) {
            console.error("Erro no chat:", error);
            return "Ocorreu um erro. Pode tentar novamente?";
        }
    }

    // Resumir conversa para economizar tokens
    private async summarizeConversation(sessionId: string): Promise<void> {
        const conversation = this.conversations.get(sessionId);
        if (!conversation || conversation.messages.length < 10) return;

        try {
            const summaryPrompt = new SystemMessage(
                "Resuma os pontos principais desta conversa sobre copywriting em 2-3 frases."
            );

            const messagesToSummarize = conversation.messages.slice(-8); // Últimas 8 mensagens
            const summaryResponse = await model.invoke([summaryPrompt, ...messagesToSummarize]);
            
            conversation.summary = summaryResponse.content as string;
            conversation.messages = conversation.messages.slice(-2); // Manter apenas as 2 últimas mensagens

        } catch (error) {
            console.error("Erro ao resumir conversa:", error);
        }
    }

    // Obter histórico da conversa
    getConversationHistory(sessionId: string): (SystemMessage | HumanMessage | AIMessage)[] {
        const conversation = this.conversations.get(sessionId);
        return conversation ? conversation.messages : [];
    }

    // Limpar memória da sessão
    clearSession(sessionId: string): void {
        this.conversations.delete(sessionId);
    }

    // Listar todas as sessões ativas
    getActiveSessions(): string[] {
        return Array.from(this.conversations.keys());
    }

    // Obter estatísticas da sessão
    getSessionStats(sessionId: string): { messageCount: number; hasSummary: boolean } {
        const conversation = this.conversations.get(sessionId);
        if (!conversation) {
            return { messageCount: 0, hasSummary: false };
        }
        
        return {
            messageCount: conversation.messages.length,
            hasSummary: !!conversation.summary
        };
    }
}

// Exportar instância singleton
export const copywriterBot = new CopywriterChatbot();