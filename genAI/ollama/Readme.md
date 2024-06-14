# How to install and test genAI locally via ollama

## Model reference (DeepSeek-Coder)
https://github.com/deepseek-ai/DeepSeek-Coder?tab=readme-ov-file


### Install and run in background
```
ollama pull deepseek-coder:6.7b
ollama serve
```

### Edit the Modelfile
https://github.com/ollama/ollama/blob/main/docs/modelfile.md
```
ollama show --modelfile deepseek-coder:6.7b
```

### Testing after serve
https://github.com/ollama/ollama/blob/main/docs/api.md
```
curl -X POST http://localhost:11434/api/generate -d '{
  "model": "deepseek-coder:6.7b",
  "prompt":"Why is the sky blue?",
  "stream": false
 }'
```