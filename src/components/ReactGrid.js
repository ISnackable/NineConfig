/**
 * File dealing with the grid/table
 * Doucmentation: https://devexpress.github.io/devextreme-reactive/react/grid/docs/
 */
import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  EditingState
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
  TableEditColumn,
  TableInlineCellEditing,
} from '@devexpress/dx-react-grid-material-ui';
import { ContextContainer } from './Dashboard'

const getRowId = row => row.id;

const FocusableCell = ({ onClick, ...restProps }) => (
  <Table.Cell {...restProps} tabIndex={0} onFocus={onClick} />
);

export default function ReactGrid() {
    // Accepts a context object, receiving the the value passed to ContextContainer.Provider
  const { userBackup, setUserBackup } = useContext(ContextContainer);
  const { currentList, setCurrentList } = useContext(ContextContainer);
  const { rows, setRows } = useContext(ContextContainer);

  // The columns of the grid
  const [columns] = useState([
    {
      name: 'title', title: 'Title'
    },
    {
      name: 'source', title: 'Source'
    },
    {
      name: 'image', title: 'Image',
      // This allow us to retrieve nested object
      getCellValue: (row) => (row.link ? row.image.relative : undefined)
    },
    {
      name: 'link', title: 'Link',
      // This allow us to retrieve nested object
      getCellValue: (row) => (row.link ? row.link.relative : undefined)
    },
  ]);
  const [editingCells, setEditingCells] = useState([]);

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;
    if (added) {
      const startingAddedId = rows.length > 0
        ? Math.max(rows[rows.length - 1].id, rows[0].id) + 1
        : 0;
      changedRows = [
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
        ...rows,
      ];
      setEditingCells([{ rowId: startingAddedId, columnName: columns[0].name }]);
    }
    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => !deletedSet.has(row.id));
    }

    setRows(changedRows);

    if (userBackup.length) {
      let newUserBackup = [ ...userBackup ]
  
      newUserBackup[0][currentList] = changedRows;
  
      setUserBackup( newUserBackup )
    }
  };

  const addEmptyRow = () => commitChanges({ added: [{}] });

  return (
    <Paper>
      <Grid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
      >
        <SearchState defaultValue="" />
        <IntegratedFiltering />
        <EditingState
          onCommitChanges={commitChanges}
          editingCells={editingCells}
          onEditingCellsChange={setEditingCells}
          addedRows={[]}
          onAddedRowsChange={addEmptyRow}
        />
        <SortingState
          defaultSorting={[{ columnName: 'title', direction: 'asc' }]}
        />
        <IntegratedSorting />
        <Table cellComponent={FocusableCell} />
        <TableHeaderRow showSortingControls />
        <TableInlineCellEditing selectTextOnEditStart />
        <TableEditColumn
          showAddCommand
          showDeleteCommand
        />
        <Toolbar />
        <SearchPanel />
      </Grid>
    </Paper>
  );
};
