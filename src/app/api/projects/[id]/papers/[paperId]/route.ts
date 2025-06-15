import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: { id: string, paperId: string } }) {
  try {
    const { id, paperId } = params;

    if (!id || !paperId) {
      return NextResponse.json({ error: 'Project ID and Paper ID are required' }, { status: 400 });
    }

    await prisma.paper.delete({
      where: {
        id: paperId,
        projectId: id, // Ensure the paper belongs to the correct project
      },
    });

    return NextResponse.json({ message: 'Paper deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting paper:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}
