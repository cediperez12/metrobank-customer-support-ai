import * as React from 'react'
import { useEffect } from 'react'
import {
  Box,
  CssBaseline,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  Fab,
  Divider,
} from '@mui/material'
import {
  SupportAgent as SupportAgentIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import SendIcon from '@mui/icons-material/Send'
import Conversation from './Conversation'

import loadingGif from '../assets/loading.gif'
import logoMB from '../assets/logoMB_icon.png'

export default function Chat() {
  // * Sample Data * ----------------
  const [messages, setMessages] = React.useState([])
  const [newMessage, setNewMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  useEffect(() => {
    setMessages([...messages,{ response: 'Hello and welcome to Metrobank Philippines customer support! How may I assist you today?' }])

  }, [])

  const handleSendMessage = () => {
    getChimResponse()
    setNewMessage('')
  }

  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY

  // * Enter key bind  * ----------------
  const handleEnterKey = (event) => {
    if (event.keyCode === 13 && newMessage.length > 0) {
      handleSendMessage()
    }
  }

  // * Auto scroll * ----------------
  const windowRef = React.useRef()
  React.useEffect(() => {
    if (!windowRef.current) return
    windowRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getChimResponse = async () => {
    if (newMessage !== '') {
      try {
        setIsLoading(true)
        const message =
          'Act as a customer support of Metrobank Philippines, ' + newMessage

        const apiRequestBody = {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
        }

        await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiRequestBody),
        })
          .then((data) => {
            return data.json()
          })
          .then((data) => {
            const chat = {
              query: newMessage,
              response: data.choices[0].message.content,
            }

            setMessages([...messages, chat])
          })
        setIsLoading(false)
      } catch (error) {
        console.log('error', error)
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // React.useEffect(() => {
  //   console.log(messages);
  // },[messages])

  return (
    <React.Fragment>
      <CssBaseline />
      <Fab
        onClick={() => {
          setIsOpen((current) => !current)
        }}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: '#049ED9',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#001A88',
          },
        }}
      >
        {isOpen ? <ExpandMoreIcon /> : <SupportAgentIcon />}
      </Fab>

      {isOpen && (
        <Box
          boxShadow={2}
          sx={{
            position: 'fixed',
            mb: 10,
            bottom: 0,
            right: 16,
            transition: 'all 0.3s ease-in-out',
            transform: `translateY(${isOpen ? 0 : '100%'})`,
            display: 'flex',
            height: 500,
            backgroundColor: '#ffffff',
            width: 350,
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '20px 20px 10px 10px',
          }}
        >
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar
              style={{
                backgroundColor: '#FFFFFF',
                color: '#001A88',
                borderRadius: '20px 20px 0px 0px',
              }}
            >
              <Box sx={{ mr: 2 }}>
                <img src={logoMB}  alt='logo Metrobank' style={{width: 35, height: 35}}/>
              </Box>
              <Typography variant="h6">Chat Support</Typography>
            </Toolbar>
          </AppBar>

          {/* ---------------- *  Conversation  * ---------------- */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: 700,
              overflow: 'hidden',
              overflowY: 'scroll',
            }}
          >
            <Conversation messages={messages} />
            <div ref={windowRef} />
          </Box>
          <Divider />
          <TextField
            variant="standard"
            placeholder="Type a message here"
            sx={{ padding: 2 }}
            className="textField"
            disabled={isLoading ? true : false}
            value={newMessage}
            onKeyDown={handleEnterKey}
            onChange={(e) => {
              setNewMessage(e.target.value)
            }}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={newMessage ? false : true}
                  >
                    {isLoading ? (
                      <img
                        src={loadingGif}
                        style={{ width: 50, height: 50 }}
                        alt="loading"
                      />
                    ) : (
                      <SendIcon
                        style={{ color: newMessage ? '#049ED9' : '#828F8D' }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </React.Fragment>
  )
}
