
import React, {useState} from 'react';
import { Button,TextField } from '@mui/material';
import './ImageUpload.css'

const BASE_URL = 'http://localhost:8000/'

function ImageUpload({authToken, authTokenType, userId}) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);

  return (
    <div className="imageupload">
      <TextField 
        type="text"
        placeholder="Enter a caption"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <TextField
        type="file"
        id="fileInput"
       
      />
      <Button className="imageupload_button" >
        Upload
      </Button>
    </div>
  )
}

export default ImageUpload;