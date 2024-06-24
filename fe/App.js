import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography, Box, AppBar, Toolbar, IconButton, Checkbox, FormControlLabel, Button } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CampaignCard from './CampaignCard';
import WalletIntegration from './WalletIntegration';
import { campaigns } from './CampaignData';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const [whatsapp, setWhatsapp] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1); // example balance
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleAgreementChange = (event) => {
    setAgreedToTerms(event.target.checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Social Campaigns
          </Typography>
          {isWalletConnected && (
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ mr: 1 }}>
                Balance: ${walletBalance.toFixed(2)}
              </Typography>
              <AccountBalanceWalletIcon />
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Box textAlign="center" mt={5}>
          {!isWalletConnected ? (
            <Box>
             
              <WalletIntegration
                setWhatsapp={setWhatsapp}
                setIsWalletConnected={setIsWalletConnected}
                setWalletBalance={setWalletBalance}
                disabled={!agreedToTerms}
              />
               <FormControlLabel
                control={<Checkbox checked={agreedToTerms} onChange={handleAgreementChange} />}
                label="I agree to share my information and accept i am submitting valid information and documents"
              />
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
              {campaigns.map((campaign, index) => (
                <CampaignCard key={index} campaign={campaign} />
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
