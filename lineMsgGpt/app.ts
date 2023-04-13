import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Axios from 'axios';
import {} from 'openai';

interface LineMessageEvent {
    message: {
        type: string;
        id: string;
        text: string;
    };
    timestamp: number;
    source: {
        type: string;
        userId: string;
    };
    replyToken: string;
    mode: string;
}
interface LineMessageEvent {
    destination: string;
    events: LineMessageEvent[];
}

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || '',
});
const openai = new OpenAIApi(configuration);

const askOpenApi = async (question: string): Promise<string | undefined> => {
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a developer assistant.' },
            { role: 'user', content: question },
        ],
    });
    const response = completion.data.choices[0].message?.content;
    return response;
};

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) {
            return {
                statusCode: 500,
                body: JSON.stringify('Error. Unexpected.'),
            };
        }

        const lineMessageApiEvent = JSON.parse(event.body) as LineMessageEvent;
        if (lineMessageApiEvent.events.length <= 0 && lineMessageApiEvent.destination) {
            return {
                statusCode: 200,
                body: JSON.stringify('Hello. API Response'),
            };
        }

        console.log(JSON.stringify(event));
        const axios = Axios.create({
            baseURL: 'https://api.line.me/v2/bot/',
            headers: {
                authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
            },
        });
        const res = await axios.post('/message/reply', {
            replyToken: lineMessageApiEvent.events[0].replyToken,
            messages: [
                {
                    type: 'text',
                    text: await askOpenApi(lineMessageApiEvent.events[0].message.text),
                },
            ],
        });
        console.log(res);
        const response = {
            statusCode: 200,
            body: JSON.stringify('Hello. API Response'),
        };
        return response;
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
