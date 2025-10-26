import { Card, CardHeader, CardContent, Divider } from "@mui/material";

export default function SectionCard({
  title,
  action,
  children,
  dense = false,
}) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      {title && (
        <>
          <CardHeader title={title} action={action} />
          <Divider />
        </>
      )}
      <CardContent sx={{ pt: title ? 2 : 1.5, pb: dense ? 1.5 : 2.5 }}>
        {children}
      </CardContent>
    </Card>
  );
}
