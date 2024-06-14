# How to install and test genAI locally via ollama

## Model reference (DeepSeek-Coder)
https://github.com/deepseek-ai/DeepSeek-Coder?tab=readme-ov-file

### Install ollama (linux)
https://github.com/ollama/ollama?tab=readme-ov-file#linux
```
curl -fsSL https://ollama.com/install.sh | sh
```

### Download DeepSeek-Coder Model
```
ollama pull deepseek-coder
```

### Run ollama in background
```
ollama serve
```

### (Optional) Edit the [_Modelfile_](Modelfile) and create a blueprint
https://github.com/ollama/ollama/blob/main/docs/modelfile.md#examples
```
ollama show --modelfile deepseek-coder
```

### Testing after serve
https://github.com/ollama/ollama/blob/main/docs/api.md
```
curl -X POST http://localhost:11434/api/generate -d '{
  "model": "deepseek-coder",
  "prompt":"How to print hello world in javascript?"
 }'
```