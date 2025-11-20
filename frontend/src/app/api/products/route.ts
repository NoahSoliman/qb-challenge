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
        JSON.stringify({ error: errorData?.error || 'Backend error' }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return data as-is
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error fetching products from backend:', error);

    // Fallback error response
    return new Response(
      JSON.stringify({ error: 'Unable to fetch products from backend. Please try again later.' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}