import { Card, CardContent, CardHeader, Divider } from "@mui/material";

export default function SectionCard({ title, children, action }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
        background: "linear-gradient(180deg,#fff,#fafafa)",
      }}
    >
      <CardHeader
        titleTypographyProps={{ fontWeight: 700, fontSize: 16 }}
        title={title}
        action={action}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
