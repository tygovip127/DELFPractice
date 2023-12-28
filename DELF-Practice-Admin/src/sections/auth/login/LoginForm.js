import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, AlertTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { login } from '../../../api/auth';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    login(email, password)
      .then((response) => {
        Cookies.set('jwt', response.token);
        Cookies.set('jwt_refresh', response.refreshToken);
        localStorage.setItem('account', JSON.stringify(response.data.user));
        localStorage.setItem('token', JSON.stringify(response.token));
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        // AlertTitle(err);\
        alert(err);
      });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          value={email}
          label="Email address"
          type={'email'}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <TextField
          name="password"
          label="Password"
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
