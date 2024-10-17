import { OpenAI } from 'openai'
import type { ChatCompletionUserMessageParam } from 'openai/resources'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

export type GenreatedQuiz = z.infer<typeof genreatedQuiz>

const question = z.object({
    question: z.string(),
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
            content: `${prompt}, retrun as JSON object`,
            role: 'user'
        }
        const response = await this.client.beta.chat.completions.parse({
            messages: [message],
            model: 'gpt-4o',
            response_format: zodResponseFormat(genreatedQuiz, 'quiz')
        })

        console.log(response.choices[0].message.parsed)

        return response.choices[0].message.parsed as GenreatedQuiz
    }
}
