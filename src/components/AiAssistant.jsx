import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Fab,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { askAssistantAPI } from "../apiService";

const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hola, puedo ayudarte a buscar y recomendar juegos de esta base de datos."
    }
  ]);

  const messagesRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  useEffect(() => {
    if (!open || !messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!canSend) return;

    const question = input.trim();
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const data = await askAssistantAPI(question);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const apiError = err.response?.data?.message || "No se pudo consultar el asistente";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <Paper
          elevation={10}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 96,
            width: { xs: "calc(100vw - 32px)", sm: 360 },
            maxWidth: 420,
            borderRadius: 2,
            overflow: "hidden",
            zIndex: 1300
          }}
        >
          <Stack sx={{ p: 1.5, borderBottom: "1px solid #e5e7eb", bgcolor: "white" }} direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight={700}>
              Asistente IA
            </Typography>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box
            ref={messagesRef}
            sx={{
              p: 1.5,
              height: 320,
              overflowY: "auto",
              bgcolor: "#f8fafc"
            }}
          >
            <Stack spacing={1}>
              {messages.map((m, index) => (
                <Box
                  key={`${m.role}-${index}`}
                  sx={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "90%"
                  }}
                >
                  <Paper
                    sx={{
                      p: 1,
                      bgcolor: m.role === "user" ? "primary.main" : "white",
                      color: m.role === "user" ? "white" : "text.primary"
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {m.content}
                    </Typography>
                  </Paper>
                </Box>
              ))}

              {loading && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={16} />
                  <Typography variant="body2">Pensando...</Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          <Box component="form" onSubmit={handleSend} sx={{ p: 1.5, bgcolor: "white" }}>
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                size="small"
                label="Pregunta sobre videojuegos"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <IconButton color="primary" type="submit" disabled={!canSend}>
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      )}

      <Tooltip title="Abrir asistente IA">
        <Fab
          color="primary"
          aria-label="abrir asistente"
          onClick={() => setOpen((prev) => !prev)}
          sx={{ position: "fixed", right: 24, bottom: 24, zIndex: 1300 }}
        >
          <SmartToyOutlinedIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default AiAssistant;
