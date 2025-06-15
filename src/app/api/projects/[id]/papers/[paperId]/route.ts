import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string, paperId: string } }) {
  try {
    const { id: projectId, paperId } = params;

    if (!projectId || !paperId) {
      return NextResponse.json({ error: 'Project ID and Paper ID are required' }, { status: 400 });
    }

    const paper = await prisma.paper.findUnique({
      where: {
        id: paperId,
        projectId: projectId,
      },
    });

    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    return NextResponse.json(paper);
  } catch (error) {
    console.error('Error fetching paper:', error);
    return NextResponse.json({ error: 'Failed to fetch paper' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string, paperId: string } }) {
  try {
    const { id: projectId, paperId } = params;
    const { title, authors, publicationYear, link, notes } = await request.json();

    if (!projectId || !paperId) {
      return NextResponse.json({ error: 'Project ID and Paper ID are required' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: 'Paper title is required' }, { status: 400 });
    }

    const updatedPaper = await prisma.paper.update({
      where: {
        id: paperId,
        projectId: projectId,
      },
      data: {
        title,
        authors,
        publicationYear,
        link,
        notes,
      },
    });

    return NextResponse.json(updatedPaper, { status: 200 });
  } catch (error) {
    console.error('Error updating paper:', error);
    return NextResponse.json({ error: 'Failed to update paper' }, { status: 500 });
  }
}

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
