import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// Capitalize the component name to follow React naming conventions
function InfoCard({ data }) {
    return (
        <Card sx={{ minWidth: 275, marginBottom: 2 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {data.model}
                </Typography>
                <Typography variant="body2">
                    {data.response}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default function AIDialog() {
    const [open, setOpen] = useState(false);
    const [userPrompt, setUserPrompt] = useState("");
    const [cardContent, setCardContent] = useState([
        {
            id: 1,
            model: "deepseek-coder",
            response: "Hi, I am your AI helper, what can I do for you?",
        },
    ]);

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
        const newCardId = Date.now(); // Using timestamp as a unique ID for simplicity
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

            const reader = response.body.getReader();

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


    return (
        <React.Fragment>
            <Button color="inherit" onClick={handleClickOpen}>
                Open AI dialog
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    AI helper
                </DialogTitle>
                <DialogContent>
                    {/* Map over the cardContent state to render InfoCard components */}
                    {cardContent.map((data) => (
                        <InfoCard key={data.id} data={data} />
                    ))}
                    <TextField
                        fullWidth
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