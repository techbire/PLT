import React from 'react';
import { Box, Alert } from '@mui/material';

const DebugInfo: React.FC = () => {
  return (
    <Box sx={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999 }}>
      <Alert severity="info" sx={{ fontSize: '12px' }}>
        API: {process.env.REACT_APP_API_URL || 'localhost:5000/api'} v2
      </Alert>
    </Box>
  );
};

export default DebugInfo;
