import { OpenAI } from 'openai'
import type { ChatCompletionUserMessageParam } from 'openai/resources'

export class OpenAIAPI {
    private readonly client = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']
    })

    public async chat(prompt: string): Promise<unknown> {
        const message: ChatCompletionUserMessageParam = {
            content: prompt,
            role: 'user'
        }
        const response = await this.client.chat.completions.create({
            messages: [message],
            model: 'gpt-4o',
            response_format: { type: 'json_object' }
        })

        console.log(response)
        return JSON.parse(
            response.choices[0]?.message?.content
                ? response.choices[0].message.content
                : ''
        )
    }
}
