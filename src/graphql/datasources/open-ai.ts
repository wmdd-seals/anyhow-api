import { OpenAI } from 'openai'
import type {
    ChatCompletionMessage,
    ChatCompletionMessageParam,
    ChatCompletionUserMessageParam
} from 'openai/resources'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

export type GenreatedQuiz = z.infer<typeof genreatedQuiz>

const question = z.object({
    questionTitle: z.string(),
    options: z.string().array(),
    correctAnswerIndex: z.number()
})

const quiz = z.object({
    title: z.string(),
    questions: z.array(question)
})

const genreatedQuiz = z.object({
    quiz: quiz
})

export class OpenAIAPI {
    private readonly client = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']
    })

    public async chat(prompt: string): Promise<GenreatedQuiz> {
        const message: ChatCompletionUserMessageParam = {
            content: `Please create up to 10 questions regarding the following content. Each question is a multiple choice and must have 2~4 answer options and only 1 answer and retrun as JSON object. \n ${prompt}`,
            role: 'user'
        }
        const response = await this.client.beta.chat.completions.parse({
            messages: [message],
            model: 'gpt-4o',
            response_format: zodResponseFormat(genreatedQuiz, 'quiz')
        })

        return response.choices[0].message.parsed as GenreatedQuiz
    }

    public async guideChat(
        chatmessages: ChatCompletionMessageParam[]
    ): Promise<ChatCompletionMessage> {
        const respone = await this.client.chat.completions.create({
            messages: chatmessages,
            model: 'gpt-4o',
            stop: ['\n']
        })

        return respone.choices[0].message
    }
}
