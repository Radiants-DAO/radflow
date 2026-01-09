/**
 * @radflow/devtools/api - Persistence API handlers
 *
 * These handlers can be mounted in a Next.js API route to enable
 * persisting DevTools changes to the filesystem.
 *
 * Usage in app/api/radflow/route.ts:
 *   export { handler as POST } from '@radflow/devtools/api'
 */

export interface WriteRequest {
  type: 'write-css' | 'write-component';
  path: string;
  content: string;
}

export interface WriteResponse {
  success: boolean;
  error?: string;
}

/**
 * API handler for persisting DevTools changes
 * Mount this in your Next.js API route for file system access
 */
export async function handler(req: Request): Promise<Response> {
  const body = (await req.json()) as WriteRequest;

  // This is a stub - actual implementation requires fs access
  // which must be done server-side in the consuming project

  return Response.json({
    success: false,
    error: 'Persistence API must be implemented in the consuming project',
  });
}

export default handler;
