import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../assets/exam.css'; // Import the CSS file for styling
import { ExcelRenderer, OutTable } from 'react-excel-renderer';

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
  TablePagination,
  TableHead,
} from '@mui/material';
import {api} from "../api/config";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_grammar) => _grammar.grammar.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function PaymentPage() {
  const [money, setMoney] = useState(1);
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [uri, setUri] = useState();
  const [header, setHeader] = useState([]);
  const [rows, setRows] = useState([]);

  const paymentHandle = async () => {
    // console.log(JSON.stringify(Cookies.get()))

    const token = Cookies.get('jwt');
    const response = await api.post('/payment/create_payment_url', {}, { headers: {
      Authorization: `Bearer ${token}`
      }});
    window.location.replace(response.data.url);
  };
  const refundHandle = async () => {
    const token = Cookies.get('jwt');
    const res = await api.post('/payment/refund', {
      id: '64cbd2743f951b67f5340ad7',
      transDate: 20230803231505,
      amount: 10000,
      transType: '02',
    }, { headers: {
        Authorization: `Bearer ${token}`
      }});
    alert(res.data.message);
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
    console.log('alo', event.target.files[0]);
    ExcelRenderer(event.target.files[0], (err, res) => {
      if (err) {
        console.log(err);
      } else {
        const { cols, rows } = res;
        setHeader(cols);
        setRows(rows);
      }
    });
    console.log(window.URL.createObjectURL(event.target.files[0]));
  };

  const submissionHandler = async () => {
    if (isSelected) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('examination', '658aebe3b227d878baf18799');
      const response = await axios.post('http://localhost:3000/api/v1/examinations/import-xlsx', formData);
      console.log(response.data);
    } else {
      alert('No file');
    }
  };

  const tokenHandle = async () => {
    const token = Cookies.get('jwt');
    const response = await axios.get('http://localhost:3000/api/v1/users/me', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    alert(JSON.stringify(response));
  };

  return (
    <>
      <Helmet>
        <title> Payment | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Payment
          </Typography>
        </Stack>
        <Button variant="contained" onClick={paymentHandle}>
          Checkout VNPAY
        </Button>
      </Container>
    </>
  );
}
