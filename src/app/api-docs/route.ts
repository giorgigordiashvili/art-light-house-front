import { NextResponse } from "next/server";

export async function GET() {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Art Light House API Documentation</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <script id="api-reference" data-url="/api-spec.json"></script>
  <script>
    var configuration = {
      theme: 'purple',
      layout: 'modern',
      showSidebar: true,
      metadata: {
        title: 'Art Light House API Documentation',
        description: 'Comprehensive API documentation for the Art Light House application',
      },
      authentication: {
        preferredSecurityScheme: 'ClerkAuth',
      },
    }

    document.getElementById('api-reference').dataset.configuration =
      JSON.stringify(configuration)
  </script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
