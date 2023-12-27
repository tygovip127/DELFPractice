import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../assets/exam.css'; // Import the CSS file for styling
import {ExcelRenderer, OutTable} from "react-excel-renderer";

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination, TableHead,
} from '@mui/material';
import {api} from "../api/config";

export default function ImportPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [header, setHeader] = useState([]);
  const [rows, setRows] = useState([]);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
    console.log('alo', event.target.files[0]);
    ExcelRenderer(event.target.files[0], (err, res) => {
      if(err) {
        console.log(err)
      } else {
        const { cols, rows } = res;
        setHeader(cols);
        setRows(rows);
      }
    })
    // console.log(window.URL.createObjectURL(event.target.files[0]))
  };

  const submissionHandler = async () => {
    if (isSelected) {
      const examination = await api.post('examinations', {name: selectedFile.name.split('.').shift(), type: "Full Test", timeLimit: 25})
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('examination', examination.data.data.id);
      const response = await api.post('/examinations/import-xlsx', formData);
      if(+response.status === 200) {
        alert('Create successfully!')
      }
    } else {
      alert('No file selected!')
    }
  }

  return (
    <>
      <Helmet>
        <title> Create Examination | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create Examination
          </Typography>

        </Stack>
        <Button
            variant="contained"
            component="label"
        >
          Upload File
          <input
              type="file"
              hidden
              name='file'
              onChange={changeHandler}
          />
        </Button>
        {isSelected && (<Button className="submit-button" variant="contained" onClick={submissionHandler}>
          Submit
        </Button>)}
        {isSelected ? (
            <div>
              <p>Filename: {selectedFile.name}</p>
              <p>
                lastModifiedDate:{' '}
                {selectedFile.lastModifiedDate.toLocaleDateString()}
              </p>
            </div>
        ) : (
            <p>Select a file to show details</p>
        )}
        {isSelected && <div style={{
          width: '100%',
          maxHeight: '1000px',
          overflow: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
        }}>
          <OutTable
              data={rows}
              columns={header}
              tableClassName="excel-table"
          />
        </div>}
      </Container>
    </>
  );
}
