import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Button, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';



function App() {
  const [emailContent,setEmailContent] = useState("");
  const [tone,setTone] = useState("");
  const [generatedReply,setGeneratedReply] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URI;


  const handleSubmit = async()=>{
    setLoading(true)
    setError("")
    try {
      const response = await axios.post(`${backendUrl}`,{
        emailContent,
        tone
      })
      setGeneratedReply(typeof response.data === "string" ? response.data : JSON.stringify(response.data));
      
    } catch (error) {
      setError("Failed to generate reply. Please try again");
      toast.error("Something went wrong");
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  const copyToClipboardHandler = () => {
    navigator.clipboard.writeText(generatedReply);
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      <Container maxWidth="md" sx={{py:4}}>
        <Typography variant='h3' component={"h1"}>
          Email Reply Generator
        </Typography>

        <Box sx={{mx:3}}>
          <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ""}
          onChange={(e)=> setEmailContent(e.target.value)}
          sx={{mb:2}}
          />

          <FormControl fullWidth sx={{mb:2}}>
            <InputLabel>Tone (optional)</InputLabel>
            <Select 
              value={tone || ""}
              label={"Tone (optional)"}
              onChange={(e)=>setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
          >
            {loading ? <CircularProgress size={24}/> : "Generate Reply"}
          </Button>
        </Box>

        {
          error && (
            <Typography color='error' sx={{mb:2}}>
              {error}
            </Typography>
          )
        }

        {generatedReply && (
          <Box sx={{mt:3}}>
            <Typography variant='h6' gutterBottom>
              Generated Reply:
            </Typography>
            <TextField 
              fullWidth
              multiline
              rows={6}
              variant='outlined'
              value={generatedReply || ""}
              inputProps={{readOnly:true}}
            />

            <Button variant='outlined' sx={{mt:2}}
              onClick={copyToClipboardHandler}
            >
              Copy to Clipboard
            </Button>
          </Box>
        )}

      </Container>
    </>
  )
}

export default App
