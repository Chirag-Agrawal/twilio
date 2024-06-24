import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import './CampaignCard.css';

const CampaignCard = ({ campaign }) => {
  return (
    <Card className="campaign-card" sx={{ maxWidth: 345, margin: 20 }}>
      <CardMedia
        component="img"
        height="140"
        image={campaign.image}
        alt={campaign.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {campaign.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {campaign.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Rule:</strong> {campaign.rule}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Reward:</strong> ${campaign.reward} per task (Max ${campaign.maxReward})
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button size="small" variant="contained" color="secondary">
          Donate
        </Button>
      </CardActions>
    </Card>
  );
};

export default CampaignCard;
