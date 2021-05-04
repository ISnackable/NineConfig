/**
 * File dealing with importing the backup.
 * This file is basically the import button 
 * component at the top right
 */
import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { ContextContainer } from './Dashboard';
import bplist from 'bplist';

// function recursiveParsePlist(object) {
//   Object.keys(object).forEach(key => {
//     if (typeof object[key] === "object") {
//       recursiveParsePlist(object[key]);
//     }
//     if (object[key] instanceof Uint8Array) {
//       bplist.parseBuffer(object[key], function (err, result) {
//         if (!err) {
//           object[key] = result;
//           recursiveParsePlist(object[key]);
//         }
//       });
//     }
//   });
// }

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function UploadButtons() {
  // Accepts a context object, receiving the the value passed to ContextContainer.Provider
  const { userBackup, setUserBackup } = useContext(ContextContainer);
  const { rows, setRows } = useContext(ContextContainer);
  const { currentList, setCurrentList } = useContext(ContextContainer);

  const classes = useStyles();

  let fileReader;

  const handleFileRead = (e) => {
    // Create the Uint8 Array from the uploaded file Array Buffer
    let arrayBuffer = new Uint8Array(fileReader.result);
    // Make it into a Buffer
    let buffer = Buffer(arrayBuffer, "binary");

    // parse the Plist
    bplist.parseBuffer(buffer, function (err, userBackup) {
      if (!err) {
        for (const property in userBackup[0]) {
          if (property === "history" || /* property === "trackingData" || */ property === "subscriptions") {
            // Add a ID property to the object, neccessary for gird editing to work. Will remove them when exporting.
            userBackup[0][property].forEach((entries, index) => { entries.id = index });
          }
        }
        // set/save the userBackup object to userBackup context hook
        setUserBackup(userBackup);
        // set the Rows to the userBackup currentList (default: history)
        setRows(userBackup[0][currentList]);
      }
    });
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();

    fileReader.onloadend = handleFileRead;
    if (fileReader && file instanceof Blob) {
      fileReader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className={classes.root}>
      <input
        accept=".naconfig"
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={e => handleFileChosen(e.target.files[0])}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
          Upload
        </Button>
      </label>
    </div>
  );
}