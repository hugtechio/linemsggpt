# linemsggpt
This is the Sample Program. The LINE message API and GPT.

# Language
Typescript, AWS-SAM

# Preparation
https://aws.amazon.com/blogs/compute/building-typescript-projects-with-aws-sam-cli/

```bash
sam init
```

# Deploy

```bash
sam build
sam deploy --parameter-overrides OpenApiKey=YOUR_OPENAI_APIKEY LineChannelToken=YOUR_LINE_CHANNEL_ACCESS_TOKEN
```
