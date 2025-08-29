import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import './HomePage.css';
import { styled } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Link } from 'react-router-dom';

// Custom styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0D6E71 0%, #11999E 100%)',
  color: 'white',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  borderRadius: '0 0 20px 20px',
  marginBottom: theme.spacing(6),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  position: 'relative',
  display: 'inline-block',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 80,
    height: 4,
    backgroundColor: '#F9A826',
    borderRadius: 2,
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const FeatureIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#11999E',
  width: 60,
  height: 60,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));

const CTAButton = styled(Button)(({ theme, secondary }) => ({
  borderRadius: 30,
  padding: theme.spacing(1, 4),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  backgroundColor: secondary ? 'white' : '#F9A826',
  color: secondary ? '#11999E' : 'white',
  border: secondary ? '2px solid #11999E' : 'none',
  '&:hover': {
    backgroundColor: secondary ? '#f5f5f5' : '#e59008',
  },
  margin: theme.spacing(1),
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  height: '100%',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  border: '1px solid #e0e0e0',
}));

const QuoteText = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  marginBottom: theme.spacing(2),
}));

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            Reignite Their Potential
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Track, Measure, and Celebrate Your Child's Growth—Their Way.
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            Empowering homeschool families to monitor capability development across emotional, physical, and cognitive domains—with clarity, confidence, and compassion.
          </Typography>
          <Box>
            <CTAButton variant="contained" component={Link} to="/register">
              ✅ Get Started Free
            </CTAButton>
            <CTAButton variant="outlined" secondary="true" component={Link} to="/how-it-works">
              📘 See How It Works
            </CTAButton>
          </Box>
        </Container>
      </HeroSection>

      {/* Problem Section */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Box textAlign="center" mb={6}>
          <SectionTitle variant="h4" component="h2">
            Your Child's Growth Isn't Linear. Your Tools Shouldn't Be Either.
          </SectionTitle>
          <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto' }}>
            Standard report cards and rigid curriculums often overlook the <em>real</em> growth happening behind the scenes—especially for neurodivergent learners. At <strong>Reignite</strong>, we believe capability deserves to be seen, tracked, and celebrated, no matter the pace or path.
          </Typography>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#f9f9f9', py: 8, borderRadius: '20px', mb: 10 }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <SectionTitle variant="h4" component="h2">
              Progress You Can See. Growth They Can Feel.
            </SectionTitle>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <FeatureIcon>
                    <AssessmentIcon fontSize="large" />
                  </FeatureIcon>
                  <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                    📊 Track Capabilities
                  </Typography>
                  <Typography variant="body2">
                    Capture scores across 10 key areas, grouped into Communication, Physical, and Thinking domains—built for meaningful, flexible growth markers.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <FeatureIcon>
                    <TimelineIcon fontSize="large" />
                  </FeatureIcon>
                  <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                    📈 Visualize Progress Over Time
                  </Typography>
                  <Typography variant="body2">
                    Watch your child's capability score evolve through interactive charts and assessments.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <FeatureIcon>
                    <LightbulbIcon fontSize="large" />
                  </FeatureIcon>
                  <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                    💡 Parent-Led Insights
                  </Typography>
                  <Typography variant="body2">
                    Customize assessments and add notes. You're in control, because you know your child best.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Inspired Section */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Box 
          sx={{ 
            p: 5, 
            borderRadius: 4, 
            bgcolor: '#11999E10', 
            borderLeft: '4px solid #11999E',
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            Inspired by Reign. Built for Yours.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
            "When my son Reign struggled with traditional methods, I built this tool to see him better. What started as a way to understand his learning turned into a map for his growth. Now, it's here for you too."
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            — Renaldo, Founder of Reignite
          </Typography>
        </Box>
      </Container>

      {/* Who It's For Section */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Box textAlign="center" mb={4}>
          <SectionTitle variant="h4" component="h2">
            Built for Parents Who Are More Than Teachers
          </SectionTitle>
        </Box>
        
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" variant="body1" paragraph>
                Homeschool families looking to stay accountable, not overwhelmed.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Parents of neurodivergent learners seeking individualized insight.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Educators and mentors who value slow, steady, meaningful progress.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: '#f9f9f9', py: 8, borderRadius: '20px', mb: 10 }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <SectionTitle variant="h4" component="h2">
              What Parents Are Saying
            </SectionTitle>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TestimonialCard>
                <QuoteText variant="body1">
                  "Reignite helped me see how far my daughter had come—without comparing her to a classroom."
                </QuoteText>
                <Typography variant="subtitle2" color="text.secondary">
                  — Sarah M., homeschool mom of 2
                </Typography>
              </TestimonialCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TestimonialCard>
                <QuoteText variant="body1">
                  "It's not just tracking scores. It's watching growth unfold in real-time."
                </QuoteText>
                <Typography variant="subtitle2" color="text.secondary">
                  — Jamal T., dad of a neurodivergent teen
                </Typography>
              </TestimonialCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Box 
          sx={{ 
            textAlign: 'center',
            p: 6,
            borderRadius: 4,
            bgcolor: '#11999E',
            color: 'white'
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Ready to Reignite the Way You See Progress?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Start tracking today. No pressure, no noise—just clarity.
          </Typography>
          <CTAButton 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: '#F9A826', 
              '&:hover': { bgcolor: '#e59008' } 
            }}
            component={Link}
            to="/register"
          >
            👉 Create Your Free Profile
          </CTAButton>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 4, borderTop: '1px solid #e0e0e0' }}>
        <Container maxWidth="md">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                © 2025 Reignite
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2" color="text.secondary">
                <Link to="/privacy" style={{ color: 'inherit', marginRight: 16 }}>Privacy Policy</Link>
                <Link to="/terms" style={{ color: 'inherit' }}>Terms</Link>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Connect with us: 📧 support@reigniteapp.com | 🐦 @ReigniteGrowth
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;