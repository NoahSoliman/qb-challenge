export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse page and limit safely, enforce bounds
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    // Fetch from backend
    const response = await fetch(`${process.env.BACKEND_URL}/products?page=${page}&limit=${limit}`);

    // Handle backend errors explicitly
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return new Response(
        JSON.stringify({ error: errorData?.error || "Something went wrong on the server." }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Successful response
    const data = await response.json();
    return Response.json(data);

   } catch (error) {
    console.error("Error fetching products from backend:", error);

    // Last fallback — friendly error message
    return new Response(
      JSON.stringify({
        error: "Unable to fetch products. Please try again later.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}