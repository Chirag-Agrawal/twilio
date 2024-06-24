import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const WalletIntegration = ({ setWhatsapp, setIsWalletConnected, setWalletBalance, disabled }) => {
  const [number, setNumber] = useState('');

  const handleConnectWallet = async () => {
    if (!disabled) {
      setWhatsapp(number);
      setIsWalletConnected(true);
      setWalletBalance(10); // Set initial balance, for example

      try {
        const response = await axios.post('http://localhost:3000/api/whatsapp', { whatsapp: number });
        console.log('Backend response:', response.data);
      } catch (error) {
        console.error('Failed to send WhatsApp number:', error);
      }
    }
  };

  return (
    <Box textAlign="center" mt={3}>
      <Typography variant="h6" gutterBottom>
        Enter your WhatsApp number and connect your wallet to continue
      </Typography>
      <TextField 
        label="WhatsApp Number" 
        variant="outlined" 
        value={number} 
        onChange={(e) => setNumber(e.target.value)} 
        margin="normal"
        fullWidth
      />
      <Box mt={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleConnectWallet}
          disabled={disabled}
        >
          Connect Wallet
        </Button>
      </Box>
    </Box>
  );
};

export default WalletIntegration;
