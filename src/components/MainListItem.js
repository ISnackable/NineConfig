import React, { useContext } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HistoryIcon from '@material-ui/icons/History';
// import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
// import AssessmentIcon from '@material-ui/icons/Assessment';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import { ContextContainer } from './Dashboard';

export default function MainListItems() {
  // Accepts a context object, receiving the the value passed to ContextContainer.Provider
  const { userBackup, setUserBackup } = useContext(ContextContainer);
  const { rows, setRows } = useContext(ContextContainer);
  const { currentList, setCurrentList } = useContext(ContextContainer);

  const handleClick = (name) => {
    // Set the currentList variable to name
    setCurrentList(name);
    
    if (userBackup[0]) {
      // Set the rows to the current name property of userBackup 
      setRows(userBackup[0][name]);
    }
  }

  return (
    <div>
      <ListItem button onClick={() => handleClick('history')} >
        <ListItemIcon>
          <HistoryIcon />
        </ListItemIcon>
        <ListItemText primary="History" />
      </ListItem>
      {/* <ListItem button onClick={() => handleClick('progresses')}>
        <ListItemIcon>
          <PlayCircleFilledIcon />
        </ListItemIcon>
        <ListItemText primary="Progresses" />
      </ListItem> 
      <ListItem button onClick={() => handleClick('trackingData')}>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Tracking Data" />
      </ListItem> */}
      <ListItem button onClick={() => handleClick('subscriptions')}>
        <ListItemIcon>
          <BookmarksIcon />
        </ListItemIcon>
        <ListItemText primary="Subscriptions" />
      </ListItem>
    </div>
  );
};