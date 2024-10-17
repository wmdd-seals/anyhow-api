import { OpenAI } from 'openai'
import type { ChatCompletionUserMessageParam } from 'openai/resources'

export interface GenreatedQuiz {
    quiz?: Quiz
}

interface Quiz {
    title?: string
    questions?: Question[]
}

interface Question {
    question: string
    options: string[]
    answer: string
}

export class OpenAIAPI {
    private readonly client = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']
    })

    public async chat(prompt: string): Promise<GenreatedQuiz> {
        const message: ChatCompletionUserMessageParam = {
            content: `${prompt}, retrun as JSON object`,
            role: 'user'
        }
        const response = await this.client.chat.completions.create({
            messages: [message],
            model: 'gpt-4o',
            response_format: { type: 'json_object' }
        })

        console.log(response.choices[0]?.message?.content)

        return JSON.parse(
            response.choices[0]?.message?.content
                ? response.choices[0].message.content
                : '{}'
        ) as GenreatedQuiz
    }
}
