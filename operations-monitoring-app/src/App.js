import { Container, Box } from "@mui/material";
import OperationsPage from './features/operations/OperationsPage';

function App() {
  return (<Box
    sx={{
      minHeight: "100vh",
      backgroundColor: "#EEF2F7",   // Soft enterprise grey
      py: 4
    }}
  >
    <Container maxWidth="lg">
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 3,
          p: 4,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)"
        }}
      >
        <OperationsPage />
      </Box>
    </Container>
  </Box>)

}

export default App;
