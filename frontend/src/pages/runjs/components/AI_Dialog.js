import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

import TextField from '@mui/material/TextField';

import axios from "axios";


function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

export default function DraggableDialog() {
    const [open, setOpen] = React.useState(false);
    
    // need to be collected 
    var reply = "HI. I am your coding helper, tell me what u want!";

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickSubmit = () => {
        fetchData();
    };

    // Define an async function to make the POST request
    const fetchData = async () => {
        // try {
        //     // Make the POST request
        //     const responseStream = await axios.post('api/generate', {
        //         "model": "deepseek-coder",
        //         "prompt": "how to print helloworld in javascript"
        //     }, {
        //         responseType: 'stream' // This tells axios to handle the response as a stream
        //     });

        //     // Initialize an empty string to collect the responses
        //     let fullResponse = '';

        //     // Handle the data event of the stream to collect the responses
        //     responseStream.data.on('data', (chunk) => {
        //         // Parse the chunk as JSON and append the 'response' field to the fullResponse string
        //         const jsonChunk = JSON.parse(chunk);
        //         fullResponse += jsonChunk.response;

        //         this.DialogContentText += jsonChunk.response;
        //     });

        //     // Handle the end event of the stream to know when all data has been received
        //     responseStream.data.on('end', () => {
        //         // All data has been received, fullResponse contains the concatenated responses
        //         console.log(fullResponse);
        //     });
        // } catch (error) {
        //     // Handle any errors
        //     console.error('There was an error!', error);
        // }
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
                fullResponse += jsonChunk.response;

                // TODO fix
                this.reply += jsonChunk.response;

                // Read the next chunk
                readStream();
            };

            // Start reading the stream
            readStream();

        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    // Call the fetchData function
    // fetchData();


    return (
        <React.Fragment>
            <Button onClick={handleClickOpen}>
                Open AI dialog
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Subscribe
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {{reply}}
                    </DialogContentText>
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
