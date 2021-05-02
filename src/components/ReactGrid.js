/**
 * File dealing with the grid/table
 * Doucmentation: https://devexpress.github.io/devextreme-reactive/react/grid/docs/
 */
import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SummaryState,
  IntegratedSummary,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  EditingState,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
  TableColumnResizing,
  TableEditColumn,
  TableInlineCellEditing,
  TableSummaryRow,
  PagingPanel,
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
      getCellValue: (row) => (row.image ? row.image.relative : undefined)
    },
    {
      name: 'link', title: 'Link',
      // This allow us to retrieve nested object
      getCellValue: (row) => (row.link ? row.link.relative : undefined)
    },
  ]);
  // Set a defaultColumnWidth for resizing the columns
  const [defaultColumnWidths] = useState([
    { columnName: 'title', width: 200 },
    { columnName: 'source', width: 150 },
    { columnName: 'image', width: 350 },
    { columnName: 'link', width: 350 },
  ]);
  const [totalSummaryItems] = useState([
    { columnName: 'title', type: 'count' },
  ]);
  const [editingColumnExtensions] = useState([
    {
      columnName: 'image',
      createRowChange: (row, value) => ({ image: { ...row.image, relative: value } }),
    },
    {
      columnName: 'link',
      createRowChange: (row, value) => ({ link: { ...row.link, relative: value } }),
    },
  ]);

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;
    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
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
      let newUserBackup = [...userBackup]
      newUserBackup[0][currentList] = changedRows;

      setUserBackup(newUserBackup)
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
          columnExtensions={editingColumnExtensions}
          onCommitChanges={commitChanges}
          addedRows={[]}
          onAddedRowsChange={addEmptyRow}
        />
        <SummaryState
          totalItems={totalSummaryItems}
        />
        <IntegratedSummary />
        <SortingState
          defaultSorting={[{ columnName: 'title', direction: 'asc' }]}
        />
        <IntegratedSorting />
        <PagingState
          defaultCurrentPage={0}
          pageSize={50}
        />
        <IntegratedPaging />
        <Table cellComponent={FocusableCell} />
        <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
        <TableHeaderRow showSortingControls />
        <PagingPanel />
        <TableSummaryRow />
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
