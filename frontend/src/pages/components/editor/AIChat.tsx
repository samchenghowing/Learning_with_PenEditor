import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Markdown from 'react-markdown' // For fromatting GenAI response
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

const BackgroundPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

function InfoCard({ data }) {
    const StyledCard = styled(Card)(({ theme }) => ({
        backgroundColor: data.role === 'assistant' ? '#3f50b5' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
    }));

    return (
        <StyledCard sx={{ minWidth: 275, marginBottom: 2 }}>
            <CardContent>
                <Typography sx={{ fontSize: 16 }} color={data.role === 'assistant' ? '#fff' : '#000'} gutterBottom>
                    {data.role}
                </Typography>
                <Typography noWrap color={data.role === 'assistant' ? '#fff' : '#000'} component={'span'} variant="body2">
                    <Markdown>{data.content}</Markdown>
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained">Take this task!</Button>
            </CardActions>
        </StyledCard>
    );
}

// Better add in backend?
// TODO: respnose json 
// {
//     question: "Fix the problem below such that it will output \"hello world\" in console.",
//     task: "console.log'hello world!';",
//     solution: "console.log('hello world!');",
// },
// https://github.com/ollama/ollama/blob/main/docs/api.md#request-json-mode

interface AIChatProps {
    question: string;
    setQuestion: (mode: string) => void;
    task: string;
    setTask: (mode: string) => void;
    solution: string;
    setSolution: (mode: string) => void;
}

export default function AIChat(props: AIChatProps) {
    const [userPrompt, setUserPrompt] = React.useState("");
    const [cardContent, setCardContent] = React.useState([
        {
            id: 1,
            role: "assistant",
            content: "Hi, I am your AI helper, what can I do for you?",
        },
    ]);
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleClickSubmit = async () => {
        if (userPrompt.trim()) { // Check if the prompt is not empty
            const newCardId = Date.now();
            setCardContent(prevCardContent => [
                ...prevCardContent,
                {
                    id: newCardId,
                    role: "user",
                    content: userPrompt,
                },
                {
                    id: newCardId + 1,
                    role: "assistant",
                    content: "",
                }
            ]);
            setUserPrompt(""); // Clear the input field

            // cardContent is not updated here since useState is async
            // console.log(cardContent);
            var messages = cardContent.map(({ role, content }) => {
                let doc = { role, content };
                return doc;
            });
            messages.push({ role: "user", content: userPrompt })
            console.log(messages)

            try {
                const response = await fetch('api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "model": "deepseek-coder-v2:16b",
                        "messages": messages
                    })
                });

                const reader = response.body!.getReader();
                if (reader == null) console.log("error connection to gen ai")

                const readStream = async () => {
                    let { done, value } = await reader.read();
                    if (done) {
                        console.log('Stream complete');
                        return;
                    }

                    // Decode the stream chunk to a string
                    const chunk = new TextDecoder('utf-8').decode(value);
                    // Split the chunk by newlines, as each JSON object ends with a newline
                    const jsonStrings = chunk.split('\n').filter(Boolean);

                    jsonStrings.forEach(jsonString => {
                        try {
                            const jsonChunk = JSON.parse(jsonString);
                            console.log(jsonChunk);
                            // Update the content of the new card with the received chunk
                            setCardContent(prevCardContent => prevCardContent.map(card => {
                                if (card.id === newCardId + 1) {
                                    return { ...card, content: card.content + jsonChunk.message.content };
                                }
                                return card;
                            }));
                        } catch (error) {
                            console.error('Error parsing JSON chunk', error);
                        }
                    });
                    // Read the next chunk
                    readStream();
                };
                // Start reading the stream
                readStream();
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
    };

    React.useEffect(() => {
        if (cardRef.current != null) cardRef.current.scrollTo(0, cardRef.current.scrollHeight);
    }, [cardContent]);


    return (
        <BackgroundPaper
            ref={cardRef}
            sx={{ maxHeight: 500, minHeight: 500, overflow: 'auto' }}>
            {cardContent.map((data) => (
                <InfoCard key={data.id} data={data} />
            ))}
            <TextField
                fullWidth
                multiline
                id="user-prompt"
                placeholder="How to print hello world in javascript?"
                value={userPrompt}
                onChange={e => {
                    setUserPrompt(e.target.value)
                }}
                onKeyDown={e => {
                    if (e.key === "Enter") handleClickSubmit();
                }}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton edge="end" color="primary" onClick={handleClickSubmit}>
                                <SendIcon />
                            </IconButton>
                        </InputAdornment>
                }}
            />
        </BackgroundPaper>
    );
}
