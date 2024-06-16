import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';


export default function AlertDialog() {
    const [open, setOpen] = useState(false);
    const [dialogText, setDialogText] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickSubmit = () => {
        fetchData();
    };

    const fetchData = async () => {
        try {
            // Make the POST request using the Fetch API
            const response = await fetch('api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "model": "deepseek-coder",
                    "prompt": "how to print helloworld in javascript"
                })
            });

            // The response body is a ReadableStream.
            // Use the getReader() method to read the stream
            const reader = response.body.getReader();

            // Initialize an empty string to collect the responses
            let fullResponse = '';

            // Function to read the stream
            const readStream = async () => {
                const { done, value } = await reader.read();
                if (done) {
                    // Stream has been fully read
                    console.log('Stream complete', fullResponse);
                    return;
                }

                // Decode the stream chunk to a string
                const chunk = new TextDecoder('utf-8').decode(value);
                // Assuming each chunk is a complete JSON object
                const jsonChunk = JSON.parse(chunk);

                console.log(jsonChunk);
                if (jsonChunk.done == true) {
                    // Stream has been fully read
                    console.log('Stream complete\n', fullResponse);
                    return;
                }

                fullResponse += jsonChunk.response;
                setDialogText(dialogText => dialogText += jsonChunk.response);

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
            <Button onClick={handleClickOpen}>
                Open AI dialog
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Ai helper
                </DialogTitle>
                <DialogContent>
                    <DialogContentText children={dialogText} id="dialogText"  />
                    <TextField fullWidth label="input" id="input" />

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
