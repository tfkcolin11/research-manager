import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const answers = await prisma.answer.findMany({
      where: { projectId: id },
      include: {
        paper: true,
        researchQuestion: {
          include: {
            bigQuestion: true
          }
        }
      },
      orderBy: { text: 'asc' }
    });

    return NextResponse.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { text, location, paperId, researchQuestionId } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: 'Answer text is required' }, { status: 400 });
    }
    if (!paperId) {
      return NextResponse.json({ error: 'Paper ID is required' }, { status: 400 });
    }
    if (!researchQuestionId) {
      return NextResponse.json({ error: 'Research question ID is required' }, { status: 400 });
    }

    // Validate that paper belongs to the same project
    const paper = await prisma.paper.findUnique({
      where: { id: paperId, projectId: id }
    });
    if (!paper) {
      return NextResponse.json({ error: 'Invalid paper ID' }, { status: 400 });
    }

    // Validate that research question belongs to the same project
    const researchQuestion = await prisma.researchQuestion.findUnique({
      where: { id: researchQuestionId, projectId: id }
    });
    if (!researchQuestion) {
      return NextResponse.json({ error: 'Invalid research question ID' }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        text,
        location: location || null,
        paperId,
        researchQuestionId,
        projectId: id,
      },
      include: {
        paper: true,
        researchQuestion: {
          include: {
            bigQuestion: true
          }
        }
      }
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json({ error: 'Failed to create answer' }, { status: 500 });
  }
}
