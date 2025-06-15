import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const papers = await prisma.paper.findMany({
      where: { projectId: id },
    });

    return NextResponse.json(papers);
  } catch (error) {
    console.error('Error fetching papers:', error);
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { title, authors, publicationYear, link, notes } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: 'Paper title is required' }, { status: 400 });
    }

    const paper = await prisma.paper.create({
      data: {
        title,
        authors,
        publicationYear,
        link,
        notes,
        projectId: id,
      },
    });

    return NextResponse.json(paper, { status: 201 });
  } catch (error) {
    console.error('Error creating paper:', error);
    return NextResponse.json({ error: 'Failed to create paper' }, { status: 500 });
  }
}
