export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const response = await fetch(
      `${process.env.BACKEND_URL}/products?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`)
    }

    const data = await response.json()

    return Response.json(data)
  } catch (error: any) {
    console.error('Error fetching products from backend:', error)

    const body = {
      error: 'Unable to fetch products from backend. Please try again later.'
    }

    return new Response(JSON.stringify(body), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 