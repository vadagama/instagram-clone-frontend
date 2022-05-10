import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post'
import { Button,TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ImageUpload from './ImageUpload';

const BASE_URL = 'http://localhost:8000/'


function App() {

  const [posts, setPosts] = useState ([])
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('');
  const [authToken, setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null);

  useEffect(() => {
    setAuthToken(window.localStorage.getItem('authToken'));
    setAuthTokenType(window.localStorage.getItem('authTokenType'))
    setUsername(window.localStorage.getItem('username'))
    setUserId(window.localStorage.getItem('userId'))
  }, [])

  useEffect(() => {
    authToken
      ? window.localStorage.setItem('authToken', authToken)
      : window.localStorage.removeItem('authToken')
    authTokenType
      ? window.localStorage.setItem('authTokenType', authTokenType)
      : window.localStorage.removeItem('authTokenType')
    username
      ? window.localStorage.setItem('username', username)
      : window.localStorage.removeItem('username')
    userId
      ? window.localStorage.setItem('userId', userId)
      : window.localStorage.removeItem('userId')

  }, [authToken, authTokenType, userId])

useEffect(() => {
    fetch(BASE_URL + 'post/all')
      .then(response => {
        const json = response.json()
        console.log(json);
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => {
        const result = data.sort((a,b) => {
          const t_a = a.timestamp.split(/[-T:]/);
          const t_b = b.timestamp.split(/[-T:]/);
          const d_a = new Date(Date.UTC(t_a[0], t_a[1]-1, t_a[2], t_a[3], t_a[4], t_a[5]));
          const d_b = new Date(Date.UTC(t_b[0], t_b[1]-1, t_b[2], t_b[3], t_b[4], t_b[5]));
          return d_b - d_a
        })
        return result
      })
      .then(data => {
        setPosts(data)
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  const SignIn = (event) => {
    event?.preventDefault();

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const requestOptions = {
      method: 'POST',
      body: formData
    }

    fetch(BASE_URL + 'login', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        console.log(data);
        setAuthToken(data.access_token)
        setAuthTokenType(data.token_type)
        setUserId(data.user_id)
        setUsername(data.username)
      })
      .catch(error => {
        console.log(error);
      })

    setOpenSignIn(false);
  }

  const Signup = (event) => {

    event?.preventDefault();

    const json_string = JSON.stringify({
      username: username,
      email: email,
      password: password
    })

    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_string
    }

    fetch(BASE_URL + 'user/', requestOption)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        SignIn();
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })

    setOpenSignUp(false)
    
  }

  const signOut = (event) => {
    setAuthToken(null)
    setAuthTokenType(null)
    setUserId('')
    setUsername('')
  }

  return (
    <div className='app'>

<Dialog open={openSignIn}
      onClose={() => setOpenSignIn(false)}>
        <DialogTitle>SignIn</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To login to this website, please enter username and password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            value={username}
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setUsername(e.target.value)} />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            value={password}
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => setPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSignIn(false)}>Cancel</Button>
          <Button onClick={SignIn}>SignIn</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSignUp}
      onClose={() => setOpenSignUp(false)}>
        <DialogTitle>SignUp</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To sign up to this website, please enter some information here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            value={username}
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setUsername(e.target.value)} />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            value={email}
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setEmail(e.target.value)} />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            value={password}
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => setPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSignUp(false)}>Cancel</Button>
          <Button onClick={Signup}>SignUp</Button>
        </DialogActions>
      </Dialog>

      <div className="app_header">
        <img className="app_headerImage"
          src="https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png"
          alt="Instagram"/>
        


            {authToken ? (
              <Button onClick={() => signOut()}>Logout</Button>
            ) : (
            <div>
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
            </div>
            )
            
            }

      </div>

      <div className="app_posts">
        {
          posts.map(post => (
            <Post
            post = {post}
            key = {post.id}
            />
          ))
        }
      </div>

      { authToken ? (
        <ImageUpload
        authToken={authToken}
        authTokenType={authTokenType}
        userId={userId}
      />
        
      ) : (
        <h3>You need to login to upload</h3>
      ) 
      }

    </div>
  );
}



export default App;
