/**
 * File dealing with exporting the backup.
 * This file is basically the export button 
 * component at the top right
 */
import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ContextContainer } from './Dashboard'
import cloneDeep from 'lodash/cloneDeep';

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

export default function ExportButtons() {
    // Accepts a context object, receiving the the value passed to ContextContainer.Provider
    const { userBackup, setUserBackup } = useContext(ContextContainer);

    const classes = useStyles();

    const downloadURL = (data, fileName) => {
        const a = document.createElement('a');
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.style.display = 'none';
        a.click();
        a.remove();
    }

    const downloadBlob = (data, fileName, mimeType) => {
        // create a Blob from our buffer
        const blob = new Blob([data], {
            type: mimeType
        });

        const url = window.URL.createObjectURL(blob);

        downloadURL(url, fileName);

        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    }

    const handleExport = () => {
        if (userBackup[0]) {

            // Cloning using Lodash library clonedeep as JavaScript ES6 sucks
            let exportUserBackup = cloneDeep(userBackup)

            // Replaces the exportedDate in the NineAnimator backup with current date 
            exportUserBackup[0]["exportedDate"] = new Date();
            exportUserBackup[0]["trackingData"] = [] // Removing trackingData for now. Will fix.

            for (const property in exportUserBackup[0]) {
                if (property === "history" || /* property === "trackingData" || */ property === "subscriptions") {
                    // delete the id property that was addded when importing
                    exportUserBackup[0][property].forEach((entries) => { delete entries.id });
                }
            }

            // Creating the Plist buffer 
            let userBackupBuf = window.createPlist(exportUserBackup);

            // Creating the file
            downloadBlob(userBackupBuf, `${String(exportUserBackup[0]["exportedDate"])}.naconfig`, 'application/octet-stream');
        } else {
            alert("Import a file first");
        }
    };


    return (
        <div className={classes.root}>
            <label>
                <Button variant="contained" color="primary" component="span" startIcon={<GetAppIcon />} onClick={() => handleExport()}>
                    Export
                </Button>
            </label>
        </div>
    );
}