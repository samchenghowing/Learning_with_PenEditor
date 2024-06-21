import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Markdown from 'react-markdown' // For fromatting GenAI response

// Capitalize the component name to follow React naming conventions
function InfoCard({ data }) {
    const StyledCard = styled(Card)(({ theme }) => ({
        backgroundColor: data.model === 'deepseek-coder' ? '#fA2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
    }));

    return (
        <StyledCard sx={{ minWidth: 275, marginBottom: 2 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {data.model}
                </Typography>
                <Typography component={'span'} variant="body2">
                    <Markdown>{data.response}</Markdown>
                </Typography>
            </CardContent>
        </StyledCard>
    );
}

export default function AIDialog() {
    const [open, setOpen] = React.useState(false);
    const [userPrompt, setUserPrompt] = React.useState("");
    const [cardContent, setCardContent] = React.useState([
        {
            id: 1,
            model: "deepseek-coder",
            response: "Hi, I am your AI helper, what can I do for you?",
        },
    ]);
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickSubmit = () => {
        if (userPrompt.trim()) { // Check if the prompt is not empty
            const newCardId = Date.now();
            setCardContent(prevCardContent => [
                ...prevCardContent,
                {
                    id: newCardId,
                    model: "User",
                    response: userPrompt, // Start with an empty response
                }
            ]);
            fetchData(userPrompt);
            setUserPrompt(""); // Clear the input field
        }
    };

    const fetchData = async (userPrompt) => {
        // Create a new card with an initial response for the user prompt
        const newCardId = Date.now() + 1; // Using timestamp as a unique ID for simplicity
        setCardContent(prevCardContent => [
            ...prevCardContent,
            {
                id: newCardId,
                model: "deepseek-coder",
                response: "", // Start with an empty response
            }
        ]);

        try {
            const response = await fetch('api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "model": "deepseek-coder",
                    "prompt": userPrompt
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
                        // Update the response of the new card with the received chunk
                        setCardContent(prevCardContent => prevCardContent.map(card => {
                            if (card.id === newCardId) {
                                return { ...card, response: card.response + jsonChunk.response };
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
    };

    React.useEffect(() => {
        if (cardRef.current != null) cardRef.current.scrollTo(0, cardRef.current.scrollHeight);
    }, [cardContent]);


    return (
        <React.Fragment>
            <Button color="inherit" onClick={handleClickOpen}>
                Open AI dialog
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="AI-dialog">
                <DialogTitle style={{ cursor: 'move' }} id="AI-dialog-title">
                    AI helper
                </DialogTitle>
                <DialogContent ref={cardRef}>
                    {/* Map over the cardContent state to render InfoCard components */}
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
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClickSubmit}>Ask</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
